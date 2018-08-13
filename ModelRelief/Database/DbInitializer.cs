// -----------------------------------------------------------------------
// <copyright file="DbInitializer.cs" company="ModelRelief">
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
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Domain;
    using ModelRelief.Services;
    using ModelRelief.Utility;

    public class DbInitializer
    {
        private bool                            ForceInitializeAll  { get; set; }
        private IServiceProvider                Services { get; set; }
        private IHostingEnvironment             HostingEnvironment  { get; set; }
        private Services.IConfigurationProvider ConfigurationProvider  { get; set; }
        private ModelReliefDbContext            DbContext  { get; set; }
        private UserManager<ApplicationUser>    UserManager  { get; set; }
        private ILogger<DbInitializer>          Logger  { get; set; }
        private IStorageManager                 StorageManager { get; set; }

        private ApplicationUser                 _user;
        private string                          _storeUsers { get; set; }

        /// <summary>
        /// Test Project Names
        /// </summary>
        private class ProjectNames
        {
            public static readonly string Architecture = "Architecture";
            public static readonly string Jewelry      = "Jewelry";
            public static readonly string ModelRelief  = "ModelRelief";
            public static readonly string Stanford     = "Stanford";
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="DbInitializer"/> class.
        /// Constructor
        /// </summary>
        /// <param name="services">Service provider.</param>
        /// <param name="forceInitializeAll">Automatically initialize database and user store. Overrides all configuration settings.</param>
        public DbInitializer(IServiceProvider services, bool forceInitializeAll)
        {
            Services = services ?? throw new ArgumentNullException(nameof(services));

            HostingEnvironment = Services.GetRequiredService<IHostingEnvironment>();
            if (HostingEnvironment == null)
                throw new ArgumentNullException(nameof(HostingEnvironment));

            ConfigurationProvider = services.GetRequiredService<Services.IConfigurationProvider>();
            if (ConfigurationProvider == null)
                throw new ArgumentNullException(nameof(ConfigurationProvider));

            DbContext = Services.GetRequiredService<ModelReliefDbContext>();
            if (DbContext == null)
                throw new ArgumentNullException(nameof(DbContext));

            UserManager = Services.GetRequiredService<UserManager<ApplicationUser>>();
            if (UserManager == null)
                throw new ArgumentNullException(nameof(UserManager));

            Logger  = services.GetRequiredService<ILogger<DbInitializer>>();
            if (Logger == null)
                throw new ArgumentNullException(nameof(Logger));

            StorageManager = services.GetRequiredService<IStorageManager>();
            if (StorageManager == null)
                throw new ArgumentNullException(nameof(StorageManager));

            _storeUsers = ConfigurationProvider.GetSetting(Paths.StoreUsers);

            ForceInitializeAll = forceInitializeAll;

            Initialize();
        }

        /// <summary>
        /// Process the command line arguments and initialize.
        /// </summary>
        private void Initialize()
        {
            if (ForceInitializeAll || ConfigurationProvider.ParseBooleanSetting(ConfigurationSettings.MRInitializeUserStore))
                DeleteUserStore();

            if (ForceInitializeAll || ConfigurationProvider.ParseBooleanSetting(ConfigurationSettings.MRInitializeDatabase))
                Populate().Wait();
        }

        /// <summary>
        /// Populate test database with sample data.
        /// </summary>
        public async Task Populate()
        {
            Logger.LogInformation($"Preparing to initialize database.");
            try
            {
                await DbContext.Database.EnsureDeletedAsync();

                // SQLite Error 1: 'table "AspNetRoles" already exists'.
                // https://github.com/aspnet/EntityFrameworkCore/issues/4649
                await DbContext.Database.EnsureCreatedAsync();

                await SeedDatabase();
            }
            catch (Exception ex)
            {
                Logger.LogError($"An error occurred while initializing the database: {ex.Message}");
            }

            Logger.LogInformation("Database initialized.");
        }

        /// <summary>
        /// Shuts down SQL Server
        /// </summary>
        /// <returns>True if successful.</returns>
        private bool StopSQLServer()
        {
            Logger.LogWarning("Shutting down SQLServer to copy database ...");
            var result = DbContext.Database.ExecuteSqlCommand("SHUTDOWN");
            Logger.LogWarning($"SQLServer shutdown complete.");

            return true;
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
                case RelationalDatabaseProvider.SQLite:
                    databaseFolder = Path.Combine(HostingEnvironment.ContentRootPath, "Database");
                    fileList = new Dictionary<string, string>
                    {
                        { "ModelReliefBaseline.db",     "ModelReliefTest.db" },
                    };
                    break;

                case RelationalDatabaseProvider.SQLServer:
                default:
                    databaseFolder = Environment.ExpandEnvironmentVariables("%USERPROFILE%");
                    fileList = new Dictionary<string, string>
                    {
                        { "ModelReliefBaseline.mdf",     "ModelReliefTest.mdf" },
                        { "ModelReliefBaseline_log.ldf", "ModelReliefTest_log.ldf" },
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
        /// Seeds the database with test data.
        /// </summary>
        /// <returns></returns>
        private async Task SeedDatabase()
        {
            var userAccounts = new List<string>
            {
                "TestAccount",
                "ArtCAMAccount",
                "VectricAccount",
            };

            foreach (var account in userAccounts)
            {
                _user = await AddUser(account);

                // database
                AddProjects();
                AddCameras();
                AddModels();
                AddMeshTransforms();

                AddDepthBuffers();
                AddMeshes();

                CreateUserStore();
            }

            // N.B. Creation of the test database is now done by testrunner.py.
            CreateTestDatabase();
        }

        /// <summary>
        /// Copies the newlt-created database to create the test database.
        /// </summary>
        private void CreateTestDatabase()
        {
            if (string.Equals(HostingEnvironment.EnvironmentName, "Test", StringComparison.CurrentCultureIgnoreCase))
            {
                // create the baseline copy of the test
                DbContext.SaveChanges();
                switch (ConfigurationProvider.Database)
                {
                    case RelationalDatabaseProvider.SQLServer:
                        // N.B. SQLServer holds a lock on the files. Shut it down to allow coping the physical files.
                        StopSQLServer();
                        break;

                    default:
                    case RelationalDatabaseProvider.SQLite:
                        break;
                }
                SynchronizeTestDatabase(restore: false);
            }
        }

        /// <summary>
        /// Delete the user store.
        /// </summary>
        private void DeleteUserStore()
        {
            var storeUsersPartialPath = ConfigurationProvider.GetSetting(Paths.StoreUsers);
            var storeUsersPath   = $"{HostingEnvironment.WebRootPath}{storeUsersPartialPath}";

            if (!ForceInitializeAll)
            {
                // Console.ForegroundColor = ConsoleColor.Red;
                // Console.WriteLine($"Delete the user store folder: {storeUsersPath} (Y/N)?");
                // Console.ForegroundColor = ConsoleColor.White;
                // var response = Console.ReadLine();
                // if (!string.Equals(response.ToUpper(), "Y"))
                //     return;
            }

            Files.DeleteFolder(storeUsersPath, true);
            Logger.LogWarning($"User store ({storeUsersPath}) deleted.");
        }

        /// <summary>
        /// Create the user store in the file system.
        /// Copy the test data files into the web user store.
        /// </summary>
        private void CreateUserStore()
        {
            CopyTestFiles<Domain.Model3d>("Paths:ResourceFolders:Model3d");
            CopyTestFiles<Domain.DepthBuffer>("Paths:ResourceFolders:DepthBuffer");
            CopyTestFiles<Domain.Mesh>("Paths:ResourceFolders:Mesh");
        }

        /// <summary>
        /// Add test users.
        /// </summary>
        private async Task<ApplicationUser> AddUser(string accountName)
        {
            var userNameSetting = $"{accountName}:UserName";
            var passwordSetting = $"{accountName}:Password";
            var idSetting = $"{accountName}:Id";

            var userName = ConfigurationProvider.GetSetting(userNameSetting);
            var password = ConfigurationProvider.GetSetting(passwordSetting);
            var id       = ConfigurationProvider.GetSetting(idSetting);

            var user = new ApplicationUser() { UserName = $"{userName}", Id = $"{id}" };
            var createResult = await UserManager.CreateAsync(user, $"{password}");
            if (!createResult.Succeeded)
                throw new Exception(createResult.ToString());

            return user;
        }

        /// <summary>
        /// Add test projects.
        /// </summary>
        private void AddProjects()
        {
            var projects = new Project[]
            {
                new Project { Name = ProjectNames.Architecture, Description = "Architectural structures, woodwork, panels and details", User = _user },
                new Project { Name = ProjectNames.Jewelry, Description = "Jewelry watch faces, bracelets and pendants", User = _user },
                new Project { Name = ProjectNames.ModelRelief, Description = "Development and Test", User = _user },
                new Project { Name = ProjectNames.Stanford, Description = "Stanford model repository", User = _user },
            };
            foreach (Project project in projects)
            {
                DbContext.Projects.Add(project);
            }
            DbContext.SaveChanges();

            QualifyDescription<Project>(_user.UserName);
        }

        /// <summary>
        /// Add test cameras.
        /// </summary>
        private void AddCameras()
        {
            var cameras = new Camera[]
            {
                // Generic Cameras
                new Camera
                {
                    Name = "Top Camera", Description = "Aligned along negative Z",
                    FieldOfView = Camera.DefaultFieldOfView,
                    AspectRatio = 1.0,
                    Near = Camera.DefaultNearClippingPlane, Far = Camera.DefaultFarClippingPlane,

                    PositionX = 0.0, PositionY = 0.0, PositionZ = 100.0,
                    EulerX = 0.0, EulerY = 0.0, EulerZ = -1.0, Theta = 0.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = _user, Project = FindByName<Project>(ProjectNames.ModelRelief),
                },

                new Camera
                {
                    Name = "Isometric Camera", Description = "Isometric",
                    FieldOfView = Camera.DefaultFieldOfView,
                    AspectRatio = 1.0,
                    Near = Camera.DefaultNearClippingPlane, Far = Camera.DefaultFarClippingPlane,

                    PositionX = 10.0, PositionY = 100.0, PositionZ = 100.0,
                    EulerX = -1.0, EulerY = -1.0, EulerZ = -1.0, Theta = 0.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = _user, Project = FindByName<Project>(ProjectNames.ModelRelief),
                },

                // Model Specific Cameras
                new Camera
                {
                    Name = "Armadillo", Description = "Armadillo Model",
                    FieldOfView = Camera.DefaultFieldOfView,
                    AspectRatio = 1.0,
                    Near = 232.05, Far = 339.50,
                    PositionX = -1.82, PositionY = 47.98, PositionZ = 262.32,
                    EulerX = 0.0475, EulerY = 0.0, EulerZ = 0.0, Theta = 1.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new Camera
                {
                    Name = "Buddha", Description = "Buddha Model",
                    FieldOfView = Camera.DefaultFieldOfView,
                    AspectRatio = 1.0,
                    Near = 222.23, Far = 283.75,

                    PositionX = -3.00, PositionY = 79.11, PositionZ = 252.03,
                    EulerX = -0.01, EulerY = -0.01, EulerZ = 0.0, Theta = 1.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new Camera
                {
                    Name = "Bunny", Description = "Bunny Model",
                    FieldOfView = Camera.DefaultFieldOfView,
                    AspectRatio = 1.0,
                    Near = 132.85, Far = 201.95,

                    PositionX = -0.34, PositionY = 43.17, PositionZ = 167.44,
                    EulerX = 0.0, EulerY = 0.0, EulerZ = 0.0, Theta = 1.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new Camera
                {
                    Name = "Dolphin", Description = "Dolphin Model",
                    FieldOfView = Camera.DefaultFieldOfView,
                    AspectRatio = 1.0,
                    Near = 355.49, Far = 800.22,

                    PositionX = 117.67, PositionY = -192.35, PositionZ = 511.19,
                    EulerX = 0.23, EulerY = 0.11, EulerZ = -0.03, Theta = 0.97,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.10, UpY = 0.90, UpZ = 0.43,

                    User = _user, Project = FindByName<Project>(ProjectNames.Jewelry),
                },
                new Camera
                {
                    Name = "Dragon", Description = "Dragon Model",
                    FieldOfView = Camera.DefaultFieldOfView,
                    AspectRatio = 1.0,
                    Near = 145.41, Far = 190.31,

                    PositionX = -1.92, PositionY = 61.41, PositionZ = 160.73,
                    EulerX = -0.08, EulerY = -0.01, EulerZ = 0.0, Theta = 1.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new Camera
                {
                    Name = "House", Description = "House Model",
                    FieldOfView = Camera.DefaultFieldOfView,
                    AspectRatio = 1.0,
                    Near = 209.28, Far = 369.43,

                    PositionX = 194.81, PositionY = 51.82, PositionZ = 214.04,
                    EulerX = 0.04, EulerY = 0.36, EulerZ = -0.01, Theta = 0.93,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.06, UpY = 1.0, UpZ = 0.07,

                    User = _user, Project = FindByName<Project>(ProjectNames.Architecture),
                },
                new Camera
                {
                    Name = "Lucy", Description = "Lucy Model",
                    FieldOfView = Camera.DefaultFieldOfView,
                    AspectRatio = 1.0,
                    Near = 238.39, Far = 292.00,

                    PositionX = -3.16, PositionY = 79.32, PositionZ = 265.07,
                    EulerX = 0.0, EulerY = 0.0, EulerZ = 0.0, Theta = 1.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new Camera
                {
                    Name = "Roadster", Description = "Roadster Model",
                    FieldOfView = Camera.DefaultFieldOfView,
                    AspectRatio = 1.0,
                    Near = 534.84, Far = 1028.02,

                    PositionX = -419.61, PositionY = 189.93, PositionZ = 644.02,
                    EulerX = -0.07, EulerY = -0.29, EulerZ = 0.0, Theta = 0.96,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.05, UpY = 0.99, UpZ = -0.13,

                    User = _user, Project = FindByName<Project>(ProjectNames.Jewelry),
                },
                new Camera
                {
                    Name = "Statue", Description = "Statue Model",
                    FieldOfView = Camera.DefaultFieldOfView,
                    AspectRatio = 1.0,
                    Near = 299.54, Far = 401.68,

                    PositionX = -4.16, PositionY = 72.49, PositionZ = 358.58,
                    EulerX = 0.04, EulerY = -0.01, EulerZ = 0.0, Theta = 1.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new Camera
                {
                    Name = "Tyrannosaurus", Description = "Tyrannosarus Model",
                    FieldOfView = Camera.DefaultFieldOfView,
                    AspectRatio = 1.0,
                    Near = 228.35, Far = 469.87,

                    PositionX = 0.00, PositionY = 75.56, PositionZ = 310.00,
                    EulerX = 0.00, EulerY = 0.0, EulerZ = 0.0, Theta = 1.00,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.00, UpZ = 0.0,

                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new Camera
                {
                    Name = "Test", Description = "Test Model",
                    FieldOfView = Camera.DefaultFieldOfView,
                    AspectRatio = 1.0,
                    Near = 148.69, Far = 199.42,

                    PositionX = 25.00, PositionY = 201.06, PositionZ = -46.50,
                    EulerX = -0.71, EulerY = 0.0, EulerZ = 0.0, Theta = 0.71,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 0.0, UpZ = -1.0,

                    User = _user, Project = FindByName<Project>(ProjectNames.ModelRelief),
                },
            };

            foreach (Camera camera in cameras)
            {
                DbContext.Cameras.Add(camera);
            }
            DbContext.SaveChanges();

            QualifyDescription<Camera>(_user.UserName);
        }

        /// <summary>
        /// Add test models.
        /// </summary>
        private void AddModels()
        {
            var models = new Model3d[]
            {
                new Model3d
                {
                    Name = "armadillo.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    User = _user, Project = FindByName<Project>("Stanford"), Camera = FindByName<Camera>("Isometric Camera"),
                },
                new Model3d
                {
                    Name = "buddha.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    User = _user, Project = FindByName<Project>("Stanford"), Camera = FindByName<Camera>("Top Camera"),
                },
                new Model3d
                {
                    Name = "bunny.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    User = _user, Project = FindByName<Project>("Stanford"), Camera = FindByName<Camera>("Top Camera"),
                },
                new Model3d
                {
                    Name = "dolphin.obj", Description = "Ocean dolphin", Format = Model3dFormat.OBJ,
                    User = _user, Project = FindByName<Project>(ProjectNames.Jewelry), Camera = FindByName<Camera>("Top Camera"),
                },
                new Model3d
                {
                    Name = "dragon.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    User = _user, Project = FindByName<Project>("Stanford"), Camera = FindByName<Camera>("Top Camera"),
                },
                new Model3d
                {
                    Name = "house.obj", Description = "San Francisco house", Format = Model3dFormat.OBJ,
                    User = _user, Project = FindByName<Project>(ProjectNames.Architecture), Camera = FindByName<Camera>("Top Camera"),
                },
                new Model3d
                {
                    Name = "lucy.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    User = _user, Project = FindByName<Project>("Stanford"), Camera = FindByName<Camera>("Top Camera"),
                },
                new Model3d
                {
                    Name = "roadster.obj", Description = "Duesen Bayern Mystar 190 SL", Format = Model3dFormat.OBJ,
                    User = _user, Project = FindByName<Project>(ProjectNames.Jewelry), Camera = FindByName<Camera>("Top Camera"),
                },
                new Model3d
                {
                    Name = "statue.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    User = _user, Project = FindByName<Project>("Stanford"), Camera = FindByName<Camera>("Top Camera"),
                },
                new Model3d
                {
                    Name = "test.obj", Description = "Reference test model", Format = Model3dFormat.OBJ,
                    User = _user, Project = FindByName<Project>(ProjectNames.ModelRelief), Camera = FindByName<Camera>("Top Camera"),
                },
                new Model3d
                {
                    Name = "tyrannosaurus.obj", Description = "Stanford test model", Format = Model3dFormat.OBJ,
                    User = _user, Project = FindByName<Project>("Stanford"), Camera = FindByName<Camera>("Isometric Camera"),
                },
            };

            foreach (Model3d model in models)
            {
                DbContext.Models.Add(model);
            }
            DbContext.SaveChanges();

            SetFileProperties(models);
            QualifyDescription<Model3d>(_user.UserName);
        }

        /// <summary>
        /// Add mesh transforms.
        /// </summary>
        private void AddMeshTransforms()
        {
            var meshTransforms = new MeshTransform[]
            {
                // Generic MeshTransforms
                new MeshTransform
                {
                    Name = "Identity", Description = "Default transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = _user, Project = FindByName<Project>(ProjectNames.ModelRelief),
                },

                new MeshTransform
                {
                    Name = "Pendant", Description = "Pendant transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = _user, Project = FindByName<Project>(ProjectNames.Architecture),
                },

                // Model-specific MeshTransforms
                new MeshTransform
                {
                    Name = "Armadillo", Description = "Armadillo transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.9, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 6.0,
                    P1 = 0.02, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new MeshTransform
                {
                    Name = "Bunny", Description = "Bunny transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new MeshTransform
                {
                    Name = "Buddha", Description = "Buddha transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new MeshTransform
                {
                    Name = "Dolphin", Description = "Dolphin transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = _user, Project = FindByName<Project>(ProjectNames.Jewelry),
                },
                new MeshTransform
                {
                    Name = "Dragon", Description = "Dragon transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new MeshTransform
                {
                    Name = "House", Description = "House transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = _user, Project = FindByName<Project>(ProjectNames.Architecture),
                },
                new MeshTransform
                {
                    Name = "Lucy", Description = "Lucy transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new MeshTransform
                {
                    Name = "Roadster", Description = "Roadster transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = _user, Project = FindByName<Project>(ProjectNames.Jewelry),
                },
                new MeshTransform
                {
                    Name = "Statue", Description = "Statue transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = _user, Project = FindByName<Project>(ProjectNames.Jewelry),
                },
                new MeshTransform
                {
                    Name = "Test", Description = "Test transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = _user, Project = FindByName<Project>(ProjectNames.ModelRelief),
                },
                new MeshTransform
                {
                    Name = "Tyrannosaurus", Description = "Tyrannosaurus transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = _user, Project = FindByName<Project>("Stanford"),
                },
            };

            foreach (MeshTransform meshTransform in meshTransforms)
            {
                DbContext.MeshTransforms.Add(meshTransform);
            }
            DbContext.SaveChanges();

            QualifyDescription<MeshTransform>(_user.UserName);
        }

        /// <summary>
        /// Add test depth buffers.
        /// </summary>
        private void AddDepthBuffers()
        {
            var depthBuffers = new DepthBuffer[]
            {
                new DepthBuffer
                {
                    Name = "armadillo.sdb", Description = "Generated in Rhino",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>("armadillo.obj"), Camera = FindByName<Camera>("Armadillo"),
                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new DepthBuffer
                {
                    Name = "buddha.sdb", Description = "Generated in Rhino",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>("buddha.obj"), Camera = FindByName<Camera>("Buddha"),
                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new DepthBuffer
                {
                    Name = "bunny.sdb", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>("bunny.obj"), Camera = FindByName<Camera>("Bunny"),
                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new DepthBuffer
                {
                    Name = "dolphin.sdb", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>("dolphin.obj"), Camera = FindByName<Camera>("Dolphin"),
                    User = _user, Project = FindByName<Project>(ProjectNames.Jewelry),
                },
                new DepthBuffer
                {
                    Name = "dragon.sdb", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>("dragon.obj"), Camera = FindByName<Camera>("Dragon"),
                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new DepthBuffer
                {
                    Name = "house.sdb", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>("house.obj"), Camera = FindByName<Camera>("House"),
                    User = _user, Project = FindByName<Project>(ProjectNames.Architecture),
                },
                new DepthBuffer
                {
                    Name = "lucy.sdb", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>("lucy.obj"), Camera = FindByName<Camera>("Lucy"),
                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new DepthBuffer
                {
                    Name = "roadster.sdb", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>("roadster.obj"), Camera = FindByName<Camera>("Roadster"),
                    User = _user, Project = FindByName<Project>(ProjectNames.Jewelry),
                },
                new DepthBuffer
                {
                    Name = "statue.sdb", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>("statue.obj"), Camera = FindByName<Camera>("Statue"),
                    User = _user, Project = FindByName<Project>("Stanford"),
                },
                new DepthBuffer
                {
                    Name = "test.sdb", Description = "Generated in ModelRelief",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>("test.obj"), Camera = FindByName<Camera>("Test"),
                    User = _user, Project = FindByName<Project>(ProjectNames.ModelRelief),
                },
                new DepthBuffer
                {
                    Name = "tyrannosaurus.sdb", Description = "Generated in ModelRelief",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>("tyrannosaurus.obj"), Camera = FindByName<Camera>("Tyrannosaurus"),
                    User = _user, Project = FindByName<Project>("Stanford"),
                },
            };

            foreach (DepthBuffer depthBuffer in depthBuffers)
            {
                DbContext.DepthBuffers.Add(depthBuffer);
            }
            DbContext.SaveChanges();

            SetFileProperties(depthBuffers);
            QualifyDescription<DepthBuffer>(_user.UserName);
        }

        /// <summary>
        /// Add test meshes.
        /// </summary>
        private void AddMeshes()
        {
            var meshes = new Mesh[]
            {
                new Mesh
                {
                    Name = "armadillo.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>("Top Camera"), DepthBuffer = FindByName<DepthBuffer>("armadillo.sdb"), MeshTransform = FindByName<MeshTransform>("Armadillo"),
                    User = _user, Project = FindByName<Project>(ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "buddha.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>("Top Camera"), DepthBuffer = FindByName<DepthBuffer>("buddha.sdb"), MeshTransform =  FindByName<MeshTransform>("Buddha"),
                    User = _user, Project = FindByName<Project>(ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "bunny.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>("Top Camera"), DepthBuffer = FindByName<DepthBuffer>("bunny.sdb"), MeshTransform =  FindByName<MeshTransform>("Bunny"),
                    User = _user, Project = FindByName<Project>(ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "dolphin.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>("Top Camera"), DepthBuffer = FindByName<DepthBuffer>("dolphin.sdb"), MeshTransform =  FindByName<MeshTransform>("Dolphin"),
                    User = _user, Project = FindByName<Project>(ProjectNames.Jewelry),
                },
                new Mesh
                {
                    Name = "dragon.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>("Top Camera"), DepthBuffer = FindByName<DepthBuffer>("dragon.sdb"), MeshTransform =  FindByName<MeshTransform>("Dragon"),
                    User = _user, Project = FindByName<Project>(ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "house.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>("Top Camera"), DepthBuffer = FindByName<DepthBuffer>("house.sdb"), MeshTransform =  FindByName<MeshTransform>("House"),
                    User = _user, Project = FindByName<Project>(ProjectNames.Architecture),
                },
                new Mesh
                {
                    Name = "lucy.sfp", Description = "Isometric", Format = MeshFormat.SFP, Camera = FindByName<Camera>("Isometric Camera"), DepthBuffer = FindByName<DepthBuffer>("lucy.sdb"), MeshTransform =  FindByName<MeshTransform>("Lucy"),
                    User = _user, Project = FindByName<Project>(ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "roadster.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>("Top Camera"), DepthBuffer = FindByName<DepthBuffer>("roadster.sdb"), MeshTransform =  FindByName<MeshTransform>("Roadster"),
                    User = _user, Project = FindByName<Project>(ProjectNames.Jewelry),
                },
                new Mesh
                {
                    Name = "statue.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>("Top Camera"), DepthBuffer = FindByName<DepthBuffer>("statue.sdb"), MeshTransform =  FindByName<MeshTransform>("Statue"),
                    User = _user, Project = FindByName<Project>(ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "test.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>("Top Camera"), DepthBuffer = FindByName<DepthBuffer>("test.sdb"), MeshTransform =  FindByName<MeshTransform>("Test"),
                    User = _user, Project = FindByName<Project>(ProjectNames.ModelRelief),
                },
                new Mesh
                {
                    Name = "tyrannosaurus.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>("Top Camera"), DepthBuffer = FindByName<DepthBuffer>("tyrannosaurus.sdb"), MeshTransform =  FindByName<MeshTransform>("Tyrannosaurus"),
                    User = _user, Project = FindByName<Project>(ProjectNames.ModelRelief),
                },
            };

            foreach (Mesh mesh in meshes)
            {
                DbContext.Meshes.Add(mesh);
            }
            DbContext.SaveChanges();

            SetFileProperties(meshes);
            QualifyDescription<Mesh>(_user.UserName);
        }

        /// <summary>
        /// Create the user store for a particular model type.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="folderType">Type of folder</param>
        private void CopyTestFiles<TEntity>(string folderType)
            where TEntity : DomainModel
        {
            var sourceFolderPartialPath = $"{ConfigurationProvider.GetSetting(Paths.TestDataUsers)}/{ConfigurationProvider.GetSetting(folderType)}";
            var sourceFolderPath        = $"{HostingEnvironment.ContentRootPath}{sourceFolderPartialPath}";

            var storeUsersPartialPath = ConfigurationProvider.GetSetting(Paths.StoreUsers);
            var destinationFolderPath   = $"{HostingEnvironment.WebRootPath}{storeUsersPartialPath}{_user.Id}/{ConfigurationProvider.GetSetting(folderType)}";
            Directory.CreateDirectory(destinationFolderPath);

            // iterate over all folders
            var rootSourceDirectory = new System.IO.DirectoryInfo(sourceFolderPath);
            System.IO.DirectoryInfo[] subDirs = rootSourceDirectory.GetDirectories();
            foreach (System.IO.DirectoryInfo dirInfo in subDirs)
            {
                // parent directory name = database resource ID
                var model = DbContext.Set<TEntity>()
                    .Where(m => m.Name.StartsWith(dirInfo.Name))
                    .Where(m => (m.UserId == _user.Id))
                    .FirstOrDefault();

                if (model == null)
                    Debug.Assert(false, $"DbInitializer: Model name ${dirInfo.Name} not found in database for type ${typeof(TEntity).Name}.");

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
        /// <param name="name">Name property to match.</param>
        /// <returns>Matching entity.</returns>
        private TEntity FindByName<TEntity>(string name)
            where TEntity : DomainModel
        {
            var resource = DbContext.Set<TEntity>()
                .Where(r => ((r.Name == name) && (r.UserId == _user.Id))).First();

            if (resource == null)
                Debug.Assert(false, $"DbInitializer: {typeof(TEntity).Name} = '{name}' not found)");

            return resource;
        }

        /// <summary>
        /// Adds a qualifying suffix to the end of the Description property.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="descriptionSuffix">Suffix to end.</param>
        private void QualifyDescription<TEntity>(string descriptionSuffix)
            where TEntity : DomainModel
        {
            var models = DbContext.Set<TEntity>()
                            .Where(m => (m.User.Id == _user.Id));

            foreach (var model in models)
                {
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
                model.Path = StorageManager.DefaultModelStorageFolder(model);

                if (model is GeneratedFileDomainModel generatedModel)
                    generatedModel.FileIsSynchronized = true;
            }

            DbContext.SaveChanges();
        }
    }
}
