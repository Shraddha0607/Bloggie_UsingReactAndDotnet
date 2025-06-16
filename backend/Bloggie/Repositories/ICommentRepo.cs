using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;

namespace Bloggie.Repositories
{
    public interface ICommentRepo
    {
        Task<MessageResponse> AddAsync(CommentRequest commentRequest);
        Task<CommentResponse> GetByIdAsync(int id);
        Task<MessageResponse> DeleteByIdAsync(int id);
        Task<MessageResponse> UpdateAsync(CommentRequest commentRequest, int id);
        Task<List<CommentResponse>> GetAllAsync();
    }
}