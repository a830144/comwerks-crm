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
if(!module_data::can_i('edit',_MODULE_DATA_NAME)){
	die("access denied");
}
$data_types = $module->get_data_types();
$menu_locations = module_data::get_menu_locations();

$header_buttons = array();
if(module_data::can_i('create',_MODULE_DATA_NAME)){
    $header_buttons[] = array(
        'url' => module_data::link_open_data_type('new'),
        'title' => "Create New "._MODULE_DATA_NAME,
    );
    $header_buttons[] = array(
        'url' => module_data::link_open_data_type('import'),
        'title' => "Import",
    );
}

print_heading(array(
    'main' => true,
    'type' => 'h2',
    'title' => _MODULE_DATA_NAME,
    'button' => $header_buttons,
));


/** START TABLE LAYOUT **/
$table_manager = module_theme::new_table_manager();
$columns = array();
$columns['data_type'] = array(
	'title' => 'Data Type',
	'callback' => function($data){
		?>
        <a href="<?php echo module_data::link_open_data_type($data['data_type_id']); ?>"><?php echo htmlspecialchars($data['data_type_name']); ?></a>
        <?php
	},
	'cell_class' => 'row_action',
);

$columns['menu_location'] = array(
	'title' => 'Menu Location',
	'callback' => function($data) use($menu_locations){
		echo isset($menu_locations[$data['data_type_menu']]) ? htmlspecialchars($menu_locations[$data['data_type_menu']]) : _l('N/A');
	},
);
$columns['records'] = array(
	'title' => 'Records',
	'callback' => function($data) use($module){
		$data_type = $module->get_data_type($data['data_type_id']);
		?>
        <a href="<?php echo $module->link('admin_data',array('data_type_id'=>$data_type['data_type_id'],'view_all'=>1)); ?>"><?php echo $data_type['count'];?> - <?php _e('view all');?></a>
        <?php
	},
);

$table_manager->set_columns($columns);
$table_manager->set_rows($data_types);
$table_manager->pagination = true;
$table_manager->print_table();

