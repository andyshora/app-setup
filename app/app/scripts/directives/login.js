'use strict';

angular.module('newappApp')
	.directive('login', function () {
		return {
			templateUrl: 'views/twitterLogin.html', // twitterLogin / facebookLogin
			restrict: 'A',
			controller: 'TwitterLoginCtrl' // TwitterLoginCtrl / FacebookLoginCtrl
		};
	});
