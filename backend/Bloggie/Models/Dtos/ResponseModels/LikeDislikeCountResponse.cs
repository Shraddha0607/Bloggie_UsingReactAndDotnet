

using Bloggie.Models.Enums;

namespace Bloggie.Models.Dtos.ResponseModels;

public class LikeDislikeCountResponse
{
    public int LikeCount { get; set; }
    public int DisLikeCount { get; set; }
    public ReactionType UserReaction { get; set; }
}