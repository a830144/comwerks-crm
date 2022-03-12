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


if(isset($_REQUEST['product_category_id']) && $_REQUEST['product_category_id'] != ''){
    $product_category_id = (int)$_REQUEST['product_category_id'];
    $product_category = module_product::get_product_category($product_category_id);
    include('product_admin_category_edit.php');
}else{
	include('product_admin_category_list.php');
}
