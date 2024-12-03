using System.Linq.Expressions;

namespace GenogramApp.Domain.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<T?> GetAsync(Expression<Func<T, bool>> filter); 
        Task<T?> GetByIdAsync(Expression<Func<T, bool>> filter, params Expression<Func<T, object>>[] includeProperties);
        IEnumerable<T> GetAll(string? includeProperties = null);
        Task AddAsync(T entity); 
        void Remove(T entity); 
    }
}
