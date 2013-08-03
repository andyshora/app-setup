'use strict';

var app = angular.module('LoginProvider', []);
app.factory('Twitter', function ($rootScope, $q, $http) {

	var self = this,
	OAuthRequestToken = '',
	OAuthTokenSecret = '',
	OAuthRequestVerifier = '',
	OAuthCallbackURL = window.location.host + '/oauth_callback',
	apiPath = 'https://api.twitter.com/',
	userId = null,
	screenName = null;

	return {
		// Step 1
		obtainRequestToken: function() {
			$http.post(apiPath + 'oauth/request_token', { "oauth_callback": encodeURIComponent(OAuthCallbackURL) })
				.success(function(data) {
					if (data.oauth_callback_confirmed) {
						// success
						OAuthRequestToken = data.oauth_token;
						OAuthTokenSecret = data.oauth_token_secret;

						self.log('step 1 success', [OAuthRequestToken, OAuthTokenSecret]);
					} else {
						// error
						self.error(data);
					}
				})
				.error(function(data) {
					self.error(data);
				});
		},
		// Step 2
		authenticate: function() {
			window.location = apiPath + 'oauth/authenticate?oauth_token=' + OAuthRequestToken;
			// this should be done as a HTTP 302 redirect
		},
		// Step 3
		verifyCallback: function(oauth_token, oauth_verifier) {
			// verify token matches the one obtained in Step 1
			if (oauth_token===OAuthRequestToken) {
				// success
				OAuthRequestVerifier = oauth_verifier;
				this.generateAccessToken();
			} else {
				// error
				self.error('callback verification failed');
			}
		},
		// Step 4
		generateAccessToken: function() {
			$http.post(apiPath + 'oauth/access_token', { oauth_verifier: OAuthRequestVerifier })
				.success(function(data) {
					OAuthRequestToken = data.oauth_token;
					OAuthTokenSecret = data.oauth_token_secret;
					screenName = data.screen_name;
					userId = data.user_id;
					self.complete();
				})
				.error(function(data) {
					self.error(data);
				});
		},
		// Step 5
		complete: function() {
			console.log('Signin Complete -> ', OAuthRequestToken, OAuthTokenSecret, screenName, user_id);
		},
		error: function(data) {
			console.log('error -> ', data);
		},
		log: function(data) {
			console.log('log -> ', data);
		}

	};

});

