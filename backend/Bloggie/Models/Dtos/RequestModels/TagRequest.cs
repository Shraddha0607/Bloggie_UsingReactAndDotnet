using System.ComponentModel.DataAnnotations;

namespace Bloggie.Models.Dtos.RequestModels;

public class TagRequest
{
    
    [Required]
    [StringLength(30, ErrorMessage ="You are allowed to add only 30 character.")]
    public string Name { get; set; }
    [Required]
    [StringLength(20, ErrorMessage ="You are allowed to add 20 characters only.")]
    public string DisplayName { get; set; }
}