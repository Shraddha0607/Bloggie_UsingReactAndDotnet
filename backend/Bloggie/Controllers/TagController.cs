using Microsoft.AspNetCore.Mvc;

namespace Bloggie.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TagController : ControllerBase
    {


        [HttpGet]
        public string getTag()
        {
            return "I am tag";
        }
    }
}