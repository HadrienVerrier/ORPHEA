<?php
//START PAGE SESSION
session_start();

//REQUIRE SOME FUNCTIONS
require_once($_SERVER["CONTEXT_DOCUMENT_ROOT"] . 'php/function/page.php');
require_once($_SERVER["CONTEXT_DOCUMENT_ROOT"] . 'php/function/database.php');

//CREATE DB OBJECT
db();

$lang = 'fr'; //TEMPORAIRE

//GET MISC MAIN DATA 
$data['misc'] = getMiscData($lang);

//GET MAIN DATA IN RIGHT LANGUAGE
$data['main'] = getMainData($_POST['page'], $lang);

//RENDER WITH TWIG THE MAIN AND SEND TO AJAX
trender($_POST['page'], true);
