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
        // GET: /<controller>/
        public IActionResult DepthBuffer()
            {
            return View();
            }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("[controller]/[action]")]
        public IActionResult DepthBuffer(DepthBufferViewModel viewModel)
            {
            if (!ModelState.IsValid)
                {
                // re-display with validation messages
                return View();
                }

            var debugValue = viewModel.DebugValue;
#if false
            var imageUrl = "";
            SaveImage(imageUrl);
#endif      
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
        }
    }
