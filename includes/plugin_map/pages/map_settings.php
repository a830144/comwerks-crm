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


$settings = array(
     array(
        'key'=>'enable_customer_maps',
        'default'=>'1',
         'type'=>'checkbox',
         'description'=>'Enable Customer Maps',
     ),
     array(
        'key'=>'google_maps_api_key',
        'default'=>'AIzaSyDFYt1ozmTn34lp96W0AakC-tSJVzEdXjk',
         'type'=>'text',
         'description'=>'Google Maps API Key',
         'help' => 'This is required to get markers displaying on the map. If markers are not displaying please sign up for your own Google Maps/Geocoding API key and put it here.'
     ),
);
module_config::print_settings_form(
    array(
        'heading' => array(
            'title' => 'Map Settings',
            'type' => 'h2',
            'main' => true,
        ),
        'settings' => $settings,
    )
);
