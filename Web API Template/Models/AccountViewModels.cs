using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Web_API_Template.Models
{
	// Models returned by AccountController actions.

	public class ExternalLoginViewModel
	{
		public string Name { get; set; }

		public string Url { get; set; }

		public string State { get; set; }
	}

	public class ManageInfoViewModel
	{
		public string LocalLoginProvider { get; set; }

		public string Email { get; set; }

		public IEnumerable<UserLoginInfoViewModel> Logins { get; set; }

		public IEnumerable<ExternalLoginViewModel> ExternalLoginProviders { get; set; }
	}

	public class UserInfoViewModel
	{
		public string Email { get; set; }

		public bool HasRegistered { get; set; }

		public string LoginProvider { get; set; }
	}

	public class UserLoginInfoViewModel
	{
		public string LoginProvider { get; set; }

		public string ProviderKey { get; set; }
	}

	// custom add this for register
	public class RegisterViewModel
	{
		public string UserName { get; set; }

		public string Password { get; set; }

		public string ConfirmPassword { get; set; }

		public DateTime BirthDate { get; set; }

		public string FirstName { get; set; }

		public string LastName { get; set; }

		public string HomeAddress { get; set; }
	}
}
