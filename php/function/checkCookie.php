<?php
session_start();
require_once('page.php');

switch ($_POST['type']) {
    case 'request':
        if ($_SESSION['cookie']) {
            $_SESSION['cookie_check'] = true;
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
        $data = array('type' => 'cookie');
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
