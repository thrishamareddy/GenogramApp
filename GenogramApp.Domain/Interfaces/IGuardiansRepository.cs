using GenogramApp.Domain.Entities;

namespace GenogramApp.Domain.Interfaces
{
    public interface IGuardiansRepository:IRepository<Guardian>
    {
        Task UpdateAsync(Guardian obj);
    }
}
