// -----------------------------------------------------------------------
// <copyright file="DbInitializer.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Database
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using AutoMapper;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Domain;
    using ModelRelief.Services;
    using ModelRelief.Settings;
    using ModelRelief.Utility;

    public class DbInitializer
    {
        public DbFactory DbFactory { get; set; }

        private bool ExitAfterInitialization { get; set; }
        private IServiceProvider Services { get; set; }
        private IWebHostEnvironment HostingEnvironment { get; set; }
        private Services.IConfigurationProvider ConfigurationProvider { get; set; }
        private ModelReliefDbContext DbContext { get; set; }
        private ILogger Logger { get; set; }
        private IStorageManager StorageManager { get; set; }
        private ModelReferenceValidator ModelReferenceValidator { get; set; }
        private AccountsSettings Accounts { get; set; }
        private IMapper Mapper { get; set; }
        private string StoreUsersPath { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="DbInitializer"/> class.
        /// Constructor
        /// </summary>
        /// <param name="scope">Service scope provider.</param>
        /// <param name="exitAfterInitialization">Exit after initialization. Do not start web server.</param>
        public DbInitializer(IServiceScope scope, bool exitAfterInitialization)
        : this(scope.ServiceProvider, exitAfterInitialization)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="DbInitializer"/> class.
        /// Constructor
        /// </summary>
        /// <param name="services">Service provider.</param>
        /// <param name="exitAfterInitialization">Exit after initialization. Do not start web server.</param>
        public DbInitializer(IServiceProvider services, bool exitAfterInitialization)
        {
            Services = services;
            if (services == null)
                throw new ArgumentNullException(nameof(IServiceProvider));

            HostingEnvironment = Services.GetRequiredService<IWebHostEnvironment>();
            if (HostingEnvironment == null)
                throw new ArgumentNullException(nameof(HostingEnvironment));

            ConfigurationProvider = services.GetRequiredService<Services.IConfigurationProvider>();
            if (ConfigurationProvider == null)
                throw new ArgumentNullException(nameof(ConfigurationProvider));

            DbContext = Services.GetRequiredService<ModelReliefDbContext>();
            if (DbContext == null)
                throw new ArgumentNullException(nameof(DbContext));

            var loggerFactory = services.GetRequiredService<ILoggerFactory>();
            Logger = (loggerFactory == null) ? throw new System.ArgumentNullException(nameof(loggerFactory)) : loggerFactory.CreateLogger(typeof(DbInitializer).Name);

            StorageManager = services.GetRequiredService<IStorageManager>();
            if (StorageManager == null)
                throw new ArgumentNullException(nameof(StorageManager));

            var accountSettings = services.GetRequiredService<IOptions<AccountsSettings>>();
            Accounts = accountSettings.Value as AccountsSettings;
            if (Accounts == null)
                throw new ArgumentNullException(nameof(Accounts));

            Mapper = services.GetRequiredService<IMapper>();
            if (Mapper == null)
                throw new ArgumentNullException(nameof(Mapper));

            ExitAfterInitialization = exitAfterInitialization;

            ModelReferenceValidator = new ModelReferenceValidator(DbContext, loggerFactory, Mapper, HostingEnvironment, ConfigurationProvider);

            var storeUsersPartialPath = ConfigurationProvider.GetSetting(Paths.StoreUsers);
            StoreUsersPath = StorageManager.GetAbsolutePath(storeUsersPartialPath);

            DbFactory = new DbFactory(HostingEnvironment, ConfigurationProvider, DbContext, loggerFactory, Mapper, StorageManager, accountSettings, ModelReferenceValidator);
        }

        /// <summary>
        /// Process the command line arguments and initialize.
        /// </summary>
        public void Initialize()
        {
            EnsureServerInitialized();

            // update test data from existing data
            if (ConfigurationProvider.ParseBooleanSetting(ConfigurationSettings.MRUpdateSeedData))
            {
                UpdateSeedData();
            }

            // create new database
            if (ConfigurationProvider.ParseBooleanSetting(ConfigurationSettings.MRInitializeDatabase))
            {
                InitializeDatabaseAsync().Wait();

                // add test data
                if (ConfigurationProvider.ParseBooleanSetting(ConfigurationSettings.MRSeedDatabase))
                {
                    DbFactory.InitializeUserStore();
                    DbFactory.SeedDatabaseForTestUsersAsync().Wait();
                }
            }
        }
        /// <summary>
        /// Ensure the database server is initialized and available.
        /// During (Docker) startup the front-end may attemp to access the database before the service is running.!--
        /// </summary>
        private bool EnsureServerInitialized()
        {
            switch (ConfigurationProvider.Database)
            {
                default:
                case RelationalDatabaseProvider.SQLite:
                    Directory.CreateDirectory(DbFactory.SqlitePath);
                    return true;
            }
        }

        /// <summary>
        /// Populate the database schema.
        /// </summary>
        private async Task InitializeDatabaseAsync()
        {
            Logger.LogInformation($"Preparing to initialize database.");
            try
            {
                await DbContext.Database.EnsureDeletedAsync();

                // SQLite Error 1: 'table "AspNetRoles" already exists'.
                // https://github.com/aspnet/EntityFrameworkCore/issues/4649
                await DbContext.Database.EnsureCreatedAsync();
            }
            catch (Exception ex)
            {
                Logger.LogError($"An error occurred while initializing the database: {ex.Message}");
                return;
            }
            Logger.LogInformation("Database initialized.");
        }

        #region UpdateSeedData
        /// <summary>
        /// Returns the Development user.
        /// </summary>
        /// <returns>Development user.</returns>
        private ApplicationUser GetDevelopmentUser()
        {
            ApplicationUser user = DbFactory.ConstructUserFromAccount(Accounts.Development);

            return user;
        }

        /// <summary>
        /// Creates a JSON file containing all the objects of the given type.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="user">Application user.</param>
        /// <param name="folderType">Type of folder</param>
        private void ExportEntityJSON<TEntity>(ApplicationUser user, string folderType)
            where TEntity : DomainModel
        {
            // N.B. There is currently no way at the current time (EntityFramework Core 3.1) to include <all> referenced entities.
            //      The property Project is required so the Name can be used to find and assign the correct Project for each User.
            //      The Id alone is not sufficient because the exported JSON is always based on the Test user so the Ids would not match other users.
            //      Consequently, the query is specialized by entity type so the Include clause can be included.
            //          .Include(x => x.Project)
            //https://stackoverflow.com/questions/49593482/entity-framework-core-2-0-1-eager-loading-on-all-nested-related-entities

            IQueryable<TEntity> modelList = null;
            switch (typeof(TEntity).Name)
            {
                case "Camera":
                    modelList = (IQueryable<TEntity>)DbContext.Cameras
                                    .Where(c => c.UserId == user.Id)
                                    .Include(c => c.Project)
                                    .AsNoTracking();
                    break;

                case "MeshTransform":
                    modelList = (IQueryable<TEntity>)DbContext.MeshTransforms
                                    .Where(m => m.UserId == user.Id)
                                    .Include(m => m.Project)
                                    .AsNoTracking();
                    break;

                default:
                    Logger.LogError($"ExportEntityJSON: unsupported entity type {typeof(TEntity).Name}");
                    return;
            }

            // verify models present; export only when database is populated
            if (modelList.Count() <= 0)
            {
                Logger.LogError($"ExportEntityJSON: No models were found for type {typeof(TEntity).Name}. No export was done.");
                return;
            }

            var jsonFile = DbFactory.GetEntityJSONFileName<TEntity>(folderType);
            Files.SerializeJSON(modelList, jsonFile, Logger);

            Logger.LogInformation($"Writing JSON definitions for {user.Name} amd model = {typeof(TEntity).Name}, file = {jsonFile}");
        }

        /// <summary>
        /// Export those entities which are used to update the seed database.
        /// </summary>
        private bool ExportJSON()
        {
            ApplicationUser developmentUser = GetDevelopmentUser();
            if (developmentUser == null)
            {
                Logger.LogError($"ExportJSON: The Development user was not found so the update was aborted.");
                return false;
            }
            ExportEntityJSON<Camera>(developmentUser, "Paths:ResourceFolders:Camera");
            ExportEntityJSON<MeshTransform>(developmentUser, "Paths:ResourceFolders:MeshTransform");

            return true;
        }

        /// <summary>
        /// Update the seed data files from the user store for a particular model type.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="folderType">Type of folder</param>
        private bool UpdateSeedDataFilesFromStore<TEntity>(string folderType)
            where TEntity : DomainModel
        {
            // Test user provides the source of the data files
            var developmentUser = GetDevelopmentUser();

            // Source: e.g. ModelRelief/store/development/users/auth05bedab58aa237e078600530b/depthbuffers
            var rootSourceFolderPath = Path.GetFullPath($"{StoreUsersPath}{developmentUser.Id}/{ConfigurationProvider.GetSetting(folderType)}");

            // Destination: ModelRelief/Test/Data/Users/depthbuffers
            var rootDestinationFolderPartialPath = $"{ConfigurationProvider.GetSetting(Paths.TestDataUser)}/{ConfigurationProvider.GetSetting(folderType)}";
            var rootDestinationFolderPath = Path.GetFullPath($"{HostingEnvironment.ContentRootPath}{rootDestinationFolderPartialPath}");

            var modelList = DbContext.Set<TEntity>()
                                .Where(m => (m.UserId == developmentUser.Id))
                                .AsNoTracking();

            foreach (var model in modelList)
            {
                var modelName = Path.GetFileNameWithoutExtension(model.Name);

                var sourceFolderPath = Path.Combine(rootSourceFolderPath, model.Id.ToString());
                var destinationFolderPath = Path.Combine(rootDestinationFolderPath, modelName);

                var rootSourceDirectory = new System.IO.DirectoryInfo(sourceFolderPath);
                System.IO.FileInfo[] files = rootSourceDirectory.GetFiles("*.*");
                foreach (var file in files)
                {
                    var destinationFileName = Path.Combine(destinationFolderPath, file.Name);
                    File.Copy(file.FullName, destinationFileName, overwrite: true);
                }
            }
            return true;
        }

        /// <summary>
        /// Updates the seed data files (e.g. DepthBuffer, Mesh, NormalMap) generated from a 3D model.
        /// </summary>
        /// <returns>True if successful.</returns>
        private bool UpdateSeedDataFiles()
        {
            UpdateSeedDataFilesFromStore<Domain.DepthBuffer>("Paths:ResourceFolders:DepthBuffer");
            UpdateSeedDataFilesFromStore<Domain.Mesh>("Paths:ResourceFolders:Mesh");
            UpdateSeedDataFilesFromStore<Domain.NormalMap>("Paths:ResourceFolders:NormalMap");

            return true;
        }

        /// <summary>
        /// Updates the test JSON used for Explorer testing.
        /// </summary>
        /// <returns>True if successful.</returns>
        private bool UpdateTestJSONAsync()
        {
            // Test user provides the source of the data files.
            var developmentUser = GetDevelopmentUser();

            var expandedMeshList = DbContext.Meshes
                                        .Where(m => (m.UserId == developmentUser.Id))
                                        .Include(m => m.DepthBuffer)
                                            .ThenInclude(d => d.Camera)
                                        .Include(m => m.MeshTransform)
                                        .Include(m => m.NormalMap)
                                        .AsNoTracking();

            var destinationFolder = Path.GetFullPath($"{HostingEnvironment.ContentRootPath}/../Solver/Test");
            foreach (var mesh in expandedMeshList)
            {
                var modelName = Path.GetFileNameWithoutExtension(mesh.Name);
                var destinationFile = Path.GetFullPath($"{destinationFolder}/{modelName}.json");
                Logger.LogInformation($"Creating {destinationFile}");
                Files.SerializeJSON(mesh, destinationFile, Logger);
            }

            return true;
        }

        /// <summary>
        /// Updates the seed data used to populate the database and the user store.
        ///     JSON (Camera, MeshTransform) used to populate database.
        ///     Mesh and DepthBuffer files.
        ///     Test JSON used by Explorer.
        /// </summary>
        private bool UpdateSeedData()
        {
            // JSON definitions from existing database; used to populate new databases
            bool exportJSONSuccess = ExportJSON();
            if (!exportJSONSuccess)
                return false;

            // data files (e.g. DepthBuffer, Mesh, NormalMap)
            bool updateSuccess = UpdateSeedDataFiles();
            if (!updateSuccess)
                return false;

            // Test JSON (e.g. Explorer)
            bool exportTestJSONSuccess = UpdateTestJSONAsync();
            if (!exportTestJSONSuccess)
                return false;

            return true;
        }
        #endregion
    }
}
