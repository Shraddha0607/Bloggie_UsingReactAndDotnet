

using Bloggie.Exceptions;
using Bloggie.Models.Dtos.RequestModels;
using Bloggie.Models.Dtos.ResponseModels;
using Bloggie.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Bloggie.Controllers;

[ApiController]
[Route("[controller]")]

public class BlogPostReactionController : ControllerBase
{

    private readonly ILogger logger;
    private readonly IBlogPostReactionRepo repo;

    BlogPostReactionController(IBlogPostReactionRepo repo, ILogger<BlogPostReactionController> logger)
    {
        this.repo = repo;
        this.logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult> AddReaction(BlogPostReactionRequest blogPostReactionRequest)
    {
        try
        {
            var response = await repo.AddReaction(blogPostReactionRequest);
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

    [HttpGet]
    public async Task<ActionResult> GetLikeDislikeCount([FromQuery] int PostId, [FromQuery] string UserId)
    {
        try
        {
            var response = await repo.GetLikeDisLikeCount(PostId, UserId);
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