using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bloggie.Migrations
{
    /// <inheritdoc />
    public partial class addthecompositekeyforBlogPostReaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_BlogPostReactions_BlogPostId",
                table: "BlogPostReactions");

            migrationBuilder.DropIndex(
                name: "IX_BlogPostReactions_UserId",
                table: "BlogPostReactions");

            migrationBuilder.CreateIndex(
                name: "IX_BlogPostReactions_BlogPostId_UserId",
                table: "BlogPostReactions",
                columns: new[] { "BlogPostId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BlogPostReactions_UserId",
                table: "BlogPostReactions",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_BlogPostReactions_BlogPostId_UserId",
                table: "BlogPostReactions");

            migrationBuilder.DropIndex(
                name: "IX_BlogPostReactions_UserId",
                table: "BlogPostReactions");

            migrationBuilder.CreateIndex(
                name: "IX_BlogPostReactions_BlogPostId",
                table: "BlogPostReactions",
                column: "BlogPostId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BlogPostReactions_UserId",
                table: "BlogPostReactions",
                column: "UserId",
                unique: true);
        }
    }
}
