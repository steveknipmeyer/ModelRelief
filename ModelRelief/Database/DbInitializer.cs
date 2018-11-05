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
    using System.Text.RegularExpressions;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Domain;
    using ModelRelief.Features.Settings;
    using ModelRelief.Services;
    using ModelRelief.Utility;
    using Newtonsoft.Json;

    using static ModelRelief.Services.StorageManager;

    public class DbInitializer
    {
        private bool                            ExitAfterInitialization  { get; set; }
        private IServiceProvider                Services { get; set; }
        private IHostingEnvironment             HostingEnvironment  { get; set; }
        private Services.IConfigurationProvider ConfigurationProvider  { get; set; }
        private ModelReliefDbContext            DbContext  { get; set; }
        private UserManager<ApplicationUser>    UserManager  { get; set; }
        private ILogger<DbInitializer>          Logger  { get; set; }
        private IStorageManager                 StorageManager { get; set; }

        private string                          StoreUsersPath { get; set; }
        private string                          SqlitePath { get; set; }

        /// <summary>
        /// User Accounts
        /// </summary>
        private class UserAccounts
        {
            public static readonly string Test    = "TestAccount";
            public static readonly string ArtCAM  = "ArtCAMAccount";
            public static readonly string Vectric = "VectricAccount";
        }

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
        /// <param name="exitAfterInitialization">Exit after initialization. Do not start web server.</param>
        public DbInitializer(IServiceProvider services, bool exitAfterInitialization)
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

            var storeUsersPartialPath = ConfigurationProvider.GetSetting(Paths.StoreUsers);
            StoreUsersPath = GetAbsolutePath(storeUsersPartialPath);

            SqlitePath = Path.GetFullPath($"{GetAbsolutePath(ConfigurationProvider.GetSetting(Paths.StoreDatabase))}{ConfigurationSettings.SQLite}");

            ExitAfterInitialization = exitAfterInitialization;
        }

        /// <summary>
        /// Ensure the database server is initialized and available.
        /// During (Docker) startup the front-end may attemp to access the database before the service is running.!--
        /// </summary>
        private bool EnsureServerInitialized()
        {
            string connectionString;
            switch (ConfigurationProvider.Database)
            {
                case RelationalDatabaseProvider.SQLite:
                    Directory.CreateDirectory(SqlitePath);
                    return true;

                default:
                case RelationalDatabaseProvider.SQLServer:
                    connectionString = ConfigurationProvider.Configuration.GetConnectionString(ConfigurationSettings.SQLServer);
                    // N.B. The database may not have been created yet.
                    // Here we are only trying to establish the server is running so remove the Database setting.
                    var regex = new Regex(@";Database=[\w+]*");
                    connectionString = regex.Replace(connectionString, string.Empty);
                    break;
            }

            var maximumAttempts = 10;
            var secondsBetweenAttempts = 2;
            var stopwatch = new Stopwatch();
            stopwatch.Start();
            for (int attempt = 0; attempt < maximumAttempts; attempt++)
            {
                try
                {
                    using (var connection = new System.Data.SqlClient.SqlConnection(connectionString))
                    {
                        connection.Open();
                        connection.Close();
                        Logger.LogInformation($"EnsureServerRunning: The SQLServer is now available.");
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    {
                        Logger.LogWarning($"EnsureServerInitialized: server connection failed: {ex.Message}.");
                    }
                }
                Thread.Sleep(secondsBetweenAttempts * 1000);
            }
            // WIP: What handling is needed if the server cannot be reached?
            Logger.LogError($"The database connection could not be opened after {maximumAttempts} attempts to reach the server.");
            return false;
        }

        /// <summary>
        /// Process the command line arguments and initialize.
        /// </summary>
        public void Initialize()
        {
            EnsureServerInitialized();

            if (ConfigurationProvider.ParseBooleanSetting(ConfigurationSettings.MRInitializeUserStore))
                InitializeUserStore();

            if (ConfigurationProvider.ParseBooleanSetting(ConfigurationSettings.MRInitializeDatabase))
            {
                InitializeDatabase().Wait();
                if (ConfigurationProvider.ParseBooleanSetting(ConfigurationSettings.MRSeedDatabase))
                {
                    SeedDatabaseForTestUsers().Wait();
                }
            }
        }

        /// <summary>
        /// Populate the database schema.
        /// </summary>
        public async Task InitializeDatabase()
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
                    databaseFolder = SqlitePath;
                    Directory.CreateDirectory(databaseFolder);
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
        private async Task SeedDatabaseForTestUsers()
        {
            var userAccounts = new List<string>
            {
                UserAccounts.Test,
                UserAccounts.ArtCAM,
                UserAccounts.Vectric,
            };

            foreach (var account in userAccounts)
            {
                var user = await AddUser(account);
                SeedDatabaseForUser(user);
            }

            CreateTestDatabase();
        }

        /// <summary>
        /// Populate the database and user store with examples.
        /// </summary>
        /// <param name="user">Owning user.</param>
        public void SeedDatabaseForUser(ApplicationUser user)
        {
            // database
            AddProjects(user);
            AddCameras(user);
            AddModels(user);
            AddMeshTransforms(user);

            AddDepthBuffers(user);
            AddMeshes(user);

            // user store
            SeedUserStore(user);

            Logger.LogInformation($"User {user} database and sample data sets created.");
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
        private void InitializeUserStore()
        {
#if false
            if (!ExitAfterInitialization)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Delete the user store folder: {storeUsersPath} (Y/N)?");
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
        /// Create the user store in the file system.
        /// Copy the test data files into the web user store.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void SeedUserStore(ApplicationUser user)
        {
            CopyTestFiles<Domain.Model3d>(user, "Paths:ResourceFolders:Model3d");
            CopyTestFiles<Domain.DepthBuffer>(user, "Paths:ResourceFolders:DepthBuffer");
            CopyTestFiles<Domain.Mesh>(user, "Paths:ResourceFolders:Mesh");
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
        /// <param name="user">Owning user.</param>
        private void AddProjects(ApplicationUser user)
        {
            var projects = new Project[]
            {
                new Project { Name = ProjectNames.Architecture, Description = "Architectural structures, woodwork, panels and details", User = user },
                new Project { Name = ProjectNames.Jewelry, Description = "Jewelry watch faces, bracelets and pendants", User = user },
                new Project { Name = ProjectNames.ModelRelief, Description = "Development and Test", User = user },
                new Project { Name = ProjectNames.Stanford, Description = "Stanford model repository", User = user },
            };
            foreach (Project project in projects)
            {
                DbContext.Projects.Add(project);
            }
            DbContext.SaveChanges();

            QualifyDescription<Project>(user);
        }

        /// <summary>
        /// Add test cameras.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void AddCameras(ApplicationUser user)
        {
            var cameras = new Camera[]
            {
                // Generic Cameras
                new Camera
                {
                    Name = "Top Camera", Description = "Aligned along negative Z",
                    IsPerspective = true,
                    FieldOfView = DefaultCameraSettings.FieldOfView,
                    AspectRatio = 1.0,
                    Near = DefaultCameraSettings.NearClippingPlane, Far = DefaultCameraSettings.FarClippingPlane,
                    Left = -100, Right = 100, Top = 100, Bottom = -100,

                    PositionX = 0.0, PositionY = 0.0, PositionZ = 100.0,
                    EulerX = 0.0, EulerY = 0.0, EulerZ = -1.0, Theta = 0.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = user, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },

                new Camera
                {
                    Name = "Isometric Camera", Description = "Isometric",
                    IsPerspective = true,
                    FieldOfView = DefaultCameraSettings.FieldOfView,
                    AspectRatio = 1.0,
                    Near = DefaultCameraSettings.NearClippingPlane, Far = DefaultCameraSettings.FarClippingPlane,
                    Left = -100, Right = 100, Top = 100, Bottom = -100,

                    PositionX = 10.0, PositionY = 100.0, PositionZ = 100.0,
                    EulerX = -1.0, EulerY = -1.0, EulerZ = -1.0, Theta = 0.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = user, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },

                // Model Specific Cameras
                new Camera
                {
                    Name = "Armadillo", Description = "Armadillo Model",
                    IsPerspective = true,
                    FieldOfView = DefaultCameraSettings.FieldOfView,
                    AspectRatio = 1.0,
                    Near = 232.05, Far = 339.50,
                    Left = -100, Right = 100, Top = 100, Bottom = -100,

                    PositionX = -1.82, PositionY = 47.98, PositionZ = 262.32,
                    EulerX = 0.0475, EulerY = 0.0, EulerZ = 0.0, Theta = 1.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new Camera
                {
                    Name = "Buddha", Description = "Buddha Model",
                    IsPerspective = true,
                    FieldOfView = DefaultCameraSettings.FieldOfView,
                    AspectRatio = 1.0,
                    Near = 222.23, Far = 283.75,
                    Left = -100, Right = 100, Top = 100, Bottom = -100,

                    PositionX = -3.00, PositionY = 79.11, PositionZ = 252.03,
                    EulerX = -0.01, EulerY = -0.01, EulerZ = 0.0, Theta = 1.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new Camera
                {
                    Name = "Bunny", Description = "Bunny Model",
                    IsPerspective = true,
                    FieldOfView = DefaultCameraSettings.FieldOfView,
                    AspectRatio = 1.0,
                    Near = 132.85, Far = 201.95,
                    Left = -100, Right = 100, Top = 100, Bottom = -100,

                    PositionX = -0.34, PositionY = 43.17, PositionZ = 167.44,
                    EulerX = 0.0, EulerY = 0.0, EulerZ = 0.0, Theta = 1.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new Camera
                {
                    Name = "Dolphin", Description = "Dolphin Model",
                    IsPerspective = true,
                    FieldOfView = DefaultCameraSettings.FieldOfView,
                    AspectRatio = 1.0,
                    Near = 355.49, Far = 800.22,
                    Left = -100, Right = 100, Top = 100, Bottom = -100,

                    PositionX = 117.67, PositionY = -192.35, PositionZ = 511.19,
                    EulerX = 0.23, EulerY = 0.11, EulerZ = -0.03, Theta = 0.97,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.10, UpY = 0.90, UpZ = 0.43,

                    User = user, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new Camera
                {
                    Name = "Dragon", Description = "Dragon Model",
                    IsPerspective = true,
                    FieldOfView = DefaultCameraSettings.FieldOfView,
                    AspectRatio = 1.0,
                    Near = 145.41, Far = 190.31,
                    Left = -100, Right = 100, Top = 100, Bottom = -100,

                    PositionX = -1.92, PositionY = 61.41, PositionZ = 160.73,
                    EulerX = -0.08, EulerY = -0.01, EulerZ = 0.0, Theta = 1.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new Camera
                {
                    Name = "House", Description = "House Model",
                    IsPerspective = true,
                    FieldOfView = DefaultCameraSettings.FieldOfView,
                    AspectRatio = 1.0,
                    Near = 220.27, Far = 373.72,
                    Left = -100, Right = 100, Top = 100, Bottom = -100,

                    PositionX = 221.37, PositionY = 59.82, PositionZ = 198.47,
                    EulerX = 0.03, EulerY = 0.41, EulerZ = -0.01, Theta = 0.91,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.02, UpY = 1.0, UpZ = 0.05,

                    User = user, Project = FindByName<Project>(user, ProjectNames.Architecture),
                },
                new Camera
                {
                    Name = "Lucy", Description = "Lucy Model",
                    IsPerspective = true,
                    FieldOfView = DefaultCameraSettings.FieldOfView,
                    AspectRatio = 1.0,
                    Near = 238.39, Far = 292.00,
                    Left = -100, Right = 100, Top = 100, Bottom = -100,

                    PositionX = -3.16, PositionY = 79.32, PositionZ = 265.07,
                    EulerX = 0.0, EulerY = 0.0, EulerZ = 0.0, Theta = 1.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new Camera
                {
                    Name = "Roadster", Description = "Roadster Model",
                    IsPerspective = true,
                    FieldOfView = DefaultCameraSettings.FieldOfView,
                    AspectRatio = 1.0,
                    Near = 581.54, Far = 1080.66,
                    Left = -100, Right = 100, Top = 100, Bottom = -100,

                    PositionX = -407.88, PositionY = 187.96, PositionZ = 712.46,
                    EulerX = -0.07, EulerY = -0.26, EulerZ = -0.01, Theta = 0.96,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.05, UpY = 0.99, UpZ = -0.13,

                    User = user, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new Camera
                {
                    Name = "Statue", Description = "Statue Model",
                    IsPerspective = true,
                    FieldOfView = DefaultCameraSettings.FieldOfView,
                    AspectRatio = 1.0,
                    Near = 299.54, Far = 401.68,
                    Left = -100, Right = 100, Top = 100, Bottom = -100,

                    PositionX = -4.16, PositionY = 72.49, PositionZ = 358.58,
                    EulerX = 0.04, EulerY = -0.01, EulerZ = 0.0, Theta = 1.0,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.0, UpZ = 0.0,

                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new Camera
                {
                    Name = "Test", Description = "Isometric Test Model",
                    IsPerspective = false,
                    Near = 148.69, Far = 199.42,
                    Left = -100, Right = 100, Top = 100, Bottom = -100,

                    PositionX = 25.00, PositionY = 201.06, PositionZ = -46.50,
                    EulerX = -0.71, EulerY = 0.0, EulerZ = 0.0, Theta = 0.71,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 0.0, UpZ = -1.0,

                    User = user, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },
                new Camera
                {
                    Name = "Tyrannosaurus", Description = "Tyrannosarus Model",
                    IsPerspective = true,
                    FieldOfView = DefaultCameraSettings.FieldOfView,
                    AspectRatio = 1.0,
                    Near = 228.35, Far = 469.87,
                    Left = -100, Right = 100, Top = 100, Bottom = -100,

                    PositionX = 0.00, PositionY = 75.56, PositionZ = 310.00,
                    EulerX = 0.00, EulerY = 0.0, EulerZ = 0.0, Theta = 1.00,
                    ScaleX = 1.0, ScaleY = 1.0, ScaleZ = 1.0,
                    UpX = 0.0, UpY = 1.00, UpZ = 0.0,

                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
            };

            foreach (Camera camera in cameras)
            {
                DbContext.Cameras.Add(camera);
            }
            DbContext.SaveChanges();

            GenerateJSON<Camera>(user, "Paths:ResourceFolders:Camera");

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
                    User = user, Project = FindByName<Project>(user, "Stanford"), Camera = FindByName<Camera>(user, "Isometric Camera"),
                },
                new Model3d
                {
                    Name = "buddha.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    User = user, Project = FindByName<Project>(user, "Stanford"), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "bunny.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    User = user, Project = FindByName<Project>(user, "Stanford"), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "dolphin.obj", Description = "Ocean dolphin", Format = Model3dFormat.OBJ,
                    User = user, Project = FindByName<Project>(user, ProjectNames.Jewelry), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "dragon.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    User = user, Project = FindByName<Project>(user, "Stanford"), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "house.obj", Description = "San Francisco house", Format = Model3dFormat.OBJ,
                    User = user, Project = FindByName<Project>(user, ProjectNames.Architecture), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "lucy.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    User = user, Project = FindByName<Project>(user, "Stanford"), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "roadster.obj", Description = "Duesen Bayern Mystar 190 SL", Format = Model3dFormat.OBJ,
                    User = user, Project = FindByName<Project>(user, ProjectNames.Jewelry), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "statue.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    User = user, Project = FindByName<Project>(user, "Stanford"), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "test.obj", Description = "Reference test model", Format = Model3dFormat.OBJ,
                    User = user, Project = FindByName<Project>(user, ProjectNames.ModelRelief), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "tyrannosaurus.obj", Description = "Stanford test model", Format = Model3dFormat.OBJ,
                    User = user, Project = FindByName<Project>(user, "Stanford"), Camera = FindByName<Camera>(user, "Isometric Camera"),
                },
            };

            foreach (Model3d model in models)
            {
                DbContext.Models.Add(model);
            }
            DbContext.SaveChanges();

            SetFileProperties(models);
            QualifyDescription<Model3d>(user);
        }

        /// <summary>
        /// Add mesh transforms.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void AddMeshTransforms(ApplicationUser user)
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
                    User = user, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },

                // Model-specific MeshTransforms
                new MeshTransform
                {
                    Name = "Armadillo", Description = "Armadillo transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.9, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 6.0,
                    P1 = 0.02, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new MeshTransform
                {
                    Name = "Bunny", Description = "Bunny transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new MeshTransform
                {
                    Name = "Buddha", Description = "Buddha transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new MeshTransform
                {
                    Name = "Dolphin", Description = "Dolphin transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = user, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new MeshTransform
                {
                    Name = "Dragon", Description = "Dragon transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new MeshTransform
                {
                    Name = "House", Description = "House transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = user, Project = FindByName<Project>(user, ProjectNames.Architecture),
                },
                new MeshTransform
                {
                    Name = "Lucy", Description = "Lucy transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new MeshTransform
                {
                    Name = "Roadster", Description = "Roadster transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = user, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new MeshTransform
                {
                    Name = "Statue", Description = "Statue transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = user, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new MeshTransform
                {
                    Name = "Test", Description = "Test transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = user, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },
                new MeshTransform
                {
                    Name = "Tyrannosaurus", Description = "Tyrannosaurus transform",
                    Width = 100.0, Height = 100.0, Depth = 1.0,
                    GradientThreshold = 5.0, AttenuationFactor = 10.0, AttenuationDecay = 0.6, UnsharpGaussianLow = 4.0, UnsharpGaussianHigh = 1.0, UnsharpHighFrequencyScale = 3.0,
                    P1 = 0.03, P2 = 1.0, P3 = 0.0, P4 = 0.0, P5 = 0.0, P6 = 0.0, P7 = 0.0, P8 = 0.0,
                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
            };

            foreach (MeshTransform meshTransform in meshTransforms)
            {
                DbContext.MeshTransforms.Add(meshTransform);
            }
            DbContext.SaveChanges();

            GenerateJSON<MeshTransform>(user, "Paths:ResourceFolders:MeshTransform");

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
                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new DepthBuffer
                {
                    Name = "buddha.sdb", Description = "Generated in Rhino",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "buddha.obj"), Camera = FindByName<Camera>(user, "Buddha"),
                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new DepthBuffer
                {
                    Name = "bunny.sdb", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "bunny.obj"), Camera = FindByName<Camera>(user, "Bunny"),
                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new DepthBuffer
                {
                    Name = "dolphin.sdb", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "dolphin.obj"), Camera = FindByName<Camera>(user, "Dolphin"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new DepthBuffer
                {
                    Name = "dragon.sdb", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "dragon.obj"), Camera = FindByName<Camera>(user, "Dragon"),
                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new DepthBuffer
                {
                    Name = "house.sdb", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "house.obj"), Camera = FindByName<Camera>(user, "House"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.Architecture),
                },
                new DepthBuffer
                {
                    Name = "lucy.sdb", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "lucy.obj"), Camera = FindByName<Camera>(user, "Lucy"),
                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new DepthBuffer
                {
                    Name = "roadster.sdb", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "roadster.obj"), Camera = FindByName<Camera>(user, "Roadster"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new DepthBuffer
                {
                    Name = "statue.sdb", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "statue.obj"), Camera = FindByName<Camera>(user, "Statue"),
                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
                new DepthBuffer
                {
                    Name = "test.sdb", Description = "Generated in ModelRelief",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "test.obj"), Camera = FindByName<Camera>(user, "Test"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },
                new DepthBuffer
                {
                    Name = "tyrannosaurus.sdb", Description = "Generated in ModelRelief",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "tyrannosaurus.obj"), Camera = FindByName<Camera>(user, "Tyrannosaurus"),
                    User = user, Project = FindByName<Project>(user, "Stanford"),
                },
            };

            foreach (DepthBuffer depthBuffer in depthBuffers)
            {
                DbContext.DepthBuffers.Add(depthBuffer);
            }
            DbContext.SaveChanges();

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
                    Name = "armadillo.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"), DepthBuffer = FindByName<DepthBuffer>(user, "armadillo.sdb"), MeshTransform = FindByName<MeshTransform>(user, "Armadillo"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "buddha.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"), DepthBuffer = FindByName<DepthBuffer>(user, "buddha.sdb"), MeshTransform =  FindByName<MeshTransform>(user, "Buddha"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "bunny.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"), DepthBuffer = FindByName<DepthBuffer>(user, "bunny.sdb"), MeshTransform =  FindByName<MeshTransform>(user, "Bunny"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "dolphin.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"), DepthBuffer = FindByName<DepthBuffer>(user, "dolphin.sdb"), MeshTransform =  FindByName<MeshTransform>(user, "Dolphin"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new Mesh
                {
                    Name = "dragon.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"), DepthBuffer = FindByName<DepthBuffer>(user, "dragon.sdb"), MeshTransform =  FindByName<MeshTransform>(user, "Dragon"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "house.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"), DepthBuffer = FindByName<DepthBuffer>(user, "house.sdb"), MeshTransform =  FindByName<MeshTransform>(user, "House"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.Architecture),
                },
                new Mesh
                {
                    Name = "lucy.sfp", Description = "Isometric", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Isometric Camera"), DepthBuffer = FindByName<DepthBuffer>(user, "lucy.sdb"), MeshTransform =  FindByName<MeshTransform>(user, "Lucy"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "roadster.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"), DepthBuffer = FindByName<DepthBuffer>(user, "roadster.sdb"), MeshTransform =  FindByName<MeshTransform>(user, "Roadster"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new Mesh
                {
                    Name = "statue.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"), DepthBuffer = FindByName<DepthBuffer>(user, "statue.sdb"), MeshTransform =  FindByName<MeshTransform>(user, "Statue"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "test.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"), DepthBuffer = FindByName<DepthBuffer>(user, "test.sdb"), MeshTransform =  FindByName<MeshTransform>(user, "Test"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },
                new Mesh
                {
                    Name = "tyrannosaurus.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"), DepthBuffer = FindByName<DepthBuffer>(user, "tyrannosaurus.sdb"), MeshTransform =  FindByName<MeshTransform>(user, "Tyrannosaurus"),
                    User = user, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },
            };

            foreach (Mesh mesh in meshes)
            {
                DbContext.Meshes.Add(mesh);
            }
            DbContext.SaveChanges();

            SetFileProperties(meshes);
            QualifyDescription<Mesh>(user);
        }

        /// <summary>
        /// Create the user store for a particular model type.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="user">Owning user.</param>
        /// <param name="folderType">Type of folder</param>
        private void CopyTestFiles<TEntity>(ApplicationUser user, string folderType)
            where TEntity : DomainModel
        {
            var sourceFolderPartialPath = $"{ConfigurationProvider.GetSetting(Paths.TestDataUsers)}/{ConfigurationProvider.GetSetting(folderType)}";
            var sourceFolderPath        = $"{HostingEnvironment.ContentRootPath}{sourceFolderPartialPath}";

            var destinationFolderPath   = $"{StoreUsersPath}{user.Id}/{ConfigurationProvider.GetSetting(folderType)}";
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
        /// <param name="user">Owning user.</param>
        /// <param name="name">Name property to match.</param>
        /// <returns>Matching entity.</returns>
        private TEntity FindByName<TEntity>(ApplicationUser user, string name)
            where TEntity : DomainModel
        {
            var resource = DbContext.Set<TEntity>()
                .Where(r => ((r.Name == name) && (r.UserId == user.Id))).First();

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
            var descriptionSuffix = user.UserName;
            var models = DbContext.Set<TEntity>()
                            .Where(m => (m.User.Id == user.Id));

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
                model.Path = GetRelativePath(StorageManager.DefaultModelStorageFolder(model));

                if (model is GeneratedFileDomainModel generatedModel)
                    generatedModel.FileIsSynchronized = true;
            }

            DbContext.SaveChanges();
        }

        private string GetTestUserName()
        {
            var userNameSetting = $"{UserAccounts.Test}:UserName";
            var userName = ConfigurationProvider.GetSetting(userNameSetting);
            return userName;
        }

        /// <summary>
        /// Creates a JSON file containing all the objects of the given type.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="user">Application user.</param>
        /// <param name="folderType">Type of folder</param>
        private void GenerateJSON<TEntity>(ApplicationUser user, string folderType)
            where TEntity : DomainModel
        {
            if (!string.Equals(user.UserName, GetTestUserName()))
                return;

            var modelList = DbContext.Set<TEntity>()
            .Where(r => (r.UserId == user.Id));

            var jsonFolderPartialPath = $"{ConfigurationProvider.GetSetting(Paths.TestDataUsers)}/{ConfigurationProvider.GetSetting(folderType)}";
            var jsonFolder = $"{HostingEnvironment.ContentRootPath}{jsonFolderPartialPath}";

            var modelType = typeof(TEntity).Name;
            var jsonFile = $"{Path.Combine(jsonFolder, modelType)}.json";

            using (StreamWriter file = File.CreateText(jsonFile))
            {
                JsonSerializer serializer = new JsonSerializer()
                {
                    Formatting = Formatting.Indented,
                    MaxDepth = 2,
                };

                //serialize object directly into file stream
                serializer.Serialize(file, modelList);
            }

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine($"Writing JSON definitions for {user.UserName} amd model = {modelType}, file = {jsonFile}");
            Console.ForegroundColor = ConsoleColor.White;
        }
    }
}
