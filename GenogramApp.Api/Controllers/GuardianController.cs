using GenogramApp.Domain.Interfaces;
using GenogramApp.Domain.Models;
using Microsoft.AspNetCore.Mvc;
namespace GenogramApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuardianController : Controller
    {
        private readonly IGuardianService _guardianService;
        public GuardianController(IGuardianService guardianService)
        {
            _guardianService = guardianService;
        }
        [HttpPost("Guardian/{id:int?}")]
        public async Task<IActionResult> AddOrUpdateAsync(int? id, [FromBody] GuardianDto guardian)
        {
            if (guardian == null)
            {
                return BadRequest("Invalid guardian data.");  
            }
            try
            {
                var result = await _guardianService.AddOrUpdateGuardianAsync(id, guardian);
                if (result)
                {
                    return Ok(guardian); 
                }
                return BadRequest("Failed to add or update the guardian.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error occurred while adding or updating the guardian.");
            }
        }
        [HttpDelete("Delete/{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid ID.");  
            }
            try
            {
                var isDeleted = await _guardianService.DeleteAsync(id);
                if (!isDeleted)
                {
                    return NotFound("Guardian not found.");  
                }

                return Ok(new { message = "Guardian deleted successfully." }); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error occurred while deleting the guardian.");
            }
        }
    }
}
