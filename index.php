<?php
require_once('php/function/page.php');
$data = array(
    'page' => 'index',
    'doctype' => array(
        'lang' => 'fr',
        'description' => 'description',
        'keywords' => 'keywords',
        'page_title' => 'Accueil'
    )

);

trender($data["page"], false);
