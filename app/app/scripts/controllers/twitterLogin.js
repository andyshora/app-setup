'use strict';

angular.module('newappApp')
	.controller('TwitterLoginCtrl', function ($scope, $http) {
		$scope.authState = 'checking-login';

		var getUserData = function() {
			$http.get('api/index.php/auth/get_user')
				.success(function(data) {
					if (data.uid) {
						console.log('User data: ', data);
						$scope.authState = 'logged-in';
					} else {
						// error
						console.log('Error getting user data');
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
