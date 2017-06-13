using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using System.Threading.Tasks;
using System.Threading;

namespace Web_API_Template
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
		{
			// Web API configuration and services
			// Configure Web API to use only bearer token authentication.
			config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

			// Web API routes
			config.MapHttpAttributeRoutes();

			// JSON formatter
			config.Formatters.Remove(GlobalConfiguration.Configuration.Formatters.XmlFormatter);
			config.Formatters.Add(GlobalConfiguration.Configuration.Formatters.JsonFormatter);

			// Override DELETE, HEAD and PUT
			config.MessageHandlers.Add(new MethodOverrideHandler());

			config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
	
	public class MethodOverrideHandler : DelegatingHandler
	{
		readonly string[] _methods = { "DELETE", "HEAD", "PUT" };
		const string _header = "X-HTTP-Method-Override";

		protected override Task<HttpResponseMessage> SendAsync(
			HttpRequestMessage request, CancellationToken cancellationToken)
		{
			// Check for HTTP POST with the X-HTTP-Method-Override header.
			if (request.Method == HttpMethod.Post && request.Headers.Contains(_header))
			{
				// Check if the header value is in our methods list.
				var method = request.Headers.GetValues(_header).FirstOrDefault();
				if (_methods.Contains(method, StringComparer.InvariantCultureIgnoreCase))
				{
					// Change the request method.
					request.Method = new HttpMethod(method);
				}
			}

			return base.SendAsync(request, cancellationToken);
		}
	}
}
