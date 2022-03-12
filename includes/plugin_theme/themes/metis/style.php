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
$styles = array();
/*
#wrap {
  background-color: #333;
}*/
$styles['#wrap,#menu,#footer']=array(
    'd'=>'Background',
    'v'=>array(
        'background-color' => '#333',
    )
);
/*.navbar-inverse {
background-color: #222;*/
$styles['.navbar-inverse']=array(
    'd'=>'Header Color',
    'v'=>array(
        'background-color' => '#222',
    )
);
/*
#top > .navbar {
	border-top: 3px solid #4a5b7d;
}*/
$styles['.inner']=array(
    'd'=>'Header Top Border',
    'v'=>array(
        'border-top' => '3px solid #4a5b7d',
    )
);
/*.user-media {
display: none;
background-color: #444444;
}*/
$styles['.user-media']=array(
    'd'=>'Sidebar Welcome',
    'v'=>array(
        'background-color' => '#444444',
    )
);
/*
.outer {
  padding: 10px;
  background-color: #6e6e6e;
}*/
$styles['.outer']=array(
    'd'=>'Content Outer Border',
    'v'=>array(
        'background-color' => '#6e6e6e',
    )
);
$styles['.inner']=array(
    'd'=>'Content Inner Border',
    'v'=>array(
        'border-color' => '#e4e4e4',
    )
);
$styles['#menu > li > a']=array(
    'd'=>'Menu',
    'v'=>array(
        'color' => '#ccc',
        'border-top' => '1px solid rgba(0, 0, 0, 0.3)',
        'text-shadow' => '0 1px 0 rgba(0, 0, 0, 0.5)',
    )
);
$styles['sidebar-position']=array(
    'd'=>'other-settings',
    'elements'=>array(
        array(
            'title' => 'Sidebar Position',
            'field' => array(
                'type' => 'select',
                'name' => 'config[_theme_metissidebar-position]',
                'options' => array(
                    'left' => _l('Left'),
                    'right' => _l('Right'),
                ),
                'value' => module_theme::get_config('metissidebar-position','left'),
            )
        ),
        array(
            'title' => 'Page Width',
            'field' => array(
                'type' => 'select',
                'name' => 'config[_theme_metispagewidth]',
                'options' => array(
                    'wide' => _l('Wide Fluid'),
                    'narrow' => _l('Narrow Fixed'),
                ),
                'value' => module_theme::get_config('metispagewidth','wide'),
            )
        ),
        array(
            'title' => 'Menu Style',
            'field' => array(
                'type' => 'select',
                'name' => 'config[_theme_metismenustyle]',
                'options' => array(
                    'fixed' => _l('Fixed on Scroll'),
                    'normal' => _l('Normal'),
                ),
                'value' => module_theme::get_config('metismenustyle','normal'),
            )
        ),
    )
);
