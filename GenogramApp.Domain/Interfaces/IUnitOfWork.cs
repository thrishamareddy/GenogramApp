namespace GenogramApp.Domain.Interfaces
{
    public interface IUnitOfWork
    {
        IChildRepository Child { get; }
        IGuardiansRepository Guardian { get; }
        Task SaveAsync(); 
    }
}
