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


//SEND MESSAGE TO DATABASE
sleep(1);
if (isset($_POST['sender']) && isset($_POST['object']) && isset($_POST['content'])) {
    $language = request('SELECT id_language FROM languages WHERE language_sn = :lang', array('lang' => $lang), true)['id_language'];
    request('INSERT INTO `message` (sender, object, content, language) VALUES (:sender, :object, :content, :language)', array('sender' => htmlspecialchars($_POST['sender']), 'object' => htmlspecialchars($_POST['object']), 'content' => htmlspecialchars($_POST['content']), 'language' => $language), false);

    $data = getPopUpData('contact_send', $lang);
    trender('pop-up', true);
} else {
    header("HTTP/1.0 403 Not Found");
    exit();
}
