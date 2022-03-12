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

// check permissions.
if(class_exists('module_security',false)){
    if($product_category_id>0 && $product_category['product_category_id']==$product_category_id){
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
	module_security::sanatise_data('product',$product_category);
}

?>
<form action="" method="post" id="product_category_form">
	<input type="hidden" name="_process" value="save_product_category" />
	<input type="hidden" name="product_category_id" value="<?php echo (int)$product_category_id; ?>" />

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
	            'name' => 'product_category_name',
	            'value' => $product_category['product_category_name'],
	        ),
	    )
	);

	echo module_form::generate_fieldset($fieldset_data);
	unset($fieldset_data);


    $form_actions = array(
        'class' => 'action_bar action_bar_center',
        'elements' => array(
            array(
                'type' => 'save_button',
                'name' => 'butt_save',
                'value' => _l('Save'),
            ),
            array(
	            'ignore' => !(int)$product_category_id,
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

