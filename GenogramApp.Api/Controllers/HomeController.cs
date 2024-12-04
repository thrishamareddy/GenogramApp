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
        public async Task<IActionResult> GetChildDetailsAsync()
        {
            try
            {
                var children = await _childService.GetAllChildrenAsync();
                return Ok(children);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving child details." });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetChildAsync(int id)
        {
            try
            {
                var child = await _childService.GetChildDetailsAsync(id);
                if (child == null)
                {
                    return NotFound(new { message = "Child not found." });
                }
                return Ok(child);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving child details." });
            }
        }

        [HttpPost("CreateChild")]
        public async Task<ActionResult> CreateChildAsync(ChildDto childDto)
        {
            if (childDto == null)
            {
                return BadRequest(new { message = "Invalid child data." });
            }
            try
            {
                var isCreated = await _childService.AddChildAsync(childDto);
                if (!isCreated)
                {
                    return BadRequest(new { message = "Failed to create child." });
                }
                return Ok(new { message = "Child created successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating child." });
            }
        }
        [HttpPost("EditChild")]
        public async Task<ActionResult> EditChildAsync(ChildDto child)
        {
            if (child == null)
            {
                return BadRequest(new { message = "Invalid child data." });
            }
            try
            {
                var isUpdated = await _childService.UpdateAsync(child);
                if (!isUpdated)
                {
                    return NotFound(new { message = "Child not found." });
                }
                return Ok(child);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating child." });
            }
        }
        [HttpDelete("DeleteChild")]
        public async Task<IActionResult> Delete(ChildDto childDto)
        {
            try
            {
                var isDeleted =await _childService.Delete(childDto);
                if (isDeleted)
                {
                    return Ok(new { message = "Child Deleted successfully." });
                    
                }
                return NotFound(new { message = "Child not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting child." });
            }
        }
    }
}
