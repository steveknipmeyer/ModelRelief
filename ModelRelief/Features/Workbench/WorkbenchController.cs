// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Workbench;
using System;
using System.IO;

namespace ModelRelief.Features.Workbench
{
    public class WorkbenchController : Controller
        {
        F<int, int>             _fInteger;
        F<double, int>          _fDoubleInteger;
        IFunctionOne<int>       _iInt;
        IFunctionTwo<double>    _iDouble;

        public WorkbenchController(F<int, int> fInteger, F<double, int> fDoubleInteger, IFunctionOne<int> iInt, IFunctionTwo<double> iDouble)
        {
        _fInteger           = fInteger; 
        _fDoubleInteger     = fDoubleInteger;
        _iInt               = iInt;    
        _iDouble            = iDouble;
        }

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

#region Autofac Dependency Injection
        // GET: /<controller>/
        // Model bind to Interface via DI
        // https://github.com/aspnet/Mvc/issues/6014
        public string DI()
            {
            string resultF1 = _fInteger.F1(1, 1);
            string resultF2 = _fDoubleInteger.F2(1, 1);
            
            resultF1 = _iInt.F1(1, 1);
            resultF2 = _iDouble.F2(1.0, 1.0);

            return resultF1;
            }
#endregion
        }
    }
