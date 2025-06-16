using System.ComponentModel.DataAnnotations;

namespace Bloggie.Models.DomainModel;

public class Comment
{
    public int Id { get; set; }
    [Required]
    [StringLength(50, ErrorMessage = "You are allowed to add only 50 characters.")]
    public string CommentDesc { get; set; }
    [Required]
    public int PostId { get; set; }
    public BlogPost Post { get; set; }
}