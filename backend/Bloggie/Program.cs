using System.Text;
using Bloggie.Data;
using Bloggie.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Microsoft.Extensions.Diagnostics.HealthChecks;

var applicationUpTime = DateTime.UtcNow;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("Logs/log.txt", rollingInterval: RollingInterval.Day)
    .Enrich.FromLogContext()
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();
builder.Services.AddDbContext<BloggieDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("BloggieConnectionString")));

builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<ITagRepo, TagRepo>();
builder.Services.AddScoped<IBlogPostRepo, BlogPostRepo>();
builder.Services.AddScoped<ICommentRepo, CommentRepo>();
builder.Services.AddScoped<ITokenRepo, TokenRepo>();
builder.Services.AddScoped<ICdnRepo, CdnRepo>();
builder.Services.AddScoped<IBlogPostReactionRepo, BlogPostReactionRepo>();
builder.Services.AddScoped<IUserRepo, UserRepo>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = JwtBearerDefaults.AuthenticationScheme
                },
                Scheme = "OAuth2",
                Name = JwtBearerDefaults.AuthenticationScheme,
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
    policy =>
    {
        policy.AllowAnyMethod();
        policy.AllowAnyHeader();

        if (builder.Configuration.GetSection("AllowedAnyOrigin").Get<bool>())
            policy.AllowAnyOrigin();
        else
            policy.WithOrigins(builder.Configuration.GetSection("AllowedOrigin").Get<string[]>() ?? []);
    }
    );
});

builder.Services.AddIdentityCore<IdentityUser>()
    .AddRoles<IdentityRole>()
    .AddTokenProvider<DataProtectorTokenProvider<IdentityUser>>("CollegeApp")
    .AddEntityFrameworkStores<BloggieDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Receiver"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    }
    );

builder.Services.AddHealthChecks()
    .AddDbContextCheck<BloggieDbContext>(
        name: "EF Core Database",
        failureStatus: HealthStatus.Unhealthy,
        tags: new[] { "db", "ef" });

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowReact");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseHttpsRedirection();
app.MapHealthChecks("/health");
app.MapGet("/", () => $"Application uptime : {applicationUpTime.ToString("O")}");

// so that folder is serve via Http server also
AddStaticFiles(builder, app, "cdn", null);
AddStaticFiles(builder, app, "Logs", "/logs");

app.Run();

static void AddStaticFiles(IHostApplicationBuilder builder, IApplicationBuilder app, string path, string? requestPath)
{
    var dir = Path.Combine(builder.Environment.ContentRootPath, path);
    if (!Directory.Exists(dir))
    {
        Directory.CreateDirectory(dir);
    }
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(
            Path.Combine(builder.Environment.ContentRootPath, path)),
        RequestPath = requestPath ?? string.Empty
    });
}