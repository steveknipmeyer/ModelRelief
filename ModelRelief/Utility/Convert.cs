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
    public class Convert
    {
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