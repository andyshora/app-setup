'use strict';

var app = angular.module('LoginProvider', []);
app.factory('Facebook', function ($rootScope, $q) {

	var self = this;
	this.auth = null;

	return {
		getAuth: function() {
			return self.auth;
		},
		getLoginStatus: function () {

			var deferred = $q.defer();

			window.FB.getLoginStatus(function (response) {
				setTimeout(function() {
					$rootScope.$apply(function() {
						deferred.resolve(response.authResponse);
						self.auth = response.authResponse;

						if (response.status === 'unknown') {
							$rootScope.$broadcast("fb_statusChange", response);
						}
					});

					// auth status change event already being listened to, fb_statusChange will be broadcast

				}, 1);

			}, true);
		},
		getMyInfo: function() {

			var deferred = $q.defer();

			FB.api('/me?fields=id,name,first_name,last_name,picture,friends', function(response) {
				setTimeout(function() {
					$rootScope.$apply(function() {
						$rootScope.myInfo = response;

					});

					if (response) {
						// todo - firing twice
						$rootScope.$broadcast("fb_myInfoReceived");
					}


				}, 1);
			});
		},
		login: function () {

			var deferred = $q.defer();

			FB.login(function(response) {
				setTimeout(function() {
					$rootScope.$apply(function() {

						if (response.authResponse) {

							deferred.resolve(response.authResponse);
							self.auth = response.authResponse;
							$rootScope.Facebook.token = deferred.promise;

						} else {

							deferred.reject(response.authResponse);
							self.auth = null;
						}

						$rootScope.$broadcast("fb_statusChange", response);

					});

				}, 1);
			});

		},
		logout:function () {

			var deferred = $q.defer();

			FB.logout(function(response) {
			  setTimeout(function() {
				$rootScope.$apply(function() {

					if (response) {
						deferred.resolve(response.authResponse);
						self.auth = null;
						$rootScope.$broadcast('fb_logout_succeded');

					} else {

						deferred.reject('fb_logout_failed');
						$rootScope.$broadcast('fb_logout_failed');
					}

				});

			  }, 1);
			});

			$rootScope.Facebook.token = null;

		},
		unsubscribe:function () {
			window.FB.api("/me/permissions", "DELETE", function (response) {
				$rootScope.$broadcast('fb_get_login_status');
			});
		}
	};
});


