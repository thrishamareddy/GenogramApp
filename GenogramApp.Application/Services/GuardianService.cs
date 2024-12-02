using AutoMapper;
using GenogramApp.Domain.Entities;
using GenogramApp.Domain.Interfaces;
using GenogramApp.Domain.Models;

namespace GenogramApp.Application.Services
{
    public class GuardianService : IGuardianService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public GuardianService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GuardianDto>> GetGuardianDetailsAsync()
        {
            var guardians = _unitOfWork.Guardian.GetAll(includeProperties: "Child");
            return await Task.FromResult(_mapper.Map<IEnumerable<GuardianDto>>(guardians));
        }

        public async Task<bool> AddOrUpdateGuardianAsync(int? id, GuardianDto guardianDto)
        {
            
            var guardian = _mapper.Map<Guardian>(guardianDto);
            
            if (guardian.IsPrimaryContact)
            {
                var existingPrimaryContact = _unitOfWork.Guardian
                    .GetAll()
                    .FirstOrDefault(g => g.ChildId == guardian.ChildId && g.IsPrimaryContact);

                if (existingPrimaryContact != null)
                {
                    existingPrimaryContact.IsPrimaryContact = false;
                    _unitOfWork.Guardian.Update(existingPrimaryContact);
                    _unitOfWork.Save();
                }
            }

            if (id == 0 || id == null)
            {
                _unitOfWork.Guardian.Add(guardian);
            }
            else
            {
                _unitOfWork.Guardian.Update(guardian);
            }

            _unitOfWork.Save();
            return await Task.FromResult(true);
        }
        public async Task<bool> Delete(int id)
        {
            var guardian = _unitOfWork.Guardian.Get(u => u.Id == id);
            if (guardian == null)
            {
                return false;
            }
            _unitOfWork.Guardian.Remove(guardian);
            _unitOfWork.Save();
            return true;
        }

    }
}
