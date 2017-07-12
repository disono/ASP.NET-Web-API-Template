/// @author Archie Disono
///
/// @git https://github.com/disono/ASP.NET-Web-API-Template
/// @created 2017-06-11
/// @lincensed Apache 2.0

using Dapper;
using Oracle.ManagedDataAccess.Client;
using System.Collections.Generic;
using System.Linq;

namespace Web_API_Template.Models
{
	public class UserModel
	{
		private string ColumnName = "AspNetUsers";
		private OracleConnection db;

		public UserModel()
		{
			db = new DBHelper().dbOracleCon();
		}

		public List<AspNetUser> query()
		{
			string SQLString = "SELECT * FROM " + ColumnName;
			return db.Query<AspNetUser>(SQLString).ToList();
		}

		public List<AspNetUser> username(string username)
		{
			string SQLString = "SELECT * FROM " + ColumnName + "WHERE UserName = '" + username + "'";
			return db.Query<AspNetUser>(SQLString).ToList();
		}
	}
}