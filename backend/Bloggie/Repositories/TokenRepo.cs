using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace Bloggie.Repositories
{
    public class TokenRepo : ITokenRepo
    {
        private readonly IConfiguration configuration;
        public TokenRepo(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public string CreateJwtToken(IdentityUser user, List<string> roles)
        {
            var claims = new List<Claim>();
            claims.Add(new Claim (ClaimTypes.Email, user.Email));

            foreach(var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                configuration["Jwt:Issuer"],
                configuration["Jwt:Receiver"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}