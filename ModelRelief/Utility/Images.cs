// -----------------------------------------------------------------------
// <copyright file="Images.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Utility
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;

    using SixLabors.ImageSharp;
    using SixLabors.ImageSharp.Formats.Png;
    using SixLabors.ImageSharp.PixelFormats;
    using SixLabors.ImageSharp.Processing;

    public class Images
    {
        // single precision float
        private static readonly int BytesPerSinglePrecisionFloat = 4;

        /// <summary>
        /// Analyze the properties of an image buffer.
        /// </summary>
        /// <typeparam name="T">Pixel type.</typeparam>
        /// <param name="imageBuffer">Pixel buffer.</param>
        /// <param name="name">Friendly name.</param>
        public static void AnalyzeImage<T>(IList<T> imageBuffer, string name)
        {
            var minimum = imageBuffer.Min();
            var maximum = imageBuffer.Max();

            int centerOffset = imageBuffer.Count() / 2;
            var centerValue  = imageBuffer[centerOffset];

            Console.ForegroundColor = ConsoleColor.Magenta;
            Console.WriteLine($"{name}");
            Console.WriteLine($"Minimum = {minimum}");
            Console.WriteLine($"Maximum = {maximum}");
            Console.WriteLine($"Center = {centerValue}");
            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.White;
        }

        /// <summary>
        /// Writes a disk image file from a single precision floating point byte array.
        /// </summary>
        /// <param name="fileName">Filename (overwritten if exists)</param>
        /// <param name="byteArray">Byte array to write to file.</param>
        public static bool WriteImageFileFromByteArray(string fileName, byte[] byteArray)
        {
            var rootFileName = System.IO.Path.ChangeExtension(fileName, null);
            var imageFileName = $"{rootFileName}.png";

            Directory.CreateDirectory(Path.GetDirectoryName(imageFileName));
            if (File.Exists(imageFileName))
                File.Delete(imageFileName);

            // convert to float
            var pixelCount = byteArray.Length / BytesPerSinglePrecisionFloat;
            var floatArray = new float[pixelCount];

            Buffer.BlockCopy(byteArray, 0, floatArray, 0, byteArray.Count());

            // convert to 16-bit float
            var halfSingleArray = new HalfSingle[pixelCount];
            for (var iPixel = 0; iPixel < pixelCount; iPixel++)
                halfSingleArray[iPixel] = new HalfSingle(floatArray[iPixel]);

            AnalyzeImage(floatArray, "floatArray");
//          AnalyzeImage(halfSingleArray, "halfSingleArray");

            int dimensions = (int)Math.Sqrt(floatArray.Length);
            using (var image = Image.LoadPixelData<HalfSingle>(halfSingleArray, dimensions, dimensions))
            {
                image.Mutate(x => x.Flip(FlipMode.Vertical));

                using (var fileStream = new FileStream(imageFileName, FileMode.Create))
                {
                    image.SaveAsPng(fileStream, new PngEncoder()
                    {
                    BitDepth = PngBitDepth.Bit16,
                    ColorType = PngColorType.Grayscale,
                    });
                }
            }
            return true;
        }
    }
}
