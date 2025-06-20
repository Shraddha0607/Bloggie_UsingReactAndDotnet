using System.ComponentModel.DataAnnotations;

namespace Bloggie.Models.DomainModel;

public class Tag
{

    public int Id { get; set; }
    [Required]
    [StringLength(30, ErrorMessage = "You are allowed to add only 30 character.")]
    public string Name { get; set; }
    [Required]
    [StringLength(20, ErrorMessage = "You are allowed to add 20 characters only.")]
    public string DisplayName { get; set; }
    public ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();
}