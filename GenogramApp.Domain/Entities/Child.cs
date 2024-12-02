using System.ComponentModel.DataAnnotations;

namespace GenogramApp.Domain.Entities
{
    public class Child
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Nationality { get; set; } = null!;
        public string Language { get; set; } =null!;
        public string? DateOfBirth { get; set; }
        public string? ImagePath { get; set; }
        public ICollection<Guardian> Guardians { get; set; } = null!;
    }
}
