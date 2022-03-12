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


if(_DEMO_MODE){
	?>
	<p>Demo Mode Notice: <strong>This is a public demo. Please only use TEST accounts here as others will see them.</strong></p>
	<?php
}


if(isset($_REQUEST['social_facebook_id']) && !empty($_REQUEST['social_facebook_id'])){
    $social_facebook_id = (int)$_REQUEST['social_facebook_id'];
	$social_facebook = module_social_facebook::get($social_facebook_id);
    include('facebook_account_edit.php');
}else{
	include('facebook_account_list.php');
}
