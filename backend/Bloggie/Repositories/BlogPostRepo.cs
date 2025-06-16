
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
            var isValid = dbContext.BlogPost.Any(x => x.Title == blogPostRequest.Title || x.Heading == blogPostRequest.Heading);
            if (isValid)
            {
                throw new CustomException("Already existing blog post! It must be unique.");
            }


            BlogPost blogPost = new BlogPost
            {
                Title = blogPostRequest.Title,
                Heading = blogPostRequest.Heading,
                Content = blogPostRequest.Content,
                ImageUrl = blogPostRequest.ImageUrl,
                UrlHandler = blogPostRequest.UrlHandler,
                PublishedDate = blogPostRequest.PublishedDate,
                Author = blogPostRequest.Author,
                IsVisible = blogPostRequest.IsVisible,
                LikeCount = 0,
                DislikeCount = 0,
                Tags = blogPostRequest.Tags,
            };

            await dbContext.BlogPost.AddAsync(blogPost);
            await dbContext.SaveChangesAsync();

            return new MessageResponse { Message = "Added successfully." };
        }

        public async Task<MessageResponse> DeleteByIdAsync(int id)
        {
            var blogPost = await dbContext.BlogPost
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

            if (blogPost == null)
            {
                throw new CustomException("Invalid Id found!");
            }

            dbContext.BlogPost.Remove(blogPost);
            await dbContext.SaveChangesAsync();

            return new MessageResponse { Message = "Removed successfully." };
        }

        public async Task<List<BlogPostResponse>> GetAllAsync()
        {
            var blogPosts = await dbContext.BlogPost
            .Select(x => new BlogPostResponse
            {
                Id = x.Id,
                Heading = x.Heading,
                Title = x.Title,
                Content = x.Content,
                ImageUrl = x.ImageUrl,
                UrlHandler = x.UrlHandler,
                PublishedDate = x.PublishedDate,
                Author = x.Author,
                IsVisible = x.IsVisible,
                LikeCount = x.LikeCount,
                DislikeCount = x.DislikeCount,
                Tags = x.Tags,
            })
            .ToListAsync();

            return blogPosts;
        }

        public async Task<BlogPostResponse> GetByIdAsync(int id)
        {
            var blogPost = await dbContext.BlogPost
            .Select(x => new BlogPostResponse
            {
                Heading = x.Heading,
                Title = x.Title,
                Content = x.Content,
                ImageUrl = x.ImageUrl,
                UrlHandler = x.UrlHandler,
                PublishedDate = x.PublishedDate,
                Author = x.Author,
                IsVisible = x.IsVisible,
                LikeCount = x.LikeCount,
                DislikeCount = x.DislikeCount,
                Tags = x.Tags,
            })
            .FirstOrDefaultAsync(x => x.Id == id);

            return blogPost;
        }

        public async Task<MessageResponse> UpdateAsync(BlogPostRequest blogPostRequest, int id)
        {
            var existingBlogPost = await dbContext.BlogPost.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

            if (existingBlogPost == null)
            {
                throw new CustomException("Invalid blog post id!");
            }

            var isValid = dbContext.BlogPost.Any(x => x.Title == blogPostRequest.Title || x.Heading == blogPostRequest.Heading);
            if (isValid)
            {
                throw new CustomException("Already existing blog title or heading! It must be unique.");
            }

            existingBlogPost.Heading = blogPostRequest.Heading;
            existingBlogPost.Title = blogPostRequest.Title;
            existingBlogPost.Content = blogPostRequest.Content;
            existingBlogPost.ImageUrl = blogPostRequest.ImageUrl;
            existingBlogPost.UrlHandler = blogPostRequest.UrlHandler;
            existingBlogPost.PublishedDate = blogPostRequest.PublishedDate;
            existingBlogPost.Author = blogPostRequest.Author;
            existingBlogPost.IsVisible = blogPostRequest.IsVisible;
            existingBlogPost.Tags = blogPostRequest.Tags;

            dbContext.BlogPost.Update(existingBlogPost);
            await dbContext.SaveChangesAsync();

            return new MessageResponse { Message = "Updated successfully." };
        }
    }
}