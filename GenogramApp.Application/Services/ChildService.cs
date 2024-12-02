using AutoMapper;
using GenogramApp.Domain.Entities;
using GenogramApp.Domain.Interfaces;
using GenogramApp.Domain.Models;

namespace GenogramApp.Application.Services
{
    public class ChildService : IChildService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ChildService(IUnitOfWork unitOfWork,IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<bool> AddChildAsync(ChildDto childDto)
        {
                var child = _mapper.Map<Child>(childDto);
                if (child == null)
                {
                    return false;
                }
                _unitOfWork.Child.Add(child);
                _unitOfWork.Save();
                return true;
        }

        public async Task<ChildDto> GetChildDetailsAsync(int id)
        {
            var child = await _unitOfWork.Child.GetByIdAsync(c => c.Id == id, c => c.Guardians);
            if (child == null)
                return null;
            var childDto = _mapper.Map<ChildDto>(child);
            return childDto;
        }
        public async Task<bool> UpdateAsync(ChildDto childDto)
        {
            try
            {
                var child = _mapper.Map<Child>(childDto);
                var existingChild = await _unitOfWork.Child.GetByIdAsync(c => c.Id == child.Id);
                if (existingChild == null)
                {
                    return false; 
                }
                _unitOfWork.Child.Update(child);
                _unitOfWork.Save(); 
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

    }
}
