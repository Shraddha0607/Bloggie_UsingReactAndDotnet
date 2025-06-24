using Bloggie.Exceptions;
using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;
using Bloggie.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bloggie.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class CommentController : ControllerBase
    {
        private readonly ICommentRepo repo;
        private readonly ILogger logger;

        public CommentController(ICommentRepo repo, ILogger<CommentController> logger)
        {
            this.repo = repo;
            this.logger = logger;
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> Add(CommentRequest commentRequest)
        {
            try
            {
                var response = await repo.AddAsync(commentRequest);
                if (response.Message == "You already submitted your review.")
                {
                    return Conflict(response); // 409
                }

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
                return BadRequest(new MessageResponse { Message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetAllComments(int PostId)
        {
            try
            {
                var response = await repo.GetAllAsync(PostId);
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
                return BadRequest(new MessageResponse { Message = ex.Message });
            }
        }

    }
}