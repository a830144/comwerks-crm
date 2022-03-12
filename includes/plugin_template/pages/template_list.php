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

$search = isset($_REQUEST['search']) ? $_REQUEST['search'] : array();
$templates = module_template::get_templates($search);

print_heading(array(
        'title' => 'System Templates',
        'type' => 'h2',
        'main' => true,
        'button' => array(
            'url' => module_template::link_open('new'),
            'title' => 'Add New',
            'type' => 'add',
        ),
    ));
?>


<form action="" method="post">

<table width="100%" border="0" cellspacing="0" cellpadding="2" class="tableclass tableclass_rows">
	<thead>
	<tr class="title">
		<th><?php echo _l('Template Name'); ?></th>
		<th><?php echo _l('Template Description'); ?></th>
    </tr>
    </thead>
    <tbody>
    <?php
	$c=0;
	foreach($templates as $template){
        $template = module_template::get_template($template['template_id']);
        ?>
        <tr class="<?php echo ($c++%2)?"odd":"even"; ?>">
            <td class="row_action">
	            <?php echo module_template::link_open($template['template_id'],true);?>
            </td>
			<td>
				<?php echo htmlspecialchars($template['description']); ?>
			</td>
        </tr>
	<?php } ?>
  </tbody>
</table>
</form>