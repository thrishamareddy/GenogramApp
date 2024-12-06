using GenogramApp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace GenogramApp.Domain.Models
{
    public class GuardianDto
    {
        [Key]
        public int? Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string? LastName { get; set; } 
        public string Relationship { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public bool? IsPrimaryContact { get; set; }
        public string? Remarks { get; set; }
        public int ChildId { get; set; }
        [JsonIgnore]
        public Child? Child { get; set; }
    }
}
