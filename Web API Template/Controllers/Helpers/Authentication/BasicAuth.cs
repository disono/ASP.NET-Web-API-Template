/// @author Archie Disono
///
/// @git https://github.com/disono/ASP.NET-Web-API-Template
/// @created 2017-06-11
/// @lincensed Apache 2.0

using System;
using System.Linq;
using Web_API_Template.Models;

namespace Web_API_Template.Controllers.Helpers.Authentication
{
	public class BasicAuth
	{
		public static bool Login(string username, string password)
		{
			using (DBEntities entities = new DBEntities())
			{
				// this thing will MIGHT not work
				// password must nut hash
				return entities.AspNetUsers.Any(user => user.UserName.Equals(username,
					StringComparison.OrdinalIgnoreCase) && user.PasswordHash == password);
			}
		}
	}
}