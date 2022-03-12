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

$group_id = (int)$_REQUEST['group_id'];
$group = array();
if($group_id>0){

    if(class_exists('module_security',false)){
        module_security::check_page(array(
            'category' => 'Group',
            'page_name' => 'Groups',
            'module' => 'group',
            'feature' => 'edit',
        ));
    }
	$group = module_group::get_group($group_id);
}else{
}
if(!$group){
    die('Creating groups this way is disabled');
    $group_id = 'new';
	$group = array(
		'group_id' => 'new',
		'name' => '',
		'default_text' => '',
	);
	module_security::sanatise_data('group',$group);
}
?>
<form action="" method="post">

      <?php
module_form::prevent_exit(array(
    'valid_exits' => array(
        // selectors for the valid ways to exit this form.
        '.submit_button',
    ))
);
?>

    
	<input type="hidden" name="_process" value="save_group" />
	<input type="hidden" name="group_id" value="<?php echo $group_id; ?>" />

    <?php

    $fieldset_data = array(
	    'heading' => array(
		    'type' => 'h3',
		    'title' => _l('Edit Group'),
	    ),
	    'class' => 'tableclass tableclass_form tableclass_full',
	    'elements' => array(
		    array(
			    'title' => _l('Group Name'),
			    'field' => array(
				    'type' => 'text',
				    'name' => 'name',
				    'value' => $group['name'],
			    ),
		    ),
		    array(
			    'title' => _l('Available to'),
			    'fields' => array(
				    $group['owner_table']
			    ),
		    ),
	    )
    );


    echo module_form::generate_fieldset($fieldset_data);

    $form_actions = array(
	    'class' => 'action_bar action_bar_center',
	    'elements' => array(
		    array(
			    'type' => 'save_button',
			    'name' => 'butt_save',
			    'value' => 'Save',
		    ),
		    array(
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
