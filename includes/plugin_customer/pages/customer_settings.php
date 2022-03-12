<?php 
/** 
  * Copyright: dtbaker 2012
  * Licence: Please check CodeCanyon.net for licence details. 
  * More licence clarification available here:  http://codecanyon.net/wiki/support/legal-terms/licensing-terms/ 
  * Deploy: 11802 7369f9a61c2e79f820350e955c52cf4b
  * Envato: 31249ba5-dbc2-4eab-bc75-b0df6eb45c51
  * Package Date: 2016-12-01 15:01:26 
  * IP Address: 219.75.80.95
  */

if(!module_customer::can_i('edit','Customer Settings','Config')){
	redirect_browser(_BASE_HREF);
}

$module->page_title = 'Customer Settings';

$links = array(
	array(
		"name"=>'Settings',
		'm' => 'customer',
		'p' => 'customer_settings_basic',
		'force_current_check' => true,
		'order' => 1, // at start.
		'menu_include_parent' => 1,
		'allow_nesting' => 1,
		'args'=>array('customer_id'=>false,'customer_type_id'=>false),
	),
	array(
		"name"=>'Customer Types',
		'm' => 'customer',
		'p' => 'customer_settings_types',
		'force_current_check' => true,
		'order' => 2, // at start.
		'menu_include_parent' => 1,
		'allow_nesting' => 1,
		'args'=>array('customer_id'=>false,'customer_type_id'=>false),
	),
);


if(file_exists(dirname(__FILE__).'/customer_signup.php')){
	$links[] = array(
		"name"=>'Signup Settings',
		'm' => 'customer',
		'p' => 'customer_signup',
		'force_current_check' => true,
		'order' => 3, // at start.
		'menu_include_parent' => 1,
		'allow_nesting' => 1,
		'args'=>array('customer_id'=>false),
	);
}

