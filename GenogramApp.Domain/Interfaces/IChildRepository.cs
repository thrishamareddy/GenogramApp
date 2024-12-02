using GenogramApp.Domain.Entities;

namespace GenogramApp.Domain.Interfaces
{
    public interface IChildRepository:IRepository<Child>
    {
        void Update(Child obj);
    }
}
