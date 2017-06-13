/**
 * ---------------------------------------------------------
 * @author Archie Disono
 *
 * @git https://github.com/disono/ASP.NET-Web-API-Template
 * @created 2017-06-11
 * @lincensed Apache 2.0
 * ---------------------------------------------------------
 */

DSNApp.service('DSNAuthService', function (DSNFetchData, AspNetUsersService) {
	// create or register new user
	this.register = function (params) {
		return DSNFetchData.post('api/Account/Register', params);
	}

	// update user details
	// api/AspNetUsers/id
	this.update = function (id, params) {
		return DSNFetchData.put('api/AspNetUsers/' + id, params);
	}

	// change password
	this.changePassword = function (params) {
		return DSNFetchData.post('api/Account/ChangePassword', params);
	}

	// delete user
	// DELETE: api/AspNetUsers/id
	this.delete = function (id) {
		return DSNFetchData.delete('api/AspNetUsers/' + id);
	}

	// authenticate / login
	this.login = function (username, password) {
		return DSNFetchData.token(username, password).then(function (loginResponse) {
			// let's save the token
			DSNHelper.storage().set('DSNUser', loginResponse);

			return AspNetUsersService.getByUsername(loginResponse.userName).then(function (userResponse) {
				// add user details
				loginResponse.details = userResponse;
				loginResponse.details.FullName = loginResponse.details.FirstName + ' ' + loginResponse.details.LastName;

				// save
				DSNHelper.storage().set('DSNUser', loginResponse);
				return loginResponse;
			});
		});
	}

	// check
	this.check = function () {
		var DSNUser = DSNHelper.storage().get('DSNUser', true);
		return (DSNUser) ? true : false;
	}

	// user details
	this.user = function () {
		var authUser = DSNHelper.storage().get('DSNUser', true);
		authUser.FullName = authUser.FirstName + ' ' + authUser.LastName;

		return authUser;
	}

	// logout
	this.logout = function () {
		DSNHelper.storage().remove('DSNUser');
		DSNHelper.storage().clear();
	}
});

DSNApp.service('DSNValuesService', function (DSNFetchData) {
	this.list = function (params) {
		return DSNFetchData.get('api/Values', params);
	}
});

DSNApp.service('AspNetUsersService', function (DSNFetchData) {
	// api/AspNetUsers
	this.list = function (params) {
		return DSNFetchData.get('api/AspNetUsers', params);
	}

	// api/AspNetUsers/UserName?username=username@domain.com
	this.getByUsername = function (username) {
		return DSNFetchData.get('api/AspNetUsers/UserName', {
			username: username
		});
	}

	// get the user details
	this.get = function (id) {
		return DSNFetchData.get('api/AspNetUsers/' + id, null);
	}
});