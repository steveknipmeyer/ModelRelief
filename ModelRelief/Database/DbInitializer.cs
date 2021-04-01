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

    public class DbInitializer : IDbInitializer
    {
        public IDbFactory DbFactory { get; set; }

        private IServiceProvider _services { get; set; }
        private IWebHostEnvironment _hostingEnvironment { get; set; }
        private Services.IConfigurationProvider _configurationProvider { get; set; }
        private ModelReliefDbContext _dbContext { get; set; }
        private ILogger _logger { get; set; }
        private IStorageManager _storageManager { get; set; }
        private IModelReferenceValidator _modelReferenceValidator { get; set; }
        private AccountsSettings _accounts { get; set; }
        private IMapper _mapper { get; set; }
        private string _storeUsersPath { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="DbInitializer"/> class.
        /// Constructor
        /// </summary>
        /// <param name="hostingEnvironment">IWebHostingEnvironment.</param>
        /// <param name="configurationProvider">Services.IConfigurationProvider.</param>
        /// <param name="dbContext">ModelReliefDbContext.</param>
        /// <param name="loggerFactory">ILoggerFactory.</param>
        /// <param name="storageManager">IStorageManager.</param>
        /// <param name="accountSettings">IOptions[AccountsSettings].</param>
        /// <param name="mapper">IMapper.</param>
        /// <param name="modelReferenceValidator">IModelReferenceValidator.</param>
        /// <param name="dbFactory">IDbFactory.</param>
        public DbInitializer(IWebHostEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider, ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IStorageManager storageManager, IOptions<AccountsSettings> accountSettings, IMapper mapper, IModelReferenceValidator modelReferenceValidator, IDbFactory dbFactory)
        {
            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(_hostingEnvironment));

            _configurationProvider = configurationProvider ?? throw new ArgumentNullException(nameof(_configurationProvider));

            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(_dbContext));

            loggerFactory = loggerFactory ?? throw new System.ArgumentNullException(nameof(loggerFactory));
            _logger = loggerFactory.CreateLogger(typeof(DbInitializer).Name);

            _storageManager = storageManager ?? throw new ArgumentNullException(nameof(_storageManager));

            accountSettings = accountSettings ?? throw new ArgumentNullException(nameof(accountSettings));
            _accounts = accountSettings.Value as AccountsSettings ?? throw new ArgumentNullException(nameof(_accounts));

            _mapper = mapper ?? throw new ArgumentNullException(nameof(_mapper));

            var storeUsersPartialPath = _configurationProvider.GetSetting(Paths.StoreUsers);
            _storeUsersPath = _storageManager.GetAbsolutePath(storeUsersPartialPath);

            _modelReferenceValidator = modelReferenceValidator ?? throw new ArgumentNullException(nameof(_modelReferenceValidator));

            DbFactory = dbFactory ?? throw new ArgumentNullException(nameof(DbFactory));
        }

        /// <summary>
        /// Process the command line arguments and initialize.
        /// </summary>
        public void Initialize()
        {
            EnsureServerInitialized();

            // update test data from existing data
            if (_configurationProvider.ParseBooleanSetting(ConfigurationSettings.MRUpdateSeedData))
            {
                UpdateSeedData();
            }

            // create new database
            if (_configurationProvider.ParseBooleanSetting(ConfigurationSettings.MRInitializeDatabase))
            {
                InitializeDatabaseAsync().Wait();

                // add test data
                if (_configurationProvider.ParseBooleanSetting(ConfigurationSettings.MRSeedDatabase))
                {
                    DbFactory.InitializeUserStore();
                    DbFactory.SeedDatabaseForTestUsersAsync().Wait();
                }
            }
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("Initialization complete.");
            Console.ForegroundColor = ConsoleColor.White;
        }
        /// <summary>
        /// Ensure the database server is initialized and available.
        /// During (Docker) startup the front-end may attemp to access the database before the service is running.!--
        /// </summary>
        private bool EnsureServerInitialized()
        {
            switch (_configurationProvider.Database)
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
            _logger.LogInformation($"Preparing to initialize database.");
            try
            {
                await _dbContext.Database.EnsureDeletedAsync();

                // SQLite Error 1: 'table "AspNetRoles" already exists'.
                // https://github.com/aspnet/EntityFrameworkCore/issues/4649
                await _dbContext.Database.EnsureCreatedAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while initializing the database: {ex.Message}");
                return;
            }
            _logger.LogInformation("Database initialized.");
        }

        #region UpdateSeedData
        /// <summary>
        /// Returns the Development user.
        /// </summary>
        /// <returns>Development user.</returns>
        private ApplicationUser GetDevelopmentUser()
        {
            ApplicationUser user = DbFactory.ConstructUserFromAccount(_accounts.Development);

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
                    modelList = (IQueryable<TEntity>)_dbContext.Cameras
                                    .Where(c => c.UserId == user.Id)
                                    .Include(c => c.Project)
                                    .AsNoTracking();
                    break;

                case "MeshTransform":
                    modelList = (IQueryable<TEntity>)_dbContext.MeshTransforms
                                    .Where(m => m.UserId == user.Id)
                                    .Include(m => m.Project)
                                    .AsNoTracking();
                    break;

                default:
                    _logger.LogError($"ExportEntityJSON: unsupported entity type {typeof(TEntity).Name}");
                    return;
            }

            // verify models present; export only when database is populated
            if (modelList.Count() <= 0)
            {
                _logger.LogError($"ExportEntityJSON: No models were found for type {typeof(TEntity).Name}. No export was done.");
                return;
            }

            var jsonFile = DbFactory.GetEntityJSONFileName<TEntity>(folderType);
            Files.SerializeJSON(modelList, jsonFile, _logger);

            _logger.LogInformation($"Writing JSON definitions for {user.Name} amd model = {typeof(TEntity).Name}, file = {jsonFile}");
        }

        /// <summary>
        /// Export those entities which are used to update the seed database.
        /// </summary>
        private bool ExportJSON()
        {
            ApplicationUser developmentUser = GetDevelopmentUser();
            if (developmentUser == null)
            {
                _logger.LogError($"ExportJSON: The Development user was not found so the update was aborted.");
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
            var rootSourceFolderPath = Path.GetFullPath($"{_storeUsersPath}{developmentUser.Id}/{_configurationProvider.GetSetting(folderType)}");

            // Destination: ModelRelief/Test/Data/Users/depthbuffers
            var rootDestinationFolderPartialPath = $"{_configurationProvider.GetSetting(Paths.TestDataUser)}/{_configurationProvider.GetSetting(folderType)}";
            var rootDestinationFolderPath = Path.GetFullPath($"{_hostingEnvironment.ContentRootPath}{rootDestinationFolderPartialPath}");

            var modelList = _dbContext.Set<TEntity>()
                                .Where(m => (m.UserId == developmentUser.Id))
                                .AsNoTracking();

            foreach (var model in modelList)
            {
                var modelName = Path.GetFileNameWithoutExtension(model.Name);

                var sourceFolderPath = Path.Combine(rootSourceFolderPath, model.Id.ToString());
                var destinationFolderPath = Path.Combine(rootDestinationFolderPath, modelName);
                Directory.CreateDirectory(destinationFolderPath);

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
            UpdateSeedDataFilesFromStore<Domain.Model3d>("Paths:ResourceFolders:Model3d");
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

            var expandedMeshList = _dbContext.Meshes
                                        .Where(m => (m.UserId == developmentUser.Id))
                                        .Include(m => m.DepthBuffer)
                                            .ThenInclude(d => d.Camera)
                                        .Include(m => m.MeshTransform)
                                        .Include(m => m.NormalMap)
                                        .AsNoTracking();

            var destinationFolder = Path.GetFullPath($"{_hostingEnvironment.ContentRootPath}/../Solver/Test");
            foreach (var mesh in expandedMeshList)
            {
                var modelName = Path.GetFileNameWithoutExtension(mesh.Name);
                var destinationFile = Path.GetFullPath($"{destinationFolder}/{modelName}.json");
                _logger.LogInformation($"Creating {destinationFile}");
                Files.SerializeJSON(mesh, destinationFile, _logger);
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

            // data files (e.g. DepthBuffer, Mesh, Model, NormalMap)
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
