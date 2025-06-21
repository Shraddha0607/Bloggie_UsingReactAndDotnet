
using System.ComponentModel.DataAnnotations;
using Bloggie.Models.Enums;
using Microsoft.AspNetCore.Identity;

namespace Bloggie.Models.DomainModel;

public class BlogPostReaction
{
    public int Id { get; set; }
    [Required]
    public int BlogPostId { get; set; }
    public BlogPost BlogPost { get; set; }
    [Required]
    public string UserId { get; set; }
    public IdentityUser User { get; set; }
    [Required]
    public ReactionType ReactionType { get; set; }

}