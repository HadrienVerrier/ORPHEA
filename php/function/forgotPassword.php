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
sleep(1);
if (isset($_POST['resetPopup'])) {
    //RESET POPUP
    unset($_SESSION['pass_forgot']);
} elseif (isset($_POST['f_password']) && isset($_POST['f_c_password'])) {
} elseif (!isset($_SESSION['pass_forgot'])) {
    //PASSWORD FORGOT 

    $_SESSION['pass_forgot'] = true;
    $data = getPopUpData('forgot_password_ask', $lang);
    trender('pop-up', true);
} elseif ($_SESSION['pass_forgot'] == true && isset($_POST['user_info'])) {
    unset($_SESSION['pass_forgot']);

    //REQUEST
    $results = request('SELECT COUNT(M.nickname) AS usernames, M.email, M.nickname, M.id_member FROM members M WHERE M.nickname = :user_info OR M.email = :user_info', array('user_info' => htmlspecialchars($_POST['user_info'])), true);
    $request->closeCursor();
    if ($results['usernames'] >= 1) { //USER EXIST

        $mail = $results['email'];
        $user = $results['nickname'];
        $id = $results['id_member'];

        //CREATE TOKEN 

        $string = implode("", array_merge(range('A', 'Z'), range('a', 'z'), range("0", "9")));
        $token = substr(str_shuffle($string), 0, 20);

        //SEND TOKEN TO DATABASE
        request('UPDATE members SET password_token = :token , password_date = CURRENT_TIME() WHERE id_member = :id', array('token' => $token, 'id' => $id), false);

        $token = 'https://www.orphea-project.com/forgot.php?token=' . $token . '&email_forgot=' . $mail;

        sendMail($mail, $user, 'forgot_password', $lang, $token);

        $data = getPopUpData('forgot_password_ok', $lang);
        trender('pop-up', true);
    } else {
        unset($_SESSION['pass_forgot']);
        //USER DON'T EXIST
        $data = getPopUpData('forgot_password_no_exist', $lang);
        trender('pop-up', true);
    }
} else {
    header("HTTP/1.0 403");
    exit();
}
