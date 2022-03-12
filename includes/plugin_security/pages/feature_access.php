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

if(isset($access_requirements['feature']) && $access_requirements['feature'] == 'menu'){
	switch($access_requirements['module']){
		case 'people':
		case 'inventory':
		case 'invoice':
		case 'config':
		case 'sales_order':
		case 'quote':
		case 'task':
            $access = true; //($_SERVER['SERVER_ADDR'] == '192.168.0.54');
	        break;
		default:
			$access = true;
	}
}else if(isset($access_requirements['feature']) && $access_requirements['feature'] == 'submenu'){
	switch($access_requirements['module']){
		case 'user':
		case 'supplier_product':
		case 'customer':
		case 'supplier':
			$access = true;
	        break;
		default:
			$access = true; //($_SERVER['SERVER_ADDR'] == '192.168.0.54');
	}
}else{

	if(false){ //self::getlevel() == 1){
		// can access any part or feature of the system!
		$access = true;
	}else{
		$access = true;
		// check based on selected user permissions
        if(isset($access_requirements['feature'])){
            switch($access_requirements['feature']){
                case 'page':
                    break;
                case 'add_link':
                case 'edit_link':
                case 'delete_link':
                case 'edit_field':
                    break;
                case 'view_link':
                    switch($access_requirements['database_table']){
                        case 'inventory_test':
                        case 'inventory':
                            $access = true; // users only allowed to view inventory
                            break;
                    }
                    break;
            }
		}
	}
}
?>