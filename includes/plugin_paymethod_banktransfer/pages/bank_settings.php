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

print_heading('Bank Transfer Settings');
module_config::print_settings_form(
    array(
         array(
            'key'=>'payment_method_banktransfer_enabled',
            'default'=>1,
             'type'=>'checkbox',
             'description'=>'Enable Payment Method',
         ),
         array(
            'key'=>'payment_method_banktransfer_enabled_default',
            'default'=>1,
             'type'=>'checkbox',
             'description'=>'Available By Default On Invoices',
	         'help' => 'If this option is enabled, all new invoices will have this payment method available. If this option is disabled, it will have to be enabled on individual invoices.'
         ),
         array(
            'key'=>'payment_method_banktransfer_label',
            'default'=>'Bank Transfer',
             'type'=>'text',
             'description'=>'Name this payment method',
         ),
    )
);

print_heading('Bank Transfer Templates');
echo module_template::link_open_popup('paymethod_banktransfer');
echo module_template::link_open_popup('paymethod_banktransfer_details');
?>
