using WinBlog.Core.Repositories;

namespace WinBlog.Core.SeedWorks
{
    public interface IUnitOfWork
    {
        IPostRepository Posts { get; }
        Task<int> CompleteAsync();
    }
}
