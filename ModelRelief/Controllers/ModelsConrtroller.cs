using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

using ModelRelief.Entitities;
using ModelRelief.Services;
using ModelRelief.ViewModels;

namespace ModelRelief.Controllers
    {
    [Authorize]
    public class ModelsController : Controller
        {
        IHostingEnvironment _hostingEnvironment;
        IModel3dLocator     _modelLocator;

        public ModelsController(IHostingEnvironment hostingEnvironment, IModel3dLocator modelLocator)
            {
            _hostingEnvironment = hostingEnvironment;
            _modelLocator       = modelLocator;
            }

        [AllowAnonymous]
        public IActionResult Index()
            {    
            IEnumerable<Model3d> models = _modelLocator.GetAll();
            return View(models);
            }

        [Route ("[controller]/[action]/{modelId}")]
        public IActionResult Viewer(int modelid)
            {           
            Model3d model = _modelLocator.Find(modelid);

            if (model == null)
                return Content(String.Format("Model not found: {0}", modelid));

            return View (model);
            }

        [HttpGet]
        public IActionResult Create()
            {           
            return View ();
            }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Model3dEditViewModel editModel)
            {           
            if (!ModelState.IsValid)
                {
                // re-display with validation messages 
                return View();
                }

            var model = new Model3d()
                {
                Name   = editModel.Name,
                Format = editModel.Format
                };

            model = _modelLocator.Add (model);
            _modelLocator.Commit();

            return RedirectToAction ("Viewer", new { Id = model.Id});           
            }

        [HttpGet]
        [Route ("[controller]/[action]/{modelId}")]
        public IActionResult Edit(int modelId)
            {           
            Model3d model = _modelLocator.Find(modelId);
            if (model == null)
                return Content(String.Format("Model not found: {0}", modelId));

            var editModel = new Model3dEditViewModel
                {
                Name   = model.Name,
                Format = model.Format
                };

            return View (editModel);
            }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route ("[controller]/[action]/{modelId}")]
        public IActionResult Edit(int modelId, Model3dEditViewModel editModel)
            {           
            if (!ModelState.IsValid)
                {
                // re-display with validation messages
                return View();
                }

            Model3d model = _modelLocator.Find(modelId);
            if (model == null)
                return Content(String.Format("Model not found: {0}", modelId));

            // copy properties
            model.Name   = editModel.Name;
            model.Format = editModel.Format;

            _modelLocator.Commit();

            return RedirectToAction ("Viewer", new { Id = model.Id});           
            }

        [Route("[controller]/[action]/{modelId}")]
        public void Save(int modelid)
            {
            Model3d model = _modelLocator.Find(modelid);

            if (model == null)
                return;

            var body = this.Request.Body;
            byte[] file = ReadToEnd(body);

            string fileName = $"{_hostingEnvironment.WebRootPath}{model.Path}{Path.GetFileNameWithoutExtension(model.Name)}.relief.obj";
            System.IO.File.Delete(fileName);
            System.IO.File.WriteAllBytes(fileName, file);
            }

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
        }        
    }
