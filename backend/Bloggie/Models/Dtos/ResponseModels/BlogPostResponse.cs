using Bloggie.Models.DomainModel;

namespace Bloggie.Models.Dtos.ResponseModels;

public class BlogPost
{
    public int Id { get; set; }

    public string Heading { get; set; }
    
    public string Title { get; set; }
    
    public string Content { get; set; }

    public string ImageUrl { get; set; }
    
    public string UrlHandler { get; set; }

    public DateOnly PublishedDate { get; set; }
    
    public string Author { get; set; }

    public Boolean IsVisible { get; set; }
    public int LikeCount { get; set; }
    public int DislikeCount { get; set; }
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
}