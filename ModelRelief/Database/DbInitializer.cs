﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using ModelRelief.Domain;
using ModelRelief.Services;
using System;
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
        private ModelReliefDbContext            _context  { get; set; }
        private UserManager<ApplicationUser>               _userManager  { get; set; }
        private SignInManager<ApplicationUser>             _signInManager  { get; set; }

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

            _context = _services.GetRequiredService<ModelReliefDbContext>();
            if (_context == null)
                throw new ArgumentNullException(nameof(_context));

            _userManager = _services.GetRequiredService<UserManager<ApplicationUser>>();
            if (_userManager == null)
                throw new ArgumentNullException(nameof(_userManager));

            _signInManager = _services.GetRequiredService<SignInManager<ApplicationUser>>();
            if (_signInManager == null)
                throw new ArgumentNullException(nameof(_signInManager));
        }

        /// <summary>
        /// Populate test database with sample data.
        /// </summary>
        public async void Populate()
        {

            // SQLite Error 1: 'table "AspNetRoles" already exists'.
            // https://github.com/aspnet/EntityFrameworkCore/issues/4649
           _context.Database.EnsureCreated();

            // existing models?
            if (_context.Models.Any())
                return;   // DB has been seeded
            
            await AddUsers();
            CopyTestFiles();

            AddProjects();
            AddCameras();
            AddModels();
            AddMeshTransforms();

            AddDepthBuffers();
            AddMeshes();
        }

        /// <summary>
        /// Add test users.
        /// </summary>
        private async Task<ApplicationUser> AddUsers()
        {
            var user = new ApplicationUser() { UserName = "test@modelrelief.com"};
            var createResult = await _userManager.CreateAsync (user, "ModelRelief2020!");
            if (!createResult.Succeeded)
                throw new Exception(createResult.ToString());

            return user;
        }

        /// <summary>
        /// Copy the seed test files to the user store.
        /// </summary>
        private void CopyTestFiles()
        {
            var user   = _context.Users.FirstOrDefault<ApplicationUser>();

            var testdataPartialPath = _configurationProvider.GetSetting(ResourcePaths.TestDataUser);
            string testDataPath     = $"{_hostingEnvironment.ContentRootPath}{testdataPartialPath}";

            var storeUsersPartialPath = _configurationProvider.GetSetting(ResourcePaths.StoreUsers);
            string storeUsersPath     = $"{_hostingEnvironment.WebRootPath}{storeUsersPartialPath}{user.Id}/";

            DirectoryInfo source = new DirectoryInfo(testDataPath);
            DirectoryInfo target = new DirectoryInfo(storeUsersPath);
            Utility.Files.CopyFilesRecursively(source, target);
        }

        /// <summary>
        /// Add test projects.
        /// </summary>
        private void AddProjects()
        {
            var user = _context.Users.FirstOrDefault<ApplicationUser>();
            var projects = new Project[]
            {
                new Project{Id = 1, Name = "ModelRelief", Description = "Development and Test", User = user},
                new Project{Id = 2, Name = "Architecture", Description = "Architectural woodwork, panels and details", User = user},
                new Project{Id = 3, Name = "Jewelry", Description = "Jewelry watch faces, bracelets and pendants", User = user},
            };
            foreach (Project project in projects)
            {
                _context.Projects.Add(project);
            }
            _context.SaveChanges();
        }

        /// <summary>
        /// Add test cameras.
        /// </summary>
        private void AddCameras()
        {
            var user    = _context.Users.FirstOrDefault<ApplicationUser>();
            var project = _context.Projects.FirstOrDefault<Project>();

            var cameras = new Camera[]
            {
                new Camera{Id = 1, Name = "Top Camera", Description = "Aligned with negative Z", StandardView = StandardView.Top,
                           PositionX = 0.0, PositionY = 0.0, PositionZ = 100.0,
                           LookAtX   = 0.0, LookAtY = 0.0, LookAtZ = 0.0,
                           FieldOfView = 35.0,
                           Near = 0.0, Far = 1000.0,
                           BoundClippingPlanes = false,
                           User = user, Project = project}
            };

            foreach (Camera camera in cameras)
            {
                _context.Cameras.Add(camera);
            }
            _context.SaveChanges();
        }

        /// <summary>
        /// Add test models.
        /// </summary>
        private void AddModels()
        {
            var user    = _context.Users.FirstOrDefault<ApplicationUser>();
            var project = _context.Projects.FirstOrDefault<Project>();
            var camera = _context.Cameras.FirstOrDefault<Camera>();

            var models = new Model3d[]
            {
                new Model3d{Id = 1, Name = "lucy.obj", Description = "Stanford test model", Format = Model3dFormat.OBJ, Path = $"/store/users/{user.Id}/models/1/",
                            User = user, Project = project, Camera = camera},
                new Model3d{Id = 2, Name = "armadillo.obj", Description = "Stanford test model", Format = Model3dFormat.OBJ, Path = $"/store/users/{user.Id}/models/2/",
                            User = user, ProjectId = 1, Camera = camera},
                new Model3d{Id = 3, Name = "bunny.obj", Description = "Stanford test model", Format = Model3dFormat.OBJ, Path = $"/store/users/{user.Id}/models/3/",
                            User = user, ProjectId = 2, Camera = camera},
                new Model3d{Id = 4, Name = "dragon.obj", Description = "Stanford test model", Format = Model3dFormat.OBJ, Path = $"/store/users/{user.Id}/models/4/",
                            User = user, ProjectId = 2, Camera = camera},
                new Model3d{Id = 5, Name = "tyrannosaurus.obj", Description = "Stanford test model", Format = Model3dFormat.OBJ, Path = $"/store/users/{user.Id}/models/5/",
                            User = user, ProjectId = 3, Camera = camera},
            };

            foreach (Model3d model in models)
            {
                _context.Models.Add(model);
            }
            _context.SaveChanges();
        }

        /// <summary>
        /// Add mesh transforms.
        /// </summary>
        private void AddMeshTransforms()
        {
            var user    = _context.Users.FirstOrDefault<ApplicationUser>();
            var project = _context.Projects.FirstOrDefault<Project>();

            var meshTransforms = new MeshTransform[]
            {
                new MeshTransform{Id = 1, Name = "Identity", Description = "Default transform",
                            Depth = 1.0, Width = 100.0,
                            Tau = 1.0, SigmaGaussianBlur = 1.0, SigmaGaussianSmooth = 1.0, LambdaLinearScaling = 1.0,
                            User = user, Project = project}
            };

            foreach (MeshTransform meshTransform in meshTransforms)
            {
                _context.MeshTransforms.Add(meshTransform);
            }
            _context.SaveChanges();
        }

        /// <summary>
        /// Add test depth buffers.
        /// </summary>
        private void AddDepthBuffers()
        {
            // copy test data into user store?
        }

        /// <summary>
        /// Add test meshes.
        /// </summary>
        private void AddMeshes()
        {
            // copy test data into user store?
        }
    }
}
