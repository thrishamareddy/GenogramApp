using GenogramApp.Domain.Entities;
using GenogramApp.Domain.Models;

namespace GenogramApp.Domain.Interfaces
{
    public interface IChildService
    {
        Task<bool> AddChildAsync(ChildDto childDto);
        Task<ChildDto> GetChildDetailsAsync(int id);
        Task<IEnumerable<Child>> GetAllChildrenAsync();
        Task<bool> UpdateAsync(ChildDto childDto);
        Task<bool> Delete(ChildDto childDto);
    }
}
