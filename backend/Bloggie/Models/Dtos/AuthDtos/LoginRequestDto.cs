using System.ComponentModel.DataAnnotations;

namespace Bloggie.Models.Dtos.AuthDtos;

public class LoginRequestDto
{
    [Required]
    [DataType(DataType.EmailAddress)]
    public string Email { get; set; }
    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }
}