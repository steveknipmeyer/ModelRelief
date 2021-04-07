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
    using ModelRelief.Database.Seed;
    using ModelRelief.Domain;
    using ModelRelief.Services;
    using ModelRelief.Settings;
    using ModelRelief.Utility;
    using Newtonsoft.Json;

    public class DbFactory : IDbFactory
    {
        public string SqlitePath { get; set; }

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
            public static readonly string SMK = "National Gallery of Denmark";
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
            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(_hostingEnvironment));

            _configurationProvider = configurationProvider ?? throw new ArgumentNullException(nameof(_configurationProvider));

            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(_dbContext));

            _ = loggerFactory ?? throw new System.ArgumentNullException(nameof(_logger));
            _logger = loggerFactory.CreateLogger(typeof(DbFactory).Name);

            _mapper = mapper ?? throw new ArgumentNullException(nameof(_mapper));

            _storageManager = storageManager ?? throw new ArgumentNullException(nameof(_storageManager));

            _accounts = accountSettings.Value as AccountsSettings ?? throw new ArgumentNullException(nameof(_accounts));

            _modelReferenceValidator = modelReferenceValidator ?? throw new ArgumentNullException(nameof(_modelReferenceValidator));

            var storeUsersPartialPath = _configurationProvider.GetSetting(Paths.StoreUsers);
            _storeUsersPath = _storageManager.GetAbsolutePath(storeUsersPartialPath);

            SqlitePath = Path.GetFullPath($"{_storageManager.GetAbsolutePath(_configurationProvider.GetSetting(Paths.StoreDatabase))}{ConfigurationSettings.SQLite}");
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
        /// Delete the user store.
        /// </summary>
        public void InitializeUserStore()
        {
#if false
            var exitAfterInitialization = ConfigurationProvider.ParseBooleanSetting(ConfigurationSettings.MRExitAferInitialization);
            if (!exitAfterInitialization)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Delete the user store folder: {StoreUsersPath} (Y/N)?");
                Console.ForegroundColor = ConsoleColor.White;
                var response = Console.ReadLine();
                if (!string.Equals(response.ToUpper(), "Y"))
                    return;
            }
