/**
 * ---------------------------------------------------------
 * @author Archie Disono
 *
 * @git https://github.com/disono/ASP.NET-Web-API-Template
 * @created 2017-06-11
 * @lincensed Apache 2.0
 * ---------------------------------------------------------
 */

var DSNApp = angular.module('DSNApp', ['ngRoute']);
var senderID = new Date() + Math.floor((Math.random() * 100000) + 1);
var socketURL = '';

// helpers
var DSNHelper = {
	// storage
	storage: function () {
		return {
			storage: function () {
				if (typeof (Storage) != "undefined") {
					return true;
				} else {
					console.error('No Local Storage.');
					return false;
				}
			},

			set: function (key, value) {
				if (this.storage()) {
					if (value != null && typeof value == 'object') {
						value = JSON.stringify(value);
					}

					localStorage.setItem(key, value);
				}
			},

			get: function (key, isObject) {
				if (this.storage()) {
					var item = localStorage.getItem(key);

					if (isObject && item) {
						item = JSON.parse(item);
					}

					return item;
				}

				return null;
			},

			remove: function (key) {
				if (this.storage()) {
					localStorage.removeItem(key);
				}
			},

			clear: function () {
				if (this.storage()) {
					localStorage.clear();
				}
			}
		};
	}
};

// configure our routes
DSNApp.config(function ($routeProvider, $httpProvider) {

	$routeProvider

		.when('/', {
			templateUrl: 'Pages/Loader.html',
			controller: 'loaderCtrl'
		})

		.when('/dashboard', {
			templateUrl: 'Pages/Admin/Dashboard.html',
			controller: 'dashboardCtrl'
		})

		.when('/login', {
			templateUrl: 'Pages/Authentication/Login.html',
			controller: 'loginCtrl'
		})

		.when('/user', {
			templateUrl: 'Pages/Admin/Users/UserList.html',
			controller: 'userCtrl'
		})

		.when('/user/create', {
			templateUrl: 'Pages/Admin/Users/UserCreate.html',
			controller: 'userCreateCtrl'
		})

		.when('/user/edit/:id', {
			templateUrl: 'Pages/Admin/Users/UserEdit.html',
			controller: 'userEditCtrl'
		})

		.when('/profile/general-settings', {
			templateUrl: 'Pages/Profile/GeneralSettings.html',
			controller: 'profileGeneralSettingsCtrl'
		})

		.when('/profile/password', {
			templateUrl: 'Pages/Profile/Password.html',
			controller: 'profilePasswordCtrl'
		})

		.otherwise({
			redirectTo: '/'
		});;
});

// https://www.hanselman.com/blog/HTTPPUTOrDELETENotAllowedUseXHTTPMethodOverrideForYourRESTServiceWithASPNETWebAPI.aspx
// models helper
DSNApp.service('DSNFetchData', function ($http, $q) {
	this.auth = function () {
		// get the auth user
		return DSNHelper.storage().get('DSNUser', true);
	}

	// get (Fetch)
	this.get = function (uri, params) {
		// authorization header
		var Authorization = "";
		if (this.auth()) {
			Authorization = 'Bearer ' + this.auth().access_token;
		}		

		return $http.get(uri, {
			params: params,
			headers: {
				"Authorization": Authorization
			}
		}).then(function (response) {
				console.log('GET: ' + JSON.stringify(response.data));
				return response.data;
			}, function (errResponse) {
				console.error('GET Error: ' + errResponse);
				return $q.reject(errResponse);
			});
	}

	// auth (Token)
	this.token = function (username, password) {
		return $http.post('Token',
			"username=" + encodeURIComponent(username) +
			"&password=" + encodeURIComponent(password) +
			"&grant_type=password", {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function (response) {
				console.log('POST: ' + JSON.stringify(response.data));
				return response.data;
			}, function (errResponse) {
				console.error('TOKEN Error: ' + errResponse);
				return $q.reject(errResponse);
			});
	}

	// post (Create)
	this.post = function (uri, params) {
		// authorization header
		var Authorization = "";
		if (this.auth()) {
			Authorization = 'Bearer ' + this.auth().access_token;
		}

		return $http.post(uri, params, {
			headers: {
				"Authorization": Authorization
			}
		}).then(function (response) {
				console.log('POST: ' + JSON.stringify(response.data));
				return response.data;
			}, function (errResponse) {
				console.error('POST Error: ' + errResponse);
				return $q.reject(errResponse);
			});
	}

	// put (Update)
	this.put = function (uri, params) {
		// authorization header
		var Authorization = "";
		if (this.auth()) {
			Authorization = 'Bearer ' + this.auth().access_token;
		}

		return $http.post(uri, params, {
			headers: {
				'X-HTTP-Method-Override': 'PUT',
				"Authorization": Authorization
			}
		}).then(function (response) {
				console.log('PUT: ' + JSON.stringify(response.data));
				return response.data;
			}, function (errResponse) {
				console.error('PUT Error: ' + errResponse);
				return $q.reject(errResponse);
			});
	}

	// delete (Destroy)
	this.delete = function (uri) {
		// authorization header
		var Authorization = "";
		if (this.auth()) {
			Authorization = 'Bearer ' + this.auth().access_token;
		}
		
		return $http.post(uri, null, {
			headers: {
				'X-HTTP-Method-Override': 'DELETE',
				"Authorization": Authorization
			}
		}).then(function (response) {
				console.log('DELETE: ' + JSON.stringify(response.data));
				return response.data;
			}, function (errResponse) {
				console.error('DELETE Error: ' + errResponse);
				return $q.reject(errResponse);
			});
	}

	// interval fetch
	this.intervalFetch = function (callback) {
		if (openInterval) {
			setInterval(function () {
				callback();
			}, intervalTimeout);
		}
	}

	// connect to socket
	this.socket = null
	this.socketConnected = false
	this.markerID = null;
	this.connectSocket = function (callback) {
		var thisApp = this;

		// do not continue if not set
		if (!socketURL) {
			return;
		}

		// connect
		thisApp.socket = io(socketURL);

		// if connected
		thisApp.socket.on('connect', function () {
			// socket connected
			console.log('Socket Connected.');
			thisApp.socketConnected = true;

			thisApp.socket.on('notifyClient', function (data) {
				console.log('Recieved Data: ' + data);

				// do not accept similar marker id
				if (data.senderID == senderID || thisApp.markerID == data.markerID) {
					console.error('Similar ID: ' + data.markerID);
					return;
				}

				thisApp.markerID = data.markerID;
				console.log('Recieved Data Accepted.');
				callback(data);
			});
		});

		// if disconnected
		thisApp.socket.on('disconnect', function () {
			console.log('Disconnected to server.');

			// when disconnected reconnect to socket
			window.setTimeout(function () {
				thisApp.connectSocket(callback);
			}, 5000);
		});
	}

	// send data to socket
	this.sendSocket = function (data) {
		if (!this.socket || !this.socketConnected) {
			console.log('Unable to send data, null.');
			return;
		}

		data.senderID = senderID;
		data.markerID = moment().unix() + '-' + Math.floor((Math.random() * 10000) + 1) + '-' + Math.floor((Math.random() * 10000) + 1);
		this.socket.emit('notifyServer', data);
	}
});
