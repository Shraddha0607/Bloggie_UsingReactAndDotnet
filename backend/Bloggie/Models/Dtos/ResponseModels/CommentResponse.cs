namespace Bloggie.Models.Dtos.ResponseModels;

public class Comment
{
    public int Id { get; set; }
    public string CommentDesc { get; set; }
    public int PostId { get; set; }
    public BlogPost Post { get; set; }
}