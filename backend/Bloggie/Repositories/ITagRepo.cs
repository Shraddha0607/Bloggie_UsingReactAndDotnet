

using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;

namespace Bloggie.Repositories
{
    public interface ITagRepo
    {
        Task<MessageResponse> AddAsync(TagRequest tagRequest);
        Task<TagResponse> GetByIdAsync(int id);
        Task<MessageResponse> DeleteByIdAsync(int id);
        Task<MessageResponse> UpdateAsync(TagRequest tagRequest, int id);
        Task<List<TagResponse>> GetAllAsync();
    }
}