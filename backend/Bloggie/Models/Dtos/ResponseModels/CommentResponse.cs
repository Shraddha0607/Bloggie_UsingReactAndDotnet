using Bloggie.Models.DomainModel;

namespace Bloggie.Models.Dtos.ResponseModels;

public class CommentResponse
{
    public int Id { get; set; }
    public string Content { get; set; }
    public string UserId { get; set; }
    public int PostId { get; set; }
}