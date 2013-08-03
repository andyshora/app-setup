'use strict';

angular.module('newappApp', [])
	.config(function ($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(true);

	$routeProvider
		.when('/', {
			templateUrl: 'views/main.html',
			controller: 'MainCtrl'
		})
		.when('/oauth_callback', {
			// this should be replaced by a 302 redirect in response to the OAuth sign in request (Step 1)
			templateUrl: 'views/callback.html',
			controller: function($scope, Twitter) {
				Twitter.redirectUser();
			}
		})
		.otherwise({
			redirectTo: '/'
		});
});