#endif
            Files.DeleteFolder(_storeUsersPath, true);
            _logger.LogWarning($"User store ({_storeUsersPath}) deleted.");
        }

        /// <summary>
        /// Synchronizes the test database with the baseline copy.
        /// </summary>
        /// <param name="restore">Restore from baseline (versus create baseline).</param>
        public void SynchronizeTestDatabase(bool restore)
        {
            string databaseFolder;
            Dictionary<string, string> fileList;

            _logger.LogInformation($"SynchronizeDatabase {_configurationProvider.Database} : restore = {restore}");
            switch (_configurationProvider.Database)
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
                            _logger.LogInformation($"Database file copy : ({sourcePath} -> {targetPath})");
                            File.Copy(sourcePath, targetPath, overwrite: true);
                            fileCopied = true;
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError($"Retrying file copy after exception {ex.Message}");
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
        public async Task SeedDatabaseForTestUsersAsync()
        {
            var userAccounts = new List<Account>
            {
                _accounts.Development,
                _accounts.Sales,
                _accounts.Support,
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
        /// Seeds the database with test data for a new user.
        /// </summary>
        /// <param name="claimsPrincipal">Newly-logged in user.</param>
        public async Task SeedDatabaseForNewUserAsync(ClaimsPrincipal claimsPrincipal)
        {
            if ((claimsPrincipal == null) || (!claimsPrincipal.Identity.IsAuthenticated))
                return;

            ApplicationUser user = await IdentityUtility.FindApplicationUserAsync(claimsPrincipal);
            IQueryable<Model3d> results = _dbContext.Models.Where(m => (m.UserId == user.Id));

            // models exist; not brand new user
            if (results.Any())
                return;

            SeedDatabaseForUser(user);
        }

        /// <summary>
        /// Add supporting models for a new Model3d.
        /// </summary>
        /// <param name="user">Application user.</param>
        /// <param name="model">Model3d to add supporting related models.</param>
        /// <param name="fileIsSynchronized">Set FileIsSynchronized.</param>
        public Model3d AddModel3dRelated(ApplicationUser user, Model3d model, bool fileIsSynchronized)
        {
            model.CameraId = AddEntity<Camera>(user, model.ProjectId, model.Name, model.Description);

            var rootModelName = Path.GetFileNameWithoutExtension(model.Name);
            AddMeshRelated(user, model.ProjectId, model.Id, rootModelName, model.Description, fileIsSynchronized);

            return model;
        }

        /// <summary>
        /// Add supporting models for a new Mesh.
        /// </summary>
        /// <param name="user">Application user.</param>
        /// <param name="projectId">Project for new Mesh.</param>
        /// <param name="modelId">Parent Model3d for the Mesh.</param>
        /// <param name="rootName">Base name for Mesh and supporting models.</param>
        /// <param name="description">Description for Mesh and supporting models.</param>
        /// <param name="fileIsSynchronized">Set FileIsSynchronized.</param>
        public Mesh AddMeshRelated(ApplicationUser user, int? projectId, int? modelId, string rootName, string description, bool fileIsSynchronized)
        {
            // add related Mesh models
            var depthBuffer = AddDepthBuffer(user, projectId, modelId, rootName, description, fileIsSynchronized);
            var normalMap = AddNormalMap(user, projectId, depthBuffer.CameraId, modelId, rootName, description, fileIsSynchronized);
            var mesh = AddMesh(user, projectId, depthBuffer.Id, normalMap.Id, rootName, description, fileIsSynchronized);

            return mesh;
        }

        /// <summary>
        /// Returns the JSON definition file for the given entity type.
        /// </summary>
        /// <typeparam name="TEntity">Domain model</typeparam>
        /// <param name="folderType">Folder type.</param>
        public string GetEntityJSONFileName<TEntity>(string folderType)
        {
            var jsonFolderPartialPath = $"{_configurationProvider.GetSetting(Paths.TestDataUser)}/{_configurationProvider.GetSetting(folderType)}";
            var jsonFolder = $"{_hostingEnvironment.ContentRootPath}{jsonFolderPartialPath}";

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

            IQueryable<TEntity> models = _dbContext.Set<TEntity>()
                                                  .Where(m => (m.UserId == user.Id));
            await models.ForEachAsync(async (model) =>
            {
                modelValidationFailures = await _modelReferenceValidator.ValidateAsync<TEntity>(model, claimsPrincipal, throwIfError: false);
                validationFailures.AddRange(modelValidationFailures);
            });

            validationFailures.ForEach((failure) =>
            {
                _logger.LogError(failure.ErrorMessage);
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
            _logger.LogInformation($"{Environment.NewLine}Validation: {user.Name}");
            var validationFailures = new List<ValidationFailure>();
            var entityValidationFailures = new List<ValidationFailure>();

            var entityTypes = _dbContext.GetAllEntityTypes();
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
            AddSession(user);

            // user store
            SeedUserStore(user);

            _logger.LogInformation($"User {user.Name} database and sample data sets created.");
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
            if (string.Equals(_hostingEnvironment.EnvironmentName, "Development", StringComparison.CurrentCultureIgnoreCase))
            {
                // create the baseline copy of the test
                _dbContext.SaveChanges();
                switch (_configurationProvider.Database)
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
                UserId = user.Id,
                Name = SettingsNames.Session,
                Description = "Cross-project session settings",
                Project = FindByName<Project>(user, ProjectNames.Examples),
            };

            _dbContext.Add(session);
            _dbContext.SaveChanges();
        }

        /// <summary>
        /// Add user (project) settings.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void AddSettings(ApplicationUser user)
        {
            var settings = new Settings[]
            {
                new Settings
                {
                    UserId = user.Id,
                    Name = SettingsNames.Project,
                    Description = "User interface and project settings",
                },
            };

            foreach (var item in settings)
            {
                _dbContext.Add(item);
                _dbContext.SaveChanges();
            }
        }

        /// <summary>
        /// Add test projects.
        /// </summary>
        /// <param name="user">Owning user.</param>
        private void AddProjects(ApplicationUser user)
        {
            var rootContentFile = SeedContent.ContentFile;
            var contentFile = $"{_hostingEnvironment.ContentRootPath}{_configurationProvider.GetSetting(Paths.TestSeed)}/{rootContentFile}";
            contentFile = Path.GetFullPath(contentFile);

            var seedContent = JsonConvert.DeserializeObject<SeedContent>(System.IO.File.ReadAllText(contentFile));

            foreach (var seedProject in seedContent.Projects)
            {
                var project = new Project()
                {
                    UserId = user.Id,
                    Name = seedProject.Name,
                    Description = seedProject.Description,
                    Settings = FindByName<Settings>(user, SettingsNames.Project),
                };
                _dbContext.Add(project);
                _dbContext.SaveChanges();

                AddProjectModels(user, seedProject, project.Id);
            }
        }

        /// <summary>
        /// Add a default entity.
        /// </summary>
        /// <param name="user">Owning user.</param>
        /// <param name="projectId">Parent Project.</param>
        /// <param name="name">Name.</param>
        /// <param name="description">Description.</param>
        private int AddEntity<TEntity>(ApplicationUser user, int? projectId, string name = "", string description = "")
            where TEntity : DomainModel, IProjectModel, new()
        {
            var entity = new TEntity();

            entity.Name = name;
            entity.Description = description;
            entity.UserId = user.Id;
            entity.ProjectId = projectId;

            _dbContext.Add(entity);
            _dbContext.SaveChanges();

            return entity.Id;
        }

        /// <summary>
        ///  Initialize DepthBuffer and NormalMap cameras from exported JSON.
        /// </summary>
        /// <param name="user">ApplicationUser</param>
        private void InitializeCameras(ApplicationUser user)
        {
            _dbContext.DetachUnchangedTrackedEntities();
            var cameraList = ImportEntityJSON<Camera>("Paths:ResourceFolders:Camera");
            var depthBuffers = _dbContext.DepthBuffers
                                   .Where(db => (db.UserId == user.Id))
                                   .Include(db => db.Camera)
                                   .AsNoTracking()
                                   .ToList<DepthBuffer>();
            depthBuffers.ForEach(depthBuffer =>
                {
                    var defaultCamera = depthBuffer.Camera;
                    var rootDepthBufferName = Path.GetFileNameWithoutExtension(depthBuffer.Name);
                    var exportedCamera = cameraList.Where(c => (c.Name == $"{rootDepthBufferName}.MeshTransform")).SingleOrDefault();
                    if (exportedCamera == null)
                        Console.WriteLine("null");

                    exportedCamera.Id = defaultCamera.Id;
                    exportedCamera.UserId = user.Id;
                    exportedCamera.Project = null;
                    exportedCamera.ProjectId = defaultCamera.ProjectId;

                    _dbContext.Update(exportedCamera);
                    _dbContext.SaveChanges();
                });
        }

        /// <summary>
        ///  Initialize mesh transforms from exported JSON.
        /// </summary>
        /// <param name="user">ApplicationUser</param>
        private void InitializeMeshTransforms(ApplicationUser user)
        {
            _dbContext.DetachUnchangedTrackedEntities();
            var meshTransformList = ImportEntityJSON<MeshTransform>("Paths:ResourceFolders:MeshTransform");
            var meshes = _dbContext.Meshes
                                   .Where(db => (db.UserId == user.Id))
                                   .Include(db => db.MeshTransform)
                                   .AsNoTracking()
                                   .ToList<Mesh>();
            meshes.ForEach(mesh =>
                {
                    var defaultMeshTransform = mesh.MeshTransform;
                    var exportedMeshTransform = meshTransformList.Where(mt => mt.Name == Path.GetFileNameWithoutExtension(mesh.Name)).SingleOrDefault();
                    if (exportedMeshTransform == null)
                        Console.WriteLine("null");

                    exportedMeshTransform.Id = defaultMeshTransform.Id;
                    exportedMeshTransform.UserId = user.Id;
                    exportedMeshTransform.Project = null;
                    exportedMeshTransform.ProjectId = defaultMeshTransform.ProjectId;

                    _dbContext.Update(exportedMeshTransform);
                    _dbContext.SaveChanges();
                });
        }

        /// <summary>
        /// Add seed models for a project.
        /// </summary>
        /// <param name="user">Application user.</param>
        /// <param name="seedProject">Seed project.</param>
        /// <param name="projectId">Project Id</param>
        private void AddProjectModels(ApplicationUser user, SeedProject seedProject, int projectId)
        {
            seedProject.Models.ForEach(seedModel =>
                {
                    AddModel3d(user, projectId, seedModel.Name, seedModel.Description, fileIsSynchronized: true);
                });

            InitializeCameras(user);
            InitializeMeshTransforms(user);
        }

        /// <summary>
        /// Add a Model3d and the related models.
        /// </summary>
        /// <param name="user">Application user.</param>
        /// <param name="projectId">Project Id for new DepthBuffer.</param>
        /// <param name="modelName">Name of related Model3d.</param>
        /// <param name="modelDescription">Description of related Model3d.</param>
        /// <param name="fileIsSynchronized">Set FileIsSynchronized.</param>
        /// <returns></returns>
        private Model3d AddModel3d(ApplicationUser user, int projectId, string modelName, string modelDescription, bool fileIsSynchronized)
        {
            // Model3d Relationships
            // ------------------------
            // Mesh
            //     MeshTransform
            //     DepthBuffer
            //         Camera
            //         Model3d
            //             Camera
            //     NormalMap
            //         Camera
            //         Model3d
            //             Camera
            //     Camera

            var qualifiedModelName = $"{modelName}.obj";
            var model = new Model3d
            {
                UserId = user.Id,
                Name = qualifiedModelName,
                Description = modelDescription,

                Format = Model3dFormat.OBJ,
                ProjectId = projectId,
                // N.B. Camera created in AddModel3dRelated
            };

            _dbContext.Add(model);
            _dbContext.SaveChanges();
            SetFileProperties<Model3d>(model, fileIsSynchronized);

            AddModel3dRelated(user, model, fileIsSynchronized: true);

            return model;
        }

        /// <summary>
        /// Add a new DepthBuffer.
        /// </summary>
        /// <param name="user">Application user.</param>
        /// <param name="projectId">Project Id for new DepthBuffer.</param>
        /// <param name="modelId">Id of related Model3d.</param>
        /// <param name="modelName">Name of related Model3d.</param>
        /// <param name="modelDescription">Description of related Model3d.</param>
        /// <param name="fileIsSynchronized">Set FileIsSynchronized.</param>
        private DepthBuffer AddDepthBuffer(ApplicationUser user, int? projectId, int? modelId, string modelName, string modelDescription, bool fileIsSynchronized)
        {
            var depthBufferName = $"{modelName}.sdb";
            var depthBuffer = new DepthBuffer
            {
                UserId = user.Id,
                Name = depthBufferName,
                Description = modelDescription,

                Format = DepthBufferFormat.SDB,
                ProjectId = projectId,
                CameraId = AddEntity<Camera>(user, projectId, $"{modelName}.MeshTransform", modelDescription),
                Model3dId = modelId,
            };
            _dbContext.Add(depthBuffer);
            _dbContext.SaveChanges();
            SetFileProperties<DepthBuffer>(depthBuffer, fileIsSynchronized);

            var path = $"{_hostingEnvironment.ContentRootPath}/{depthBuffer.Path}{depthBuffer.Name}";
            Utility.Files.WriteRawFileFromByteArray(path, depthBuffer.CreateDefaultContent(depthBuffer.Width, depthBuffer.Height)).Wait();

            return depthBuffer;
        }

        /// <summary>
        /// Add a new NormalMap.
        /// </summary>
        /// <param name="user">Application user.</param>
        /// <param name="projectId">Project Id for new NormalMap.</param>
        /// <param name="cameraId">Id of camera.</param>
        /// <param name="modelId">Id of related Model3d.</param>
        /// <param name="modelName">Name of related Model3d.</param>
        /// <param name="modelDescription">Description of related Model3d.</param>
        /// <param name="fileIsSynchronized">Set FileIsSynchronized.</param>
        private NormalMap AddNormalMap(ApplicationUser user, int? projectId, int? cameraId, int? modelId, string modelName, string modelDescription, bool fileIsSynchronized)
        {
            var normalMap = new NormalMap
            {
                UserId = user.Id,
                Name = $"{modelName}.nmap",
                Description = modelDescription,
                Format = NormalMapFormat.NMAP,
                ProjectId = projectId,
                CameraId = cameraId,
                Model3dId = modelId,
            };
            _dbContext.Add(normalMap);
            _dbContext.SaveChanges();
            SetFileProperties<NormalMap>(normalMap, fileIsSynchronized);

            var path = $"{_hostingEnvironment.ContentRootPath}/{normalMap.Path}{normalMap.Name}";
            Utility.Files.WriteRawFileFromByteArray(path, normalMap.CreateDefaultContent(normalMap.Width, normalMap.Height)).Wait();

            return normalMap;
        }

        /// <summary>
        /// Add a new Mesh.
        /// </summary>
        /// <param name="user">Application user.</param>
        /// <param name="projectId">Project Id for new Mesh.</param>
        /// <param name="depthBufferId">Id of related DepthBuffer.</param>
        /// <param name="normalMapId">Id of related NormalMap.</param>
        /// <param name="modelName">Name of related Model3d.</param>
        /// <param name="modelDescription">Description of related Model3d.</param>
        /// <param name="fileIsSynchronized">Set FileIsSynchronized.</param>
        private Mesh AddMesh(ApplicationUser user, int? projectId, int depthBufferId, int normalMapId, string modelName, string modelDescription, bool fileIsSynchronized)
        {
            var meshName = $"{modelName}.sfp";
            var mesh = new Mesh
            {
                UserId = user.Id,
                Name = meshName,
                Description = modelDescription,
                Format = MeshFormat.SFP,
                ProjectId = projectId,
                MeshTransformId = AddEntity<MeshTransform>(user, projectId, modelName, modelDescription),
                DepthBufferId = depthBufferId,
                NormalMapId = normalMapId,
                CameraId = AddEntity<Camera>(user, projectId, meshName, modelDescription),
            };
            _dbContext.Add(mesh);
            _dbContext.SaveChanges();
            SetFileProperties<Mesh>(mesh, fileIsSynchronized);

            var path = $"{_hostingEnvironment.ContentRootPath}/{mesh.Path}{mesh.Name}";
            Utility.Files.WriteRawFileFromByteArray(path, mesh.CreateDefaultContent(Defaults.Resolution.Image, Defaults.Resolution.Image)).Wait();

            return mesh;
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
            var sourceFolderPartialPath = $"{_configurationProvider.GetSetting(Paths.TestDataUser)}/{_configurationProvider.GetSetting(folderType)}";
            var sourceFolderPath = $"{_hostingEnvironment.ContentRootPath}{sourceFolderPartialPath}";

            var destinationFolderPath = $"{_storeUsersPath}{user.Id}/{_configurationProvider.GetSetting(folderType)}";
            Directory.CreateDirectory(destinationFolderPath);

            // iterate over all folders
            var rootSourceDirectory = new System.IO.DirectoryInfo(sourceFolderPath);
            System.IO.DirectoryInfo[] subDirs = rootSourceDirectory.GetDirectories();
            foreach (System.IO.DirectoryInfo dirInfo in subDirs)
            {
                // parent directory name = database resource ID
                var model = _dbContext.Set<TEntity>()
                    .AsEnumerable()
                    .Where(m => m.Name.StartsWith(dirInfo.Name, true, null))
                    .Where(m => (m.UserId == user.Id))
                    .SingleOrDefault();

                if (model == null)
                {
                    var message = $"DbInitializer: File system folder '{dirInfo.Name}' not found in database for type {typeof(TEntity).Name}.";
                    Console.WriteLine(message);
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
            var resource = _dbContext.Set<TEntity>()
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
            var models = _dbContext.Set<TEntity>().Where(m => (m.UserId == user.Id));

            foreach (var model in models)
            {
                // strip existing suffix; user name in parentheses
                int index = model.Description.IndexOf("(");
                if (index > 0)
                    model.Description = model.Description.Substring(0, index - 1);

                model.Description += $" ({descriptionSuffix})";
            }
            _dbContext.SaveChanges();
        }

        /// <summary>
        /// Sets the file properties of the model.
        /// </summary>
        /// <typeparam name="TEntity">Domain model.</typeparam>
        /// <param name="model">Models to update.</param>
        /// <param name="fileIsSynchronized">Set FileIsSynchronized.</param>
        private void SetFileProperties<TEntity>(TEntity model, bool fileIsSynchronized)
            where TEntity : FileDomainModel
        {
            model.FileTimeStamp = DateTime.Now;
            model.Path = _storageManager.GetRelativePath(_storageManager.DefaultModelStorageFolder(model));

            if (fileIsSynchronized && model is GeneratedFileDomainModel generatedModel)
                generatedModel.FileIsSynchronized = true;

            _dbContext.SaveChanges();
        }
    }
}
