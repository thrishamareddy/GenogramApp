using GenogramApp.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace GenogramApp.Domain.Models
{
    public class ChildDto
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Nationality { get; set; } = null!;
        public string Language { get; set; } = null!;
        public string? DateOfBirth { get; set; }
        public string? ImagePath { get; set; }
        public ICollection<Guardian>? Guardians { get; set; }
    }
}
