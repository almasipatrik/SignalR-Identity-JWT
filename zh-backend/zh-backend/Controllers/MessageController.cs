using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using zh_backend.Data;
using zh_backend.Hubs;
using zh_backend.Models;

namespace zh_backend.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly IConfiguration configuration;
        private readonly ApplicationDbContext context;
        private readonly IHubContext<ChatHub> hub;

        public MessageController(UserManager<IdentityUser> userManager, IConfiguration configuration, ApplicationDbContext context, IHubContext<ChatHub> hub)
        {
            this.userManager = userManager;
            this.configuration = configuration;
            this.context = context;
            this.hub = hub;
        }


        // GET api/ticket
        [HttpGet]
        public ActionResult<IEnumerable<Message>> GetAll()
        {
            return context.Messages.OrderBy(x=> x.Date).ToList();
        }

        // GET api/ticket/5HFG6
        [HttpGet("{id}")]
        public ActionResult<Message> Get(string id)
        {
            return context.Messages.FirstOrDefault(t => t.UID == id);
        }


        // POST api/ticket
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Message value)
        {
            var userName = User.Claims.First(i => i.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;
            var sender = this.context.Users.FirstOrDefault(x => x.UserName == userName);

            value.UID = Guid.NewGuid().ToString();
            value.Date = DateTime.Now;
            value.Sender = sender.Email;

            context.Messages.Add(value);
            context.SaveChanges();

            await hub.Clients.All.SendAsync("NewMessage", value);
            return Ok();

        }

        // PUT api/ticket/5HFG6
        [HttpPut("{id}")]
        public void Put(string id, [FromBody] Message value)
        {
            var old = context.Messages.FirstOrDefault(t => t.UID == id);
            value.UID = id;
            context.Remove(old);
            context.Add(value);
            context.SaveChanges();
        }

        // DELETE api/ticket/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            var old = context.Messages.FirstOrDefault(t => t.UID == id);
            context.Remove(old);
            context.SaveChanges();
        }
    }
}