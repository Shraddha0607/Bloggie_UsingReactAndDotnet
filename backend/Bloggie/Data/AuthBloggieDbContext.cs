using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Bloggie.Data
{
    public class AuthBloggieDbContext : IdentityDbContext
    {
        public AuthBloggieDbContext(DbContextOptions<AuthBloggieDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var userRoleId = "9e57ac33-93e9-45b2-bb96-49bf6b08ffdf";
            var adminRoleId = "5b1a041c-3596-478d-b78b-3388c23b03bb";
           

            var roles = new List<IdentityRole>
                {
                    new IdentityRole
                    {
                        Id = userRoleId,
                        ConcurrencyStamp = userRoleId,
                        Name = "User",
                        NormalizedName = "User".ToUpper()
                    },
                    new IdentityRole
                    {
                        Id = adminRoleId,
                        ConcurrencyStamp = adminRoleId,
                        Name = "Admin",
                        NormalizedName = "Admin".ToUpper()
                    }
                };

            builder.Entity<IdentityRole>().HasData(roles);
        }
    }
}