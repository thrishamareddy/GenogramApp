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
            _guardianService=guardianService;
        }

        [HttpPost("Guardian/{id:int?}")]
        public async Task<IActionResult> AddGuardian(int? id, [FromBody] GuardianDto guardian)
        { 
                await _guardianService.AddOrUpdateGuardianAsync(id, guardian);
                return Ok(guardian);
        }
        [HttpDelete("Delete/{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var isDeleted = await _guardianService.Delete(id);
            if (!isDeleted)
            {
                return NotFound("Guardian not found."); 
            }
            return Ok(new { message = "Guardian deleted successfully." }); 
        }




    }
}
