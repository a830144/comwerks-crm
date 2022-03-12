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

if(!module_config::can_i('view','Settings') || !module_faq::can_i('edit','FAQ')){
    redirect_browser(_BASE_HREF);
}

$module->page_title = 'FAQ Settings';

$links = array(
    array(
        "name"=>'FAQ Products',
        'm' => 'faq',
        'p' => 'faq_products',
        'force_current_check' => true,
        'order' => 1, // at start.
        'menu_include_parent' => 1,
        'allow_nesting' => 1,
        'args'=>array('faq_id'=>false,'faq_product_id'=>false),
    ),
    array(
        "name"=>'Questions & Answers',
        'm' => 'faq',
        'p' => 'faq_questions',
        'force_current_check' => true,
        'order' => 2, // at start.
        'menu_include_parent' => 1,
        'allow_nesting' => 1,
        'args'=>array('faq_id'=>false,'faq_product_id'=>false),
    ),
    array(
        "name"=>'Settings',
        'm' => 'faq',
        'p' => 'faq_settings_basic',
        'force_current_check' => true,
        'order' => 3, // at start.
        'menu_include_parent' => 1,
        'allow_nesting' => 1,
        'args'=>array('faq_id'=>false,'faq_product_id'=>false),
    ),
);
