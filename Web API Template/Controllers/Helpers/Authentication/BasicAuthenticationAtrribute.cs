/// @author Archie Disono
///
/// @git https://github.com/disono/ASP.NET-Web-API-Template
/// @created 2017-06-11
/// @lincensed Apache 2.0

using System;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Web_API_Template.Controllers.Helpers.Authentication
{
	public class BasicAuthenticationAtrribute : AuthorizationFilterAttribute
	{
		public override void OnAuthorization(HttpActionContext actionContext)
		{
			if (actionContext.Request.Headers.Authorization == null)
			{
				actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
			}
			else
			{
				string authenticationToken = actionContext.Request.Headers.Authorization.Parameter;
				string decodeAuthenticationToken = Encoding.UTF8.GetString(Convert.FromBase64String(authenticationToken));
				string[] usernamePassword = decodeAuthenticationToken.Split(':');
				string username = usernamePassword[0];
				string password = usernamePassword[1];

				if (BasicAuth.Login(username, password))
				{
					Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(username), null);
				}
				else
				{
					actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
				}
			}
		}
	}
}