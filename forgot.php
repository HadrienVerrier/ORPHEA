<?php
//START PAGE SESSION
session_start();

require_once('php/function/page.php');

if (isset($_GET['token']) && isset($_GET['email_forgot'])) {

    require_once('php/function/database.php');
    db();
    //FIND IF TOKEN AND USERNAME ARE GOOD
    $result = request('SELECT M.password_date FROM members M WHERE M.password_token = :token AND M.email = :email', array('token' => htmlspecialchars($_GET['token']), 'email' => htmlspecialchars($_GET['email_forgot'])), true);
    if (isset($result['password_date'])) {
        $password_date = strtotime('+15 minutes', strtotime($result['password_date']));
        $dateToday = strtotime(time());
        //FIND IF TOKEN WAS GENERATAD LESS THAN 15 MINUTES
        if ($password_date < $dateToday) {
            echo 'time out';
            header('Location:index.php');
            exit();
        } else {
            new page("forgot");
        }
    } else {
        header('Location:index.php');
        exit();
    }
} else {
    header('Location:index.php');
    exit();
}
