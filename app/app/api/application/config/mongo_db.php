<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

$config['mongo_host'] = 'localhost';
$config['mongo_port'] = 27017;
$config['mongo_db'] = (ENVIRONMENT=='test') ? 'myapp_test' : 'myapp';
$config['mongo_user'] = '';
$config['mongo_pass'] = '';
$config['mongo_persist'] = TRUE;
$config['mongo_persist_key'] = 'ci_mongo_persist';