using Bloggie.Exceptions;
using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;

namespace Bloggie.Repositories;

public class CdnRepo : ICdnRepo
{
    private readonly IWebHostEnvironment env;
    private readonly IHttpContextAccessor httpContext;

    public CdnRepo(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
    {
        this.env = env;
        httpContext = httpContextAccessor;
    }

    public async Task<ImageUploadResponse> AddImage(ImageUploadRequest request)
    {
        if (string.IsNullOrEmpty(request.ImageContent) || string.IsNullOrEmpty(request.ImageName))
        {
            throw new CustomException("Image name or content cannot be empty.");
        }

        var fileName = GetFileName(request.ImageName);
        var cdnDirPath = GetUploadPath();
        var filePath = Path.Combine(cdnDirPath, fileName);

        var bytes = Convert.FromBase64String(request.ImageContent);
        await File.WriteAllBytesAsync(filePath, bytes);

        return new ImageUploadResponse { ImageUrl = GetUrl(fileName) };
    }

    public async Task<ImageUploadResponse> UploadViaHttpContext()
    {
        var files = httpContext.HttpContext!.Request.Form.Files;

        if (files.Count == 0)
            throw new CustomException("No files received.");

        var file = files[0];
        return await UploadByIFormFile(file);
    }


    public async Task<ImageUploadResponse> UploadByIFormFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new CustomException("File not selected or uploaded empty file.");

        var uploadsPath = GetUploadPath();
        var fileName = GetFileName(file.FileName);
        var filePath = Path.Combine(uploadsPath, fileName);
        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return new ImageUploadResponse { ImageUrl = GetUrl(fileName) };
    }

    private string GetUploadPath() => Path.Combine(env.ContentRootPath, "cdn-images");

    private string GetUrl(string FileName)
    {
        var baseUrl = $"{httpContext.HttpContext!.Request.Scheme}://{httpContext.HttpContext!.Request.Host}";
        return $"{baseUrl}/{FileName}";
    }

    private string GetFileName(string originalFileName)
    {
        var timeStamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var cleaned = originalFileName.ToLower().Replace(" ", "");
        return $"{timeStamp}_{cleaned}";
    }
}