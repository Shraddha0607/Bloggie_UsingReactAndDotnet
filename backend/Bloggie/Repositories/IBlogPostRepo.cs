
using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;

namespace Bloggie.Repositories
{
    public interface IBlogPostRepo
    {
        Task<MessageResponse> AddAsync(BlogPostRequest blogPostRequest);
        Task<BlogPostResponse> GetByIdAsync(int id);
        Task<MessageResponse> DeleteByIdAsync(int id);
        Task<MessageResponse> UpdateAsync(BlogPostRequest blogPostRequest, int id);
        Task<List<BlogPostResponse>> GetAllAsync();
    }
}