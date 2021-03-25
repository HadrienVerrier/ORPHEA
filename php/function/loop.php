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
    case 'rename':
        //GET LOOP ID
        $id = request('SELECT L.id_loop FROM loops L LEFT JOIN members M ON L.author = M.id_member WHERE L.name = :l_name AND M.nickname = :user', array('l_name' => htmlspecialchars($_POST['current_name']), 'user' => $_SESSION['username']), true)['id_loop'];

        $name = htmlspecialchars($_POST['new_name']);

        //CHECK IF NAME ALREADY EXIST
        if ($name !== htmlspecialchars($_POST['current_name'])) {
            $count = request('SELECT count(L.name) AS count FROM loops L LEFT JOIN members M ON L.author = M.id_member WHERE L.name = :l_name AND M.nickname = :user', array('l_name' => $name, 'user' => $_SESSION['username']), true)['count'];
            if ($count == 1) {
                $count = 100;
                $temp = $name;
                $i = 0;
                while ($count > 0) {
                    $i++;
                    $temp = $name . ' (' . $i . ')';
                    $count = request('SELECT count(L.name) AS count FROM loops L LEFT JOIN members M ON L.author = M.id_member WHERE L.name = :l_name AND M.nickname = :user', array('l_name' => $temp, 'user' => $_SESSION['username']), true)['count'];
                }
                $name = $temp;
            }
        }

        //CHANGE LOOP NAME
        request('UPDATE loops SET name = :name WHERE id_loop = :id', array('id' => $id, 'name' => $name), false);

        echo $name;
        break;

    case 'delete':

        //GET LOOP ID
        $id = request('SELECT L.id_loop FROM loops L LEFT JOIN members M ON L.author = M.id_member WHERE L.name = :l_name AND M.nickname = :user', array('l_name' => htmlspecialchars($_POST['name']), 'user' => $_SESSION['username']), true)['id_loop'];

        //DELETE LOOP 
        request('DELETE FROM loops WHERE id_loop = :id', array('id' => $id), false);

        echo 'success';
        break;
}
