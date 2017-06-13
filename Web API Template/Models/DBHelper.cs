/// @author Archie Disono
///
/// @git https://github.com/disono/ASP.NET-Web-API-Template
/// @created 2017-06-11
/// @lincensed Apache 2.0

using Oracle.ManagedDataAccess.Client;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace Web_API_Template.Models
{
	public class DBHelper
	{
		private IDbConnection dbSQL = null;
		private OracleConnection dbOracle = null;

		// DBConnection
		private string connectionString = "DBConnection";

		// sql or oracle
		public string connectionType = "sql";

		public DBHelper()
		{
			if (connectionType == "sql")
			{
				dbSQL = new SqlConnection(ConfigurationManager.ConnectionStrings[connectionString].ConnectionString);
			} else if (connectionType == "oracle")
			{
				dbOracle = new OracleConnection(ConfigurationManager.ConnectionStrings[connectionString].ConnectionString);
			}
		}

		public IDbConnection dbSQLCon()
		{
			return dbSQL;
		}

		public OracleConnection dbOracleCon()
		{
			return dbOracle;
		}
	}
}