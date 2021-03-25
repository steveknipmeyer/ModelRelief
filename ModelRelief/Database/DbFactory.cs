// -----------------------------------------------------------------------
// <copyright file="DbFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Database
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.IO;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading;
    using System.Threading.Tasks;
    using AutoMapper;
    using FluentValidation.Results;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Domain;
    using ModelRelief.Services;
    using ModelRelief.Settings;
    using ModelRelief.Utility;
    using Newtonsoft.Json;

    public class DbFactory
    {
        public string SqlitePath { get; set; }

        private IWebHostEnvironment HostingEnvironment { get; set; }
        private Services.IConfigurationProvider ConfigurationProvider { get; set; }
        private ModelReliefDbContext DbContext { get; set; }
        private ILogger Logger { get; set; }
        private IStorageManager StorageManager { get; set; }
        private IModelReferenceValidator ModelReferenceValidator { get; set; }
        private AccountsSettings Accounts { get; set; }
        private IMapper Mapper { get; set; }
        private string StoreUsersPath { get; set; }

        /// <summary>
        /// Settings Names
        /// </summary>
        public class SettingsNames
        {
            public static readonly string Project = "Project Settings";
            public static readonly string Session = "Session Settings";
        }

        /// <summary>
        /// Test Project Names
        /// </summary>
        public class ProjectNames
        {
            public static readonly string Examples = "Examples";
            public static readonly string Architecture = "Architecture";
            public static readonly string Jewelry = "Jewelry";
            public static readonly string Stanford = "Stanford";
            public static readonly string ModelRelief = "ModelRelief";
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="DbFactory"/> class.
        /// Constructor
        /// </summary>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">Services.IConfigurationProvider.</param>
        /// <param name="dbContext">ModelRelief DbContext</param>
        /// <param name="loggerFactory">ILoggerFactory</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="storageManager">StorageManager</param>
        /// <param name="accountSettings"> IOptions</param>
        /// <param name="modelReferenceValidator">modelReferenceValidator</param>
        public DbFactory(
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider configurationProvider,
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IStorageManager storageManager,
            IOptions<AccountsSettings> accountSettings,
            IModelReferenceValidator modelReferenceValidator)
        {
            HostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(HostingEnvironment));

            ConfigurationProvider = configurationProvider ?? throw new ArgumentNullException(nameof(ConfigurationProvider));

            DbContext = dbContext ?? throw new ArgumentNullException(nameof(DbContext));

            _ = loggerFactory ?? throw new System.ArgumentNullException(nameof(Logger));
            Logger = loggerFactory.CreateLogger(typeof(DbFactory).Name);

            Mapper = mapper ?? throw new ArgumentNullException(nameof(Mapper));

            StorageManager = storageManager ?? throw new ArgumentNullException(nameof(StorageManager));

            Accounts = accountSettings.Value as AccountsSettings ?? throw new ArgumentNullException(nameof(Accounts));

            ModelReferenceValidator = modelReferenceValidator ?? throw new ArgumentNullException(nameof(ModelReferenceValidator));

            var storeUsersPartialPath = ConfigurationProvider.GetSetting(Paths.StoreUsers);
            StoreUsersPath = StorageManager.GetAbsolutePath(storeUsersPartialPath);

            SqlitePath = Path.GetFullPath($"{StorageManager.GetAbsolutePath(ConfigurationProvider.GetSetting(Paths.StoreDatabase))}{ConfigurationSettings.SQLite}");
        }

        /// <summary>
        /// Delete the user store.
        /// </summary>
        public void InitializeUserStore()
        {
#if false
            if (!ExitAfterInitialization)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Delete the user store folder: {StoreUsersPath} (Y/N)?");
                Console.ForegroundColor = ConsoleColor.White;
                var response = Console.ReadLine();
                if (!string.Equals(response.ToUpper(), "Y"))
                    return;
            }
#endif

            Files.DeleteFolder(StoreUsersPath, true);
            Logger.LogWarning($"User store ({StoreUsersPath}) deleted.");
        }

        /// <summary>
        /// Seeds the database with test data for a new user.
        /// </summary>
        /// <param name="claimsPrincipal">Newly-logged in user.</param>
        public async Task SeedDatabaseForNewUserAsync(ClaimsPrincipal claimsPrincipal)
        {
            if ((claimsPrincipal == null) || (!claimsPrincipal.Identity.IsAuthenticated))
                return;

            ApplicationUser user = await IdentityUtility.FindApplicationUserAsync(claimsPrincipal);
            IQueryable<Model3d> results = DbContext.Models
                                            .Where(m => (m.UserId == user.Id));

            // models exist; not brand new user
            if (results.Any())
                return;

            SeedDatabaseForUser(user);
        }

        /// <summary>
        /// Seeds the database with test data.
        /// </summary>
        public async Task SeedDatabaseForTestUsersAsync()
        {
            var userAccounts = new List<Account>
            {
                Accounts.Development,
                Accounts.Sales,
                Accounts.Support,
            };

            foreach (var account in userAccounts)
            {
                ApplicationUser user = ConstructUserFromAccount(account);
                SeedDatabaseForUser(user);

                ValidateAll(user);
            }
            CreateTestDatabase();
            await Task.CompletedTask;
        }

        /// <summary>
        /// Returns the unique user Id for an account.
        /// </summary>
        /// <param name="account">Target Account.</param>
        /// <returns></returns>
        public ApplicationUser ConstructUserFromAccount(Account account)
        {
            var user = new ApplicationUser(account.NameIdentifier, account.Name);

            return user;
        }

        /// <summary>
        /// Synchronizes the test database with the baseline copy.
        /// </summary>
        /// <param name="restore">Restore from baseline (versus create baseline).</param>
        public void SynchronizeTestDatabase(bool restore)
        {
            string databaseFolder;
            Dictionary<string, string> fileList;

            Logger.LogInformation($"SynchronizeDatabase {ConfigurationProvider.Database} : restore = {restore}");
            switch (ConfigurationProvider.Database)
            {
                default:
                case RelationalDatabaseProvider.SQLite:
                    databaseFolder = SqlitePath;
                    Directory.CreateDirectory(databaseFolder);
                    fileList = new Dictionary<string, string>
                    {
                        { "ModelReliefBaseline.db",     "ModelReliefDevelopment.db" },
                    };
                    break;
            }

            try
            {
                foreach (KeyValuePair<string, string> entry in fileList)
                {
                    bool fileCopied = false;
                    int copyAttemptsRemaining = 5;
                    while (!fileCopied && (copyAttemptsRemaining > 0))
                    {
                        string sourcePath = string.Empty;
                        string targetPath = string.Empty;
                        try
                        {
                            sourcePath = Path.Combine(databaseFolder, restore ? entry.Key : entry.Value);
                            targetPath = Path.Combine(databaseFolder, restore ? entry.Value : entry.Key);
                            Logger.LogInformation($"Database file copy : ({sourcePath} -> {targetPath})");
                            File.Copy(sourcePath, targetPath, overwrite: true);
                            fileCopied = true;
                        }
                        catch (Exception ex)
                        {
                            Logger.LogError($"Retrying file copy after exception {ex.Message}");
                            Thread.Sleep(1000);
                            copyAttemptsRemaining--;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.Assert(false, $"RefreshTestDatabase: {ex.Message}");
            }
        }

        /// <summary>
        /// Returns the JSON definition file for the given entity type.
        /// </summary>
        /// <typeparam name="TEntity">Domain model</typeparam>
        /// <param name="folderType">Folder type.</param>
        public string GetEntityJSONFileName<TEntity>(string folderType)
        {
            var jsonFolderPartialPath = $"{ConfigurationProvider.GetSetting(Paths.TestDataUsers)}/{ConfigurationProvider.GetSetting(folderType)}";
            var jsonFolder = $"{HostingEnvironment.ContentRootPath}{jsonFolderPartialPath}";

            var modelType = typeof(TEntity).Name;
            var jsonFile = $"{Path.Combine(jsonFolder, modelType)}.json";

            //normalize
            jsonFile = Path.GetFullPath(jsonFile);

            return jsonFile;
        }

        /// <summary>
        ///  Validate the database entities.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="user">Application user</param>
        /// <returns>true if all entities are valid</returns>
        public async Task<List<ValidationFailure>> ValidateEntityAsync<TEntity>(ApplicationUser user)
        where TEntity : DomainModel
        {
            var claimsPrincipal = IdentityUtility.ConstructClaimsPrincipal(user);
            var validationFailures = new List<ValidationFailure>();
            var modelValidationFailures = new List<ValidationFailure>();

            IQueryable<TEntity> models = DbContext.Set<TEntity>()
                                                  .Where(m => (m.UserId == user.Id));
            await models.ForEachAsync(async (model) =>
            {
                modelValidationFailures = await ModelReferenceValidator.ValidateAsync<TEntity>(model, claimsPrincipal, throwIfError: false);
                validationFailures.AddRange(modelValidationFailures);
            });

            validationFailures.ForEach((failure) =>
            {
                Logger.LogError(failure.ErrorMessage);
            });

            return validationFailures;
        }

        /// <summary>
        /// Validate the database entities.
        /// </summary>
        /// <param name="user">Application user</param>
        /// <returns>true if all entities are valid</returns>
        public bool ValidateAll(ApplicationUser user)
        {
            var validationFailures = new List<ValidationFailure>();
            var entityValidationFailures = new List<ValidationFailure>();

            var entityTypes = DbContext.GetAllEntityTypes();
            entityTypes.ForEach(async (entityType) =>
            {
                var validateEntityMethod = typeof(DbFactory).GetMethod(nameof(ValidateEntityAsync)).MakeGenericMethod(entityType);
                dynamic task = validateEntityMethod.Invoke(this, new object[] { user });
                await task;
                entityValidationFailures = task.Result;
                validationFailures.AddRange(entityValidationFailures);
            });

            return validationFailures.Count == 0;
        }

        /// <summary>
        /// Populate the database and user store with examples.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void SeedDatabaseForUser(ApplicationUser user)
        {
            // database
            AddSettings(user);
            AddProjects(user);
            AddCameras(user);                   // JSON
            AddModels(user);
            AddMeshTransforms(user);            // JSON

            AddDepthBuffers(user);
            AddNormalMaps(user);
            AddMeshes(user);

            AddSession(user);

            // user store
            SeedUserStore(user);

            Logger.LogInformation($"User {user.Name} database and sample data sets created.");
        }

        /// <summary>
        /// Create the user store in the file system.
        /// Copy the test data files into the web user store.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void SeedUserStore(ApplicationUser user)
        {
            CopySeedDataFilesToStore<Domain.Model3d>(user, "Paths:ResourceFolders:Model3d");
            CopySeedDataFilesToStore<Domain.DepthBuffer>(user, "Paths:ResourceFolders:DepthBuffer");
            CopySeedDataFilesToStore<Domain.Mesh>(user, "Paths:ResourceFolders:Mesh");
            CopySeedDataFilesToStore<Domain.NormalMap>(user, "Paths:ResourceFolders:NormalMap");
        }

        /// <summary>
        /// Copies the newly-created database to create the test database.
        /// </summary>
        private void CreateTestDatabase()
        {
            if (string.Equals(HostingEnvironment.EnvironmentName, "Development", StringComparison.CurrentCultureIgnoreCase))
            {
                // create the baseline copy of the test
                DbContext.SaveChanges();
                switch (ConfigurationProvider.Database)
                {
                    default:
                    case RelationalDatabaseProvider.SQLite:
                        break;
                }
                SynchronizeTestDatabase(restore: false);
            }
        }

        /// <summary>
        /// Constructs a list of entities read from the seed JSON definitions file.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="folderType">Folder type.</param>
        /// <returns>List of models read from JSON.</returns>
        private List<TEntity> ImportEntityJSON<TEntity>(string folderType)
        {
            var jsonFile = GetEntityJSONFileName<TEntity>(folderType);
            var modelList = JsonConvert.DeserializeObject<List<TEntity>>(System.IO.File.ReadAllText(jsonFile));
            return modelList;
        }

        /// <summary>
        /// Add user (global) session.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void AddSession(ApplicationUser user)
        {
            var session = new Session
            {
                Name = SettingsNames.Session,
                Description = "Cross-project session settings",
                UserId = user.Id,
                Project = FindByName<Project>(user, ProjectNames.Examples),
            };

            DbContext.Add(session);
            DbContext.SaveChanges();

            QualifyDescription<Session>(user);
        }

        /// <summary>
        /// Add user (project) settings.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void AddSettings(ApplicationUser user)
        {
            var settings = new Settings[]
            {
                new Settings { Name = SettingsNames.Project, Description = "User interface and project settings", UserId = user.Id },
            };

            foreach (var item in settings)
            {
                DbContext.Add(item);
                DbContext.SaveChanges();
            }

            QualifyDescription<Settings>(user);
        }

        /// <summary>
        /// Add test projects.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void AddProjects(ApplicationUser user)
        {
            var projects = new Project[]
            {
                new Project { Name = ProjectNames.Examples, Description = "Example models", Settings = FindByName<Settings>(user, SettingsNames.Project), UserId = user.Id },
                new Project { Name = ProjectNames.Architecture, Description = "Architectural structures, woodwork, panels and details", Settings = FindByName<Settings>(user, SettingsNames.Project), UserId = user.Id },
                new Project { Name = ProjectNames.Jewelry, Description = "Jewelry watch faces, bracelets and pendants", Settings = FindByName<Settings>(user, SettingsNames.Project), UserId = user.Id },
                new Project { Name = ProjectNames.ModelRelief, Description = "Development and Test", Settings = FindByName<Settings>(user, SettingsNames.Project), UserId = user.Id },
                new Project { Name = ProjectNames.Stanford, Description = "Stanford model repository", Settings = FindByName<Settings>(user, SettingsNames.Project), UserId = user.Id },
            };

            foreach (var project in projects)
            {
                DbContext.Add(project);
                DbContext.SaveChanges();
            }

            QualifyDescription<Project>(user);
        }

        /// <summary>
        /// Add test cameras.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void AddCameras(ApplicationUser user)
        {
            var cameraList = ImportEntityJSON<Camera>("Paths:ResourceFolders:Camera");
            foreach (var camera in cameraList)
            {
                camera.Id = 0;
                camera.UserId = user.Id;

                camera.Project = FindByName<Project>(user, camera.Project?.Name);
                camera.ProjectId = camera.Project.Id;
            }

            foreach (var camera in cameraList)
            {
                DbContext.Add(camera);
                DbContext.SaveChanges();
            }

            QualifyDescription<Camera>(user);
        }

        /// <summary>
        /// Add test models.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void AddModels(ApplicationUser user)
        {
            var models = new Model3d[]
            {
                new Model3d
                {
                    Name = "armadillo.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford), Camera = FindByName<Camera>(user, "Lucy"),
                },
                new Model3d
                {
                    Name = "buddha.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "bunny.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "dolphin.obj", Description = "Ocean dolphin", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "dragon.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Examples), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "horse.obj", Description = "Prancing horse", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Examples), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "house.obj", Description = "San Francisco house", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Examples), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "lowresolution.obj", Description = "Low resolution test model", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.ModelRelief), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "lucy.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Examples), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "plunderbusspete.obj", Description = "Plunder Buss Pete pirate", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Examples), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "roadster.obj", Description = "Duesen Bayern Mystar 190 SL", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "scallop.obj", Description = "Scallop shell", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Examples), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "statue.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "test.obj", Description = "Reference test model", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.ModelRelief), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "tyrannosaurus.obj", Description = "Stanford test model", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford), Camera = FindByName<Camera>(user, "Isometric Camera"),
                },
            };

            foreach (var model in models)
            {
                DbContext.Add(model);
                DbContext.SaveChanges();
            }

            SetFileProperties(models);
            QualifyDescription<Model3d>(user);
        }

        /// <summary>
        /// Add mesh transforms.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void AddMeshTransforms(ApplicationUser user)
        {
            var meshTransformList = ImportEntityJSON<MeshTransform>("Paths:ResourceFolders:MeshTransform");
            foreach (var meshtransform in meshTransformList)
            {
                meshtransform.Id = 0;
                meshtransform.UserId = user.Id;

                meshtransform.Project = FindByName<Project>(user, meshtransform.Project?.Name);
                meshtransform.ProjectId = meshtransform.Project.Id;
            }

            foreach (var mesh in meshTransformList)
            {
                DbContext.Add(mesh);
                DbContext.SaveChanges();
            }

            QualifyDescription<MeshTransform>(user);
        }

        /// <summary>
        /// Add test depth buffers.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void AddDepthBuffers(ApplicationUser user)
        {
            var depthBuffers = new DepthBuffer[]
            {
                new DepthBuffer
                {
                    Name = "armadillo.sdb", Description = "Generated in Rhino",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "armadillo.obj"), Camera = FindByName<Camera>(user, "Armadillo"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new DepthBuffer
                {
                    Name = "buddha.sdb", Description = "Generated in Rhino",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "buddha.obj"), Camera = FindByName<Camera>(user, "Buddha"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new DepthBuffer
                {
                    Name = "bunny.sdb", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "bunny.obj"), Camera = FindByName<Camera>(user, "Bunny"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new DepthBuffer
                {
                    Name = "dolphin.sdb", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "dolphin.obj"), Camera = FindByName<Camera>(user, "Dolphin"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new DepthBuffer
                {
                    Name = "dragon.sdb", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "dragon.obj"), Camera = FindByName<Camera>(user, "Dragon"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new DepthBuffer
                {
                    Name = "horse.sdb", Description = "Created in ModelRelief",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "horse.obj"), Camera = FindByName<Camera>(user, "Horse"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new DepthBuffer
                {
                    Name = "house.sdb", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "house.obj"), Camera = FindByName<Camera>(user, "House"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Architecture),
                },
                new DepthBuffer
                {
                    Name = "lowresolution.sdb", Description = "Generated in ModelRelief",
                    Width = 16, Height = 16,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "lowresolution.obj"), Camera = FindByName<Camera>(user, "LowResolution"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },
                new DepthBuffer
                {
                    Name = "lucy.sdb", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "lucy.obj"), Camera = FindByName<Camera>(user, "Lucy"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new DepthBuffer
                {
                    Name = "plunderbusspete.sdb", Description = "Created in ModelRelief",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "plunderbusspete.obj"), Camera = FindByName<Camera>(user, "PlunderbussPete"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new DepthBuffer
                {
                    Name = "roadster.sdb", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "roadster.obj"), Camera = FindByName<Camera>(user, "Roadster"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new DepthBuffer
                {
                    Name = "scallop.sdb", Description = "Created in ModelRelief",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "scallop.obj"), Camera = FindByName<Camera>(user, "Scallop"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new DepthBuffer
                {
                    Name = "statue.sdb", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "statue.obj"), Camera = FindByName<Camera>(user, "Statue"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new DepthBuffer
                {
                    Name = "test.sdb", Description = "Generated in ModelRelief",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "test.obj"), Camera = FindByName<Camera>(user, "Test"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },
                new DepthBuffer
                {
                    Name = "tyrannosaurus.sdb", Description = "Generated in ModelRelief",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "tyrannosaurus.obj"), Camera = FindByName<Camera>(user, "Tyrannosaurus"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
            };

            foreach (var depthBuffer in depthBuffers)
            {
                DbContext.Add(depthBuffer);
                DbContext.SaveChanges();
            }

            SetFileProperties(depthBuffers);
            QualifyDescription<DepthBuffer>(user);
        }

        /// <summary>
        /// Add test meshes.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void AddMeshes(ApplicationUser user)
        {
            var meshes = new Mesh[]
            {
                new Mesh
                {
                    Name = "armadillo.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "armadillo.sdb"), NormalMap = FindByName<NormalMap>(user, "armadillo.nmap"), MeshTransform = FindByName<MeshTransform>(user, "Armadillo"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "buddha.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "buddha.sdb"), NormalMap = FindByName<NormalMap>(user, "buddha.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "Buddha"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "bunny.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "bunny.sdb"), NormalMap = FindByName<NormalMap>(user, "bunny.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "Bunny"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "dolphin.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "dolphin.sdb"), NormalMap = FindByName<NormalMap>(user, "dolphin.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "Dolphin"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new Mesh
                {
                    Name = "dragon.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "dragon.sdb"), NormalMap = FindByName<NormalMap>(user, "dragon.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "Dragon"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "horse.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "horse.sdb"), NormalMap = FindByName<NormalMap>(user, "horse.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "Horse"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new Mesh
                {
                    Name = "house.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "house.sdb"), NormalMap = FindByName<NormalMap>(user, "house.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "House"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Architecture),
                },
                new Mesh
                {
                    Name = "lowresolution.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "lowresolution.sdb"), NormalMap = FindByName<NormalMap>(user, "lowresolution.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "LowResolution"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },
                new Mesh
                {
                    Name = "lucy.sfp", Description = "Isometric", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Isometric Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "lucy.sdb"), NormalMap = FindByName<NormalMap>(user, "lucy.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "Lucy"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "plunderbusspete.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "plunderbusspete.sdb"), NormalMap = FindByName<NormalMap>(user, "plunderbusspete.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "PlunderbussPete"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new Mesh
                {
                    Name = "roadster.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "roadster.sdb"), NormalMap = FindByName<NormalMap>(user, "roadster.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "Roadster"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new Mesh
                {
                    Name = "scallop.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "scallop.sdb"), NormalMap = FindByName<NormalMap>(user, "scallop.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "Scallop"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new Mesh
                {
                    Name = "statue.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "statue.sdb"), NormalMap = FindByName<NormalMap>(user, "statue.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "Statue"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "test.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "test.sdb"), NormalMap = FindByName<NormalMap>(user, "test.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "Test"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },
                new Mesh
                {
                    Name = "tyrannosaurus.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "tyrannosaurus.sdb"), NormalMap = FindByName<NormalMap>(user, "tyrannosaurus.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "Tyrannosaurus"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },
            };

            foreach (var mesh in meshes)
            {
                DbContext.Add(mesh);
                DbContext.SaveChanges();
            }

            SetFileProperties(meshes);
            QualifyDescription<Mesh>(user);
        }

        /// <summary>
        /// Add test normal maps.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void AddNormalMaps(ApplicationUser user)
        {
            var normalMaps = new NormalMap[]
            {
                new NormalMap
                {
                    Name = "armadillo.nmap", Description = "Generated in Rhino",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "armadillo.obj"), Camera = FindByName<Camera>(user, "Armadillo"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new NormalMap
                {
                    Name = "buddha.nmap", Description = "Generated in Rhino",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "buddha.obj"), Camera = FindByName<Camera>(user, "Buddha"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new NormalMap
                {
                    Name = "bunny.nmap", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "bunny.obj"), Camera = FindByName<Camera>(user, "Bunny"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new NormalMap
                {
                    Name = "dolphin.nmap", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "dolphin.obj"), Camera = FindByName<Camera>(user, "Dolphin"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new NormalMap
                {
                    Name = "dragon.nmap", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "dragon.obj"), Camera = FindByName<Camera>(user, "Dragon"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new NormalMap
                {
                    Name = "horse.nmap", Description = "Created in ModelRelief",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "horse.obj"), Camera = FindByName<Camera>(user, "Horse"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new NormalMap
                {
                    Name = "house.nmap", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "house.obj"), Camera = FindByName<Camera>(user, "House"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Architecture),
                },
                new NormalMap
                {
                    Name = "lowresolution.nmap", Description = "Generated in ModelRelief",
                    Width = 16, Height = 16,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "lowresolution.obj"), Camera = FindByName<Camera>(user, "LowResolution"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },
                new NormalMap
                {
                    Name = "lucy.nmap", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "lucy.obj"), Camera = FindByName<Camera>(user, "Lucy"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new NormalMap
                {
                    Name = "plunderbusspete.nmap", Description = "Created in ModelRelief",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "plunderbusspete.obj"), Camera = FindByName<Camera>(user, "PlunderbussPete"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new NormalMap
                {
                    Name = "roadster.nmap", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "roadster.obj"), Camera = FindByName<Camera>(user, "Roadster"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new NormalMap
                {
                    Name = "scallop.nmap", Description = "Created in ModelRelief",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "scallop.obj"), Camera = FindByName<Camera>(user, "Scallop"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new NormalMap
                {
                    Name = "statue.nmap", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "statue.obj"), Camera = FindByName<Camera>(user, "Statue"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new NormalMap
                {
                    Name = "test.nmap", Description = "Generated in ModelRelief",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "test.obj"), Camera = FindByName<Camera>(user, "Test"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },
                new NormalMap
                {
                    Name = "tyrannosaurus.nmap", Description = "Generated in ModelRelief",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP, Space = NormalMapSpace.Tangent,
                    Model3d = FindByName<Model3d>(user, "tyrannosaurus.obj"), Camera = FindByName<Camera>(user, "Tyrannosaurus"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
            };

            foreach (var normalMap in normalMaps)
            {
                DbContext.Add(normalMap);
                DbContext.SaveChanges();
            }

            SetFileProperties(normalMaps);
            QualifyDescription<NormalMap>(user);
        }

        /// <summary>
        /// Create the user store for a particular model type.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="user">Owning user.</param>
        /// <param name="folderType">Type of folder</param>
        private void CopySeedDataFilesToStore<TEntity>(ApplicationUser user, string folderType)
            where TEntity : DomainModel
        {
            var sourceFolderPartialPath = $"{ConfigurationProvider.GetSetting(Paths.TestDataUsers)}/{ConfigurationProvider.GetSetting(folderType)}";
            var sourceFolderPath = $"{HostingEnvironment.ContentRootPath}{sourceFolderPartialPath}";

            var destinationFolderPath = $"{StoreUsersPath}{user.Id}/{ConfigurationProvider.GetSetting(folderType)}";
            Directory.CreateDirectory(destinationFolderPath);

            // iterate over all folders
            var rootSourceDirectory = new System.IO.DirectoryInfo(sourceFolderPath);
            System.IO.DirectoryInfo[] subDirs = rootSourceDirectory.GetDirectories();
            foreach (System.IO.DirectoryInfo dirInfo in subDirs)
            {
                // parent directory name = database resource ID
                var model = DbContext.Set<TEntity>()
                    .Where(m => m.Name.StartsWith(dirInfo.Name))
                    .Where(m => (m.UserId == user.Id))
                    .SingleOrDefault();

                if (model == null)
                {
                    Debug.Assert(false, $"DbInitializer: Model name ${dirInfo.Name} not found in database for type ${typeof(TEntity).Name}.");
                    continue;
                }

                // create target folder
                var targetDirectory = Directory.CreateDirectory(Path.Combine(destinationFolderPath, model.Id.ToString())).FullName;

                System.IO.FileInfo[] files = dirInfo.GetFiles("*.*");
                foreach (var file in files)
                {
                    var destinationFileName = Path.Combine(targetDirectory, file.Name);
                    // Console.WriteLine(destinationFileName);
                    File.Copy(file.FullName, destinationFileName, overwrite: true);
                }
            }
        }

        /// <summary>
        /// Find a resource by Name that is owned by the active user.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="user">Owning user.</param>
        /// <param name="name">Name property to match.</param>
        /// <returns>Matching entity.</returns>
        private TEntity FindByName<TEntity>(ApplicationUser user, string name)
            where TEntity : DomainModel
        {
            var resource = DbContext.Set<TEntity>()
                .Where(r => ((r.Name == name) && (r.UserId == user.Id))).SingleOrDefault();

            if (resource == null)
                Debug.Assert(false, $"DbInitializer: {typeof(TEntity).Name} = '{name}' not found)");

            return resource;
        }

        /// <summary>
        /// Adds a qualifying suffix to the end of the Description property.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="user">Owning user.</param>
        private void QualifyDescription<TEntity>(ApplicationUser user)
            where TEntity : DomainModel
        {
            var descriptionSuffix = user.Name;
            var models = DbContext.Set<TEntity>()
                            .Where(m => (m.UserId == user.Id));

            foreach (var model in models)
            {
                // strip existing suffix; user name in parentheses
                int index = model.Description.IndexOf("(");
                if (index > 0)
                    model.Description = model.Description.Substring(0, index - 1);

                model.Description += $" ({descriptionSuffix})";
            }
            DbContext.SaveChanges();
        }

        /// <summary>
        /// Sets the file properties of the model.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="models">Collection of models to update.</param>
        private void SetFileProperties<TEntity>(IEnumerable<TEntity> models)
            where TEntity : FileDomainModel
        {
            // model Ids are known now; set paths, etc.
            foreach (TEntity model in models)
            {
                model.FileTimeStamp = DateTime.Now;
                model.Path = StorageManager.GetRelativePath(StorageManager.DefaultModelStorageFolder(model));

                if (model is GeneratedFileDomainModel generatedModel)
                    generatedModel.FileIsSynchronized = true;
            }

            DbContext.SaveChanges();
        }
    }
}
