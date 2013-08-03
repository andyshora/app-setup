<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Auth extends CI_Controller
{
	public function oauth($provider)
	{
		$this->load->helper('url');

		$this->load->spark('oauth/0.3.1');

		$this->load->config('oauth');

		$keys = $this->config->item('keys');
		$secrets = $this->config->item('secrets');

		// Create an OAuth consumer from the config
		$consumer = $this->oauth->consumer(array(
			'key' => $keys[$provider],
			'secret' => $secrets[$provider]
		));

		// Load the provider
		$provider = $this->oauth->provider($provider);

		// Create the URL to return the user to
		$callback = site_url('auth/oauth/'.$provider->name);

		if ( ! $this->input->get_post('oauth_token'))
		{
			// Add the callback URL to the consumer
			$consumer->callback($callback);

			// Get a request token for the consumer
			$token = $provider->request_token($consumer);

			// Store the token
			$this->session->set_userdata('oauth_token', base64_encode(serialize($token)));

			// Get the URL to the twitter login page
			$url = $provider->authorize($token, array(
				'oauth_callback' => $callback,
			));

			// Send the user off to login
			redirect($url);
		}
		else
		{
			if ($this->session->userdata('oauth_token'))
			{
				// Get the token from storage
				$token = unserialize(base64_decode($this->session->userdata('oauth_token')));
			}

			if ( ! empty($token) AND $token->access_token !== $this->input->get_post('oauth_token'))
			{
				// Delete the token, it is not valid
				$this->session->unset_userdata('oauth_token');

				// Send the user back to the beginning
				exit('invalid token after coming back to site');
			}

			// Get the verifier
			$verifier = $this->input->get_post('oauth_verifier');

			// Store the verifier in the token
			$token->verifier($verifier);

			// Exchange the request token for an access token
			$token = $provider->access_token($consumer, $token);

			// We got the token, let's get some user data
			$user = $provider->get_user_info($consumer, $token);

			// Login complete
			$arr = array(
				'oauth_token' => $token->access_token,
				'oauth_secret' => $token->secret,
				'oauth_token_type' => $token->name,
				'oauth_uid' => $token->uid,
				'name' => $user['name'],
				'image' => $user['image'],
				'location' => $user['location'],
				'nickname' => $user['nickname'],
				'uid' => $user['uid']
				);

			$user_data = $this->mongo_db->get_where('user', array('uid' => $arr['uid']));
			$this->mongo_db->clear();

			if (count($user_data)) {
				// user already exists
				$user = $user_data[0];
				$user['login_count'] = $user['login_count'] + 1;

				$this->mongo_db->clear();
				$this->mongo_db->where(array('_id' => new MongoId($user['_id']->{'$id'})))
								->update('user', array('login_count' => $user['login_count']), false, '$set');

				$this->mongo_db->clear();

				$this->session->set_userdata($user);

			} else {
				// user doesn't exist yet
				$arr['login_count'] = 1;

				// add user
				$this->mongo_db->clear();
				$user_id = $this->mongo_db->insert('user', $arr);
				$this->mongo_db->clear();

				$arr['last_login'] = time();

				$this->session->set_userdata($arr);
			}


			$session_data = $this->session->all_userdata();

			redirect(app_url());
		}
	}
	public function session()
	{
		$session_data = $this->session->all_userdata();

		die(json_encode($session_data));
	}
	public function get_user() {
		$session_data = $this->session->all_userdata();

		die(json_encode($session_data));
	}
	public function logout()
	{
		$this->session->sess_destroy();

		redirect(app_url());
	}
}
