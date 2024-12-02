using AutoMapper;
using GenogramApp.Domain.Entities;
using GenogramApp.Domain.Models;
namespace GenogramApp.Application.Mapping
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<Guardian, GuardianDto>()
            .ReverseMap();
            CreateMap<Child, ChildDto>().ReverseMap();
        }
    }
}
