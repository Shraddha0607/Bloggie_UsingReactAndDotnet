using Bloggie.Models.DomainModel;
using Microsoft.EntityFrameworkCore;


namespace Bloggie.Data;

public class BloggieDbContext : DbContext
{
    public BloggieDbContext(DbContextOptions<BloggieDbContext> options) : base(options)
    {

    }

    public DbSet<Tag> Tags { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<BlogPost> BlogPost { get; set; }
}