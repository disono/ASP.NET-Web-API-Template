/**
 * ---------------------------------------------------------
 * @author Archie Disono
 *
 * @git https://github.com/disono/ASP.NET-Web-API-Template
 * @created 2017-06-11
 * @lincensed Apache 2.0
 * ---------------------------------------------------------
 */

/**
 * ---------------------------------------------------------
 * loaderCtrl
 * ---------------------------------------------------------
 */
DSNApp.controller('loaderCtrl', function ($scope, $rootScope, $location, $timeout, DSNAuthService) {
	$rootScope.authRoot = DSNAuthService;
	$rootScope.fromDate = moment().format('YYYY-MM-DD');
	$rootScope.toDate = moment().format('YYYY-MM-DD');

	// let's remove the main loader
	$('#mainLoader').remove();

	$rootScope.jsLoader = function () {
		$timeout(function () {
			$('.date_picker').datepicker();
		}, 300);
	};

	// check if login
	// if not redirect to login page
	$rootScope.isAuthenticated = function (uri) {
		if (!$rootScope.authRoot.check()) {
			$location.url('/login');
		} else {
			if ($location.path() != '/dashboard') {
				$location.url(uri);
			} else {
				$location.url('/dashboard');
			}
		}

		$rootScope.jsLoader();
	};

	// sign out
	$rootScope.signOut = function () {
		DSNAuthService.logout();
		$location.url('/login');
	};

	// check for authentication
	if ($location.path() == '' || $location.path() == '/' || !$location.path() || $location.path() == null) {
		$rootScope.isAuthenticated('/dashboard');
	}
});

/**
 * ---------------------------------------------------------
 * loginCtrl
 * ---------------------------------------------------------
 */
DSNApp.controller('loginCtrl', function ($scope, $location, DSNAuthService) {
	$scope.inputs = {
		username: null,
		password: null
	};

	// register
	DSNAuthService.register({
		UserName: 'admin@gmail.com',
		Password: 'WoW101X!',
		ConfirmPassword: 'WoW101X!',

		FirstName: 'Admin',
		LastName: 'User',
		Gender: 'Male',
		BirthDate: moment().format('LL'),
		HomeAddress: 'Home Address Demo',

		CreatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
		UpdatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
	}).then(function (response) {
		console.log(response);
	}, function (e) {
		console.log(JSON.stringify(e));
	});

	// login function
	$scope.login = function (inputs) {
		if (!inputs.username || !inputs.password) {
			return;
		}

		// login
		DSNAuthService.login(inputs.username, inputs.password).then(function (response) {
			if (response) {
				$location.url('/dashboard');
			}
		}, function (e) {
			console.log(JSON.stringify(e));
			swal("Oops...", "Username/Email and Password is invalid.", "error");
		});
	};
});

/**
 * ---------------------------------------------------------
 * registerCtrl
 * ---------------------------------------------------------
 */
DSNApp.controller('registerCtrl', function ($scope, $location, DSNAuthService) {
	$scope.inputs = {
		UserName: '',
		Password: '',
		ConfirmPassword: '',

		FirstName: '',
		LastName: '',
		Gender: '',
		BirthDate: moment().format('LL'),
		HomeAddress: '',

		CreatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
		UpdatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
	};

	// register function
	$scope.register = function (inputs) {
		if (!inputs.username || !inputs.password) {
			return;
		}

		// register
		DSNAuthService.register(inputs).then(function (response) {
			console.log(response);
		}, function (e) {
			console.log(JSON.stringify(e));
		});
	};
});

/**
 * ---------------------------------------------------------
 * dashboardCtrl
 * ---------------------------------------------------------
 */
DSNApp.controller('dashboardCtrl', function ($scope, $rootScope, DSNValuesService) {
	$rootScope.isAuthenticated('/dashboard');

	DSNValuesService.list(null).then(function (response) {

	});
});

/**
 * ---------------------------------------------------------
 * userCtrl
 * ---------------------------------------------------------
 */
DSNApp.controller('userCtrl', function ($scope, $rootScope, $location, AspNetUsersService, DSNAuthService) {
	$rootScope.isAuthenticated('/user');
	$scope.dataList = [];

	// list of users
	AspNetUsersService.list(null).then(function (response) {
		$scope.dataList = response;
	});

	// edit user details
	$scope.edit = function (id) {
		$location.url('/user/edit' + id);
	}

	// delete user details
	$scope.delete = function ($index, id) {
		console.log('Deleting user ' + id);

		swal({
			title: "Are you sure?",
			text: "You will not be able to recover this user!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			closeOnConfirm: true
		}, function () {
			DSNAuthService.delete(id).then(function (deleteResponse) {
				$scope.dataList.splice($index, 1);
			});
		});
	}
});

/**
 * ---------------------------------------------------------
 * userCreateCtrl
 * ---------------------------------------------------------
 */
