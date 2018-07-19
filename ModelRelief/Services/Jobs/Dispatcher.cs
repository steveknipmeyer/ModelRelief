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
    using Newtonsoft.Json;

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
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="storageManager">Services for file system storage.</param>
        public Dispatcher(
            ModelReliefDbContext dbContext,
            ILoggerFactory loggerFactory,
            IHostingEnvironment hostingEnvironment,
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
        public IHostingEnvironment HostingEnvironment { get; }
        public IConfigurationProvider ConfigurationProvider { get; }
        public IStorageManager StorageManager { get; }

        /// <summary>
        /// Returns the path of the Python interpreter.
        /// WIP: Create a virtual environment to host the python tools.
        /// </summary>
        private string GetPythonInterpreterPath()
        {
            var machineName = System.Environment.MachineName;
            switch (machineName)
            {
                default:
                case "Lambda":
                case "Vector":
                    return @"C:\Program Files (x86)\Microsoft Visual Studio\Shared\Anaconda3_64\python.exe";
            }
        }

        /// <summary>
        /// Returns the path of the Python solver application.
        /// WIP: Resolve the location of the solver using a relative path.
        /// </summary>
        private string GetSolverPath()
        {
            return @"..\Solver\solver.py";
        }

        /// <summary>
        /// Dispatches a process to create a DepthBuffer from its dependencies (e.g. Model3d, Camera).
        /// </summary>
        /// <param name="depthBuffer">DepthBuffer.</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// /// <returns>True if successful.</returns>
        public async Task<bool> GenerateDepthBufferAsync(Domain.DepthBuffer depthBuffer, CancellationToken cancellationToken = default)
        {
            Logger.LogError($"{nameof(GenerateDepthBufferAsync)} is not implemented.");
            await Task.CompletedTask;
            return false;
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
            Files.EnsureDirectoryExists(fileName);

            using (StreamWriter file = File.CreateText(fileName))
            {
                JsonSerializer serializer = new JsonSerializer()
                {
                    Formatting = Formatting.Indented,
                    MaxDepth = 2,
                };

                //serialize object directly into file stream
                serializer.Serialize(file, model);
            }
            return fileName;
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

            // expand mesh to include Camera
            var expandedMesh = await DbContext.Set<Mesh>()
                                .Where(m => (m.Id == mesh.Id) &&
                                            (m.UserId == mesh.UserId))
                                .Include(m => m.DepthBuffer)
                                    .ThenInclude(d => d.Camera)
                                .SingleOrDefaultAsync();

            string jsonFile = SerializeModelToWorkingStorage(expandedMesh);
            string jsonFileArgument = $"-s \"{jsonFile}\"";

            // WIP:  XPlatform: Review the handling of the command line arguments.
            // Add extra trailing \ to avoid ending folder path with \".
            // Otherwise, the workding folder will be parsed as having a trailing " in the solver command line arguments.
            string workingFolder = $"{StorageManager.WorkingStorageFolder(mesh.UserId)}\\";
            string workingFolderArgument = $"-w \"{workingFolder}\"";

            string solverPath = GetSolverPath();
            string arguments = $"{jsonFileArgument} {workingFolderArgument}";
            int solverExitCode = RunPythonTask(solverPath, arguments);
            if (solverExitCode != 0)
                return false;

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
        public int RunProcess(string taskName, string args, int timeOut = 10000)
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
            using (Process process = Process.Start(start))
            {
                if (!process.WaitForExit(timeOut))
                {
                    process.Kill();
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
                    Logger.LogError($"stderr = {stderr}");
                }
                return process.ExitCode;
            }
        }
    }
}
