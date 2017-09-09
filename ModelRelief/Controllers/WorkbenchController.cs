// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using ModelRelief.ViewModels;
using System.IO;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ModelRelief.Controllers
    {
    public class WorkbenchController : Controller
        {
#region DepthBufferTest
        // GET: /<controller>/
        public IActionResult DepthBufferTest()
            {
            return View();
            }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("[controller]/[action]")]
        public IActionResult DepthBufferTest(DepthBufferTestViewModel viewModel)
            {
            if (!ModelState.IsValid)
                {
                // re-display with validation messages
                return View();
                }

            var imageUrl = viewModel.ImageUrl;
            SaveImage(imageUrl);

            return View();
            }

        public bool SaveImage(string imageUrl)
            {
            string imageData = imageUrl.Substring("data:image/png;base64,".Length);
            string imagePath = Path.Combine(@"D:\Users\Steve Knipmeyer\Documents\GitHub\ModelRelief\ModelRelief\wwwroot\temp", "DepthBuffer.png");

            byte[] imageBytes = Convert.FromBase64String(imageData);
            System.IO.File.WriteAllBytes(imagePath, imageBytes);

            return true;
            }
#endregion

#region InheritanceTest
        // GET: /<controller>/
        public IActionResult InheritanceTest()
            {
            return View();
            }
#endregion

#region CameraTest
        // GET: /<controller>/
        public IActionResult CameraTest()
            {
            return View();
            }
#endregion

        }
    }
