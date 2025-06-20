using System.ComponentModel.DataAnnotations;

namespace Bloggie.Models.DomainModel;

public class BlogPost
{
    public int Id { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "You are allowed to add only 100 characters.")]
    public string Heading { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "You are allowed to add only 100 characters.")]
    public string Title { get; set; }

    [Required]
    public string Content { get; set; }

    [Required]
    [Url]
    [StringLength(64, ErrorMessage = "You are allowed to add only 64 characters.")]
    public string ImageUrl { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "You are allowed to add only 100 characters.")]
    public string UrlHandler { get; set; }

    [Required]
    public DateOnly PublishedDate { get; set; }

    [Required]
    [StringLength(50, ErrorMessage = "You are allowed to add only 50 characters.")]
    public string Author { get; set; }

    [Required]
    public Boolean IsVisible { get; set; }
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}

