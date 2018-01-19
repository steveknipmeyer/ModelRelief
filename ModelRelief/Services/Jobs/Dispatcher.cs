// -----------------------------------------------------------------------
// <copyright file="Dispatcher.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services.Jobs
{
    using System.Diagnostics;
    using System.IO;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Hosting;
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
        /// Dispatches a process to create a DepthBuffer from its dependencies (e.g. Model3d, Camera).
        /// </summary>
        /// <param name="depthBuffer">DepthBuffer.</param>
        /// <param name="fileName">FIle name of DepthBuffer.</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// /// <returns>True if successful.</returns>
        public async Task<bool> GenerateDepthBufferAsync(Domain.DepthBuffer depthBuffer, string fileName, CancellationToken cancellationToken = default)
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
        /// <param name="fileName">File name of DepthBuffer.</param>
        /// <param name="cancellationToken">Token to allows operation to be cancelled</param>
        /// /// <returns>True if successful.</returns>
        public async Task<bool> GenerateMeshAsync(Domain.Mesh mesh, string fileName, CancellationToken cancellationToken = default)
        {
            Logger.LogInformation($"{nameof(GenerateMeshAsync)} process queued.");

            // FileIsSynchronized is permitted to become true only when the file has been generated.
            mesh.FileIsSynchronized = false;
            await DbContext.SaveChangesAsync();

            string jsonFile = SerializeModelToWorkingStorage(mesh);
            string arguments = $"-s \"{jsonFile}\"";
            string pythonPath = @"D:\Users\Steve Knipmeyer\Documents\GitHub\ModelRelief\Solver\Solver.py";
            var result = RunPythonTask(pythonPath, arguments);

            // The job is complete and the file is synchronized.
            mesh.FileIsSynchronized = true;
            await DbContext.SaveChangesAsync();

            return true;
        }
        /// <summary>
        /// Synchronously run a Python task.
        /// https://medium.com/@dpursanov/running-python-script-from-c-and-working-with-the-results-843e68d230e5
        /// </summary>
        /// <param name="taskName">Python program name.</param>
        /// <param name="args">Argument.</param>
        /// <returns>StdOut from program execution.</returns>
        public string RunPythonTask(string taskName, string args)
        {
            ProcessStartInfo start = new ProcessStartInfo
            {
                FileName = @"C:\Program Files (x86)\Microsoft Visual Studio\Shared\Anaconda3_64\python.exe",
                Arguments = string.Format("\"{0}\" \"{1}\"", taskName, args),
                UseShellExecute = false,                                // Do not use OS shell.
                CreateNoWindow = true,                                  // no window
                RedirectStandardOutput = true,                          // Any output, generated by application will be redirected back.
                RedirectStandardError = true,                           // Any error in standard output will be redirected back (for example exceptions).
            };
            using (Process process = Process.Start(start))
            {
                using (StreamReader reader = process.StandardOutput)
                {
                    string stderr = process.StandardError.ReadToEnd();          // exceptions from our Python script
                    string result = reader.ReadToEnd();                         // result of StdOut (for example: print "test")
                    return result;
                }
            }
        }
    }
}
