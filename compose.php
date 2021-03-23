<?php
//START PAGE SESSION
session_start();

require_once('php/function/page.php');

if (!loggin()) {
    session_destroy();
    session_regenerate_id();
    header('Location:login.php');
    exit();
}

new page('compose');
