using AutoMapper;
using WinBlog.Core.Repositories;
using WinBlog.Core.SeedWorks;
using WinBlog.Data.Repositories;

namespace WinBlog.Data.SeedWorks
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly WinBlogContext _context;

        public UnitOfWork(WinBlogContext context, IMapper mapper)
        {
            _context = context;
            Posts = new PostRepository(context, mapper);
        }

        public IPostRepository Posts { get; private set; }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
