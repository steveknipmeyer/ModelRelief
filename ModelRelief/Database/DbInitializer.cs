using System;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;


using ModelRelief.Models;
using ModelRelief.Services;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace ModelRelief.Database
{
    public class DbInitializer
    {
        IServiceProvider                _services;
        IHostingEnvironment             _hostingEnvironment;
        Services.IConfigurationProvider _configurationProvider;
        ModelReliefDbContext            _context;
        UserManager<User>               _userManager;
        SignInManager<User>             _signInManager;

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

            _userManager = _services.GetRequiredService<UserManager<User>>();
            if (_userManager == null)
                throw new ArgumentNullException(nameof(_userManager));

            _signInManager = _services.GetRequiredService<SignInManager<User>>();
            if (_signInManager == null)
                throw new ArgumentNullException(nameof(_signInManager));
        }

        /// <summary>
        /// Populate test database with sample data.
        /// </summary>
        public async void Populate()
        {
            _context.Database.EnsureCreated();

            // existing models?
            if (_context.Models.Any())
                return;   // DB has been seeded
            
            await AddUsers();
            CopyTestFiles();

            AddProjects();
            AddModels();
            AddCameras();
            AddMeshTransforms();

            AddDepthBuffers();
            AddMeshes();
        }

        /// <summary>
        /// Add test users.
        /// </summary>
        private async Task<User> AddUsers()
        {
            var user = new User() { UserName = "test@modelrelief.com"};
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
            var user = _context.Users.FirstOrDefault<User>();

            var testdataPartialPath  = _configurationProvider.GetSetting("ResourcePaths:TestData");
            string testDataPath      = $"{_hostingEnvironment.ContentRootPath}{testdataPartialPath}";

            var storeUsersPartialPath  = _configurationProvider.GetSetting("ResourcePaths:StoreUsers");
            string storeUsersPath      = $"{_hostingEnvironment.WebRootPath}{storeUsersPartialPath}{user.Id}/";

            DirectoryInfo source = new DirectoryInfo(testDataPath);
            DirectoryInfo target = new DirectoryInfo(storeUsersPath);
            Utility.Files.CopyFilesRecursively(source, target);
        }

        /// <summary>
        /// Add test projects.
        /// </summary>
        private void AddProjects()
        {
        }

        /// <summary>
        /// Add test models.
        /// </summary>
        private void AddModels()
        {
            var user = _context.Users.FirstOrDefault<User>();
            var models = new Model3d[]
            {
                new Model3d{Id = 1, Name = "lucy,obj", Description = "Standford test model", Format = Model3dFormat.OBJ, Path = $"/store/users/{user.Id}/models/1/"},
            };
/*
	    Id	CameraId	Description	Format	Name	            Path	                                                    ProjectId	UserId
        1		        Stanford	1	    lucy.obj	        /store/users/7b4f6c4a-9113-4f7b-9ca2-9d1358ad5f20/models/1	1	        7b4f6c4a-9113-4f7b-9ca2-9d1358ad5f20
        2		        Stanford	1	    armadillo.obj	    /store/users/7b4f6c4a-9113-4f7b-9ca2-9d1358ad5f20/models/2	1	        7b4f6c4a-9113-4f7b-9ca2-9d1358ad5f20
        3		        Stanford	1	    bunny.obj	        /store/users/7b4f6c4a-9113-4f7b-9ca2-9d1358ad5f20/models/3	1	        7b4f6c4a-9113-4f7b-9ca2-9d1358ad5f20
        4		        Stanford	1	    dragon.obj	        /store/users/7b4f6c4a-9113-4f7b-9ca2-9d1358ad5f20/models/4	1	        7b4f6c4a-9113-4f7b-9ca2-9d1358ad5f20
        5		        Stanford	1	    tyrannosaurus.obj	/store/users/7b4f6c4a-9113-4f7b-9ca2-9d1358ad5f20/models/5	1	        7b4f6c4a-9113-4f7b-9ca2-9d1358ad5f20*/
            foreach (Model3d model in models)
            {
                _context.Models.Add(model);
            }
            _context.SaveChanges();
        }

        /// <summary>
        /// Add test cameras.
        /// </summary>
        private void AddCameras()
        {
        }

        /// <summary>
        /// Add mesh transforms.
        /// </summary>
        private void AddMeshTransforms()
        {
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
