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
        public static void WriteFileFromStream(string fileName, System.IO.Stream stream)
        {
            byte[] fileStream = Files.ReadToEnd(stream);

            System.IO.File.Delete(fileName);
            System.IO.File.WriteAllBytes(fileName, fileStream);
        }

        /// <summary>
        /// Returns a byte array from a stream.
        /// https://stackoverflow.com/questions/221925/creating-a-byte-array-from-a-stream
        /// </summary>
        /// <param name="input">Stream to read</param>
        /// <returns>Byte array</returns>
        public static byte[] StreamToByteArray(Stream input)
        {
            byte[] buffer = new byte[16*1024];
            using (MemoryStream memoryStream = new MemoryStream())
            {
                input.CopyTo(memoryStream);
                return memoryStream.ToArray();
            }
        }        

        /// <summary>
        /// Converts a byte array to an array of single precision floats.
        /// https://stackoverflow.com/questions/5056635/converting-raw-byte-data-to-float
        /// </summary>
        /// <param name="byteArray">Byte array to convert</param>
        /// <returns></returns>
        public static float[] ByteArrayToFloatArray(byte[] byteArray) 
        {
            float[] floatArray = new float[byteArray.Length / 4];
            for (int iFloat = 0; iFloat < floatArray.Length; iFloat++) 
            {
            #if false                    
                if (BitConverter.IsLittleEndian) {
                    Array.Reverse(byteArray, iFloat * 4, 4);
            #endif                    
            floatArray[iFloat] = BitConverter.ToSingle(byteArray, iFloat * 4);
            }
        return floatArray;
        }            
    }        
}