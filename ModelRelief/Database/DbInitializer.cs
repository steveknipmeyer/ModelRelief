// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ModelRelief.Domain;
using ModelRelief.Services;
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
        private IServiceProvider                _services { get; set; }
        private IHostingEnvironment             _hostingEnvironment  { get; set; }
        private Services.IConfigurationProvider _configurationProvider  { get; set; }
        private ModelReliefDbContext            _dbContext  { get; set; }
        private UserManager<ApplicationUser>    _userManager  { get; set; }
        private string                          _storeUsers { get; set; }
        private ApplicationUser                 _user;
        
        public DbInitializer(IServiceProvider services)
        {
            if (null == services)
                throw new ArgumentNullException(nameof(services));
            _services = services;

            _hostingEnvironment = _services.GetRequiredService<IHostingEnvironment>();
            if (_hostingEnvironment == null)
                throw new ArgumentNullException(nameof(_hostingEnvironment));

            _configurationProvider = services.GetRequiredService<Services.IConfigurationProvider>();
            if (_configurationProvider == null)
                throw new ArgumentNullException(nameof(_configurationProvider));

            _dbContext = _services.GetRequiredService<ModelReliefDbContext>();
            if (_dbContext == null)
                throw new ArgumentNullException(nameof(_dbContext));

            _userManager = _services.GetRequiredService<UserManager<ApplicationUser>>();
            if (_userManager == null)
                throw new ArgumentNullException(nameof(_userManager));

            _storeUsers = _configurationProvider.GetSetting(ResourcePaths.StoreUsers);
        }

        /// <summary>
        /// Populate test database with sample data.
        /// </summary>
        public async void Populate()
        {

            // SQLite Error 1: 'table "AspNetRoles" already exists'.
            // https://github.com/aspnet/EntityFrameworkCore/issues/4649
            _dbContext.Database.EnsureCreated();

            // existing models?
            if (_dbContext.Models.Any())
                return;   // DB has been seeded

            await SeedDatabase();
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
        }

        /// <summary>
        /// Create the user store in the file system.
        /// Copy the test data files into the web user store.
        /// </summary>
        private void CreateUserStore()
        {
            CopyTestFiles<Domain.Model3d>("ResourcePaths:Folders:Model");
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

            var userName = _configurationProvider.GetSetting(userNameSetting);
            var password = _configurationProvider.GetSetting(passwordSetting);
            var id       = _configurationProvider.GetSetting(idSetting);

            var user = new ApplicationUser() { UserName = $"{userName}", Id = $"{id}"};
            var createResult = await _userManager.CreateAsync (user, $"{password}");
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
                _dbContext.Projects.Add(project);
            }
            _dbContext.SaveChanges();

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
                _dbContext.Cameras.Add(camera);
            }
            _dbContext.SaveChanges();

            QualifyDescription<Camera>(_user.UserName);
        }

        /// <summary>
        /// Add test models.
        /// </summary>
        private void AddModels()
        {
            var models = new Model3d[]
            {
                new Model3d{Name = "lucy", Description = "Stanford test model", Format = Model3dFormat.OBJ,
                            User = _user, Project = FindByName<Project>("ModelRelief"), Camera = FindByName<Camera>("Top Camera")},
                new Model3d{Name = "armadillo", Description = "Stanford test model", Format = Model3dFormat.OBJ,
                            User = _user, Project = FindByName<Project>("ModelRelief"), Camera = FindByName<Camera>("Isometric Camera")},
                new Model3d{Name = "bunny", Description = "Stanford test model", Format = Model3dFormat.OBJ,
                            User = _user, Project = FindByName<Project>("Architecture"), Camera = FindByName<Camera>("Top Camera")},
                new Model3d{Name = "dragon", Description = "Stanford test model", Format = Model3dFormat.OBJ,
                            User = _user, Project = FindByName<Project>("Jewelry"), Camera = FindByName<Camera>("Top Camera")},
                new Model3d{Name = "tyrannosaurus", Description = "Stanford test model", Format = Model3dFormat.OBJ,
                            User = _user, Project = FindByName<Project>("Jewelry"), Camera = FindByName<Camera>("Isometric Camera")},
            };

            foreach (Model3d model in models)
            {
                _dbContext.Models.Add(model);
            }
            _dbContext.SaveChanges();

            // model Ids are known now; set paths
            foreach (Model3d model in models)
                model.Path = $"{_storeUsers}{_user.Id}/models/{model.Id}/";

            _dbContext.SaveChanges();

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
                _dbContext.MeshTransforms.Add(meshTransform);
            }
            _dbContext.SaveChanges();

            QualifyDescription<MeshTransform>(_user.UserName);
        }

        /// <summary>
        /// Add test depth buffers.
        /// </summary>
        private void AddDepthBuffers()
        {
            var depthBuffers = new DepthBuffer[]
            {
                new DepthBuffer{Name = "Lucy", Description = "Generated in Maya", Camera = FindByName<Camera>("Top Camera"), Model = FindByName<Model3d>("lucy"),
                                User = _user, Project = FindByName<Project>("ModelRelief")},
                new DepthBuffer{Name = "Bunny", Description = "Generated in VRay", Camera = FindByName<Camera>("Isometric Camera"), Model = FindByName<Model3d>("bunny"),
                                User = _user, Project = FindByName<Project>("Architecture")},
                new DepthBuffer{Name = "Armadillo", Description = "Generated in Rhino",Camera = FindByName<Camera>("Isometric Camera"), Model = FindByName<Model3d>("armadillo"),
                                User = _user, Project = FindByName<Project>("Jewelry")},
            };

            foreach (DepthBuffer depthBuffer in depthBuffers)
            {
                _dbContext.DepthBuffers.Add(depthBuffer);
            }
            _dbContext.SaveChanges();

            QualifyDescription<DepthBuffer>(_user.UserName);
        }

        /// <summary>
        /// Add test meshes.
        /// </summary>
        private void AddMeshes()
        {
            var meshes = new Mesh[]
            {
                new Mesh{Name = "Lucy", Description = "Isometric", Camera = FindByName<Camera>("Isometric Camera"), DepthBuffer = FindByName<DepthBuffer>("Lucy"), MeshTransform =  FindByName<MeshTransform>("Identity"),
                         User = _user, Project = FindByName<Project>("ModelRelief")},
                new Mesh{Name = "Bunny", Description = "Top", Camera = FindByName<Camera>("Top Camera"), DepthBuffer = FindByName<DepthBuffer>("Bunny"), MeshTransform =  FindByName<MeshTransform>("Identity"),
                         User = _user, Project = FindByName<Project>("Architecture")},
                new Mesh{Name = "Armadillo", Description = "Top", Camera = FindByName<Camera>("Top Camera"), DepthBuffer = FindByName<DepthBuffer>("Armadillo"), MeshTransform = FindByName<MeshTransform>("Pendant"),
                         User = _user, Project = FindByName<Project>("Architecture")},
            };

            foreach (Mesh mesh in meshes)
            {
                _dbContext.Meshes.Add(mesh);
            }
            _dbContext.SaveChanges();

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
            var sourceFolderPartialPath = $"{_configurationProvider.GetSetting(ResourcePaths.TestDataUsers)}/{_configurationProvider.GetSetting(folderType)}";
            var sourceFolderPath        = $"{_hostingEnvironment.ContentRootPath}{sourceFolderPartialPath}";

            var storeUsersPartialPath = _configurationProvider.GetSetting(ResourcePaths.StoreUsers);
            var destinationFolderPath   = $"{_hostingEnvironment.WebRootPath}{storeUsersPartialPath}{_user.Id}/{_configurationProvider.GetSetting(folderType)}";
            Directory.CreateDirectory(destinationFolderPath);

            // iterate over all folders
            var rootSourceDirectory = new System.IO.DirectoryInfo(sourceFolderPath);
            System.IO.DirectoryInfo[] subDirs = rootSourceDirectory.GetDirectories();
            foreach (System.IO.DirectoryInfo dirInfo in subDirs)
            {
                // parent directory name = database resource ID
                var model = _dbContext.Set<TEntity>()
                    .Where(m => (m.Name == dirInfo.Name))
                    .Where(m => (m.UserId == _user.Id))
                    .First();

                if (model == null)
                    Debug.Assert (false, $"DbInitializer: Model name ${dirInfo.Name} not found in database for type ${typeof(TEntity).Name}.");

                // create target folder
                var targetDirectory = Directory.CreateDirectory(Path.Combine(destinationFolderPath, model.Id.ToString())).FullName;

                System.IO.FileInfo[] files = dirInfo.GetFiles("*.*");
                foreach (var file in files)
                {
                    var destinationFileName = Path.Combine (targetDirectory, file.Name);
                    Console.WriteLine(destinationFileName);
                    File.Copy(file.FullName, destinationFileName);
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
            var resource = _dbContext.Set<TEntity>()
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
            var models = _dbContext.Set<TEntity>()
                            .Where(m => (m.User.Id == _user.Id));

            foreach (var model in models)
                {
                model.Description += $" ({descriptionSuffix})";
                }
            _dbContext.SaveChanges();
        }
    }
}
