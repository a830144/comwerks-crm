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

$search = (isset($_REQUEST['search']) && is_array($_REQUEST['search'])) ? $_REQUEST['search'] : array();

$newsletter_templates = module_newsletter::get_templates($search);


$header = array(
    'title' => _l('Newsletter Templates'),
    'type' => 'h2',
    'main' => true,
    'button' => array(),
);
$header['button'] = array(
    'url' => module_newsletter::link_open_template('new'),
    'title' => _l('Add New Template'),
    'type' => 'add',
);
print_heading($header);


$table_manager = module_theme::new_table_manager();
$columns = array();
$columns['newsletter_template_name'] = array(
    'title' => 'Template Name',
    'callback' => function($newsletter_template){
		echo module_newsletter::link_open_template($newsletter_template['newsletter_template_id'],true);
    },
    'cell_class' => 'row_action',
);
$columns['newsletter_template_action'] = array(
    'title' => 'Action',
    'callback' => function($newsletter_template){
		?> <a href="<?php echo module_newsletter::link_open_template($newsletter_template['newsletter_template_id']);?>">Edit</a> <?php
    },
);
$table_manager->set_columns($columns);
$table_manager->set_rows($newsletter_templates);
$table_manager->pagination = false;
$table_manager->print_table();

?>

