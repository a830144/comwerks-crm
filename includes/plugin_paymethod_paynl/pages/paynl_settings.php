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


if(!module_config::can_i('edit','Settings')){
    redirect_browser(_BASE_HREF);
}

print_heading('PayNL Settings');?>


<?php module_config::print_settings_form(
    array(
         array(
            'key'=>'payment_method_paynl_enabled',
            'default'=>0,
             'type'=>'checkbox',
             'description'=>'Enable PayNL Checkout',
         ),
         array(
            'key'=>'payment_method_paynl_enabled_default',
            'default'=>1,
             'type'=>'checkbox',
             'description'=>'Available By Default On Invoices',
	         'help' => 'If this option is enabled, all new invoices will have this payment method available. If this option is disabled, it will have to be enabled on individual invoices.'
         ),
         array(
            'key'=>'payment_method_paynl_label',
            'default'=>'PayNL',
             'type'=>'text',
             'description'=>'Payment Method Label',
	         'help' => 'This will display on invoices as the name of this payment method.'
         ),
         array(
            'key'=>'payment_method_paynl_token',
            'default'=>'',
             'type'=>'text',
             'description'=>'Your PayNL token',
         ),
         array(
            'key'=>'payment_method_paynl_serviceid',
            'default'=>'',
             'type'=>'text',
             'description'=>'Your PayNL Service ID',
         ),
         array(
            'key'=>'payment_method_paynl_currency',
            'default'=>'',
             'type'=>'text',
             'description'=>'Which Currencies To Support',
             'help'=>'A comma separated list of currencies to support, eg: AUD,USD Leave this blank to support all currencies. If an invoice is in an unsupported currency then this payment method will not display.',
         ),
         array(
            'key'=>'payment_method_paynl_limit_type',
            'default'=>'above',
             'type'=>'select',
	         'options' => array(
		         'above'=>_l('Greater Than...'),
		         'below'=>_l('Less Than...'),
	         ),
             'description'=>'Only show when invoice value is ...',
             'help'=>'Only show the paynl option if the dollar value is greater than or less than the below value.',
         ),
         array(
            'key'=>'payment_method_paynl_limit_value',
            'default'=>'0',
             'type'=>'text',
             'description'=>'... this amount',
             'help'=>'What value to restrict paynl payments to',
         ),
         array(
            'key'=>'payment_method_paynl_charge_percent',
            'default'=>0,
             'type'=>'text',
             'description'=>'Additional Charge (as %)',
             'help' => 'Example: 2.9 do not enter %% sign',
         ),
         array(
            'key'=>'payment_method_paynl_charge_amount',
            'default'=>0,
             'type'=>'text',
             'description'=>'Additional Charge (as $)',
             'help' => 'Example: 0.30 do not enter $ sign',
         ),
         array(
            'key'=>'payment_method_paynl_charge_description',
            'default'=>'Paynl Fee',
             'type'=>'text',
             'description'=>'Additional Charge (Description)',
             'help' => 'This will show on the Invoice when paying via Paynl',
         ),
    )
); ?>

<?php print_heading('PayNL setup instructions:');?>

<p>Please signup for a PayNL account here: http://www.pay.nl </p>
