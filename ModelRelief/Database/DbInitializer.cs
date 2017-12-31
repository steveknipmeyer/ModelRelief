﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ModelRelief.Domain;
using ModelRelief.Services;
using ModelRelief.Utility;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Database
{
    public class DbInitializer
    {
        private IServiceProvider                Services { get; set; }
        private IHostingEnvironment             HostingEnvironment  { get; set; }
        private Services.IConfigurationProvider ConfigurationProvider  { get; set; }
        private ModelReliefDbContext            DbContext  { get; set; }
        private UserManager<ApplicationUser>    UserManager  { get; set; }
        private ILogger<DbInitializer>          Logger  { get; set; }
        private IStorageManager                 StorageManager { get; set; }

        private ApplicationUser                 _user;
        private string                          _storeUsers { get; set; }
        
        public DbInitializer(IServiceProvider services)
        {
            if (null == services)
                throw new ArgumentNullException(nameof(services));
            Services = services;

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

            _storeUsers = ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers);

            Initialize();
        }

        /// <summary>
        /// Parses a boolean environment variable.
        /// </summary>
        /// <param name="variableName">Name of environment variable.</param>
        /// <returns></returns>
        private bool ParseBooleanEnvironmentVariable(string variableName)
        {
            var variableValue = ConfigurationProvider.GetSetting(variableName, throwIfNotFound: false);
            var result = false;
            Boolean.TryParse(variableValue, out result);
            return result;
        }

        /// <summary>
        /// Process the command line arguments and initialize.
        /// </summary>
        private void Initialize ()
        {
            if (ParseBooleanEnvironmentVariable("InitializeUserStore"))
                DeleteUserStore();

            if (ParseBooleanEnvironmentVariable("InitializeDatabase"))
                Populate().Wait();
        }

        /// <summary>
        /// Populate test database with sample data.
        /// </summary>
        public async Task Populate()
        {
            Logger.LogInformation("Preparing to initialize database.");
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
        /// Synchronizes the test database with the baseline copy.
        /// </summary>
        /// <param name="restore">Restore from baseline (versus create baseline).</param>
        public void SynchronizeTestDatabase(bool restore)
        {
            string databaseFolder;
            Dictionary<string, string> fileList;

            switch (ConfigurationProvider.Database)
            {
                case RelationalDatabaseProvider.SQLite:
                    databaseFolder = Path.Combine(HostingEnvironment.ContentRootPath, "Database");
                    fileList = new Dictionary<string, string>
                    {
                        {"ModelReliefBaseline.db",     "ModelReliefTest.db" }
                    };
                    break;

                case RelationalDatabaseProvider.SQLServer:
                default:
                    databaseFolder = Environment.ExpandEnvironmentVariables("%USERPROFILE%");
                    fileList = new Dictionary<string, string>
                    {
                        {"ModelReliefBaseline.mdf",     "ModelReliefTest.mdf" },
                        {"ModelReliefBaseline_log.ldf", "ModelReliefTest_log.ldf" }
                    };
                    break;
            }

            try
            {
                foreach (KeyValuePair<string, string> entry in fileList)
                {
                    var sourcePath = Path.Combine(databaseFolder, restore? entry.Key : entry.Value);
                    var targetPath = Path.Combine(databaseFolder, restore? entry.Value : entry.Key);
                    File.Copy(sourcePath, targetPath, overwrite: true);
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
                "VectricAccount"
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

            if (String.Equals(HostingEnvironment.EnvironmentName, "Test", StringComparison.CurrentCultureIgnoreCase))
            {
                // create the baseline copy of the test
                DbContext.SaveChanges();
                switch (ConfigurationProvider.Database)
                {
                    case RelationalDatabaseProvider.SQLServer:
                        // WIP: The Test database cannot be copied to create the baseline due to a locking error.    
                        break;

                    default:
                    case RelationalDatabaseProvider.SQLite:
                        SynchronizeTestDatabase(restore: false);
                        break;
                }
            }            
        }

        /// <summary>
        /// Delete the user store.
        /// </summary>
        private void DeleteUserStore()
        {
            var storeUsersPartialPath = ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers);
            var storeUsersPath   = $"{HostingEnvironment.WebRootPath}{storeUsersPartialPath}";

            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"Delete the user store folder: {storeUsersPath} (Y/N)?");
            Console.ForegroundColor = ConsoleColor.White;
            var response = Console.ReadLine();
            if (!String.Equals(response, "Y"))
                return;

            Files.DeleteFolder(storeUsersPath, true);
            Logger.LogWarning($"User store ({storeUsersPath}) deleted.");
        }

        /// <summary>
        /// Create the user store in the file system.
        /// Copy the test data files into the web user store.
        /// </summary>
        private void CreateUserStore()
        {   
            CopyTestFiles<Domain.Model3d>("ResourcePaths:Folders:Model3d");
            CopyTestFiles<Domain.DepthBuffer>("ResourcePaths:Folders:DepthBuffer");
            CopyTestFiles<Domain.Mesh>("ResourcePaths:Folders:Mesh");
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

            var user = new ApplicationUser() { UserName = $"{userName}", Id = $"{id}"};
            var createResult = await UserManager.CreateAsync (user, $"{password}");
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
                new Project{Name = "ModelRelief", Description = "Development and Test", User = _user},
                new Project{Name = "Architecture", Description = "Architectural woodwork, panels and details", User = _user},
                new Project{Name = "Jewelry", Description = "Jewelry watch faces, bracelets and pendants", User = _user},
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
                new Camera{Name = "Top Camera", Description = "Aligned with negative Z", StandardView = StandardView.Top,
                           PositionX = 0.0, PositionY = 0.0, PositionZ = 100.0,
                           LookAtX   = 0.0, LookAtY = 0.0, LookAtZ = 0.0,
                           FieldOfView = 35.0,
                           Near = 0.0, Far = 1000.0,
                           BoundClippingPlanes = false,
                           User = _user, Project = FindByName<Project>("ModelRelief")},

                new Camera{Name = "Isometric Camera", Description = "Isometric", StandardView = StandardView.Isometric,
                           PositionX = 50.0, PositionY = 50.0, PositionZ = 50.0,
                           LookAtX   = 0.0, LookAtY = 0.0, LookAtZ = 0.0,
                           FieldOfView = 35.0,
                           Near = 0.0, Far = 1000.0,
                           BoundClippingPlanes = false,
                           User = _user, Project = FindByName<Project>("Architecture")}

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
                new Model3d{Name = "lucy.obj", Description = "Stanford test model", Format = Model3dFormat.OBJ,
                            User = _user, Project = FindByName<Project>("ModelRelief"), Camera = FindByName<Camera>("Top Camera")},
                new Model3d{Name = "armadillo.obj", Description = "Stanford test model", Format = Model3dFormat.OBJ,
                            User = _user, Project = FindByName<Project>("ModelRelief"), Camera = FindByName<Camera>("Isometric Camera")},
                new Model3d{Name = "bunny.obj", Description = "Stanford test model", Format = Model3dFormat.OBJ,
                            User = _user, Project = FindByName<Project>("Architecture"), Camera = FindByName<Camera>("Top Camera")},
                new Model3d{Name = "dragon.obj", Description = "Stanford test model", Format = Model3dFormat.OBJ,
                            User = _user, Project = FindByName<Project>("Jewelry"), Camera = FindByName<Camera>("Top Camera")},
                new Model3d{Name = "tyrannosaurus.obj", Description = "Stanford test model", Format = Model3dFormat.OBJ,
                            User = _user, Project = FindByName<Project>("Jewelry"), Camera = FindByName<Camera>("Isometric Camera")},
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
                new MeshTransform{Name = "Identity", Description = "Default transform",
                            Depth = 1.0, Width = 100.0,
                            Tau = 1.0, SigmaGaussianBlur = 1.0, SigmaGaussianSmooth = 1.0, LambdaLinearScaling = 1.0,
                            User = _user, Project = FindByName<Project>("ModelRelief")},

                new MeshTransform{Name = "Pendant", Description = "Pendant transform",
                            Depth = 0.5, Width = 10.0,
                            Tau = 0.75, SigmaGaussianBlur = 0.5, SigmaGaussianSmooth = 0.25, LambdaLinearScaling = 1.0,
                            User = _user, Project = FindByName<Project>("Architecture")}
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
                new DepthBuffer{Name = "lucy.raw", Description = "Generated in Maya", Format = DepthBufferFormat.Raw, Camera = FindByName<Camera>("Top Camera"), Model = FindByName<Model3d>("lucy.obj"),
                                User = _user, Project = FindByName<Project>("ModelRelief")},
                new DepthBuffer{Name = "bunny.raw", Description = "Generated in VRay", Format = DepthBufferFormat.Raw, Camera = FindByName<Camera>("Isometric Camera"), Model = FindByName<Model3d>("bunny.obj"),
                                User = _user, Project = FindByName<Project>("Architecture")},
                new DepthBuffer{Name = "armadillo.raw", Description = "Generated in Rhino",Format = DepthBufferFormat.Raw, Camera = FindByName<Camera>("Isometric Camera"), Model = FindByName<Model3d>("armadillo.obj"),
                                User = _user, Project = FindByName<Project>("Jewelry")},
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
                new Mesh{Name = "lucy.obj", Description = "Isometric", Format = MeshFormat.OBJ, Camera = FindByName<Camera>("Isometric Camera"), DepthBuffer = FindByName<DepthBuffer>("lucy.raw"), MeshTransform =  FindByName<MeshTransform>("Identity"),
                         User = _user, Project = FindByName<Project>("ModelRelief")},
                new Mesh{Name = "bunny.obj", Description = "Top", Format = MeshFormat.OBJ, Camera = FindByName<Camera>("Top Camera"), DepthBuffer = FindByName<DepthBuffer>("bunny.raw"), MeshTransform =  FindByName<MeshTransform>("Identity"),
                         User = _user, Project = FindByName<Project>("Architecture")},
                new Mesh{Name = "armadillo.obj", Description = "Top", Format = MeshFormat.OBJ, Camera = FindByName<Camera>("Top Camera"), DepthBuffer = FindByName<DepthBuffer>("armadillo.raw"), MeshTransform = FindByName<MeshTransform>("Pendant"),
                         User = _user, Project = FindByName<Project>("Architecture")},
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
            var sourceFolderPartialPath = $"{ConfigurationProvider.GetSetting(ResourcePaths.TestDataUsers)}/{ConfigurationProvider.GetSetting(folderType)}";
            var sourceFolderPath        = $"{HostingEnvironment.ContentRootPath}{sourceFolderPartialPath}";

            var storeUsersPartialPath = ConfigurationProvider.GetSetting(ResourcePaths.StoreUsers);
            var destinationFolderPath   = $"{HostingEnvironment.WebRootPath}{storeUsersPartialPath}{_user.Id}/{ConfigurationProvider.GetSetting(folderType)}";
            Directory.CreateDirectory(destinationFolderPath);

            // iterate over all folders
            var rootSourceDirectory = new System.IO.DirectoryInfo(sourceFolderPath);
            System.IO.DirectoryInfo[] subDirs = rootSourceDirectory.GetDirectories();
            foreach (System.IO.DirectoryInfo dirInfo in subDirs)
            {
                // parent directory name = database resource ID
                var model = DbContext.Set<TEntity>()
                    .Where(m => (m.Name.StartsWith(dirInfo.Name)))
                    .Where(m => (m.UserId == _user.Id))
                    .FirstOrDefault();

                if (model == null)
                    Debug.Assert (false, $"DbInitializer: Model name ${dirInfo.Name} not found in database for type ${typeof(TEntity).Name}.");

                // create target folder
                var targetDirectory = Directory.CreateDirectory(Path.Combine(destinationFolderPath, model.Id.ToString())).FullName;

                System.IO.FileInfo[] files = dirInfo.GetFiles("*.*");
                foreach (var file in files)
                {
                    var destinationFileName = Path.Combine (targetDirectory, file.Name);
                    Console.WriteLine(destinationFileName);
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
        private TEntity FindByName<TEntity> (string name)
            where TEntity : DomainModel
        {
            var resource = DbContext.Set<TEntity>()
                .Where(r => ((r.Name == name) && (r.UserId == _user.Id))).First();

            if (resource == null)
                Debug.Assert (false, $"DbInitializer: {typeof(TEntity).Name} = '{name}' not found)");

            return resource;
        }
        
        /// <summary>
        /// Adds a qualifying suffix to the end of the Description property.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="descriptionSuffix">Suffix to end.</param>
        private void QualifyDescription <TEntity> (string descriptionSuffix)
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
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="models"></param>
        private void SetFileProperties<TEntity>(IEnumerable<TEntity> models)
            where TEntity : FileDomainModel
        {
           // model Ids are known now; set paths, etc.
            foreach (TEntity model in models)
                {
                model.FileTimeStamp = DateTime.Now;
                model.Path = StorageManager.DefaultModelStorageFolder(model);

                var generatedModel = model as GeneratedFileDomainModel;
                if (generatedModel != null)
                    generatedModel.FileIsSynchronized = true;
                }

            DbContext.SaveChanges();
        }
    }
}
