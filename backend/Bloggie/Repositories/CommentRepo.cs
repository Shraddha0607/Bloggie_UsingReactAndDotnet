
using Bloggie.Data;
using Bloggie.Models.DomainModel;
using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;
using Microsoft.EntityFrameworkCore;

namespace Bloggie.Repositories
{
    public class CommentRepo : ICommentRepo
    {
        private readonly BloggieDbContext dbContext;

        public CommentRepo(BloggieDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<MessageResponse> AddAsync(CommentRequest request)
        {
            var isExisting = await dbContext.Comments.AnyAsync(x => x.PostId == request.PostId && x.UserId == request.UserId);
            if (isExisting)
            {
                return new MessageResponse { Message = "You already submitted your review." };
            }

            var comment = new Comment
            {
                Content = request.Content,
                CreatedAt = DateTime.Now,
                PostId = request.PostId,
                UserId = request.UserId
            };

            try
            {
                await dbContext.Comments.AddAsync(comment);
                await dbContext.SaveChangesAsync();
                return new MessageResponse { Message = "Comment added successfully." };
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Failed to add comment.", ex);
            }

        }

        public async Task<List<CommentResponse>> GetAllAsync(int postId)
        {
            var comments = await dbContext.Comments.AsNoTracking()
                .Where(c => c.PostId == postId)
                .Select(c => new CommentResponse
                {
                    Id = c.Id,
                    Content = c.Content,
                    UserId = c.UserId,
                })
                .ToListAsync();

            return comments;
        }
    }
}