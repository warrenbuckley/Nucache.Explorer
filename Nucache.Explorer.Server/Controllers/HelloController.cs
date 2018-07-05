using System.Web.Http;

namespace Nucache.Explorer.Server.Controllers
{
    public class HelloController : ApiController
    {
        public string GetPing()
        {
            return "Pong";
        }
    }
}
