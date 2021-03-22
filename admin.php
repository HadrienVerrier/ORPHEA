<?php
//START PAGE SESSION
session_start();

if (isset($_POST['request'])) {
    if (isset($_SESSION['admin'])) {
        echo 'true';
        exit();
    } else {
        echo 'false';
        exit();
    }
}

require_once('php/function/page.php');

new page('admin');
