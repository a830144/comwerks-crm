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
//include("top_menu.php");




$module->page_title = _l('Finance');


$links = array();
$menu_position = 1;

array_unshift($links,array(
    "name"=>"Transactions",
    'm' => 'finance',
    'p' => 'finance',
    'default_page' => 'finance_list',
    'order' => $menu_position++,
    'menu_include_parent' => 0,
    'allow_nesting' => 0,
    'args' => array('finance_id'=>false),
));
if(module_finance::can_i('view','Finance Upcoming')){
    array_unshift($links,array(
        "name"=>"Upcoming Payments",
        'm' => 'finance',
        'p' => 'recurring',
        'order' => $menu_position++,
        'menu_include_parent' => 0,
        'allow_nesting' => 1,
        'args' => array('finance_id'=>false,'finance_recurring_id'=>false),
    ));
}

?>