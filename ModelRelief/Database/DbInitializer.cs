﻿// -----------------------------------------------------------------------
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
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using ModelRelief.Domain;
    using ModelRelief.Services;
    using ModelRelief.Settings;
    using ModelRelief.Utility;
    using Newtonsoft.Json;

    public class DbInitializer
    {
        private bool ExitAfterInitialization { get; set; }
        private IServiceProvider Services { get; set; }
        private IHostingEnvironment HostingEnvironment { get; set; }
        private Services.IConfigurationProvider ConfigurationProvider { get; set; }
        private ModelReliefDbContext DbContext { get; set; }
        private ILogger<DbInitializer> Logger { get; set; }
        private IStorageManager StorageManager { get; set; }
        private AccountsSettings Accounts { get; set; }

        private string StoreUsersPath { get; set; }
        private string SqlitePath { get; set; }

        /// <summary>
        /// Test Project Names
        /// </summary>
        private class ProjectNames
        {
            public static readonly string Architecture = "Architecture";
            public static readonly string Jewelry = "Jewelry";
            public static readonly string ModelRelief = "ModelRelief";
            public static readonly string Stanford = "Stanford";
        }

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

            HostingEnvironment = Services.GetRequiredService<IHostingEnvironment>();
            if (HostingEnvironment == null)
                throw new ArgumentNullException(nameof(HostingEnvironment));

            ConfigurationProvider = services.GetRequiredService<Services.IConfigurationProvider>();
            if (ConfigurationProvider == null)
                throw new ArgumentNullException(nameof(ConfigurationProvider));

            DbContext = Services.GetRequiredService<ModelReliefDbContext>();
            if (DbContext == null)
                throw new ArgumentNullException(nameof(DbContext));

            Logger = services.GetRequiredService<ILogger<DbInitializer>>();
            if (Logger == null)
                throw new ArgumentNullException(nameof(Logger));

            StorageManager = services.GetRequiredService<IStorageManager>();
            if (StorageManager == null)
                throw new ArgumentNullException(nameof(StorageManager));

            Accounts = services.GetRequiredService<IOptions<AccountsSettings>>().Value as AccountsSettings;

            var storeUsersPartialPath = ConfigurationProvider.GetSetting(Paths.StoreUsers);
            StoreUsersPath = StorageManager.GetAbsolutePath(storeUsersPartialPath);

            SqlitePath = Path.GetFullPath($"{StorageManager.GetAbsolutePath(ConfigurationProvider.GetSetting(Paths.StoreDatabase))}{ConfigurationSettings.SQLite}");

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
                    InitializeUserStore();
                    SeedDatabaseForTestUsersAsync().Wait();
                }
            }
        }

        /// <summary>
        /// Populate the database schema.
        /// </summary>
        public async Task InitializeDatabaseAsync()
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
                        { "ModelReliefBaseline.db",     "ModelReliefDevelopment.db" },
                    };
                    break;

                case RelationalDatabaseProvider.SQLServer:
                default:
                    databaseFolder = Environment.ExpandEnvironmentVariables("%USERPROFILE%");
                    fileList = new Dictionary<string, string>
                    {
                        { "ModelReliefBaseline.mdf",     "ModelReliefDevelopment.mdf" },
                        { "ModelReliefBaseline_log.ldf", "ModelReliefDevelopment_log.ldf" },
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
        private async Task SeedDatabaseForTestUsersAsync()
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
            }

            CreateTestDatabase();
            await Task.CompletedTask;
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
            AddNormalMaps(user);
            AddMeshes(user);

            // user store
            SeedUserStore(user);

            Logger.LogInformation($"User {user.Name} database and sample data sets created.");
        }

        /// <summary>
        /// Copies the newlt-created database to create the test database.
        /// </summary>
        private void CreateTestDatabase()
        {
            if (string.Equals(HostingEnvironment.EnvironmentName, "Development", StringComparison.CurrentCultureIgnoreCase))
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
        /// Returns the unique user Id for an account.
        /// </summary>
        private ApplicationUser ConstructUserFromAccount(Account account)
        {
            var user = new ApplicationUser(account.NameIdentifier, account.Name);

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
                new Project { Name = ProjectNames.Architecture, Description = "Architectural structures, woodwork, panels and details", UserId = user.Id },
                new Project { Name = ProjectNames.Jewelry, Description = "Jewelry watch faces, bracelets and pendants", UserId = user.Id },
                new Project { Name = ProjectNames.ModelRelief, Description = "Development and Test", UserId = user.Id },
                new Project { Name = ProjectNames.Stanford, Description = "Stanford model repository", UserId = user.Id },
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
            var cameraList = ImportEntityJSON<Camera>("Paths:ResourceFolders:Camera");
            foreach (var camera in cameraList)
            {
                camera.Id = 0;
                camera.UserId = user.Id;

                camera.Project = FindByName<Project>(user, camera.Project?.Name);
                camera.ProjectId = camera.Project.Id;
            }

            foreach (Camera camera in cameraList)
            {
                DbContext.Cameras.Add(camera);
            }
            DbContext.SaveChanges();

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
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"), Camera = FindByName<Camera>(user, "Isometric Camera"),
                },
                new Model3d
                {
                    Name = "buddha.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "bunny.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "dolphin.obj", Description = "Ocean dolphin", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "dragon.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "house.obj", Description = "San Francisco house", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Architecture), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "lucy.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "roadster.obj", Description = "Duesen Bayern Mystar 190 SL", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "statue.obj", Description = "Stanford model repository", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "test.obj", Description = "Reference test model", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.ModelRelief), Camera = FindByName<Camera>(user, "Top Camera"),
                },
                new Model3d
                {
                    Name = "tyrannosaurus.obj", Description = "Stanford test model", Format = Model3dFormat.OBJ,
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"), Camera = FindByName<Camera>(user, "Isometric Camera"),
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
            var meshTransformList = ImportEntityJSON<MeshTransform>("Paths:ResourceFolders:MeshTransform");
            foreach (var meshtransform in meshTransformList)
            {
                meshtransform.Id = 0;
                meshtransform.UserId = user.Id;

                meshtransform.Project = FindByName<Project>(user, meshtransform.Project?.Name);
                meshtransform.ProjectId = meshtransform.Project.Id;
            }

            foreach (MeshTransform meshTransform in meshTransformList)
            {
                DbContext.MeshTransforms.Add(meshTransform);
            }
            DbContext.SaveChanges();

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
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"),
                },
                new DepthBuffer
                {
                    Name = "buddha.sdb", Description = "Generated in Rhino",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "buddha.obj"), Camera = FindByName<Camera>(user, "Buddha"),
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"),
                },
                new DepthBuffer
                {
                    Name = "bunny.sdb", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "bunny.obj"), Camera = FindByName<Camera>(user, "Bunny"),
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"),
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
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"),
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
                    Name = "lucy.sdb", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "lucy.obj"), Camera = FindByName<Camera>(user, "Lucy"),
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"),
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
                    Name = "statue.sdb", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = DepthBufferFormat.SDB,
                    Model3d = FindByName<Model3d>(user, "statue.obj"), Camera = FindByName<Camera>(user, "Statue"),
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"),
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
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"),
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
                    Name = "house.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "house.sdb"), NormalMap = FindByName<NormalMap>(user, "house.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "House"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Architecture),
                },
                new Mesh
                {
                    Name = "lucy.sfp", Description = "Isometric", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Isometric Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "lucy.sdb"), NormalMap = FindByName<NormalMap>(user, "lucy.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "Lucy"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Stanford),
                },
                new Mesh
                {
                    Name = "roadster.sfp", Description = "Top", Format = MeshFormat.SFP, Camera = FindByName<Camera>(user, "Top Camera"),
                    DepthBuffer = FindByName<DepthBuffer>(user, "roadster.sdb"), NormalMap = FindByName<NormalMap>(user, "roadster.nmap"), MeshTransform =  FindByName<MeshTransform>(user, "Roadster"),
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

            foreach (Mesh mesh in meshes)
            {
                DbContext.Meshes.Add(mesh);
            }
            DbContext.SaveChanges();

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
                    Format = NormalMapFormat.NMAP,
                    Model3d = FindByName<Model3d>(user, "armadillo.obj"), Camera = FindByName<Camera>(user, "Armadillo"),
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"),
                },
                new NormalMap
                {
                    Name = "buddha.nmap", Description = "Generated in Rhino",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP,
                    Model3d = FindByName<Model3d>(user, "buddha.obj"), Camera = FindByName<Camera>(user, "Buddha"),
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"),
                },
                new NormalMap
                {
                    Name = "bunny.nmap", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP,
                    Model3d = FindByName<Model3d>(user, "bunny.obj"), Camera = FindByName<Camera>(user, "Bunny"),
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"),
                },
                new NormalMap
                {
                    Name = "dolphin.nmap", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP,
                    Model3d = FindByName<Model3d>(user, "dolphin.obj"), Camera = FindByName<Camera>(user, "Dolphin"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new NormalMap
                {
                    Name = "dragon.nmap", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP,
                    Model3d = FindByName<Model3d>(user, "dragon.obj"), Camera = FindByName<Camera>(user, "Dragon"),
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"),
                },
                new NormalMap
                {
                    Name = "house.nmap", Description = "Generated in VRay",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP,
                    Model3d = FindByName<Model3d>(user, "house.obj"), Camera = FindByName<Camera>(user, "House"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Architecture),
                },
                new NormalMap
                {
                    Name = "lucy.nmap", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP,
                    Model3d = FindByName<Model3d>(user, "lucy.obj"), Camera = FindByName<Camera>(user, "Lucy"),
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"),
                },
                new NormalMap
                {
                    Name = "roadster.nmap", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP,
                    Model3d = FindByName<Model3d>(user, "roadster.obj"), Camera = FindByName<Camera>(user, "Roadster"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.Jewelry),
                },
                new NormalMap
                {
                    Name = "statue.nmap", Description = "Generated in Maya",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP,
                    Model3d = FindByName<Model3d>(user, "statue.obj"), Camera = FindByName<Camera>(user, "Statue"),
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"),
                },
                new NormalMap
                {
                    Name = "test.nmap", Description = "Generated in ModelRelief",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP,
                    Model3d = FindByName<Model3d>(user, "test.obj"), Camera = FindByName<Camera>(user, "Test"),
                    UserId = user.Id, Project = FindByName<Project>(user, ProjectNames.ModelRelief),
                },
                new NormalMap
                {
                    Name = "tyrannosaurus.nmap", Description = "Generated in ModelRelief",
                    Width = 512, Height = 512,
                    Format = NormalMapFormat.NMAP,
                    Model3d = FindByName<Model3d>(user, "tyrannosaurus.obj"), Camera = FindByName<Camera>(user, "Tyrannosaurus"),
                    UserId = user.Id, Project = FindByName<Project>(user, "Stanford"),
                },
            };

            foreach (NormalMap normalMap in normalMaps)
            {
                DbContext.NormalMaps.Add(normalMap);
            }
            DbContext.SaveChanges();

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
        /// Update the seed data files from the user store for a particular model type.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="folderType">Type of folder</param>
        private bool UpdateSeedDataFilesFromStore<TEntity>(string folderType)
            where TEntity : DomainModel
        {
            // Test user provides the source of the data files
            var developmentUser = GetDevelopmentUser();

            // Source = D:\ModelRelief\ModelRelief\store\test\users\7ab4676b-563b-4c42-b6f9-27c11208f33f\depthbuffers
            var rootSourceFolderPath = Path.GetFullPath($"{StoreUsersPath}{developmentUser.Id}/{ConfigurationProvider.GetSetting(folderType)}");

            // Destination = D:\ModelRelief\ModelRelief\Test\Data\Users\depthbuffers
            var rootDestinationFolderPartialPath = $"{ConfigurationProvider.GetSetting(Paths.TestDataUsers)}/{ConfigurationProvider.GetSetting(folderType)}";
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

        #region UpdateSeedData
        /// <summary>
        /// Returns the Development user.
        /// </summary>
        /// <returns>Development user.</returns>
        private ApplicationUser GetDevelopmentUser()
        {
            ApplicationUser user = ConstructUserFromAccount(Accounts.Development);

            return user;
        }

        /// <summary>
        /// Returns the JSON definition file for the given entity type.
        /// </summary>
        /// <typeparam name="TEntity">Domain model</typeparam>
        /// <param name="folderType">Folder type.</param>
        /// <returns></returns>
        private string GetEntityJSONFileName<TEntity>(string folderType)
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
        /// Creates a JSON file containing all the objects of the given type.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="user">Application user.</param>
        /// <param name="folderType">Type of folder</param>
        private void ExportEntityJSON<TEntity>(ApplicationUser user, string folderType)
            where TEntity : DomainModel
        {
            // N.B. There is currently no way at the current time (EntityFramework Core 2.1) to include <all> referenced entities.
            //      The property Project is required so the Name can be used to find and assign the correct Project for each User.
            //      The Id alone is not sufficient because the exported JSON is always based on the Test user so the Ids would not match other users.
            //      Consequently, the query is specialized by entity type so the Include clause can be included.
            //          .Include(x => x.Project)
            //https://stackoverflow.com/questions/49593482/entity-framework-core-2-0-1-eager-loading-on-all-nested-related-entities

            IQueryable<TEntity> modelList = null;
            switch (typeof(TEntity).Name)
            {
                case "Camera":
                    modelList = (IQueryable<TEntity>)DbContext.Set<Camera>()
                                    .Where(c => c.UserId == user.Id)
                                    .Include(c => c.Project)
                                    .AsNoTracking();
                    break;

                case "MeshTransform":
                    modelList = (IQueryable<TEntity>)DbContext.Set<MeshTransform>()
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

            var jsonFile = GetEntityJSONFileName<TEntity>(folderType);
            Files.SerializeJSON(modelList, jsonFile);

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

            var expandedMeshList =  DbContext.Set<Mesh>()
                                        .Where(m => (m.UserId == developmentUser.Id))
                                        .Include(m => m.DepthBuffer)
                                            .ThenInclude(d => d.Camera)
                                        .Include(m => m.MeshTransform)
                                        .AsNoTracking();

            var destinationFolder = Path.GetFullPath($"{HostingEnvironment.ContentRootPath}/../Solver/Test");
            foreach (var mesh in expandedMeshList)
            {
                var modelName = Path.GetFileNameWithoutExtension(mesh.Name);
                var destinationFile = Path.GetFullPath($"{destinationFolder}/{modelName}.json");
                Logger.LogInformation($"Creating {destinationFile}");
                Files.SerializeJSON(mesh, destinationFile);
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
    }
    #endregion
}
