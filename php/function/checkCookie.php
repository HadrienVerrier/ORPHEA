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
    case 'request':
        if ($_SESSION['cookie']) {
            $_SESSION['cookie_check'] = true;
            setAllCookies();
            echo 'true';
            return;
        } else {
            if (isset($_SESSION['cookie_check'])) {
                $_SESSION['cookie_check'] = true;
                echo 'true';
                return;
            } else {
                $_SESSION['cookie_check'] = true;
                echo 'false';
                return;
            }
        }
        break;
    case 'generate':

        $data = getPopUpData('cookie', $lang);
        trender('pop-up', true);
        return;
        break;
    case 'validation':
        if ($_POST['response'] == 'true') {
            setAllCookies();

            echo 'true';
        } else {
            deleteAllCookies();
            echo 'false';
        }
        break;
}
