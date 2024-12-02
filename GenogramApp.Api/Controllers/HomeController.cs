using GenogramApp.Domain.Interfaces;
using GenogramApp.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace GenogramApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IChildService _childService;
        public HomeController(IChildService childService)
        {
            _childService = childService;
        }
        [HttpGet("ChildDetails")]
        public async Task<IActionResult> GetAllChildDetails()
        {
            var child = await _childService.GetAllChildrenAsync();
            return Ok(child);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetChildDetails(int id)
        {
            var child = await _childService.GetChildDetailsAsync(id);
            if (child == null)
            {
                return NotFound(new { message = "Child not found." });
            }
            return Ok(child);
        }
        [HttpPost("CreateChild")]
        public async Task<ActionResult> CreateChild(ChildDto childDto)
        {
            await _childService.AddChildAsync(childDto);
            return Ok(new { message = "Child Created Successfully" });
        }

        [HttpPost("EditChild")]
        public async Task<ActionResult> EditChild(ChildDto child)
        {
            var isUpdated = await _childService.UpdateAsync(child);
            if (!isUpdated)
            {
                return NotFound(new { message = "Child not found." }); 
            }
            return Ok(child);
        }

    }
}
