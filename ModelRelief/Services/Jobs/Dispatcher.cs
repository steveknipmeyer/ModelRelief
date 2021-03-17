// -----------------------------------------------------------------------
// <copyright file="Dispatcher.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services.Jobs
{
    using System;
    using System.Diagnostics;
    using System.IO;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Utility;

    /// <summary>
    /// Dispatch manager.
    /// Queues long-running processes that generate or modify files.
    /// </summary>
    public class Dispatcher : IDispatcher
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Dispatcher"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="storageManager">Services for file system storage.</param>
        public Dispatcher(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IWebHostEnvironment hostingEnvironment,
            IConfigurationProvider configurationProvider,
            IStorageManager storageManager)
        {
            DbContext             = dbContext;
            Logger                = loggerFactory.CreateLogger<Dispatcher>();
            HostingEnvironment    = hostingEnvironment;
            ConfigurationProvider = configurationProvider;
            StorageManager        = storageManager;
        }

        public ModelReliefDbContext DbContext { get; }
        public ILogger Logger { get; }
        public IWebHostEnvironment HostingEnvironment { get; }
        public IConfigurationProvider ConfigurationProvider { get; }
        public IStorageManager StorageManager { get; }

        /// <summary>
        /// Returns the path of the Python interpreter.
        /// </summary>
        private string GetPythonInterpreterPath()
        {
            var machineName = System.Environment.MachineName;
            switch (machineName)
            {
                default:
                    // N.B. The path to the python executable is found through the system PATH.
                    // Therefore, it is imperative that the path include the ModelRelief Python environment before any other python runtimes.
                    return @"python";
            }
        }

        /// <summary>
        /// Returns the path of the Python solver application.
        /// WIP: Resolve the location of the solver using a relative path.
        /// </summary>
        private string GetSolverPath()
        {
            var solverPath = Path.Combine(".", "Solver", "solver.py");
            // In a deployed Production, the Solver folder is at the same level as <ContentRootPath>. Otherwise, it is one level above at the Solution root.
            // Therefore, the Solver folder may be in one of two locations.
            if (File.Exists(solverPath))
                return solverPath;

            return Path.Combine("..", solverPath);
        }

        /// <summary>
        /// Writes a JSON file to working storage from the given model.
        /// </summary>
        /// <param name="model">Domain model to serialize.</param>
        /// <returns>Path of JSON file.</returns>
        private string SerializeModelToWorkingStorage(DomainModel model)
        {
            string workingStorageFolder = StorageManager.WorkingStorageFolder(model.UserId);
            string fileName = $"{workingStorageFolder}{model.GetType().Name}{model.Id.ToString()}.json";

            Files.SerializeJSON(model, fileName, Logger);

            return fileName;
        }

        /// <summary>
        /// Dispatches a process to create a DepthBuffer from its dependencies (e.g. Model3d, Camera).
        /// </summary>
        /// <param name="depthBuffer">DepthBuffer.</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// /// <returns>True if successful.</returns>
        public async Task<bool> GenerateDepthBufferAsync(Domain.DepthBuffer depthBuffer, CancellationToken cancellationToken = default)
        {
            // N.B. DepthBuffer does not implement FileGenerateRequest now because there is no means to generate a new DepthBuffer on the backend.
            // Later, there could be a case for generating DepthBuffers on the server to allow completely API-driven workflows.

            Logger.LogError($"{nameof(GenerateDepthBufferAsync)} is not implemented.");
            await Task.CompletedTask;
            return false;
        }

        /// <summary>
        /// Dispatches a process to create a NormalMap from its dependencies (e.g. Model3d, Camera).
        /// </summary>
        /// <param name="normalMap">NormalMap.</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// /// <returns>True if successful.</returns>
        public async Task<bool> GenerateNormalMapAsync(Domain.NormalMap normalMap, CancellationToken cancellationToken = default)
        {
            // N.B. NormalMap does not implement FileGenerateRequest now because there is no means to generate a new NormalMap on the backend.
            // Later, there could be a case for generating NormalMaps on the server to allow completely API-driven workflows.

            Logger.LogError($"{nameof(GenerateNormalMapAsync)} is not implemented.");
            await Task.CompletedTask;
            return false;
        }

        /// <summary>
        /// Dispatches a process to create a Mesh from its dependencies (e.g. DepthBuffer, MeshTransform).
        /// </summary>
        /// <param name="mesh">Mesh.</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// /// <returns>True if successful.</returns>
        public async Task<bool> GenerateMeshAsync(Domain.Mesh mesh, CancellationToken cancellationToken = default)
        {
            Logger.LogInformation($"{nameof(GenerateMeshAsync)} process queued.");

            // FileIsSynchronized is permitted to become true only when the file has been generated.
            mesh.FileIsSynchronized = false;
            await DbContext.SaveChangesAsync();

            var expandedMesh = await DbContext.Meshes
                                .Where(m => ((m.UserId == mesh.UserId) &&
                                             (m.Id == mesh.Id)))
                                .Include(m => m.DepthBuffer)
                                    .ThenInclude(d => d.Camera)
                                .SingleOrDefaultAsync();
            if (expandedMesh == null)
            {
                Logger.LogError($"GenerateMesh cannot query Mesh: Id = {mesh.Id}");
                return false;
            }

            string jsonFile = SerializeModelToWorkingStorage(expandedMesh);
            string jsonFileArgument = $"-s \"{jsonFile}\"";

            string workingFolder = $"{StorageManager.WorkingStorageFolder(mesh.UserId)}";
            string workingFolderArgument = $"-w \"{workingFolder}\"";

            string solverPath = GetSolverPath();
            string arguments = $"{jsonFileArgument} {workingFolderArgument}";
            int solverExitCode = RunPythonTask(solverPath, arguments);
            if (solverExitCode != 0)
            {
                Logger.LogError($"Solver returned error code {solverExitCode}");
                return false;
            }

            // The job is complete and the mesh file has been generated.
            var generatedFile = Path.Combine($"{workingFolder}{mesh.Name}");
            mesh.Format = MeshFormat.SFP;

            // var fileSynchronized = File.Exists(generatedFile) ? mesh.SynchronizeGeneratedFile(generatedFile, StorageManager.DefaultModelStorageFolder(mesh)) : false;
            var fileSynchronized = mesh.SynchronizeGeneratedFile(generatedFile, StorageManager.DefaultModelStorageFolder(mesh));
            if (fileSynchronized)
                await DbContext.SaveChangesAsync();

            return fileSynchronized;
        }

        /// <summary>
        /// Synchronously run a Python task.
        /// </summary>
        /// <param name="pythonTask">Python program name.</param>
        /// <param name="args">Python program arguments.</param>
        /// <returns>Process exit code.</returns>
        public int RunPythonTask(string pythonTask, string args)
        {
            var pythonInterpreter = GetPythonInterpreterPath();
            var arguments = string.Format("\"{0}\" {1}", pythonTask, args);

            return RunProcess(pythonInterpreter, arguments);
        }

        /// <summary>
        /// Synchronously run a process.
        /// https://medium.com/@dpursanov/running-python-script-from-c-and-working-with-the-results-843e68d230e5
        /// </summary>
        /// <param name="taskName">Program name.</param>
        /// <param name="args">Arguments.</param>
        /// <param name="timeOut">Millisecond timeout. Maximum process execution time.</param>
        /// <returns>Process exit code.</returns>
        public int RunProcess(string taskName, string args, int timeOut = 60000)
        {
            ProcessStartInfo start = new ProcessStartInfo
            {
                FileName = taskName,
                Arguments = args,
                UseShellExecute = false,                                // Do not use OS shell.
                CreateNoWindow = true,                                  // no window
                RedirectStandardOutput = true,                          // Any output, generated by application will be redirected back.
                RedirectStandardError = true,                           // Any error in standard output will be redirected back (for example exceptions).
            };
            try
            {
                using (Process process = Process.Start(start))
                {
                    if (!process.WaitForExit(timeOut))
                    {
                        process.Kill();
                        Logger.LogError($"Solver timed out after {timeOut / 1000.0} seconds.");
                        return -1;
                    }

                    Logger.LogInformation($"RunTask exited with {process.ExitCode}. Task arguments = {args}");
                    using (StreamReader reader = process.StandardOutput)
                    {
                        string stdout = reader.ReadToEnd();
                        Logger.LogInformation($"stdout = {Environment.NewLine}{stdout}");
                    }
                    using (StreamReader reader = process.StandardError)
                    {
                        string stderr = reader.ReadToEnd();
                        if (!string.IsNullOrWhiteSpace(stderr))
                            Logger.LogError($"stderr = {stderr}");
                    }
                    return process.ExitCode;
                }
            }
            catch (Exception ex)
            {
                Logger.LogError($"Unable to start process {taskName} {args}: {ex.Message}");
                return -1;
            }
        }
    }
}
