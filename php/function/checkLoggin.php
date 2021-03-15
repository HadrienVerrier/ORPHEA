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
//CHECK IF USERNAME EXIST

if (isset($_POST['nickname']) && isset($_POST['password'])) {

    $nickname = request('SELECT COUNT(nickname) AS nb FROM members WHERE nickname = :nickname OR email = :nickname', array('nickname' => htmlspecialchars($_POST['nickname'])), true)['nb'];
    $request->closeCursor();
    if ($nickname > 0 && $nickname < 2) {
        //CHECK PASSWORD 
        if (preg_match("#^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$#", $_POST['password'])) {
            $password_hash = request('SELECT M.password FROM members M WHERE M.nickname = :nickname OR email = :nickname', array('nickname' => $_POST['nickname']), true)['password'];
            $request->closeCursor();
            if (password_verify($_POST['password'], $password_hash)) {
                $_SESSION['username'] = $_POST['nickname'];
                echo 'success';
            } else {
                $data = getPopUpData('log', $lang);
                trender('pop-up', true);
            }
        } else {
            $data = getPopUpData('log', $lang);
            trender('pop-up', true);
        }
    } else {
        $data = getPopUpData('log', $lang);
        trender('pop-up', true);
    }
} else {
    header("HTTP/1.0 403 Not Found");
    exit();
}
