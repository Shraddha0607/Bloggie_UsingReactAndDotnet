
using Bloggie.Repositories;
using Microsoft.AspNetCore.Mvc;
using Bloggie.Exceptions;
using Bloggie.Models.Dtos.ResponseModels;
using Bloggie.Models.Dtos.RequestModels;

namespace Bloggie.Controllers;

[ApiController]
[Route("[controller]")]
public class CdnController : ControllerBase
{
    private readonly ICdnRepo repo;
    private readonly ILogger logger;


    public CdnController(ICdnRepo repo, ILogger<CdnController> logger)
    {
        this.repo = repo;
        this.logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult> UrlGenerate(ImageUploadRequest imageUploadRequest)
    {
        try
        {
            var response = await repo.AddImage(imageUploadRequest);
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


    [HttpPost("upload")]
    public async Task<IActionResult> UploadViaHttpContext()
    {
        try
        {
            var response = await repo.UploadViaHttpContext();
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

    [HttpPost("upload1")]
    public async Task<IActionResult> Upload1(IFormFile file)
    {
        try
        {
            var response = await repo.UploadByIFormFile(file);
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