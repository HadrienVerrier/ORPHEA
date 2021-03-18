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
                if (preg_match("#^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$#", $_POST['password'])) {
                    $results = request("SELECT M.password FROM members M WHERE M.nickname = :username", array("username" => htmlspecialchars($_POST['current_username'])), true);
                    if (password_verify($_POST['password'], $results['password'])) {
                        $_SESSION['username'] = $_POST['new_username'];
                        request("UPDATE members SET nickname = :new_username WHERE nickname = :username", array('new_username' => htmlspecialchars($_POST['new_username']), 'username' => htmlspecialchars($_POST['current_username'])), false);
                        $data = getPopUpData('valid_update_username', $lang);
                        trender('pop-up', true);
                    }
                } else {
                    //PASSWORD IS NOT GOOD
                    $data = getPopUpData('rules', $lang);
                    trender('pop-up', true);
                }
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
            sleep(1);
            unset($_SESSION['pop']);

            if ($_POST['username'] == $_SESSION['username']) {
                if (preg_match("#^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$#", $_POST['old_password']) && preg_match("#^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$#", $_POST['new_password'])) {
                    if ($_POST['new_password'] == $_POST['new_password_c']) {
                        $results = request("SELECT M.password FROM members M WHERE M.nickname = :username", array("username" => htmlspecialchars($_POST['username'])), true);
                        if (password_verify($_POST['old_password'], $results['password'])) {

                            request("UPDATE members SET password = :password WHERE nickname = :username", array('password' => password_hash($_POST['new_password'], PASSWORD_BCRYPT), 'username' => htmlspecialchars($_POST['username'])), false);
                            $data = getPopUpData('valid_update_password', $lang);
                            trender('pop-up', true);
                        }
                    } else {
                        sleep(1);
                        //PASSWORD NOT MATCH
                        $data = getPopUpData('match', $lang);
                        trender('pop-up', true);
                    }
                } else {
                    //PASSWORD IS NOT GOOD
                    $data = getPopUpData('rules', $lang);
                    trender('pop-up', true);
                }
            }
        }
        break;
    case 'delete':
        if (!isset($_SESSION['pop'])) {
            $_SESSION['pop'] = true;

            sleep(1);
            $data = getPopUpData('delete_account', $lang);
            trender('pop-up', true);
        } else {
            sleep(1);
            request('DELETE FROM `members` WHERE `members`.`nickname` = :username ', array('username' => $_SESSION['username']), false);
            unset($_SESSION['pop']);
            session_unset();
            session_regenerate_id();
            session_destroy();
            echo 'success';
        }
        break;
    case 'pop':
        unset($_SESSION['pop']);
        break;
}
