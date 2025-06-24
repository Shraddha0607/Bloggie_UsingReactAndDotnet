using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bloggie.Migrations
{
    /// <inheritdoc />
    public partial class correctshortDescriptionvariablename : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ShortDiscription",
                table: "BlogPosts",
                newName: "ShortDescription");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ShortDescription",
                table: "BlogPosts",
                newName: "ShortDiscription");
        }
    }
}
