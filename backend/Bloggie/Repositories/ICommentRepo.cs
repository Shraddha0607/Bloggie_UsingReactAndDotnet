using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;

namespace Bloggie.Repositories
{
    public interface ICommentRepo
    {
        Task<MessageResponse> AddAsync(CommentRequest commentRequest);
        Task<List<CommentResponse>> GetAllAsync(int PostId);
    }
}