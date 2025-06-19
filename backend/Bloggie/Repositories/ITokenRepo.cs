using Microsoft.AspNetCore.Identity;

namespace Bloggie.Repositories;

public interface ITokenRepo
{
    string CreateJwtToken(IdentityUser user, List<string> roles);
}