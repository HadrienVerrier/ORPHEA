<?php
//START PAGE SESSION
session_start();

require_once('php/class/_page.php');

if (!isset($_SESSION['username'])) {
    session_destroy();
    session_regenerate_id();
    header('Location:login.php');
    exit();
}

new page('dashboard');
