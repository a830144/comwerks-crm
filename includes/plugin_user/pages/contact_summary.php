<table width="100%" border="0" cellspacing="0" cellpadding="2" class="tableclass tableclass_form">
	<tbody>
		<tr>
			<th class="width1">
				<?php 
/** 
  * Copyright: dtbaker 2012
  * Licence: Please check CodeCanyon.net for licence details. 
  * More licence clarification available here:  http://codecanyon.net/wiki/support/legal-terms/licensing-terms/ 
  * Deploy: 11802 7369f9a61c2e79f820350e955c52cf4b
  * Envato: 31249ba5-dbc2-4eab-bc75-b0df6eb45c51
  * Package Date: 2016-12-01 15:01:26 
  * IP Address: 219.75.80.95
  */ echo _l('Contact Name'); ?>
			</th>
			<td>
				<?php echo $user_data['name'];?>
				<a href="<?php echo $this->link_open_contact($user_id);?>">&raquo;</a>
			</td>
		</tr>
		<tr>
			<th>
				<?php echo _l('Phone'); ?>
			</th>
			<td>
				<?php echo $user_data['phone'];?>
				&nbsp;&nbsp;<strong>Ext. <?php echo $user_data['phone_ext'];?></strong>
			</td>
		</tr>
		<tr>
			<th>
				<?php echo _l('Mobile'); ?>
			</th>
			<td>
				<?php echo $user_data['mobile'];?>
			</td>
		</tr>
		<tr>
			<th>
				<?php echo _l('Fax'); ?>
			</th>
			<td>
				<?php echo $user_data['fax'];?>
			</td>
		</tr>
		<tr>
			<th>
				<?php echo _l('Email'); ?>
			</th>
			<td>
				<a href="mailto:<?php echo $user_data['email'];?>"><?php echo $user_data['email'];?></a>
			</td>
		</tr>
	</tbody>
</table>