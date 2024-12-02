using GenogramApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GenogramApp.Infrastructure.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }
        public DbSet<Child> Children { get; set; }
        public DbSet<Guardian> Guardians { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Guardian>()
                .HasOne(g => g.Child)
                .WithMany(c => c.Guardians)
                .HasForeignKey(g => g.ChildId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Guardian>()
                .HasIndex(g => new { g.ChildId, g.IsPrimaryContact })
                .IsUnique()
                .HasFilter("[IsPrimaryContact] = 1");
        }

    }
}
