namespace Web_API_Template.Models
{
	public partial class UserEditModel
	{
		public string Id { get; set; }
		public System.DateTime BirthDate { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string MiddleName { get; set; }
		public string HomeAddress { get; set; }
		public string AboutMe { get; set; }
		public string Role { get; set; }
		public string Email { get; set; }
		public string PhoneNumber { get; set; }
		public string Gender { get; set; }
		public System.DateTime UpdatedAt { get; set; }
	}
}