DSNApp.controller('userCreateCtrl', function ($scope, $rootScope, DSNAuthService) {
	$rootScope.isAuthenticated('/user/create');

	// form inputs
	$scope.inputs = null;
	$scope.formInputs = function () {
		$scope.inputs = {
			FirstName: '',
			LastName: '',
			Gender: '',
			BirthDate: moment().format('LL'),
			HomeAddress: '',
			Role: ''
		};
	}
	$scope.formInputs();

	// register function
	$scope.register = function ($event, inputs) {
		$event.preventDefault();

		if (!inputs.FirstName || !inputs.LastName || !inputs.HomeAddress || !inputs.Gender || !inputs.BirthDate) {
			swal("Please fill all the required fields..");
			return;
		}

		// update the format
		inputs.BirthDate = moment(new Date(inputs.BirthDate)).format('YYYY-MM-DD');

		// register
		DSNAuthService.register(inputs).then(function (response) {
			console.log(response);
			swal({
				title: "New User!",
				text: "New user added.",
				html: true
			});

			$scope.formInputs();
		}, function (e) {
			console.log(JSON.stringify(e));
		});
	};
});

/**
 * ---------------------------------------------------------
 * userEditCtrl
 * ---------------------------------------------------------
 */
DSNApp.controller('userEditCtrl', function ($scope, $rootScope, $routeParams, DSNAuthService, AspNetUsersService) {
	$rootScope.isAuthenticated('/user/edit/' + $routeParams.id);

	// form inputs
	// fetch the user details
	$scope.inputs = null;
	$scope.formInputs = function () {
		AspNetUsersService.get($routeParams.id).then(function (userResponse) {
			$scope.inputs = userResponse;

			$scope.inputs.BirthDate = moment(new Date($scope.inputs.BirthDate)).format('LL');
		});
	}
	$scope.formInputs();

	// update function
	$scope.update = function ($event, inputs) {
		$event.preventDefault();

		if (!inputs.FirstName || !inputs.LastName || !inputs.HomeAddress || !inputs.Gender || !inputs.BirthDate) {
			swal("Please fill all the required fields..")
			return;
		}

		// update the format
		inputs.BirthDate = moment(new Date(inputs.BirthDate)).format('YYYY-MM-DD');

		// update
		DSNAuthService.update($routeParams.id, inputs).then(function (response) {
			console.log(response);
			swal({
				title: "<small>Updated</small>!",
				text: "User details updated.",
				html: true
			});

			$scope.formInputs();
		}, function (e) {
			console.log(JSON.stringify(e));
		});
	};
});

/**
 * ---------------------------------------------------------
 * profileGeneralSettingsCtrl
 * ---------------------------------------------------------
 */
DSNApp.controller('profileGeneralSettingsCtrl', function ($scope, $rootScope, DSNAuthService, AspNetUsersService) {
	$rootScope.isAuthenticated('/profile/general-settings');
	var userID = DSNAuthService.user().details.Id;

	// form inputs
	// fetch the user details
	$scope.inputs = null;
	$scope.formInputs = function () {
		AspNetUsersService.get(userID).then(function (userResponse) {
			$scope.inputs = userResponse;

			$scope.inputs.BirthDate = moment(new Date($scope.inputs.BirthDate)).format('LL');
		});
	}
	$scope.formInputs();

	// update function
	$scope.update = function ($event, inputs) {
		$event.preventDefault();

		if (!inputs.FirstName || !inputs.LastName || !inputs.HomeAddress || !inputs.Gender || !inputs.BirthDate) {
			swal("Please fill all the required fields..")
			return;
		}

		// update the format
		inputs.BirthDate = moment(new Date(inputs.BirthDate)).format('YYYY-MM-DD');

		// update
		DSNAuthService.update(userID, inputs).then(function (response) {
			console.log(response);
			swal({
				title: "Profile Updated!",
				text: "Your profile details is updated.",
				html: true
			});

			$scope.formInputs();
		}, function (e) {
			console.log(JSON.stringify(e));
		});
	};
});

/**
 * ---------------------------------------------------------
 * profilePasswordCtrl
 * ---------------------------------------------------------
 */
DSNApp.controller('profilePasswordCtrl', function ($scope, $rootScope, DSNAuthService, AspNetUsersService) {
	$rootScope.isAuthenticated('/profile/password');

	// form inputs
	// fetch the user details
	$scope.inputs = {
		OldPassword: '',
		NewPassword: '',
		ConfirmPassword: ''
	};

	// change password
	$scope.update = function ($event, inputs) {
		if (!inputs.OldPassword || !inputs.NewPassword || !inputs.ConfirmPassword) {
			swal("Please fill all the required fields..")
			return;
		}

		// update
		DSNAuthService.changePassword(inputs).then(function (response) {
			console.log(response);
			swal({
				title: "Profile Updated!",
				text: "Your profile password is updated.",
				html: true
			});
		}, function (e) {
			console.log(JSON.stringify(e));
		});
	};
});