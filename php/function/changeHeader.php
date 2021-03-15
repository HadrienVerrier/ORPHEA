<?php

//START PAGE SESSION
session_start();

//REQUIRE SOME FUNCTIONS
require_once(dirname(__FILE__, 3) . '/php/function/page.php');
require_once(dirname(__FILE__, 3) . '/php/function/database.php');

//CREATE DB OBJECT
db();

//RIGHT LANGUAGE
if (isset($_SESSION['lang'])) {
    $lang = $_SESSION['lang'];
} else {
    $lang = 'en';
}


//GET MISC MAIN DATA 
$data['misc'] = getMiscData($lang);

//GET HEADER DATA IN RIGHT LANGUAGE
$data['header'] = getHeaderData($lang, $_POST['pageName']);

//RENDER WITH TWIG THE MAIN AND SEND TO AJAX
trender('header', true);
