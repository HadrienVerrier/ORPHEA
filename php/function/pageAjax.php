<?php
//START PAGE SESSION
session_start();

//REQUIRE SOME FUNCTIONS
require_once(dirname(__FILE__, 3) . '/php/function/page.php');
require_once(dirname(__FILE__, 3) . '/php/function/database.php');

//CREATE DB OBJECT
db();

//RIGHT LANGUAGE
$lang = $_SESSION['lang'];

if ($_POST['page'] === 'dashboard') {
    //GET MISC MAIN DATA 
    $data['misc'] = getMiscData($lang);

    //GET MAIN DATA IN RIGHT LANGUAGE
    $data['main'] = getMainData($_POST['page'], $lang);

    //RENDER WITH TWIG THE MAIN AND SEND TO AJAX
    trender($_POST['page'], true);
} else {
    //GET MISC MAIN DATA 
    $data['misc'] = getMiscData($lang);

    //GET MAIN DATA IN RIGHT LANGUAGE
    $data['main'] = getMainData($_POST['page'], $lang);

    //RENDER WITH TWIG THE MAIN AND SEND TO AJAX
    trender($_POST['page'], true);
}
