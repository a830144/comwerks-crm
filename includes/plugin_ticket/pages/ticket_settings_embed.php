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

print_heading('Ticket Embed Form');
?>
<p>
    <?php _e('Place this in an iframe on your website, or as a link on your website, and people can submit support tickets.'); ?>
</p>
<p><a href="<?php echo module_ticket::link_public_new();?>" target="_blank"><?php echo module_ticket::link_public_new();?></a></p>

    <p>If you want to customise this ticket submit form, please open the ticket submit form and "View Source" in your web browser. Save this source to a file (eg: ticket.html) and upload it to your website (eg: yourwebsite.com/ticket.html). Test this form works on your website. If it works, open this form up in a web development tool (eg: PhpStorm, Dreamweaver or Notepad) and edit the form to suit your needs. As long as all the FORM and INPUT tags are left the same then the form should work. This way you can customise the form to look however you like (ie: match your website style).</p>