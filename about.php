<?php
require_once('php/function/page.php');
$data = array(
    'page' => 'about',
    'doctype' => array(
        'lang' => 'fr',
        'description' => 'description',
        'keywords' => 'keywords',
        'page_title' => 'About'
    )

);

trender($data['page'], false);
