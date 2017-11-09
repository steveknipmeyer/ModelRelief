// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModelRelief.Database;
using ModelRelief.Domain;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Features.Meshes
{
    public class MeshesController : Controller
    {
        private readonly ModelReliefDbContext _context;

        public MeshesController(ModelReliefDbContext context)
        {
            _context = context;
        }

        // GET: Meshes
        public async Task<IActionResult> Index()
        {
            return View(await _context.Meshes.ToListAsync());
        }

        // GET: Meshes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mesh = await _context.Meshes
                .SingleOrDefaultAsync(m => m.Id == id);
            if (mesh == null)
            {
                return NotFound();
            }

            return View(mesh);
        }

        // GET: Meshes/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Meshes/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Name,Format,Path,Id,Description")] Mesh mesh)
        {
            if (ModelState.IsValid)
            {
                _context.Add(mesh);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(mesh);
        }

        // GET: Meshes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mesh = await _context.Meshes.SingleOrDefaultAsync(m => m.Id == id);
            if (mesh == null)
            {
                return NotFound();
            }
            return View(mesh);
        }

        // POST: Meshes/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Name,Format,Path,Id,Description")] Mesh mesh)
        {
            if (id != mesh.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(mesh);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MeshExists(mesh.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(mesh);
        }

        // GET: Meshes/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mesh = await _context.Meshes
                .SingleOrDefaultAsync(m => m.Id == id);
            if (mesh == null)
            {
                return NotFound();
            }

            return View(mesh);
        }

        // POST: Meshes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var mesh = await _context.Meshes.SingleOrDefaultAsync(m => m.Id == id);
            _context.Meshes.Remove(mesh);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MeshExists(int id)
        {
            return _context.Meshes.Any(e => e.Id == id);
        }
    }
}
