

using Bloggie.Data;
using Bloggie.Exceptions;
using Bloggie.Models.DomainModel;
using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;
using Microsoft.EntityFrameworkCore;

namespace Bloggie.Repositories
{
    public class TagRepo : ITagRepo
    {
        private readonly BloggieDbContext dbContext;

        public TagRepo(BloggieDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<MessageResponse> AddAsync(TagRequest tagRequest)
        {
            var isValid = dbContext.Tags.Any(x => x.Name == tagRequest.Name);

            if (isValid)
            {
                throw new CustomException("Already existing tag name! It must be unique.");
            }
            
            Tag tag = new Tag
            {
                Name = tagRequest.Name,
                DisplayName = tagRequest.DisplayName,
            };

            await dbContext.Tags.AddAsync(tag);
            await dbContext.SaveChangesAsync();

            return new MessageResponse { Message = "Added successfully." };

        }

        public async Task<MessageResponse> DeleteByIdAsync(int id)
        {
            var tag = await dbContext.Tags.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

            if (tag == null)
            {
                throw new CustomException("Invalid Id found!");
            }

            dbContext.Tags.Remove(tag);
            await dbContext.SaveChangesAsync();

            return new MessageResponse { Message = "Removed successfully. " };

        }

        public async Task<List<TagResponse>> GetAllAsync()
        {
            var tags = await dbContext.Tags.Select(x => new TagResponse
            {
                Id = x.Id,
                Name = x.Name,
                DisplayName = x.DisplayName
            })
            .ToListAsync();

            return tags;

        }

        public async Task<TagResponse> GetByIdAsync(int id)
        {
            var tag = await dbContext.Tags
            .Select(x => new TagResponse
            {
                Id = x.Id,
                Name = x.Name,
                DisplayName = x.DisplayName
            })
            .FirstOrDefaultAsync(x => x.Id == id);

            if (tag == null)
            {
                throw new CustomException("Id not found!");
            }

            return tag;
            
        }

        public async Task<MessageResponse> UpdateAsync(TagRequest tagRequest, int id)
        {
            var existingTag = await dbContext.Tags
            .FirstOrDefaultAsync(x => x.Id == id);

            if (existingTag == null)
            {
                throw new CustomException("Invalid tag id!");
            }

            var isValid = dbContext.Tags.Any(x => x.Name == tagRequest.Name && x.Id != id);

            if (isValid)
            {
                throw new CustomException("Already existing tag name! It must be unique.");
            }

            existingTag.Name = tagRequest.Name;
            existingTag.DisplayName = tagRequest.DisplayName;

            dbContext.Tags.Update(existingTag);
            await dbContext.SaveChangesAsync();

            return new MessageResponse { Message = "Update successfully." };
        }
    }
}