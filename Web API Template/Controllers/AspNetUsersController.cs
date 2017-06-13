using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using Web_API_Template.Models;

namespace Web_API_Template.Controllers
{
	[Authorize]
    public class AspNetUsersController : ApiController
    {
        private DBEntities db = new DBEntities();

        // GET: api/AspNetUsers
        public IQueryable<AspNetUser> GetAspNetUsers()
        {
            return db.AspNetUsers;
        }

        // GET: api/AspNetUsers/5
        [ResponseType(typeof(AspNetUser))]
        public IHttpActionResult GetAspNetUser(string id)
        {
            AspNetUser aspNetUser = db.AspNetUsers.Find(id);
            if (aspNetUser == null)
            {
                return NotFound();
            }

            return Ok(aspNetUser);
        }

		// GET: api/AspNetUsers/UserName?username=username@domain.com
		[Route("api/AspNetUsers/UserName")]
		[HttpGet]
		public IHttpActionResult UserNameAspNetUser(string username)
		{
			var aspNetUser = db.AspNetUsers.SingleOrDefault(u => u.UserName == username);
			if (aspNetUser == null)
			{
				return NotFound();
			}

			// remove the password
			aspNetUser.PasswordHash = null;
			return Ok(aspNetUser);
		}
		
		// PUT: api/AspNetUsers/5
		[ResponseType(typeof(void))]
        public IHttpActionResult PutAspNetUser(string id, UserEditModel aspNetUser)
        {
			if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

			// check if user exists
            if (id != aspNetUser.Id)
            {
                return BadRequest();
            }

			string userID = aspNetUser.Id;
			AspNetUser currentUser = db.AspNetUsers.Where(u => u.Id == userID).FirstOrDefault<AspNetUser>();
			currentUser.FirstName = aspNetUser.FirstName;
			currentUser.LastName = aspNetUser.LastName;
			currentUser.HomeAddress = aspNetUser.HomeAddress;
			currentUser.BirthDate = aspNetUser.BirthDate;
			currentUser.PhoneNumber = aspNetUser.PhoneNumber;
			currentUser.Gender = aspNetUser.Gender;
			currentUser.UpdatedAt = System.DateTime.Now;

			if (aspNetUser.Role != null && aspNetUser.Role != "")
			{
				currentUser.Role = aspNetUser.Role;
			}

			db.Entry(currentUser).State = EntityState.Modified;

			try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
			{
				throw;
			}

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/AspNetUsers
        [ResponseType(typeof(AspNetUser))]
        public IHttpActionResult PostAspNetUser(AspNetUser aspNetUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.AspNetUsers.Add(aspNetUser);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (AspNetUserExists(aspNetUser.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = aspNetUser.Id }, aspNetUser);
        }

        // DELETE: api/AspNetUsers/5
        [ResponseType(typeof(AspNetUser))]
        public IHttpActionResult DeleteAspNetUser(string id)
        {
            AspNetUser aspNetUser = db.AspNetUsers.Find(id);
            if (aspNetUser == null)
            {
                return NotFound();
            }

            db.AspNetUsers.Remove(aspNetUser);
            db.SaveChanges();

            return Ok(aspNetUser);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AspNetUserExists(string id)
        {
            return db.AspNetUsers.Count(e => e.Id == id) > 0;
        }

		// if returns true username already exists
		// if not username is unique
		private bool AspNetUserUserNameUnique(string id, string username)
		{
			return db.AspNetUsers.Count(e => e.Id != id && e.UserName == username) > 0;
		}

	}
}