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
    public class TagController : ControllerBase
    {

        private readonly ITagRepo repo;
        private readonly ILogger logger;

        public TagController(ITagRepo repo, ILogger<TagController> logger)
        {
            this.repo = repo;
            this.logger = logger;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Add(TagRequest tagRequest)
        {
            try
            {
                var response = await repo.AddAsync(tagRequest);
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
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update([FromBody] TagRequest tagRequest, int id)
        {
            try
            {
                var response = await repo.UpdateAsync(tagRequest, id);
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

        [HttpGet("tagId/{id}")]
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