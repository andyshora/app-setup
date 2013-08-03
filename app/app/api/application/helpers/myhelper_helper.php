<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if ( ! function_exists('old_IE'))
{
	function old_IE()
	{
	    return (isset($_SERVER['HTTP_USER_AGENT']) && preg_match('/MSIE 6|MSIE 7|MSIE 8/', $_SERVER['HTTP_USER_AGENT']));
	}
}
if ( ! function_exists('mongoise_array'))
{
	function mongoise_array($arr) {
		$arr2 = array();
		foreach($arr as $a){
			if (valid_mongo_id($a))
				$a[] = new Mongo($a);
		}
		return $arr2;
    }
}
if ( ! function_exists('vmid'))
{
	function vmid($id) {
		return (strlen($id) == 24);
    }
}



/* End of file myhelper.php */
/* Location: ./application/helpers/myhelper.php */
