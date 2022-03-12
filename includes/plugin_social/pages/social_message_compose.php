

<table class="tableclass tableclass_full tableclass_rows">
    <thead>
    <tr class="title">
        <th><?php 
/** 
  * Copyright: dtbaker 2012
  * Licence: Please check CodeCanyon.net for licence details. 
  * More licence clarification available here:  http://codecanyon.net/wiki/support/legal-terms/licensing-terms/ 
  * Deploy: 11802 7369f9a61c2e79f820350e955c52cf4b
  * Envato: 31249ba5-dbc2-4eab-bc75-b0df6eb45c51
  * Package Date: 2016-12-01 15:01:26 
  * IP Address: 219.75.80.95
  */ echo _l('Social Accounts'); ?></th>
        <th><?php echo _l('Compose'); ?></th>
    </tr>
    </thead>
    <tbody>
	<?php
	$c=0;
	if(module_social::can_i('create','Facebook Comments','Social','social')) {
		$accounts = module_social_facebook::get_accounts();
		foreach ( $accounts as $account ) {
			$facebook_account = new ucm_facebook_account( $account['social_facebook_id'] );
			?>
			<tr class="<?php echo ( $c ++ % 2 ) ? "odd" : "even"; ?>">
				<td class="row_action">
					<img src="<?php echo _BASE_HREF; ?>includes/plugin_social_facebook/images/facebook.png"
					     class="facebook_icon">
					<?php echo htmlspecialchars( $facebook_account->get( 'facebook_name' ) ); ?>
					<br/>
				</td>
				<td>
					<a href="<?php echo module_social_facebook::link_open_facebook_message($account['social_facebook_id'],false);?>" class="socialfacebook_message_open social_modal btn btn-success btn-sm" data-modal-title="<?php _e( 'Compose Post' );?>"><?php _e( 'Compose Post' );?></a>
				</td>
			</tr>
		<?php
		}
	}

	if(module_social::can_i('create','Twitter Comments','Social','social')) {
		$accounts = module_social_twitter::get_accounts();
		foreach ( $accounts as $account ) {
			$twitter_account = new ucm_twitter_account($account['social_twitter_id']);
			?>
			<tr class="<?php echo ( $c ++ % 2 ) ? "odd" : "even"; ?>">
				<td class="row_action">
					<img src="<?php echo _BASE_HREF; ?>includes/plugin_social_twitter/images/twitter-logo.png"
					     class="twitter_icon">
					<?php echo htmlspecialchars( $twitter_account->get( 'account_name' ) ); ?>
					<br/>
				</td>
				<td>
					<a href="<?php echo module_social_twitter::link_open_twitter_message($account['social_twitter_id'],false);?>" class="socialtwitter_message_open social_modal btn btn-success btn-sm" data-modal-title="<?php echo _l('Compose Tweet');?>"><?php _e( 'Compose Tweet' );?></a>
				</td>
			</tr>
		<?php
		}
	} ?>
  </tbody>
</table>


