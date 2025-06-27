

using Bloggie.Exceptions;
using Bloggie.Models.Dtos.ResponseModels;
using CollegeApp.Models.Dtos.AuthDtos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Bloggie.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private ILogger logger;
        private IUserRepo repo;
        public UserController(ILogger<UserController> logger, IUserRepo repo)
        {
            this.logger = logger;
            this.repo = repo;
        }

        [HttpGet("all")]
        public async Task<ActionResult> GetAllUsers()
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
                return BadRequest(new MessageResponse { Message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetById(string id)
        {
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
                return BadRequest(new MessageResponse { Message = ex.Message });
            }
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteById(string id)
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
                return BadRequest(new MessageResponse { Message = ex.Message });
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateById(RegisterRequestDto userRequest, string id)
        {
            try
            {
                var response = await repo.UpdateByIdAsync(userRequest, id);
                if (response.Message.Contains("Failed") || response.Message.Contains("Invalid"))
                {
                    return BadRequest(response);
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

    }
}