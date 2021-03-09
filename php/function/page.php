<?php

function trender($page, $main)
{
    global $data;
    require_once "include/init_twig.php";
    if ($main) {
        echo $twig->render($page . '.html.twig', array(''));
    } else {
        echo $twig->render('page.html.twig', $data);
    }
}
