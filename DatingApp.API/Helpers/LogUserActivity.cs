using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DatingApp.API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // execute any code before the action executes

            var resultContext = await next();

            // execute any code after the action executes

            var userId = int.Parse(resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var repo = (IDatingRepository)resultContext.HttpContext.RequestServices.GetService(typeof(IDatingRepository));

            var user = await repo.GetUser(userId);
            user.LastActive = DateTime.Now;
            await repo.SaveAll();
        }
    }
}