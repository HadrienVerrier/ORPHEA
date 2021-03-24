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
    case 'click':
        $data = getPopUpData('pu_compose', $lang);
        trender('pop-up', true);
        break;
    case 'return':
        switch ($_POST['mode']) {
            case 'loop':
                $data = getPopUpData('pu_loop', $lang);
                trender('pop-up', true);
                break;
        }
        break;
    case 'new':
        //GET MEMBER ID
        switch ($_POST['mode']) {
            case 'loop':
                $id_user = request('SELECT M.id_member FROM members M WHERE M.nickname = :user', array('user' => $_SESSION['username']), true)['id_member'];
                $request->closeCursor();

                $loop_name = 'loop_' . $_SESSION['username'] . '_' . time();

                //CREATE LOOP
                request("INSERT INTO `loops` (`id_loop`, `name`, `author`, `settings`, `data`, `licence`, `date`) VALUES (NULL, :loop_name, :id_user , 'defaults', 'defaults', 'PRIVATE', CURRENT_TIME)", array('loop_name' => $loop_name, 'id_user' => $id_user), false);
                $request->closeCursor();
                echo 'loop';
                break;
        }

        break;
}
