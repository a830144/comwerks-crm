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

// include this file to list some type of data
// supports different types of lists, everything from a major table list down to a select dropdown list

$display_type = 'table';
$allow_search = true;


switch($display_type){
	case 'table':
		
		$data_types = $module->get_data_types();
		foreach($data_types as $data_type){
			$data_type_id = $data_type['data_type_id'];
            if(isset($_REQUEST['data_type_id']) && $data_type_id != $_REQUEST['data_type_id'])continue;

            include('admin_data_list_type.php');

		}
		
		break;
	case 'select':
		
		break;
	default:
		echo 'Display type: '.$display_type.' unknown.';
		break;
}