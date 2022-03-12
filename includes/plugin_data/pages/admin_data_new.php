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

$data_types = $module->get_data_types();

?>
<h2><?php echo _l('Select Type'); ?></h2>

<?php foreach($data_types as $data_type){
	?>
	
	<a class="uibutton" href="<?php echo $module->link('',array('data_type_id'=>$data_type['data_type_id'],'data_record_id'=>'new','mode'=>'edit'));?>"><?php echo $data_type['data_type_name'];?></a>
	
	<?php
}
?>
