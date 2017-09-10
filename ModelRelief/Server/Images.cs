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

namespace ModelRelief.Server
{
    public class Images
    {
        public Stream SetImage(Stream file, int? qualityRate, int? compressRate)
        {
            // https://github.com/SixLabors/ImageSharp/issues/163
            var fileStream = new MemoryStream();
#if false
            var client = new ImageSharp.Image(file);
            {
                var pngEncoderOptions = new PngEncoderOptions()
                {
                    //Quantizer = new WuQuantizer<Color>(),
                    IgnoreMetadata = true
                };

                if (qualityRate != null)
                    pngEncoderOptions.Quality = (int)qualityRate;

                if  (compressRate != null)
                    pngEncoderOptions.CompressionLevel = (compressRate);

                client.SaveAsPng(fileStream, pngEncoderOptions);
            }
#endif            
            return fileStream;
        }
    }
}    
    