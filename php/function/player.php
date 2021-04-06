<?php
//START PAGE SESSION
session_start();

//REQUIRE SOME FUNCTIONS
require_once(dirname(__FILE__, 3) . '/php/function/page.php');
require_once(dirname(__FILE__, 3) . '/php/function/database.php');

//CREATE DB OBJECT
db();

if (isset($_SESSION['lang'])) {
    $lang = $_SESSION['lang'];
} else {
    $lang = 'en';
}

switch ($_POST['type']) {
    case 'input':

        $results = request('SELECT L.id_loop, L.name, M.nickname, M.pp_link FROM loops L LEFT JOIN members M ON L.author = M.id_member WHERE L.name LIKE :input AND NOT L.licence ="PRIVATE" ', array('input' => $_POST['input'] . "%"), false);
        $data['songs'] = $results->fetchAll(PDO::FETCH_ASSOC);
        if (empty($data['songs'])) {
            echo 'void';
        } else {
            trender('searchSong', true);
        }


        break;
}
