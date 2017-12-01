// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ModelRelief.Utility
{
    public class Files 
    {
        /// <summary>
        /// Reads a stream and returns an array of bytes.
        /// </summary>
        /// <param name="stream">Stream to read</param>
        /// <returns>Byte array</returns>
        public static byte[] ReadToEnd(System.IO.Stream stream)
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

                int totalBytesRead = 0;
                int bytesRead;

                while ((bytesRead = stream.Read(readBuffer, totalBytesRead, readBuffer.Length - totalBytesRead)) > 0)
                {
                    totalBytesRead += bytesRead;

                    if (totalBytesRead == readBuffer.Length)
                    {
                        int nextByte = stream.ReadByte();
                        if (nextByte != -1)
                        {
                            byte[] temp = new byte[readBuffer.Length * 2];
                            Buffer.BlockCopy(readBuffer, 0, temp, 0, readBuffer.Length);
                            Buffer.SetByte(temp, totalBytesRead, (byte)nextByte);
                            readBuffer = temp;
                            totalBytesRead++;
                        }
                    }
                }

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
        public static async Task WriteFileFromStream(string fileName, System.IO.Stream stream)
        {
            byte[] byteArray = Files.ReadToEnd(stream);
            await WriteFileFromByteArray(fileName, byteArray);
        }

        /// <summary>
        /// Writes a disk file from a byte array.
        /// </summary>
        /// <param name="fileName">Filename (overwritten if exists)</param>
        /// <param name="byteArray">Byte array to write to file.</param>
        public static async Task WriteFileFromByteArray(string fileName, byte[] byteArray)
        {
            if (System.IO.File.Exists(fileName))
                System.IO.File.Delete(fileName);

            Directory.CreateDirectory(Path.GetDirectoryName(fileName));
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

            Directory.Delete(path, recursive);
        }
    }        
}