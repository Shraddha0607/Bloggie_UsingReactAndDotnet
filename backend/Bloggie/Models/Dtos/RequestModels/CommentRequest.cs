using System.ComponentModel.DataAnnotations;

namespace Bloggie.Models.Dtos.RequestModels;

public class CommentRequest
{
    [Required]
    [StringLength(50, ErrorMessage = "You are allowed to add only 50 characters.")]
    public string CommentDesc { get; set; }
    [Required]
    public int PostId { get; set; }
}