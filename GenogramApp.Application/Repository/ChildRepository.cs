
using GenogramApp.Domain.Entities;
using GenogramApp.Domain.Interfaces;
using GenogramApp.Infrastructure.Data;

namespace GenogramApp.Application.Repository
{
    public class ChildRepository: Repository<Child>,IChildRepository
    {
        private ApplicationDbContext _db;
        public ChildRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public void Update(Child obj)
        {
            var objFromDb = _db.Children.FirstOrDefault(u => u.Id == obj.Id);
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
