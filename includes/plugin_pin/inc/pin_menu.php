<li id="top_menu_pin">
	<div id="top_menu_pin_options">
		<div class="pin_title">
			<?php 
/** 
  * Copyright: dtbaker 2012
  * Licence: Please check CodeCanyon.net for licence details. 
  * More licence clarification available here:  http://codecanyon.net/wiki/support/legal-terms/licensing-terms/ 
  * Deploy: 11802 7369f9a61c2e79f820350e955c52cf4b
  * Envato: 31249ba5-dbc2-4eab-bc75-b0df6eb45c51
  * Package Date: 2016-12-01 15:01:26 
  * IP Address: 219.75.80.95
  */ if(module_pin::can_i('create','Header Pin')){ ?>
				<a href="#" id="pin_current_page"><?php _e('Pin Current Page +');?></a>
			<?php } ?>
			<?php _e('Quick Pin');?>
		</div>
		<ul id="pin_options">
			<?php foreach($this->get_pins() as $pin_id => $pin){ ?>
				<li rel="<?php echo $pin_id;?>">
					<div class="top_menu_pin_actions">
						<?php if(module_pin::can_i('edit','Header Pin')){ ?>
							<a href="#" class="top_menu_pin_edit">[e]</a>
						<?php } ?>
						<?php if(module_pin::can_i('delete','Header Pin')){ ?>
							<a href="#" class="top_menu_pin_delete">[x]</a>
						<?php } ?>
					</div>
					<a href="<?php echo $pin[0];?>" class="top_menu_pin_item"><?php echo htmlspecialchars($pin[1]);?></a>
				</li>
			<?php } ?>
		</ul>

		<form action="" method="post" id="pin_action_form">
			<input type="hidden" name="pin_process" value="pin_save">
			<input type="hidden" name="pin_id" id="pin_id" value="">
			<input type="hidden" name="current_url" value="<?php echo htmlspecialchars($_SERVER['REQUEST_URI']);?>">
			<input type="hidden" name="current_title" id="pin_current_title" value="">
			<input type="hidden" name="pin_action" id="pin_action" value="">
		</form>
	</div>
	<a href="#" title="<?php _e('Pin');?>"><?php _e('Pin');?></a>
</li>