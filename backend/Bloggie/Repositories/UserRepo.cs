using Bloggie.Data;
using Bloggie.Exceptions;
using Bloggie.Models.Dtos.ResponseModels;
using CollegeApp.Models.Dtos.AuthDtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class UserRepo : IUserRepo
{
    private readonly BloggieDbContext dbContext;
    private readonly UserManager<IdentityUser> userManager;
    public UserRepo(BloggieDbContext dbContext, UserManager<IdentityUser> userManager)
    {
        this.dbContext = dbContext;
        this.userManager = userManager;
    }

    public async Task<List<UserResponse>> GetAllAsync()
    {
        var users = await userManager.Users.ToListAsync();
        var UserResponses = new List<UserResponse>();

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);

            UserResponses.Add(new UserResponse
            {
                Id = user.Id,
                Email = user.Email ?? "",
                UserName = user.UserName ?? "",
                Roles = roles.ToList()
            });
        }

        return UserResponses;
    }

    public async Task<MessageResponse> DeleteByIdAsync(string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user is null)
        {
            throw new CustomException("Invalid id!");
        }

        var result = await userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            throw new CustomException("Deletion failed!");
        }

        return new MessageResponse { Message = "User deleted successfully." };
    }

    public async Task<UserResponse> GetByIdAsync(string id)
    {
        var user = await userManager.FindByIdAsync(id);

        if (user is null)
        {
            throw new CustomException("Invalid id!");
        }

        var roles = await userManager.GetRolesAsync(user);

        return new UserResponse
        {
            Id = user.Id,
            Email = user.Email ?? "",
            UserName = user.UserName ?? "",
            Roles = roles.ToList()
        };
    }

    public async Task<MessageResponse> UpdateByIdAsync(RegisterRequestDto userRequest, string id)
    {
        var user = await userManager.FindByIdAsync(id);

        if (user is null)
        {
            throw new CustomException("Invalid user id!");
        }

        user.UserName = userRequest.Username;
        user.Email = userRequest.Email;

        if (!string.IsNullOrWhiteSpace(userRequest.Password))
        {
            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var result = await userManager.ResetPasswordAsync(user, token, userRequest.Password);

            if (!result.Succeeded)
            {
                return new MessageResponse { Message = "Failed to update password." };
            }
        }

        if (userRequest.Roles != null && userRequest.Roles.Any())
        {
            var currentRoles = await userManager.GetRolesAsync(user);

            var rolesToRemove = currentRoles.Except(userRequest.Roles).ToList();
            if (rolesToRemove.Any())
            {
                var removeRolesResult = await userManager.RemoveFromRolesAsync(user, rolesToRemove);
                if (!removeRolesResult.Succeeded)
                {
                    return new MessageResponse { Message = "Failed to remove old roles." };
                }

            }

            var rolesToAdd = userRequest.Roles.Except(currentRoles).ToList();

            if (rolesToAdd.Any())
            {
                var addRolesResult = await userManager.AddToRolesAsync(user, rolesToAdd);
                if (!addRolesResult.Succeeded)
                {
                    return new MessageResponse { Message = "Failed to add new roles." };
                }
            }

        }

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            return new MessageResponse { Message = "Failed to update user details." };
        }

        return new MessageResponse { Message = "User updated successfully!" };

    }
}