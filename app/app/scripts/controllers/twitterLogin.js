'use strict';

angular.module('newappApp')
	.controller('TwitterLoginCtrl', function ($scope, Twitter) {
		$scope.authState = 'init';
		//Twitter.obtainRequestToken();

	});
