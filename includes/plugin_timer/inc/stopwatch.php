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

$latest = $timer->get_latest();
if($latest){
	$hhmmss = $timer->get_total_time( );
}else{
	$hhmmss = '00:00:00';
}
$hhmmss = explode(':', $hhmmss);

if( $timer->timer_status != _TIMER_STATUS_CLOSED && $timer->timer_status != _TIMER_STATUS_AUTOMATIC ) {

	?>
    <div id="main_page_timer" data-duration="<?php echo time() - $latest['start_time']; ?>"
         data-total-time="<?php echo $timer->get_total_time( false, true ) - ( time() - $latest['start_time'] ); ?>">
        <div class="timer-clock">
            <span class="hours"><?php echo $hhmmss[0];?></span> :
            <span class="minutes"><?php echo $hhmmss[1];?></span> :
            <span class="seconds"><?php echo $hhmmss[2];?></span>
        </div>
        <div class="timer-controls">
			<?php
			switch ( $latest['timer_status'] ) {
                case _TIMER_STATUS_RUNNING:
                    ?>
                    <button type="submit" name="start_pause"
                            class="start_pause submit_button btn btn-danger"><?php _e( 'Pause Timer' ); ?></button>
                    <script type="text/javascript">
                        $(function () {
                            var main_timer = new ucm.timer.timer_object();
                            main_timer.init($('#main_page_timer'));
                        });
                    </script>
                    <?php
                    break;
                default:
                    // start a new timer.
                    if($latest){
                    ?>
                        <button type="submit" name="start_pause"
                                class="start_pause submit_button btn btn-primary"><?php _e( 'Resume Timer' ); ?></button>
                        <button type="submit" name="close_timer"
                                class="submit_button btn"><?php _e( 'Finish Timer' ); ?></button>
                        <?php
                    }else{
                        ?>
                        <button type="submit" name="start_pause"
                                class="start_pause submit_button btn btn-primary"><?php _e( 'Start Timer' ); ?></button>
                        <?php
                    }
                    break;
			}
			?>
        </div>
    </div>
	<?php
}else{
    ?>
    <div id="main_page_timer">
        <div class="timer-clock">
            <span class="hours"><?php echo $hhmmss[0];?></span> :
            <span class="minutes"><?php echo $hhmmss[1];?></span> :
            <span class="seconds"><?php echo $hhmmss[2];?></span>
        </div>
        <?php if($timer->timer_status == _TIMER_STATUS_AUTOMATIC ){ ?>
            <button type="submit" name="close_timer"
                    class="submit_button btn"><?php _e( 'End Automatic Timer' ); ?></button>
        <?php } ?>

    </div>
    <?php
}
?>