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
// $_SESSION['username'] = "HadV";
// $_POST['type'] = 'username';
// $_POST['current_username'] = 'HadV';
// $_POST['new_username'] = 'HadVE';
// $_POST['password'] = '0201Hb**';

switch ($_POST['type']) {
    case 'username':
        if (!isset($_SESSION['pop'])) {
            $_SESSION['pop'] = true;

            sleep(1);
            $data = getPopUpData('update_username', $lang);
            trender('pop-up', true);
        } else {
            sleep(1);
            unset($_SESSION['pop']);

            if ($_POST['current_username'] == $_SESSION['username']) {

                $results = request("SELECT M.password FROM members M WHERE M.nickname = :username", array("username" => $_POST['current_username']), true);
                if (password_verify($_POST['password'], $results['password'])) {
                    $_SESSION['username'] = $_POST['new_username'];
                    request("UPDATE members SET nickname = :new_username WHERE nickname = :username", array('new_username' => $_POST['new_username'], 'username' => $_POST['current_username']), false);
                    $data = getPopUpData('valid_update_username', $lang);
                    trender('pop-up', true);
                }
            } else {
            }
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
    case 'pop':
        unset($_SESSION['pop']);
        break;
}
