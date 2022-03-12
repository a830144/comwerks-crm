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


if(!module_config::can_i('view','Settings')){
    redirect_browser(_BASE_HREF);
}

print_heading('Help Settings');

module_config::print_settings_form(
    array(
        array(
            'key'=>'help_only_for_admin',
            'default'=>1,
            'type'=>'checkbox',
            'description'=>'Only show help menu for Super Administrator.',
	        'help' => 'By default only the Super Administrator (first user created) can see the help documentation. If this option is disabled you will still need to give each User Role access to "view help" for them to see the "help" menu correctly. Please note that the help documentation may contain branding.'
        ),
    )
);
