using System.ComponentModel.DataAnnotations;
using Bloggie.Models.Enums;

namespace Bloggie.Models.Dtos.RequestModels;

public class BlogPostReactionRequest
{

    [Required]
    public int BlogId { get; set; }
    [Required]
    public string UserId { get; set; }
    public ReactionType UserReaction { get; set; }
}