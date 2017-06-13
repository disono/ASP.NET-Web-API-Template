using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using FluentValidation;
using System.Linq;

namespace Web_API_Template.Models
{
    // Models used as parameters to AccountController actions.

    public class AddExternalLoginBindingModel
    {
        [Required]
        [Display(Name = "External access token")]
        public string ExternalAccessToken { get; set; }
    }

    public class ChangePasswordBindingModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Current password")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm new password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class RegisterBindingModel
    {
        [Required]
        [Display(Name = "UserName")]
        public string UserName { get; set; }

		[Required]
		[Display(Name = "FirstName")]
		public string FirstName { get; set; }

		[Required]
		[Display(Name = "LastName")]
		public string LastName { get; set; }

		[Required]
		[Display(Name = "HomeAddress")]
		public string HomeAddress { get; set; }
		
		[Display(Name = "PhoneNumber")]
		public string PhoneNumber { get; set; }

		[Display(Name = "Role")]
		public string Role { get; set; }

		[Required]
		[Display(Name = "Gender")]
		public string Gender { get; set; }

		[Required]
		[Display(Name = "BirthDate")]
		[DataType(DataType.Date)]
		public DateTime BirthDate { get; set; }

		[Display(Name = "CreatedAt")]
		[DataType(DataType.DateTime)]
		public DateTime CreatedAt { get; set; }

		[Display(Name = "UpdatedAt")]
		[DataType(DataType.DateTime)]
		public DateTime UpdatedAt { get; set; }

		[Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

		public class RegisterValidator : AbstractValidator<RegisterBindingModel>
		{
			public RegisterValidator()
			{
				RuleFor(user => user.UserName).NotEmpty().Must(UniqueUsername).WithMessage("This username already exists.");
			}

			private bool UniqueUsername(string username)
			{
				DBEntities _db = new DBEntities();
				var query = _db.AspNetUsers
					.Where(x => x.UserName == username)
					.SingleOrDefault();

				if (query == null) {
					return true;
				}
				
				return false;
			}
		}
	}

    public class RegisterExternalBindingModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class RemoveLoginBindingModel
    {
        [Required]
        [Display(Name = "Login provider")]
        public string LoginProvider { get; set; }

        [Required]
        [Display(Name = "Provider key")]
        public string ProviderKey { get; set; }
    }

    public class SetPasswordBindingModel
    {
        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm new password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
}
