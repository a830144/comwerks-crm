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



if(isset($_REQUEST['user_id'])){

    $user_id = (int)$_REQUEST['user_id'];

    if(class_exists('module_security',false)){
        if($user_id > 0){
            $user = module_user::get_user($user_id);

            if(!$user){
                die('Permission denied to view this user');
            }
            $user_id = (int)$user['user_id'];
        }
        if($user_id > 0){
            module_security::check_page(array(
                 'category' => 'Config',
                 'page_name' => 'Users',
                'module' => 'user',
                'feature' => 'edit',
            ));
        }else{
            module_security::check_page(array(
                 'category' => 'Config',
                 'page_name' => 'Users',
                'module' => 'user',
                'feature' => 'create',
            ));
        }
    }

    $user_safe = true;
    include(module_theme::include_ucm("includes/plugin_user/pages/user_admin_edit.php"));
	//include("user_admin_edit.php");

}else{

    if(class_exists('module_security',false)){
        module_security::check_page(array(
             'category' => 'Config',
             'page_name' => 'Users',
            'module' => 'user',
            'feature' => 'view',
        ));
    }

    include(module_theme::include_ucm("includes/plugin_user/pages/user_admin_list.php"));
	//include("user_admin_list.php");
	
} 

