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

//CHECK IF USERNAME EXIST

if (isset($_POST['username']) && isset($_POST['email']) && isset($_POST['password']) && isset($_POST['password_check'])) {

    //CHECK IF THIS USER EXIST 
    $results = request('SELECT COUNT(M.nickname) AS usernames FROM members M WHERE M.nickname = :username', array('username' => $_POST['username']), true);
    $request->closeCursor();
    if ($results['usernames'] >= 1) {
        sleep(1);
        $data = getPopUpData('exist_username', $lang);
        trender('pop-up', true);
    } else {
        $results = request('SELECT COUNT(M.email) as emails FROM members M WHERE M.email = :email', array('email' => $_POST['email']), true);
        $request->closeCursor();
        if ($results['emails'] >= 1) {
            sleep(1);
            $data = getPopUpData('exist_mail', $lang);
            trender('pop-up', true);
        } else {
            if (filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
                //CHECK IF PASSWORDS MATCH

                if ($_POST['password'] == $_POST['password_check']) {

                    //CHECK IF PASSWORD RESPECT RULES
                    if (preg_match("#^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$#", $_POST['password'])) {

                        // CREATE ACCOUNT IN DB
                        request(
                            'INSERT INTO `members` (`id_member`, `nickname`, `password`, `email`, `member_page`) VALUES (NULL, :username, :password, :mail, \'{"disposition": "defaults"}\')',
                            array(
                                'username' => htmlspecialchars($_POST['username']),
                                'password' => password_hash($_POST['password'], PASSWORD_BCRYPT),
                                'mail' => htmlspecialchars($_POST['email'])
                            ),
                            false
                        );

                        // SEND MAIL
                        sendMail($_POST['email'], $_POST['username'], 'signup', $lang);

                        $data = getPopUpData('signup', $lang);
                        trender('pop-up', true);
                    } else {
                        sleep(1);
                        //PASSWORD IS NOT GOOD
                        $data = getPopUpData('rules', $lang);
                        trender('pop-up', true);
                    }
                } else {
                    sleep(1);
                    //PASSWORD NOT MATCH
                    $data = getPopUpData('match', $lang);
                    trender('pop-up', true);
                }
            } else {
                sleep(1);
                $data = getPopUpData('mail', $lang);
                trender('pop-up', true);
            }
        }
    }
} else {
    header("HTTP/1.0 403");
    exit();
}
