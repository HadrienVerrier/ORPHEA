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

switch ($_POST['type']) {
    case 'generate':
        $data = getPopUpData('logout', $lang);
        trender('pop-up', true);
        return;
        break;
    case 'validation':
        if ($_POST['response'] == 'true') {
            unset($_SESSION['username']);
            echo 'true';
        } else {

            echo 'false';
        }
        break;
}
