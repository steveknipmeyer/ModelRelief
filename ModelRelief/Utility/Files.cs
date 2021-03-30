// -----------------------------------------------------------------------
// <copyright file="Files.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Utility
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Logging;
    using Newtonsoft.Json;

    public class Files
    {
        /// <summary>
        /// Reads a stream and returns an array of bytes.
        /// </summary>
        /// <param name="stream">Stream to read</param>
        /// <returns>Byte array</returns>
        public static async Task<byte[]> ReadToEnd(System.IO.Stream stream)
        {
            // https://stackoverflow.com/questions/1080442/how-to-convert-an-stream-into-a-byte-in-c
            long originalPosition = 0;

            if (stream.CanSeek)
            {
                originalPosition = stream.Position;
                stream.Position = 0;
            }

            try
            {
                byte[] readBuffer = new byte[4096];
                byte[] probeBuffer = new byte[1];

                int totalBytesRead = 0;
                int bytesRead;

                while ((bytesRead = await stream.ReadAsync(readBuffer, totalBytesRead, readBuffer.Length - totalBytesRead)) > 0)
                {
                    totalBytesRead += bytesRead;

                    if (totalBytesRead == readBuffer.Length)
                    {
                        // double read buffer every time if end of stream not reached
                        int nextByte = await stream.ReadAsync(probeBuffer, 0, 1);
                        if (nextByte != 0)
                        {
                            byte[] temp = new byte[readBuffer.Length * 2];
                            Buffer.BlockCopy(readBuffer, 0, temp, 0, readBuffer.Length);
                            Buffer.SetByte(temp, totalBytesRead, (byte)probeBuffer[0]);
                            readBuffer = temp;
                            totalBytesRead++;
                        }
                    }
                }

                // trim final buffer to actual size
                byte[] buffer = readBuffer;
                if (readBuffer.Length != totalBytesRead)
                {
                    buffer = new byte[totalBytesRead];
                    Buffer.BlockCopy(readBuffer, 0, buffer, 0, totalBytesRead);
                }
                return buffer;
            }
            finally
            {
                if (stream.CanSeek)
                {
                    stream.Position = originalPosition;
                }
            }
        }
        /// <summary>
        /// Writes a disk file from a stream.
        /// </summary>
        /// <param name="fileName">Filename (overwritten if exists)</param>
        /// <param name="stream">Stream to read</param>
        public static async Task WriteRawFileFromStream(string fileName, System.IO.Stream stream)
        {
            byte[] byteArray = await Files.ReadToEnd(stream);
            await WriteRawFileFromByteArray(fileName, byteArray);
        }

        /// <summary>
        /// Writes a raw file from a byte array.
        /// </summary>
        /// <param name="fileName">Filename (overwritten if exists)</param>
        /// <param name="byteArray">Byte array to write to file.</param>
        public static async Task WriteRawFileFromByteArray(string fileName, byte[] byteArray)
        {
            Directory.CreateDirectory(Path.GetDirectoryName(fileName));
            if (File.Exists(fileName))
                File.Delete(fileName);

            await System.IO.File.WriteAllBytesAsync(fileName, byteArray);
        }

        /// <summary>
        /// Copies a folder and all children.
        /// https://stackoverflow.com/questions/58744/copy-the-entire-contents-of-a-directory-in-c-sharp
        /// </summary>
        /// <param name="source">Source</param>
        /// <param name="target">Target</param>
        public static void CopyFilesRecursively(DirectoryInfo source, DirectoryInfo target)
        {
            foreach (DirectoryInfo dir in source.GetDirectories())
                CopyFilesRecursively(dir, target.CreateSubdirectory(dir.Name));

            foreach (FileInfo file in source.GetFiles())
                file.CopyTo(Path.Combine(target.FullName, file.Name));
        }

        /// <summary>
        /// Deletes a folder and all of the contents.
        /// </summary>
        /// <param name="path">Path to delete</param>
        /// <param name="recursive">true to remove directories, subdirectories, and files in path; otherwise, false</param>
        public static void DeleteFolder(string path, bool recursive)
        {
            if (!Directory.Exists(path))
                return;
            try
            {
                Directory.Delete(path, recursive);
            }
            catch (System.IO.IOException)
            {
                Console.WriteLine($"The directory {path} is not empty and the contents cannot be entirely deleted.");
            }
        }

        /// <summary>
        /// Returns whether a folder contains any files.
        /// https://stackoverflow.com/questions/755574/how-to-quickly-check-if-folder-is-empty-net
        /// </summary>
        /// <param name="path">Path of folder to check.</param>
        /// <returns>True if empty.</returns>
        public static bool IsFolderEmpty(string path)
        {
            return !Directory.EnumerateFileSystemEntries(path).Any();
        }

        /// <summary>
        /// Ensures the directory of the given file exists.
        /// The directory is created if necessary;
        /// </summary>
        /// <param name="fileName">Complete path of file.</param>
        public static void EnsureDirectoryExists(string fileName)
        {
            string directoryName = Path.GetDirectoryName(fileName);
            if (!Directory.Exists(directoryName))
                Directory.CreateDirectory(directoryName);
        }

        /// <summary>
        /// N.B. DateTime.Now yields 1 second accuracy so the resulting timestamps betweeen the initial and modified file events may be identical!
        /// A) This is needed during integration testing to ensure that a file that has been (POST) updated will trigger the DependencyManager to invalidate its dependents.
        ///    The FileTimeStamp property must change to trigger the processing. The delay ensures that it will be different than the previous value.
        ///
        /// B) This is also needed during integration testing to avoid an unnecessary GenerateFile when a file has been (POST) updated.
        ///     FileIsSynchronized = false  // initial condition
        ///     SleepForTimeStamp           // force next FileTimeStamp to be different
        ///     PostFile                    // updated file
        ///  As the FileTimeStamp is different in the second PostFile, an (unnecessary) GenerateFile will NOT be triggered.
        ///  The PostFile will set FileIsSynchronized, however the time stamp HAS changed so NO GenerateFileRequest will be created.
        /// </summary>
        public static void SleepForTimeStamp()
        {
            Thread.Sleep(1000);
        }

        /// <summary>
        /// Serialize an object into a JSON file.
        /// </summary>
        /// <param name="value">Object to serialize</param>
        /// <param name="fileName">Output file.</param>
        /// <param name="logger">ILogger.</param>
        /// <returns>True if successful</returns>
        public static bool SerializeJSON(object value, string fileName, ILogger logger)
        {
            Files.EnsureDirectoryExists(fileName);
            try
            {
                using (StreamWriter file = File.CreateText(fileName))
                {
                    JsonSerializer serializer = new JsonSerializer()
                    {
                        Formatting = Formatting.Indented,
                        MaxDepth = 2,
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                    };

                    //serialize object directly into file stream
                    serializer.Serialize(file, value);
                }
            }
            catch (Exception ex)
            {
                logger.LogError($"JSON serialization error: [{fileName}] {ex.Message}");
                return false;
            }

            return true;
        }
    }
}