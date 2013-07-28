<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Account extends CI_Controller {

	public function index()
	{
		echo "Nope";
	}
	/**
	 * Authenticate against db
	 * Potentially create new user record
	 * Store userdata in session
	 */
	public function auth()
	{
		/*
			facebook_id: "61303357"
			first_name: "Andy"
			last_name: "Shora"
			picture: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/c0.0.445.445/526074_10100103260188164_1331764527_n.jpg"
		*/

		$post_data = json_decode(file_get_contents('php://input'));

		$arr = array(
			'facebook_id' => $post_data->id,
			'first_name' => $post_data->first_name,
			'last_name' => $post_data->last_name,
			'picture' => $post_data->picture->data->url,
			'friends' => $post_data->friends->data
		);

		$user_data = $this->mongo_db->get_where('user', array('facebook_id' => $arr['facebook_id']));
		$this->mongo_db->clear();

		if (count($user_data)) {
			// user already exists
			$user = $user_data[0];
			$user['login_count'] = $user['login_count'] + 1;

			$this->mongo_db->clear();
			$this->mongo_db->where(array('_id' => new MongoId($user['_id']->{'$id'})))
        					->update('user', array('login_count' => $user['login_count']), false, '$set');

			$this->mongo_db->clear();

			unset($user['friends']);
			$this->session->set_userdata($user);

		} else {
			// user doesn't exist yet
			$arr['login_count'] = 1;

			// add user
			$this->mongo_db->clear();
			$user_id = $this->mongo_db->insert('user', $arr);
			$this->mongo_db->clear();

			$arr['last_login'] = time();

			unset($user['friends']);
			$this->session->set_userdata($arr);
		}



		$session_data = $this->session->all_userdata();

		die(json_encode($session_data));
	}
	/**
	 * Get session variables
	 * facebook_id, first_name, last_name, picture
	 */
	public function session()
	{
		$session_data = $this->session->all_userdata();

		die(json_encode($session_data));
	}
	public function logout()
	{
		$arr = array('success' => true);
		die(json_encode($arr));
	}
}

/* End of file account.php */
/* Location: ./application/controllers/account.php */
