using Bloggie.Models.DomainModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace Bloggie.Data;

public class BloggieDbContext : IdentityDbContext
{
    public BloggieDbContext(DbContextOptions<BloggieDbContext> options) : base(options)
    {

    }

    public DbSet<Tag> Tags { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<BlogPost> BlogPosts { get; set; }
    public DbSet<BlogPostReaction> BlogPostReactions { get; set; }

    // set unique key
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<Tag>()
        .HasIndex(b => b.Name)
        .IsUnique();

        modelBuilder.Entity<BlogPostReaction>()
        .HasIndex(b => new { b.BlogPostId, b.UserId })
        .IsUnique();

        modelBuilder.Entity<BlogPost>()
        .HasIndex(b => b.Heading)
        .IsUnique();

        modelBuilder.Entity<BlogPost>()
        .HasIndex(b => b.UrlHandler)
        .IsUnique();

        modelBuilder.Entity<Comment>()
        .HasIndex(b => b.PostId)
        .IsUnique();

        modelBuilder.Entity<Comment>()
        .HasIndex(b => b.UserId)
        .IsUnique();

        modelBuilder.Entity<BlogPost>()
            .HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<BlogPostReaction>()
            .HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

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

        modelBuilder.Entity<IdentityRole>().HasData(roles);

        base.OnModelCreating(modelBuilder);

    }

}