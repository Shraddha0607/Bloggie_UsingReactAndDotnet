
using Bloggie.Data;
using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;

namespace Bloggie.Repositories
{
    public class CommentRepo : ICommentRepo
    {
        private readonly BloggieDbContext dbContext;

        public CommentRepo(BloggieDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public Task<MessageResponse> AddAsync(CommentRequest commentRequest)
        {
            throw new NotImplementedException();
        }

        public Task<MessageResponse> DeleteByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<CommentResponse>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<CommentResponse> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<MessageResponse> UpdateAsync(CommentRequest commentRequest, int id)
        {
            throw new NotImplementedException();
        }
    }
}