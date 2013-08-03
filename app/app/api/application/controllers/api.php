<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Api extends CI_Controller {

	private $_tempData = array();

	public function index()
	{
		echo "Oh hai.";
	}
	public function search($query='') {
		$ll = /*$this->input->post('ll') | */'51.538851799999996,-0.0758134';

		echo json_encode($this->foursquare->get_public('venues/suggestcompletion', array('ll'=>$ll, 'intent'=>'browse', 'query'=>$query, 'limit'=>10)));
	}
	public function things()
	{
		$this->mongo_db->clear();
		$things = $this->mongo_db->get('a');

		echo json_encode($things);
	}
	public function award_add()
	{
		$post_data = json_decode(file_get_contents('php://input'), true);
		$facebook_id = $this->session->userdata('facebook_id');
		$slug = $post_data['slug'];
		$location_name = $post_data['name'];

		if (!is_numeric($facebook_id)) {
			$this->fail('not authenticated');
		}

		$arr = array(
			'name'=>$location_name,
			'slug'=>$slug,
			'foursquare_id'=>$post_data['place']['id'],
			'place'=>$post_data['place'],
			'facebook_id'=>$facebook_id,
			'username'=>$this->session->userdata('username'),
			'first_name' => $this->session->userdata('first_name'),
			'last_name' => $this->session->userdata('last_name'),
			'picture' => $this->session->userdata('picture')
		);

		$this->mongo_db->clear();
		$insert_id = $this->mongo_db->insert('a', $arr);
		$this->mongo_db->clear();

		die(json_encode(array('success'=>vmid($insert_id))));
	}
	public function available_things() {

		$this->mongo_db->clear();
		$things = $this->mongo_db->get('things');

		echo json_encode($things);
	}
	public function fail($msg='failed') {
		die(json_encode(array('success'=>false, 'message'=>$msg)));
	}

}

/* End of file api.php */
/* Location: ./application/controllers/api.php */
