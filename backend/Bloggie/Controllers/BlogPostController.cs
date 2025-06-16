using Bloggie.Exceptions;
using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;
using Bloggie.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Bloggie.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class BlogPostController : ControllerBase
    {
        private readonly IBlogPostRepo repo;
        private readonly ILogger logger;

        public BlogPostController(IBlogPostRepo repo, ILogger<BlogPostController> logger)
        {
            this.repo = repo;
            this.logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult> Add(BlogPostRequest blogPostRequest)
        {
            try
            {
                var response = await repo.AddAsync(blogPostRequest);
                return Ok(response);
            }
            catch (CustomException ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(new MessageResponse { Message = ex.Message });
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("all")]
        public async Task<ActionResult> GetAllTag()
        {
            try
            {
                var response = await repo.GetAllAsync();
                return Ok(response);
            }
            catch (CustomException ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(new MessageResponse { Message = ex.Message });
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("id/{id}")]
        public async Task<ActionResult> DeleteById([FromRoute] int id)
        {
            try
            {
                var response = await repo.DeleteByIdAsync(id);
                return Ok(response);
            }
            catch (CustomException ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(new MessageResponse { Message = ex.Message });
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update")]
        public async Task<ActionResult> Update([FromBody] BlogPostRequest blogPostRequest, int id)
        {
            try
            {
                var response = await repo.UpdateAsync(blogPostRequest, id);
                return Ok(response); 
            }
            catch (CustomException ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(new MessageResponse { Message = ex.Message });
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("blogPostId/{id}")]
        public async Task<ActionResult> GetByIdAsync(int id) {
            try
            {
                var response = await repo.GetByIdAsync(id);
                return Ok(response);
            }
            catch (CustomException ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(new MessageResponse { Message = ex.Message });
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }
    }
}