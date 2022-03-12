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

if(isset($_REQUEST['company_id'])){
    include('company_edit.php');
}else{

    $search = isset($_REQUEST['search']) ? $_REQUEST['search'] : array();
    $companys = $module->get_companys($search);

    if(module_config::c('company_unique_config') && !defined('COMPANY_UNIQUE_CONFIG')){
        ?>
     <div style="font-size: 20px; color:#FF0000; font-weight: bold;">
         Update: to use unique configuration per company please manually edit the file includes/config.php and add this line of code to the bottom:
         <pre>define('COMPANY_UNIQUE_CONFIG',true);</pre>
     </div>
        <?php
    }

    print_heading(array(
        'title' => 'System Companies',
        'type' => 'h2',
        'main' => true,
        'button' => array(
            'type' => 'add',
            'title' => 'Add New',
            'url' => module_company::link_open('new'),
        ),
    ));
    ?>


    <form action="" method="post">

    <table class="tableclass tableclass_rows tableclass_full">
        <thead>
        <tr class="title">
            <th><?php echo _l('Company Name'); ?></th>
        </tr>
        </thead>
        <tbody>
        <?php
        $c=0;
        foreach($companys as $company){ ?>
            <tr class="<?php echo ($c++%2)?"odd":"even"; ?>">
                <td class="row_action">
                    <?php echo module_company::link_open($company['company_id'],true);?>
                </td>
            </tr>
        <?php } ?>
      </tbody>
    </table>
    </form>
<?php } ?>