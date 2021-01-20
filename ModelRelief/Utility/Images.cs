// -----------------------------------------------------------------------
// <copyright file="Images.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Utility
{
    using System;
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
        /// Analyze the properties of a single precision floating point image buffer.
        /// </summary>
        /// <param name="imageBuffer">Pixel buffer.</param>
        /// <param name="name">Friendly name.</param>
        public static void AnalyzeFloatImage(float[] imageBuffer, string name)
        {
            var minimum = imageBuffer.Min();
            var maximum = imageBuffer.Max();

            int dimensions = (int)Math.Sqrt(imageBuffer.Count());
            int middle = dimensions / 2;
            int centerOffset = (middle * dimensions) + middle;
            var center = imageBuffer[centerOffset];

            var lowerLeft  = imageBuffer[0];
            var upperRight = imageBuffer[imageBuffer.Count() - 1];

            var precision = "0.00000";
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine($"{name}");
            Console.WriteLine($"Lower Left  = {lowerLeft.ToString(precision)}");
            Console.WriteLine($"Upper Right = {upperRight.ToString(precision)}");
            Console.WriteLine($"Center  = {center.ToString(precision)}");
            Console.WriteLine($"Minimum = {minimum.ToString(precision)}");
            Console.WriteLine($"Maximum = {maximum.ToString(precision)}");
            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.White;
        }
        /// <summary>
        /// Convert HalfSingle array to single precision float.
        /// </summary>
        /// <param name="imageBuffer">Pixel buffer.</param>
        /// <param name="name">Friendly name.</param>
        public static void AnalyzeHalfSingleImage(HalfSingle[] imageBuffer, string name)
        {
            float[] floatBuffer = Array.ConvertAll(imageBuffer, element => element.ToSingle());
            AnalyzeFloatImage(floatBuffer, name);
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
            var minimum = floatArray.Min();
            var maximum = floatArray.Max();
            var range = maximum - minimum;
            var halfSingleArray = new HalfSingle[pixelCount];
            for (var iPixel = 0; iPixel < pixelCount; iPixel++)
            {
                //float scaledValue = (float)((Math.Pow(2, 16) - 1) * (1 - (floatArray[iPixel] / range)));
                float scaledValue = floatArray[iPixel];
                halfSingleArray[iPixel] = new HalfSingle(scaledValue);
            }

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
                var lowerLeft = image[0, 0];
            }
            return true;
        }
    }
}
