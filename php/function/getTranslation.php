<?php

//START PAGE SESSION
session_start();

//REQUIRE SOME FUNCTIONS
require_once(dirname(__FILE__, 3) . '/php/function/page.php');
require_once(dirname(__FILE__, 3) . '/php/function/database.php');


//CREATE DB OBJECT
db();

//RIGHT LANGUAGE
if (isset($_SESSION['lang'])) {
    $lang = $_SESSION['lang'];
} else {
    $lang = 'en';
}

switch ($_POST['type']) {
    case 'request':
        $results = request('SELECT L.language_sn, T.value, T.variable_name FROM translations T LEFT JOIN languages L ON T.language = L.id_language WHERE T.variable_name = :request', array('request' => $_POST['request']), false);
        $results = $results->fetchAll(PDO::FETCH_ASSOC);


        $GLOBALS['translates'] = $results;

        $data = getPopUpData('translation', $lang);
        trender('pop-up', true);

        break;
    case 'change':
        $changes = json_decode($_POST['changes'], true);
        foreach ($changes as $change) {
            request('UPDATE translations T LEFT JOIN languages L ON T.language = L.id_language SET T.value = :value WHERE T.variable_name = :variable AND L.language_sn = :lang', array('value' => $change['value'], 'variable' => $change['variable_name'], 'lang' => $change['lang']), false);
        }
        echo 'success';
        break;
}
