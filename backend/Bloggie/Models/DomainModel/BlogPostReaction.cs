
using System.ComponentModel.DataAnnotations;
using Bloggie.Models.Enums;

namespace Bloggie.Models.DomainModel;

public class BlogPostReaction
{
    public int Id { get; set; }
    [Required]
    public int BlogPostId { get; set; }
    [Required]
    public int UserId { get; set; }
    [Required]
    public ReactionType ReactionType { get; set; }
    public BlogPost BlogPost { get; set; }

}