using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using WinBlog.Api;
using WinBlog.Api.Authorization;
using WinBlog.Api.Filters;
using WinBlog.Api.Services;
using WinBlog.Core.ConfigOptions;
using WinBlog.Core.Domain.Identity;
using WinBlog.Core.Models.Content;
using WinBlog.Core.SeedWorks;
using WinBlog.Data;
using WinBlog.Data.Repositories;
using WinBlog.Data.SeedWorks;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var connectionString = configuration.GetConnectionString("DefaultConnection");
var WinCorsPolicy = "WinCorsPolicy";
builder.Services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
builder.Services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
builder.Services.AddCors(o => o.AddPolicy(WinCorsPolicy, builder =>
{
    builder.AllowAnyMethod()
        .AllowAnyHeader()
        .WithOrigins(configuration["AllowedOrigins"])
        .AllowCredentials();
}));
// Add services to the container.
builder.Services.AddScoped(typeof(IRepository<,>), typeof(RepositoryBase<,>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Business services and repositories
var services = typeof(PostRepository).Assembly.GetTypes()
    .Where(x => x.GetInterfaces().Any(i => i.Name == typeof(IRepository<,>).Name)
    && !x.IsAbstract && x.IsClass && !x.IsGenericType);

foreach (var service in services)
{
    var allInterfaces = service.GetInterfaces();
    var directInterface = allInterfaces.Except(allInterfaces.SelectMany(t => t.GetInterfaces())).FirstOrDefault();
    if (directInterface != null)
    {
        builder.Services.Add(new ServiceDescriptor(directInterface, service, ServiceLifetime.Scoped));
    }
}

//Config DB Context and ASP.NET Core Identity
builder.Services.AddDbContext<WinBlogContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddIdentity<AppUser, AppRole>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddEntityFrameworkStores<WinBlogContext>();

builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings.
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;

    // Lockout settings.
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings.
    options.User.AllowedUserNameCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    options.User.RequireUniqueEmail = false;
});

builder.Services.AddAutoMapper(typeof(PostInListDto));

//Authen and author
builder.Services.Configure<JwtTokenSettings>(configuration.GetSection("JwtTokenSettings"));
builder.Services.AddScoped<SignInManager<AppUser>, SignInManager<AppUser>>();
builder.Services.AddScoped<UserManager<AppUser>, UserManager<AppUser>>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<RoleManager<AppRole>, RoleManager<AppRole>>();

//Default config for ASP.NET Core
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.CustomOperationIds(apiDesc =>
    {
        return apiDesc.TryGetMethodInfo(out MethodInfo methodInfo) ? methodInfo.Name : null;
    });
    c.SwaggerDoc("AdminAPI", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Version = "v1",
        Title = "API for Administrators",
        Description = "API for CMS core domain. This domain keeps track of campaigns, campaign rules, and campaign execution."
    });
    c.ParameterFilter<SwaggerNullableParameterFilter>();
    var used = new Dictionary<string, Type>(StringComparer.Ordinal);

    c.CustomSchemaIds(type =>
    {
        string PrettyName(Type t)
        {
            if (t.IsGenericType)
            {
                var root = t.Name.Split('`')[0]; // PagedResult
                var args = t.GetGenericArguments().Select(PrettyName);
                // RoleDtoPagedResult (đổi thành PagedResultOfRoleDto nếu thích)
                return string.Join("", args) + root;
            }
            return t.Name;
        }

        string baseName = PrettyName(type);

        // Chưa dùng -> dùng luôn tên “đẹp”
        if (!used.ContainsKey(baseName))
        {
            used[baseName] = type;
            return baseName;
        }

        // Nếu trùng nhưng là cùng type → trả về cùng tên (idempotent)
        if (used[baseName] == type)
            return baseName;

        // Thêm hậu tố namespace cuối
        var nsTail = type.Namespace?.Split('.').LastOrDefault();
        var candidate = string.IsNullOrEmpty(nsTail) ? baseName : $"{baseName}_{nsTail}";
        if (!used.ContainsKey(candidate))
        {
            used[candidate] = type;
            return candidate;
        }

        // Fallback: thêm hash 8 ký tự từ FullName để đảm bảo duy nhất và ổn định
        static string ShortHash(string? s)
        {
            if (string.IsNullOrEmpty(s)) return "x";
            using var sha1 = SHA1.Create();
            var bytes = sha1.ComputeHash(Encoding.UTF8.GetBytes(s));
            return Convert.ToHexString(bytes, 0, 4).ToLower(); // 8 hex chars
        }

        var unique = $"{baseName}_{ShortHash(type.FullName)}";
        // Nếu vẫn trùng (rất khó), thêm cả counter
        var finalName = unique;
        int i = 1;
        while (used.ContainsKey(finalName)) finalName = $"{unique}_{i++}";

        used[finalName] = type;
        return finalName;
    });
});

builder.Services.AddAuthentication(o =>
{
    o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(cfg =>
{
    cfg.RequireHttpsMetadata = false;
    cfg.SaveToken = true;

    cfg.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = configuration["JwtTokenSettings:Issuer"],
        ValidAudience = configuration["JwtTokenSettings:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtTokenSettings:Key"]))
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("AdminAPI/swagger.json", "Admin API");
        c.DisplayOperationId();
        c.DisplayRequestDuration();
    });
}
app.UseCors(WinCorsPolicy);
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MigrateDatabase();
app.Run();
