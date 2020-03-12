using System;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace DatingApp.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            using(var scope = host.Services.CreateScope()) // CreateScope -> using Microsoft.Extensions.DependencyInjection;
            {
                var services=scope.ServiceProvider;
                try
                {
                    var context=services.GetRequiredService<DataContext>();
                    context.Database.Migrate(); // Migrate() -> using Microsoft.EntityFrameworkCore;
                    Seed.SeedUsers(context);
                }
                catch(Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>(); // ILogger -> using Microsoft.Extensions.Logging;
                    logger.LogError(ex.Message);
                }
                host.Run();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
