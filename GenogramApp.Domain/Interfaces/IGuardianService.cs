using GenogramApp.Domain.Entities;
using GenogramApp.Domain.Models;

namespace GenogramApp.Domain.Interfaces
{
    public interface IGuardianService
    {
        Task<IEnumerable<GuardianDto>> GetGuardianDetailsAsync();
        Task<bool> AddOrUpdateGuardianAsync(int? id, GuardianDto guardian);
        Task<bool> Delete(int id);
    }
}
