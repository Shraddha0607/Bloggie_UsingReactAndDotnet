using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Bloggie.Models.DomainModel;

public class Comment
{
    public int Id { get; set; }
    [Required]
    [StringLength(50, ErrorMessage = "You are allowed to add only 50 characters.")]
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    [Required]
    public int PostId { get; set; }
    public BlogPost Post { get; set; }
    [Required]
    public string UserId { get; set; }
    public IdentityUser User { get; set; }

    
}