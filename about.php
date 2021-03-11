<?php
//START PAGE SESSION
session_start();

//REQUIRE SOME FUNCTIONS
require_once('php/function/page.php');
require_once('php/function/database.php');

//CREATE DB OBJECT
db();

//GET ALL DATA IN RIGHT LANGUAGE
createPage('about');

//RENDER WITH TWIG THE ALL PAGE
trender($data["page"], false);
