<?php
//START PAGE SESSION
session_start();

//REQUIRE SOME FUNCTIONS
require_once('php/function/page.php');
require_once('php/function/database.php');

//CREATE DB object
db();
//GET ALL DATA IN RIGHT LANGUAGE
createPage('index');

//RENDER WITH TWIG THE ALL PAGE
trender($data["page"], false);
