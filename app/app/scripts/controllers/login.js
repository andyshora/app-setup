'use strict';

angular.module('newappApp').controller('LoginCtrl', function (Facebook, $scope, $rootScope, $http, $location) {

	var	CHECKING_LOGIN = 'checking-login',
		LOGGED_OUT = 'logged-out',
		LOGGING_IN = 'logging-in',
		AWAITING_AUTH = 'awaiting-auth',
		LOGGED_IN = 'logged-in';


	$scope.info = {};
	$scope.sub = 2;
	$scope.authState = CHECKING_LOGIN;


	$rootScope.$on("fb_statusChange", function (event, args) {
		//console.log('fb_statusChange', args);

		if (args.status === 'connected') {
			// logged in and authorized on fb, now authenticate with our app
			// we dont care if this response has come from FB.init or FB.login
			Facebook.getMyInfo();

		} else if (($scope.authState!==LOGGED_OUT)&&($scope.authState!==AWAITING_AUTH)) { // if user clicked on login button
			// failed FB.login
			if (args.status === 'not_authorized') {
				// failed to authorize this app
				//console.log('You failed to authorize this app');
				$scope.authState = LOGGED_OUT;

			} else if (args.status === 'unknown') {
				// failed to login to facebook
				//console.log('Not logged into fb, auth state unknown');
				$scope.authState = LOGGED_OUT;
			} else {
				// failed to login, or whatever
				//console.log('Login failed');
				$scope.authState = LOGGED_OUT;
			}
		} else {
			// show login button
			$scope.authState = LOGGED_OUT;
			$scope.$apply();
		}
	});

	$rootScope.$on("fb_myInfoReceived", function () {
		//console.log('fb_myInfoReceived', $rootScope.myInfo);
		beginAppAuth($rootScope.myInfo);
	});

	$rootScope.$on("fb_get_login_status", function () {
		Facebook.getLoginStatus();
	});
	$rootScope.$on("fb_login_failed", function () {
		//console.log("fb_login_failed");

		$scope.authState = LOGGED_OUT
	});
	$rootScope.$on("fb_logout_succeded", function () {
		//console.log("fb_logout_succeded");
		$rootScope.id = "";

		$scope.authState = LOGGED_OUT
	});
	$rootScope.$on("fb_logout_failed", function () {
		//console.log("fb_logout_failed!");
		$scope.authState = LOGGED_IN;
	});

	$rootScope.updateSession = function () {
		//reads the session variables if exist from php
		$http.post($rootScope.apiPath + '/account/session').success(function (data) {
			//and transfers them to angular
			$rootScope.session = data;
		});
	};

	// button functions
	$scope.getLoginStatus = function () {
		Facebook.getLoginStatus();
	};

	$scope.login = function () {
		$scope.authState = LOGGING_IN;
		Facebook.login();
	};

	$scope.logout = function () {
		Facebook.logout();
		$rootScope.session = {};
		//make a call to a php page that will erase the session data
		$http.post($rootScope.apiPath + "/account/logout").success(function(data) {
			$rootScope.session = data;
		});
	};

	$scope.unsubscribe = function () {
		Facebook.unsubscribe();
	};

	var beginAppAuth = function(parameters) {
		console.log('begin app auth', parameters);
		// authenticate against tca db
		// this will register a user if they dont exist
		$http.post($rootScope.apiPath + '/account/auth', parameters).success(function(sessionData) {
			$rootScope.session = sessionData;
			//$scope.$apply();

			loginComplete();
		});
	};

	var loginComplete = function() {
		console.log('login complete:', $rootScope.session);

		$rootScope.facebook_id = parseInt($rootScope.session.facebook_id);
		$scope.authState = LOGGED_IN;

		$rootScope.subtitle = 'Give awards to your favourite places, ' + $rootScope.session.first_name + '.';

		$rootScope.$broadcast("loginComplete");
	};

});
