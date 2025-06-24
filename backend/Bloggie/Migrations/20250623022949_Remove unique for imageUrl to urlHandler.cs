using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bloggie.Migrations
{
    /// <inheritdoc />
    public partial class RemoveuniqueforimageUrltourlHandler : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_BlogPosts_ImageUrl",
                table: "BlogPosts");

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_UrlHandler",
                table: "BlogPosts",
                column: "UrlHandler",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_BlogPosts_UrlHandler",
                table: "BlogPosts");

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_ImageUrl",
                table: "BlogPosts",
                column: "ImageUrl",
                unique: true);
        }
    }
}
