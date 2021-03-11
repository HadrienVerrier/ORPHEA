<?php
//START PAGE SESSION
session_start();

//REQUIRE SOME FUNCTIONS
require_once($_SERVER["CONTEXT_DOCUMENT_ROOT"] . 'php/function/page.php');
require_once($_SERVER["CONTEXT_DOCUMENT_ROOT"] . 'php/function/database.php');

//CREATE DB OBJECT
db();

$lang = 'fr'; //TEMPORAIRE

//GET PAGE TITLE IN RIGHT LANGUAGE

$page = request('SELECT T.page_title FROM pages_tl T LEFT JOIN languages L ON T.language = L.id_language RIGHT JOIN pages P ON T.page = P.id_page WHERE P.page_name = :page_name AND L.language_sn = :lang', array("page_name" => $_POST['page'], 'lang' => $lang), true);

//SEND TO AJAX

echo $page['page_title'];