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


if ($_POST['page'] === 'dashboard') {
    if (loggin()) {
        //GET MISC MAIN DATA 
        $data['misc'] = getMiscData($lang);

        //GET MAIN DATA IN RIGHT LANGUAGE
        $data['main'] = getMainData($_POST['page'], $lang);

        //RENDER WITH TWIG THE MAIN AND SEND TO AJAX
        trender($_POST['page'], true);
    } else {
        echo 'failure';
    }
} else {
    //GET MISC MAIN DATA 
    $data['misc'] = getMiscData($lang);

    //GET MAIN DATA IN RIGHT LANGUAGE
    $data['main'] = getMainData($_POST['page'], $lang);

    //RENDER WITH TWIG THE MAIN AND SEND TO AJAX
    trender($_POST['page'], true);
}
