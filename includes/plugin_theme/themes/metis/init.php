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

//module_config::register_css('theme','metis_style.css',full_link('/includes/plugin_theme/themes/metis/css/metis_style.css'));

if(!isset($_REQUEST['display_mode']) || (isset($_REQUEST['display_mode']) && $_REQUEST['display_mode']!='iframe' && $_REQUEST['display_mode']!='ajax')){
    $_REQUEST['display_mode'] = 'metis';
}
require_once(module_theme::include_ucm('includes/plugin_theme/themes/metis/metis_functions.php'));




// theme overrides and styles:
module_config::register_css('theme','main.css',full_link('/includes/plugin_theme/themes/metis/css/main.css'),16);
//module_config::register_css('theme','metisMenu.css',full_link('/includes/plugin_theme/themes/metis/css/metisMenu.css'),17);
module_config::register_css('theme','theme.css',full_link('/includes/plugin_theme/themes/metis/css/theme.css'),18);
if(isset($_SERVER['REQUEST_URI']) && (strpos($_SERVER['REQUEST_URI'],_EXTERNAL_TUNNEL) || strpos($_SERVER['REQUEST_URI'],_EXTERNAL_TUNNEL_REWRITE))){
    module_config::register_css('theme','external.css',full_link('/includes/plugin_theme/themes/metis/css/external.css'),100);
}

module_config::register_js('theme','main.js',full_link('/includes/plugin_theme/themes/metis/js/main.js'), 16);
//module_config::register_js('theme','metisMenu.js',full_link('/includes/plugin_theme/themes/metis/js/metisMenu.js'), 17);
module_config::register_js('theme','metis.js',full_link('/includes/plugin_theme/themes/metis/js/metis.js'), 18);