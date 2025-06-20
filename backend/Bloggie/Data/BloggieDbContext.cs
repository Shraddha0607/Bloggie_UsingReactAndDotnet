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
    public DbSet<BlogPost> BlogPosts { get; set; }
    public DbSet<BlogPostReaction> BlogPostReactions { get; set; }

    // set unique key
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Tag>()
        .HasIndex(b => b.Name)
        .IsUnique();

        modelBuilder.Entity<BlogPostReaction>()
        .HasIndex(b => b.BlogPostId)
        .IsUnique();

        modelBuilder.Entity<BlogPostReaction>()
        .HasIndex(b => b.UserId)
        .IsUnique();

        modelBuilder.Entity<BlogPost>()
        .HasIndex(b => b.Heading)
        .IsUnique();

        modelBuilder.Entity<BlogPost>()
        .HasIndex(b => b.ImageUrl)
        .IsUnique();

        modelBuilder.Entity<Comment>()
        .HasIndex(b => b.PostId)
        .IsUnique();

        modelBuilder.Entity<Comment>()
        .HasIndex(b => b.UserId)
        .IsUnique();
    }

}