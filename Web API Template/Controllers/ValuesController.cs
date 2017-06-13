using System.Web.Http;
using Web_API_Template.Models;

namespace Web_API_Template.Controllers
{
    public class ValuesController : ApiController
    {
        // GET api/values
		[Authorize]
        public IHttpActionResult Get()
        {
			return Ok(new UserModel().query());
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
