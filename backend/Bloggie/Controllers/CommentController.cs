using Bloggie.Exceptions;
using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;
using Bloggie.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Bloggie.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class CommentController : ControllerBase
    {
        private readonly ICommentRepo repo;
        private readonly ILogger logger;

        public CommentController(ICommentRepo repo, ILogger logger)
        {
            this.repo = repo;
            this.logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult> Add(CommentRequest commentRequest)
        {
            try
            {
                var response = await repo.AddAsync(commentRequest);
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
        public async Task<ActionResult> GetAllComment()
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
        public async Task<ActionResult> Update([FromBody] CommentRequest commentRequest, int id)
        {
            try
            {
                var response = await repo.UpdateAsync(commentRequest, id);
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

        [HttpGet("commentId/{id}")]
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