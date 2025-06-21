

using Bloggie.Data;
using Bloggie.Exceptions;
using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;
using Microsoft.EntityFrameworkCore;
using Bloggie.Models.Enums;
using Bloggie.Models.DomainModel;
using Microsoft.EntityFrameworkCore.Storage.Internal;

namespace Bloggie.Repositories;

public class BlogPostReactionRepo : IBlogPostReactionRepo
{
    private readonly BloggieDbContext dbContext;

    public BlogPostReactionRepo(BloggieDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<MessageResponse> AddReaction(BlogPostReactionRequest request)
    {
        var reaction = await dbContext.BlogPostReactions
           .FirstOrDefaultAsync(r => r.BlogPostId == request.BlogId && r.UserId == request.UserId);

        if (reaction == null)
        {
            var newReaction = new BlogPostReaction
            {
                BlogPostId = request.BlogId,
                UserId = request.UserId,
                ReactionType = request.UserReaction
            };

            await dbContext.BlogPostReactions.AddAsync(newReaction);
        }
        else
        {
            if (reaction.ReactionType == request.UserReaction)
            {
                reaction.ReactionType = ReactionType.None;
            }
            else
            {
                reaction.ReactionType = request.UserReaction;
            }
        }

        await dbContext.SaveChangesAsync();
        return new MessageResponse { Message = "Reaction added successfully." };

    }

    public async Task<LikeDislikeCountResponse> GetLikeDisLikeCount(int BlogId, string UserId)
    {

        var reactions = await dbContext.BlogPostReactions
            .Where(r => r.BlogPostId == BlogId)
            .ToListAsync();

        if (reactions == null)
        {
            throw new CustomException("No reaction found for given blogId!");
        }

        var response = new LikeDislikeCountResponse();

        foreach (var reaction in reactions)
        {
            if (reaction.ReactionType == ReactionType.Like) response.LikeCount++;
            else if (reaction.ReactionType == ReactionType.Unlike) response.DisLikeCount++;

            if (reaction.UserId == UserId) response.UserReaction = reaction.ReactionType;
        }

        return response;

    }
}