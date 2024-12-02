using GenogramApp.Domain.Entities;
using GenogramApp.Domain.Interfaces;
using GenogramApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GenogramApp.Application.Repository
{
    public class ChildRepository : Repository<Child>, IChildRepository
    {
        private readonly ApplicationDbContext _db;

        public ChildRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task UpdateAsync(Child obj)
        {
            var objFromDb = await _db.Children.FirstOrDefaultAsync(u => u.Id == obj.Id);
            if (objFromDb != null)
            {
                objFromDb.Name = obj.Name;
                objFromDb.Nationality = obj.Nationality;
                objFromDb.Address = obj.Address;
                objFromDb.Language = obj.Language;
                objFromDb.DateOfBirth = obj.DateOfBirth;
                objFromDb.ImagePath = obj.ImagePath;

            }
        }
    }
}
