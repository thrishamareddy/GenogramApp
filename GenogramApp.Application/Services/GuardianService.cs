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
            return _mapper.Map<IEnumerable<GuardianDto>>(guardians);
        }

        public async Task<bool> AddOrUpdateGuardianAsync(int? id, GuardianDto guardianDto)
        {
            var guardian = _mapper.Map<Guardian>(guardianDto);

            if (guardian.IsPrimaryContact)
            {
                var guardians = _unitOfWork.Guardian.GetAll();
                var existingPrimaryContact = guardians.FirstOrDefault(g => g.ChildId == guardian.ChildId && g.IsPrimaryContact);
                if (existingPrimaryContact != null)
                {
                    existingPrimaryContact.IsPrimaryContact = false;
                    await _unitOfWork.Guardian.UpdateAsync(existingPrimaryContact);
                    await _unitOfWork.SaveAsync();
                }
            }

            if (id == 0 || id == null)
            {
                await _unitOfWork.Guardian.AddAsync(guardian);
            }
            else
            {
                await _unitOfWork.Guardian.UpdateAsync(guardian);
            }

            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var guardian = await _unitOfWork.Guardian.GetAsync(u => u.Id == id);
            if (guardian == null)
            {
                return false;
            }

            _unitOfWork.Guardian.Remove(guardian);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}
