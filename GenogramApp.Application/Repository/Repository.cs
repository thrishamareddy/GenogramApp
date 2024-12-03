using GenogramApp.Domain.Interfaces;
using GenogramApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace GenogramApp.Application.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly ApplicationDbContext _db;
        internal DbSet<T> dbSet;

        public Repository(ApplicationDbContext db)
        {
            _db = db;
            dbSet = _db.Set<T>();
        }

        public async Task AddAsync(T entity)
        {
            await dbSet.AddAsync(entity);
        }

        public async Task<T?> GetAsync(Expression<Func<T, bool>> filter)
        {
            return await dbSet.FirstOrDefaultAsync(filter);
        }

        public async Task<T?> GetByIdAsync(Expression<Func<T, bool>> filter, params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> query = dbSet;

            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }

            return await query.FirstOrDefaultAsync(filter);
        }

        //public Task<IEnumerable<T>> GetAll(string? includeProperties = null)
        //{
        //    IQueryable<T> query = dbSet;

        //    if (!string.IsNullOrEmpty(includeProperties))
        //    {
        //        foreach (var includeProp in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
        //        {
        //            query = query.Include(includeProp);
        //        }
        //    }

        //    return query.ToListAsync();
        //}
        public IEnumerable<T> GetAll(string? includeProperties = null)
        {
            IQueryable<T> query = dbSet;
            if (!string.IsNullOrEmpty(includeProperties))
            {
                foreach (var includeProp in includeProperties
                    .Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProp);
                }

            }
            return query.ToList();

        }

        public void Remove(T entity)
        {
            dbSet.Remove(entity);
        }
    }
}
