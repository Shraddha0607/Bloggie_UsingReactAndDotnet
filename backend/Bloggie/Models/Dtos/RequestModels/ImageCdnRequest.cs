
using System.ComponentModel.DataAnnotations;

namespace Bloggie.Models.Dtos.RequestModels;

public class ImageUploadRequest
{
    [Required]
    public string ImageName { get; set; }
    [Required]
    public string ImageContent { get; set; }
}