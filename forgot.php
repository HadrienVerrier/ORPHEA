<?php
//START PAGE SESSION
session_start();
date_default_timezone_set("Europe/Paris");
require_once('php/function/page.php');

if (isset($_GET['token']) && isset($_GET['email_forgot'])) {

    require_once('php/function/database.php');
    db();
    //FIND IF TOKEN AND USERNAME ARE GOOD
    $result = request('SELECT M.password_date FROM members M WHERE M.password_token = :token AND M.email = :email', array('token' => htmlspecialchars($_GET['token']), 'email' => htmlspecialchars($_GET['email_forgot'])), true);
    if (isset($result['password_date'])) {
        $password_date = strtotime('+15 minutes', strtotime($result['password_date']));
        $dateToday = strtotime(date_default_timezone_set("Europe/Paris"), date_default_timezone_set("Europe/Paris"));
        //FIND IF TOKEN WAS GENERATAD LESS THAN 15 MINUTES
        if ($password_date < $dateToday) {
            echo date('H:i:s');
            echo 'out';
            // header('Location:index.php');
            exit();
        } else {
            new page("forgot");
        }
    } else {
        echo 'pas de date';
        // header('Location:index.php');
        exit();
    }
} else {
    echo 'no';
    // header('Location:index.php');
    exit();
}
