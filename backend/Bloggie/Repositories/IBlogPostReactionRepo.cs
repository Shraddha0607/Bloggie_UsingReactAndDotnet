
using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;

namespace Bloggie.Repositories;

public interface IBlogPostReactionRepo
{
    Task<MessageResponse> AddReaction(BlogPostReactionRequest blogPostReactionRequest);

    Task<LikeDislikeCountResponse> GetLikeDisLikeCount(int BlogId, string UserId);

}