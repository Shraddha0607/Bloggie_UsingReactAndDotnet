using System.ComponentModel.DataAnnotations;
using Bloggie.Models.DomainModel;

namespace Bloggie.Models.Dtos.RequestModels;

public class BlogPostRequest
{
    [Required]
    [StringLength(100, ErrorMessage = "You are allowed to add only 100 characters.")]
    public string Heading { get; set; }
    
    [Required]
    [StringLength(100, ErrorMessage = "You are allowed to add only 100 characters.")]
    public string Title { get; set; }
    
    [Required]
    public string Content { get; set; }

    [Required]
    [StringLength(320, ErrorMessage = "You are allowed to add only 320 characters.")]
    public string ShortDescription { get; set; } = "Description";

    [Required]
    [Url]
    [StringLength(128, ErrorMessage = "You are allowed to add only 128 characters.")]
    public string ImageUrl { get; set; }
    
    [Required]
    [StringLength(100, ErrorMessage = "You are allowed to add only 100 characters.")]
    public string UrlHandler { get; set; }

    [Required]
    public DateOnly PublishedDate { get; set; }
    
    [Required]
    public string UserId { get; set; }

    [Required]
    public Boolean IsVisible { get; set; }
    public List<int> TagIds { get; set; } 
}