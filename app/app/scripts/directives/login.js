'use strict';

angular.module('rocketTweetsApp')
	.directive('login', function () {
		return {
			templateUrl: 'views/twitterLogin.html', // twitterLogin / facebookLogin
			restrict: 'A',
			controller: 'TwitterLoginCtrl' // TwitterLoginCtrl / FacebookLoginCtrl
		};
	});
