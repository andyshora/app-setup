'use strict';

angular.module('rocketTweetsApp')
	.controller('TwitterLoginCtrl', function ($scope, $http, $location) {
		$scope.authState = 'checking-login';

		var storedToken = localStorage.getItem('token');
		$scope.loginQueryString = storedToken ? '?access_token=' + storedToken : '';

		var getUserData = function() {
			$http.get('api/index.php/auth/get_user?' + Math.random())
				.success(function(data) {
					if (data.uid) {
						console.log('User data: ', data);
						$scope.authState = 'logged-in';
						localStorage.setItem('token', data.oauth_token);
					} else {
						// error
						console.log('Error getting user data');
						$scope.authState = 'logged-out';
					}
				})
				.error(function(data) {
					console.log('Error fetching user data');
				});
		};

		$scope.showLoginState = function() {
			$scope.authState = 'logging-in';
		};

		getUserData();

	});
