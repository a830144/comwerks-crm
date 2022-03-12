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
if($ticket_id > 0 && module_config::c('ticket_allow_billing',1) && module_ticket::can_edit_tickets()){
	$responsive_summary = array();
	$quotes = array();
	if(class_exists('module_quote',false) && module_quote::is_plugin_enabled()) {
		$quotes = module_quote::get_quotes( array( 'ticket_id' => $ticket_id ) );
		foreach($quotes as $quote){
			$responsive_summary[] = module_quote::link_open($quote['quote_id'],true,$quote);
		}
	}
	$fieldset_data = array(
        'heading' => array(
            'type' => 'h3',
            'title' => 'Ticket Billing',
	        'responsive' => array(
		        'summary' => implode(', ',$responsive_summary),
	        ),
        ),
        'class' => 'tableclass tableclass_form tableclass_full',
        'elements' => array(),
    );



    $fieldset_data['elements'][] = array(
        'title' => _l('Customer'),
        'fields' => array(
	        $ticket['customer_id'] ? module_customer::link_open($ticket['customer_id'],true) : '',
        )
    );
	if(class_exists('module_quote',false) && module_quote::is_plugin_enabled()){
		$quote_list = '';
		foreach($quotes as $quote){
			$public_link = module_quote::link_public($quote['quote_id']);
			$quote_list .= module_quote::link_open($quote['quote_id'],true,$quote) .' (<a href="' . $public_link . '" onclick="ucm.ticket.add_to_message($(this).data(\'link\'));return false;" data-link="<a href=\''.$public_link.'\'>View Quote</a>">insert link</a>) <br/>';
		}
		$fieldset_data['elements'][] = array(
	        'title' => _l('Quotes'),
	        'fields' => array(
		        $quote_list,
	            array(
	                'type' => 'button',
	                'name' => 'new_quote',
	                'value' => _l('New Quote'),
	                'onclick' => "window.location.href='".module_quote::link_open('new',false) . "&ticket_id=".$ticket_id."';",
	            ),
	        )
	    );
	}
	if(class_exists('module_invoice',false) && module_invoice::is_plugin_enabled()){
		$invoice_list = '';
		$invoices = module_invoice::get_invoices( array( 'ticket_id' => $ticket_id ) );
		foreach($invoices as $invoice){
			$public_link = module_invoice::link_public($invoice['invoice_id']);
			$invoice_list .= module_invoice::link_open($invoice['invoice_id'],true,$invoice) .' (<a href="' . $public_link . '" onclick="ucm.ticket.add_to_message($(this).data(\'link\'));return false;" data-link="<a href=\''.$public_link.'\'>View Invoice</a>">Insert link</a>) <br/>';
		}
		$fieldset_data['elements'][] = array(
	        'title' => _l('Invoices'),
	        'fields' => array(
		        $invoice_list,
	            array(
	                'type' => 'button',
	                'name' => 'new_invoice',
	                'value' => _l('New Invoice'),
	                'onclick' => "window.location.href='".module_invoice::link_open('new',false) . "&ticket_id=".$ticket_id."';",
	            ),
	        )
	    );
	}


    echo module_form::generate_fieldset($fieldset_data);
}