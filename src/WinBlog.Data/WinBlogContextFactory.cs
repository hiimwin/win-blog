using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WinBlog.Data
{
    public class WinBlogContextFactory : IDesignTimeDbContextFactory<WinBlogContext>
    {
        public WinBlogContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                 .SetBasePath(Directory.GetCurrentDirectory())
                 .AddJsonFile("appsettings.json")
                 .Build();
            var builder = new DbContextOptionsBuilder<WinBlogContext>();
            builder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            return new WinBlogContext(builder.Options);
        }
    }
}
