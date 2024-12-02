using GenogramApp.Domain.Interfaces;
using GenogramApp.Infrastructure.Data;
namespace GenogramApp.Application.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        public IChildRepository Child { get; }
        public IGuardiansRepository Guardian { get; }
        private readonly ApplicationDbContext _db;
        public UnitOfWork(ApplicationDbContext db)
        {
            _db = db;
            Child = new ChildRepository(_db);
            Guardian = new GuardiansRepository(_db);
        }
        public async Task SaveAsync() 
        {
            await _db.SaveChangesAsync(); 
        }
    }
}
