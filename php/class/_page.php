<?php

class page
{

    public function __construct($page)
    {
        global $data;
        //START PAGE SESSION
        session_start();

        //REQUIRE SOME FUNCTIONS
        require_once('php/function/page.php');
        require_once('php/function/database.php');

        //CREATE DB object
        db();

        //CHECK IF COOKIE NEED TO BE UPDATE
        if (isset($_COOKIE['cookie'])) {
            setAllCookies();
        }

        //GET ALL DATA IN RIGHT LANGUAGE
        createPage($page, false);


        //RENDER WITH TWIG THE ALL PAGE
        trender($data["page"], false);
    }
}
