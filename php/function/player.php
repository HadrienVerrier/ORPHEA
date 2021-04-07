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
        switch ($_POST['wich']) {
            case 'song':
                $results = request('SELECT DISTINCT L.id_loop, L.name, M.nickname, M.pp_link FROM loops L RIGHT JOIN members M ON L.author = M.id_member LEFT JOIN loops_x_tags X ON L.id_loop = X.id_loop LEFT JOIN tags T ON X.id_tag = T.id_tag WHERE L.name LIKE :input OR M.nickname LIKE :input OR T.tag_sn LIKE :input AND NOT L.licence ="PRIVATE" ', array('input' => $_POST['input'] . "%"), false);
                $data['songs'] = $results->fetchAll(PDO::FETCH_ASSOC);
                if (empty($data['songs'])) {
                    echo 'void';
                } else {
                    trender('searchSong', true);
                }
                break;
            case 'author':
                $results = request('SELECT id_member, nickname, pp_link FROM members WHERE nickname LIKE :input', array('input' => $_POST['input'] . "%"), false);
                $data['authors'] = $results->fetchAll(PDO::FETCH_ASSOC);
                if (empty($data['authors'])) {
                    echo 'void';
                } else {
                    trender('searchAuthor', true);
                }
                break;
            case 'tag':
                $results = request('SELECT id_tag, tag_sn FROM tags WHERE tag_sn LIKE :input', array('input' => $_POST['input'] . "%"), false);
                $data['tags'] = $results->fetchAll(PDO::FETCH_ASSOC);
                if (empty($data['tags'])) {
                    echo 'void';
                } else {
                    trender('searchTag', true);
                }
                break;
        }



        break;
}
