using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;

namespace Bloggie.Repositories;

public interface ICdnRepo
{
    Task<ImageUploadResponse> AddImage(ImageUploadRequest imageUploadRequest);
}