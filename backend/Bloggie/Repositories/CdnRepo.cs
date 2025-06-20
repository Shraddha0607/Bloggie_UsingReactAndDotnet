using Bloggie.Exceptions;
using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;

namespace Bloggie.Repositories;

public class CdnRepo : ICdnRepo
{
    private readonly IWebHostEnvironment env;

    public CdnRepo(IWebHostEnvironment env)
    {
        this.env = env;
    }

    public async Task<ImageUploadResponse> AddImage(ImageUploadRequest imageUploadRequest)
    {
        if (string.IsNullOrEmpty(imageUploadRequest.ImageContent) || string.IsNullOrEmpty(imageUploadRequest.ImageName))
        {
            throw new CustomException("Image name or content cannot be empty.");
        }

        var fileName = GetFileName(imageUploadRequest.ImageName);
        var cdnDirPath = Path.Combine(env.ContentRootPath, "cdn-images");

        if (!Directory.Exists(cdnDirPath))
        {
            Directory.CreateDirectory(cdnDirPath);
        }

        var filePath = Path.Combine(cdnDirPath, fileName);  // await

         var bytes = Convert.FromBase64String(imageUploadRequest.ImageContent);
            await File.WriteAllBytesAsync(filePath, bytes);

        var fullUrl = $"{imageUploadRequest.BaseUrl}/{fileName}";

        return new ImageUploadResponse { ImageUrl = fullUrl };
    }

    private string GetFileName(string originalFileName)
    {
        var timeStamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var cleaned = originalFileName.ToLower().Replace(" ", "");
        return $"{timeStamp}_{cleaned}";
    }

}