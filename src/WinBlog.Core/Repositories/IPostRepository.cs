using WinBlog.Core.Domain.Content;
using WinBlog.Core.Models;
using WinBlog.Core.Models.Content;
using WinBlog.Core.SeedWorks;

namespace WinBlog.Core.Repositories
{
    public interface IPostRepository : IRepository<Post, Guid>
    {
        Task<List<Post>> GetPopularPostsAsync(int count);
        Task<PagedResult<PostInListDto>> GetPostsPagingAsync(string? keyword, Guid? categoryId, int pageIndex = 1, int pageSize = 10);
    }
}
