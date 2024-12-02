
using GenogramApp.Domain.Entities;
using GenogramApp.Domain.Interfaces;
using GenogramApp.Infrastructure.Data;

namespace GenogramApp.Application.Repository
{
    public class GuardiansRepository:Repository<Guardian>, IGuardiansRepository
    {
        private ApplicationDbContext _db;
        public GuardiansRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public void Update(Guardian obj)
        {
            var objFromDb = _db.Guardians.FirstOrDefault(u => u.Id == obj.Id);
            if (objFromDb != null)
            {
                objFromDb.FirstName = obj.FirstName;
                objFromDb.LastName = obj.LastName;
                objFromDb.Relationship = obj.Relationship;
                objFromDb.Phone = obj.Phone;
                objFromDb.Email = obj.Email;
                objFromDb.IsPrimaryContact = obj.IsPrimaryContact;
                objFromDb.Remarks= obj.Remarks;
                objFromDb.ChildId= obj.ChildId;

            }
        }
    }
}
