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


if(!$module->can_i('view','Products') || !$module->can_i('edit','Products')){
    redirect_browser(_BASE_HREF);
}

// done in product_admin
//$product_id = (int)$_REQUEST['product_id'];
//$product = array();
//$product = module_product::get_product($product_id);

// check permissions.
if(class_exists('module_security',false)){
    if($product_id>0 && $product['product_id']==$product_id){
        // if they are not allowed to "edit" a page, but the "view" permission exists
        // then we automatically grab the page and regex all the crap out of it that they are not allowed to change
        // eg: form elements, submit buttons, etc..
		module_security::check_page(array(
            'category' => 'Product',
            'page_name' => 'Products',
            'module' => 'product',
            'feature' => 'Edit',
		));
    }else{
		module_security::check_page(array(
			'category' => 'Product',
            'page_name' => 'Products',
            'module' => 'product',
            'feature' => 'Create',
		));
	}
	module_security::sanatise_data('product',$product);
}

?>
<form action="" method="post" id="product_form">
	<input type="hidden" name="_process" value="save_product" />
	<input type="hidden" name="product_id" value="<?php echo $product_id; ?>" />

    <?php
    module_form::set_required(array(
        'fields' => array(
            'name' => 'Name',
        ))
    );
    module_form::prevent_exit(array(
        'valid_exits' => array(
            // selectors for the valid ways to exit this form.
            '.submit_button',
        ))
    );

    hook_handle_callback('layout_column_half',1);

	$fieldset_data = array(
	    'heading' => array(
	        'type' => 'h3',
	        'title' => 'Product Information',
	    ),
	    'class' => 'tableclass tableclass_form tableclass_full',
	    'elements' => array(),
	);
	$fieldset_data['elements'][] = array(
	    'title' => 'Name',
	    'fields' => array(
	        array(
	            'type' => 'text',
	            'name' => 'name',
	            'value' => $product['name'],
	        ),
	    )
	);
	$fieldset_data['elements'][] = array(
	    'title' => 'Category',
	    'fields' => array(
	        array(
	            'type' => 'select',
	            'name' => 'product_category_id',
		        'options' => module_product::get_product_categories(),
		        'options_array_id' => 'product_category_name',
	            'value' => $product['product_category_id'],
	        ),
	    )
	);
	$fieldset_data['elements'][] = array(
	    'title' => 'Quantity',
	    'fields' => array(
	        array(
	            'type' => 'text',
	            'name' => 'quantity',
	            'value' => $product['quantity'],
	        ),
	    )
	);
	$fieldset_data['elements'][] = array(
	    'title' => 'Amount',
	    'fields' => array(
	        array(
	            'type' => 'currency',
	            'name' => 'amount',
	            'value' => $product['amount'],
	        ),
	    )
	);
	$fieldset_data['elements'][] = array(
	    'title' => 'Description',
	    'fields' => array(
	        array(
	            'type' => module_config::c('long_description_wysiwyg',1) ? 'wysiwyg' : 'textarea',
	            'name' => 'description',
	            'value' => $product['description'],
	        ),
	    )
	);
    $types = module_job::get_task_types();
    $types['-1'] = _l('Default');
	$fieldset_data['elements'][] = array(
	    'title' => 'Task Type',
	    'fields' => array(
	        array(
	            'type' => 'select',
	            'name' => 'default_task_type',
		        'options' => $types,
	            'value' => isset($product['default_task_type']) ? $product['default_task_type'] : -1,
		        'blank' => false,
	            'help' => 'If the task type is "Default" it will use whatever the Quote/Job/Invoice task type is set to'
	        ),
	    )
	);
    $fieldset_data['elements'][] = array(
	    'title' => 'Quantity Unit',
	    'fields' => array(
		    array(
			    'type' => 'text',
			    'name' => 'unitname',
			    'value' => isset($product['unitname']) ? $product['unitname'] : '',
			    'help' => 'This Unit name will appear on Quotes/Jobs/Invoices. e.g. Kg, Grams, Boxes. '
		    ),
	    )
    );
	$fieldset_data['elements'][] = array(
	    'title' => 'Billable',
	    'fields' => array(
	        array(
	            'type' => 'checkbox',
	            'name' => 'billable',
	            'value' => isset($product['billable']) ? $product['billable'] : 1,
	        ),
	    )
	);
	$fieldset_data['elements'][] = array(
	    'title' => 'Taxable',
	    'fields' => array(
	        array(
	            'type' => 'checkbox',
	            'name' => 'taxable',
	            'value' => isset($product['taxable']) ? $product['taxable'] : 1,
	        ),
	    )
	);

    if(class_exists('module_extra',false) && module_extra::is_plugin_enabled() && module_extra::can_i('view','Products')){
	    $fieldset_data['extra_settings'] = array(
		    'owner_table' => 'product',
		    'owner_key' => 'product_id',
		    'owner_id' => $product_id,
		    'layout' => 'table_row',
		    'allow_new' => module_extra::can_i('create','Products'),
		    'allow_edit' => module_extra::can_i('edit','Products'),
	    );
    }

	echo module_form::generate_fieldset($fieldset_data);
	unset($fieldset_data);

    hook_handle_callback('layout_column_half',2);

    $fieldset_data = array(
	    'heading' => array(
		    'type' => 'h3',
		    'title' => 'Basic Inventory',
	    ),
	    'class' => 'tableclass tableclass_form tableclass_full',
	    'elements' => array(),
    );
    $fieldset_data['elements'][] = array(
	    'message' => 'Stock/Inventory levels will be deducted automatically once a product is added to an invoice. Stock levels are shown below for reference.',
    );
    $fieldset_data['elements'][] = array(
	    'title' => 'Enable Inventory',
	    'fields' => array(
		    array(
			    'type' => 'check',
			    'name' => 'inventory_control',
			    'value' => 1,
			    'checked' => !empty($product['inventory_control'])
		    ),
	    )
    );
    $fieldset_data['elements'][] = array(
	    'title' => 'Current Inventory',
	    'fields' => array(
		    array(
			    'type' => 'text',
			    'name' => 'inventory_level_current',
			    'value' => isset($product['inventory_level_current']) ? $product['inventory_level_current'] : 0,
			    'help' => 'Number of products you currently have in stock. This number will decrease each time a product is added to an invoice.',
		    ),
		    //' <!-- '.$product['inventory_level'].' -->'
	    )
    );
    $fieldset_data['elements'][] = array(
	    'title' => 'Cost Price',
	    'fields' => array(
		    array(
			    'type' => 'currency',
			    'name' => 'purchase_price',
			    'value' => isset($product['purchase_price']) ? $product['purchase_price'] : 0,
			    'help' => 'Optional: cost price of this product when purchasing from supplier',
		    ),
	    )
    );
    /*$fieldset_data['elements'][] = array(
	    'title' => 'Supplier',
	    'fields' => array(
		    array(
			    'type' => 'html',
			    'name' => 'name',
			    'value' => ' choose a customer ',
			    'help' => 'This is optional.'
		    ),
	    )
    );*/
    if((int)$product_id > 0 && class_exists('module_log',false) && module_log::is_plugin_enabled()) {
	    $history = module_log::log_history('inventory',$product_id);
	    if($history) {
		    $fieldset_data['elements'][] = array(
			    'title'  => 'Inventory History',
			    'fields' => array(
				    array(
					    'type'  => 'html',
					    'value' => $history,
				    ),
			    )
		    );
	    }
	    $fieldset_data['elements'][] = array(
		    'title'  => 'Product Usage',
		    'fields' => array(
			    function () use ( $product_id ) {
				    $usages = module_product::get_product_usage( $product_id );
				    foreach($usages as $usage){
					    ?>
					    <div class="product_usage">
						    <strong><?php echo $usage['title'];?></strong>: <?php echo $usage['count'];?> products
						    <div class="product_usage_items">
							    <ul>
								    <?php foreach($usage['items'] as $item){ ?>
						            <li><?php echo $item['link'];?>: (<?php echo $item['text'];?>) Quantity: <?php echo $item['count'];?> Date: <?php echo print_date($item['date']);?></li>
						            <?php } ?>
							    </ul>
						    </div>
					    </div>
					    <?php
				    }

		        }
		    )
	    );
    }
    echo module_form::generate_fieldset($fieldset_data);
    unset($fieldset_data);

    hook_handle_callback('layout_column_half','end');

    $form_actions = array(
        'class' => 'action_bar action_bar_center',
        'elements' => array(
            array(
                'type' => 'save_button',
                'name' => 'butt_save',
                'value' => _l('Save'),
            ),
            array(
	            'ignore' => !(int)$product_id,
                'type' => 'delete_button',
                'name' => 'butt_del',
                'value' => _l('Delete'),
            ),
            array(
                'type' => 'button',
                'name' => 'cancel',
                'value' => _l('Cancel'),
                'class' => 'submit_button',
                'onclick' => "window.location.href='".$module->link_open(false)."';",
            ),
        ),
    );
    echo module_form::generate_form_actions($form_actions);

    ?>

</form>

