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

//UPDATE SWITCH 

switch ($type) {
    case 'username':
        if (!isset($_SESSION['pop'])) {
            $_SESSION['pop'] = true;

            sleep(1);
            $data = getPopUpData('update_username', $lang);
            trender('pop-up', true);
        } else {
            unset($_SESSION['pop']);
        }
        break;
    case 'password':
        if (!isset($_SESSION['pop'])) {
            $_SESSION['pop'] = true;

            sleep(1);
            $data = getPopUpData('update_password', $lang);
            trender('pop-up', true);
        } else {
            unset($_SESSION['pop']);
        }
        break;
    case 'delete':
        if (!isset($_SESSION['pop'])) {
            $_SESSION['pop'] = true;

            sleep(1);
            $data = getPopUpData('delete_account', $lang);
            trender('pop-up', true);
        } else {
            unset($_SESSION['pop']);
        }
        break;
}
