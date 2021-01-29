// -----------------------------------------------------------------------
// <copyright file="WorkbenchController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Workbench
{
    using System;
    using System.IO;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.DependencyInjection;
    using ModelRelief.Services;
    using ModelRelief.Workbench;

    public class WorkbenchController : Controller
        {
        private IStorageManager StorageManager { get; set; }

        private F<int, int>             _fInteger;
        private F<double, int>          _fDoubleInteger;
        private IFunctionOne<int>       _iInt;
        private IFunctionTwo<double>    _iDouble;

        public F<int, int> FInteger { get => _fInteger; set => _fInteger = value; }
        public F<double, int> FDoubleInteger { get => _fDoubleInteger; set => _fDoubleInteger = value; }
        public IFunctionOne<int> IInt { get => _iInt; set => _iInt = value; }
        public IFunctionTwo<double> IDouble { get => _iDouble; set => _iDouble = value; }

        public WorkbenchController(IServiceProvider services, F<int, int> fInteger, F<double, int> fDoubleInteger, IFunctionOne<int> iInt, IFunctionTwo<double> iDouble)
        {
        StorageManager = services.GetRequiredService<IStorageManager>();
        if (StorageManager == null)
            throw new ArgumentNullException(nameof(StorageManager));

        _fInteger          = fInteger;
        _fDoubleInteger    = fDoubleInteger;
        IInt               = iInt;
        IDouble            = iDouble;
        }

#region ImageTest
        // GET: /<controller>/
        public IActionResult ImageTest()
            {
            return View();
            }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("[controller]/[action]")]
        public IActionResult ImageTest(ImageTestViewModel viewModel)
            {
            if (!ModelState.IsValid)
                {
                // re-display with validation messages
                return View();
                }

            var base64Image = viewModel.Base64Image;
            SaveImage(base64Image);

            return View();
            }
        public bool SaveImage(string base64Image)
            {
            string imagePath = Path.Combine(StorageManager.ContentRootPath, "wwwroot/images/base64Image.png");
            byte[] imageBytes = Convert.FromBase64String(base64Image);
            System.IO.File.WriteAllBytes(imagePath, imageBytes);

            return true;
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

            resultF1 = IInt.F1(1, 1);
            resultF2 = IDouble.F2(1.0, 1.0);

            return resultF1;
            }
#endregion
        }
    }
