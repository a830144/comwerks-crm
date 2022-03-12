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

ob_start();
$customer_templates = array();
$customer_templates['customer_statement_email'] = 1;
foreach($customer_templates as $template_key => $tf){
	module_template::link_open_popup($template_key);
}
$template_html = ob_get_clean();


$settings = array(
	array(
		'key'=>'customer_staff_name',
		'default'=>'Staff',
		'type'=>'text',
		'description'=>'Customer Staff Name',
		'help'=>'What are customer staff members called? e.g. "Staff" or "Team Leader" or "Admin"',
	),
	array(
		'key'=>'customer_list_show_invoices',
		'default'=>'1',
		'type'=>'checkbox',
		'description'=>'Show Invoices in Customer List',
		'help'=>'If invoices should be shown in the main customer listing. If you have lots of customers and lots of invoices you can try disable this option to speed things up a bit.',
	),
	array(
		'key'=>'customer_staff_list',
		'default'=>'1',
		'type'=>'checkbox',
		'description'=>'Show Staff in Customer List',
		'help'=>'Enable this option to show staff members in the main customer listing area',
	),
	array(
		'type'=>'html',
		'description'=>'Templates',
		'html' => $template_html,
	),
);


module_config::print_settings_form(
	array(
		'heading' => array(
			'title' => 'Customer Settings',
			'type' => 'h2',
			'main' => true,
		),
		'settings' => $settings,
	)
);