
using Bloggie.Data;
using Bloggie.Exceptions;
using Bloggie.Models.DomainModel;
using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;
using Microsoft.EntityFrameworkCore;

namespace Bloggie.Repositories
{
    public class BlogPostRepo : IBlogPostRepo
    {
        private readonly BloggieDbContext dbContext;

        public BlogPostRepo(BloggieDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<MessageResponse> AddAsync(BlogPostRequest blogPostRequest)
        {
            var isValid = await dbContext.BlogPosts.AnyAsync(x => x.Title == blogPostRequest.Title || x.Heading == blogPostRequest.Heading);
            if (isValid)
            {
                throw new CustomException("Already existing blog post! It must be unique.");
            }

            var tags = await dbContext.Tags
                .Where(tag => blogPostRequest.TagIds.Contains(tag.Id))
                .ToListAsync();

            if (blogPostRequest.TagIds.Count != tags.Count)
            {
                throw new CustomException("Tags is missing in database!");
            }

            BlogPost blogPost = new BlogPost
            {
                Title = blogPostRequest.Title,
                Heading = blogPostRequest.Heading,
                Content = blogPostRequest.Content,
                ImageUrl = blogPostRequest.ImageUrl,
                UrlHandler = blogPostRequest.UrlHandler,
                PublishedDate = blogPostRequest.PublishedDate,
                UserId = blogPostRequest.UserId,
                IsVisible = blogPostRequest.IsVisible,
                Tags = tags
            };

            await dbContext.BlogPosts.AddAsync(blogPost);
            await dbContext.SaveChangesAsync();

            return new MessageResponse { Message = "Added successfully." };
        }

        public async Task<MessageResponse> DeleteByIdAsync(int id)
        {
            var blogPost = await dbContext.BlogPosts
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

            if (blogPost == null)
            {
                throw new CustomException("Invalid Id found!");
            }

            dbContext.BlogPosts.Remove(blogPost);
            await dbContext.SaveChangesAsync();

            return new MessageResponse { Message = "Removed successfully." };
        }

        public async Task<List<BlogPostResponse>> GetAllAsync()
        {
            var blogPosts = await dbContext.BlogPosts
            .Include(b => b.User)
            .Select(x => new BlogPostResponse
            {
                Id = x.Id,
                Heading = x.Heading,
                Title = x.Title,
                Content = x.Content,
                ImageUrl = x.ImageUrl,
                UrlHandler = x.UrlHandler,
                PublishedDate = x.PublishedDate,
                Author = x.User.UserName,
                IsVisible = x.IsVisible,
                Tags = x.Tags,
            })
            .ToListAsync();

            return blogPosts;
        }

        public async Task<BlogPostResponse> GetByIdAsync(int id)
        {
            var blogPost = await dbContext.BlogPosts
            .Select(x => new BlogPostResponse
            {
                Id = x.Id,
                Heading = x.Heading,
                Title = x.Title,
                Content = x.Content,
                ImageUrl = x.ImageUrl,
                UrlHandler = x.UrlHandler,
                PublishedDate = x.PublishedDate,
                Author = x.User.UserName,
                IsVisible = x.IsVisible,
                Tags = x.Tags,
            })
            .FirstOrDefaultAsync(x => x.Id == id);

            if(blogPost == null){
                throw new CustomException("Invalid post Id!");
            }

            return blogPost;
        }

        public async Task<MessageResponse> UpdateAsync(BlogPostRequest blogPostRequest, int id)
        {
            var existingBlogPost = await dbContext.BlogPosts.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

            if (existingBlogPost == null)
            {
                throw new CustomException("Invalid blog post id!");
            }

            var isValid = dbContext.BlogPosts.Any(x => x.Title == blogPostRequest.Title || x.Heading == blogPostRequest.Heading);
            if (isValid)
            {
                throw new CustomException("Already existing blog title or heading! It must be unique.");
            }

            var tags = await dbContext.Tags
                .Where(tag => blogPostRequest.TagIds.Contains(tag.Id))
                .ToListAsync();

            existingBlogPost.Heading = blogPostRequest.Heading;
            existingBlogPost.Title = blogPostRequest.Title;
            existingBlogPost.Content = blogPostRequest.Content;
            existingBlogPost.ImageUrl = blogPostRequest.ImageUrl;
            existingBlogPost.UrlHandler = blogPostRequest.UrlHandler;
            existingBlogPost.PublishedDate = blogPostRequest.PublishedDate;
            existingBlogPost.UserId = blogPostRequest.UserId;
            existingBlogPost.IsVisible = blogPostRequest.IsVisible;
            existingBlogPost.Tags = tags;

            dbContext.BlogPosts.Update(existingBlogPost);
            await dbContext.SaveChangesAsync();

            return new MessageResponse { Message = "Updated successfully." };
        }
        
    }
}