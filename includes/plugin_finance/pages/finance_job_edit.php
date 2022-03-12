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
$transactions = module_finance::get_finances(array('job_id'=>$job_id));

ob_start();
?>

<div class="content_box_wheader">
    <table class="tableclass tableclass_rows tableclass_full">
       <thead>
        <tr class="title">
            <th><?php echo _l('Date'); ?></th>
            <th><?php echo _l('Name'); ?></th>
            <th><?php echo _l('Description'); ?></th>
            <th><?php echo _l('Credit'); ?></th>
            <th><?php echo _l('Debit'); ?></th>
        </tr>
        </thead>
        <tbody>
            <?php
            $c=0;
            foreach($transactions as $transaction){
                ?>
                <tr class="<?php echo ($c++%2)?"odd":"even"; ?>">
                    <td class="row_action">
                        <?php echo print_date($transaction['transaction_date']); ?>
                    </td>
                    <td>
                        <a href="<?php echo $transaction['url'];?>"><?php echo !trim($transaction['name']) ? 'N/A' :    htmlspecialchars($transaction['name']);?></a>
                    </td>
                    <td>
                        <?php echo $transaction['description']; ?>
                    </td>
                    <td>
                        <span class="success_text"><?php echo $transaction['credit'] > 0 ? '+'.dollar($transaction['credit'],true,$transaction['currency_id']) : '';?></span>
                    </td>
                    <td>
                        <span class="error_text"><?php echo $transaction['debit'] > 0 ? '-'.dollar($transaction['debit'],true,$transaction['currency_id']) : '';?></span>
                    </td>
                </tr>
            <?php } ?>
        </tbody>
    </table>
</div>
<?php

$fieldset_data = array(
    'heading' =>  array(
        'title'=>'Job Finances:',
        'type'=>'h3',
        'button'=>array(
            'title'=>_l('Add New'),
            'url'=>module_finance::link_open('new').'&from_job_id='.$job_id,
        )
    ) ,
    'elements_before' => ob_get_clean(),
);
echo module_form::generate_fieldset($fieldset_data);

