using Bloggie.Models.Dtos.ResponseModels;
using CollegeApp.Models.Dtos.AuthDtos;

public interface IUserRepo
{
    Task<List<UserResponse>> GetAllAsync();
    Task<UserResponse> GetByIdAsync(string id);
    Task<MessageResponse> DeleteByIdAsync(string id);
    Task<MessageResponse> UpdateByIdAsync(RegisterRequestDto userReqeust, string id);
}