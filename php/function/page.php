<?php

class page
{

    public function __construct($page)
    {
        global $data;

        //REQUIRE SOME FUNCTIONS

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

//CHECK LOG

function loggin()
{
    if (isset($_SESSION['username'])) {
        return true;
    } else {
        return false;
    }
}

//LANGUAGE
function getLanguage()
{

    if (isset($_POST['lang'])) {
        $lang = $_POST['lang'];
        $languages = request('SELECT L.language_sn FROM languages L', array(), false);

        $arrayL = $languages->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array($lang, $arrayL)) {
            $lang = 'en';
        }
        $_SESSION['lang'] = $lang;


        return $lang;
    } elseif (isset($_COOKIE['lang'])) {
        $lang = $_COOKIE['lang'];
        $languages = request('SELECT L.language_sn FROM languages L', array(), false);

        $arrayL = $languages->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array($lang, $arrayL)) {
            $lang = 'en';
        }
        $_SESSION['lang'] = $lang;

        return $lang;
    } elseif (isset($_SESSION['lang'])) {
        $lang = $_SESSION['lang'];
        $_SESSION['lang'] = $lang;

        return $lang;
    } elseif (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {        //CHECK BROWSER LANGUAGE TO SET LANGUAGE//
        $lang = $_SERVER['HTTP_ACCEPT_LANGUAGE'][0] . $_SERVER['HTTP_ACCEPT_LANGUAGE'][1];

        $languages = request('SELECT L.language_sn FROM languages L', array(), false);

        $arrayL = $languages->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array($lang, $arrayL)) {
            $lang = 'en';
        }
        $_SESSION['lang'] = $lang;

        return $lang;
    } else {
        $lang = "en";
        $_SESSION['lang'] = $lang;
        echo '5';
        return $lang;
    }
}

//TWIG
function trender($page, $main)
{
    global $data;
    require_once dirname(__FILE__, 3) . "/include/init_twig.php";
    if ($main) {
        echo $twig->render($page . '.html.twig', $data);
    } else {
        echo $twig->render('page.html.twig', $data);
    }
}

//DATA

function createPage($page)
{
    global $data, $request, $cookie;

    //CHECK COOKIE ACCESS

    $cookie = getCookie();
    $_SESSION['cookie'] = $cookie;

    //GET LANG
    $lang = getLanguage();

    //GET ALL LANGUAGE POSSIBLE
    $languages = array();
    $results = request('SELECT language_fn, language_sn FROM languages', array(), false);
    while ($result = $results->fetch()) {
        $languages[$result['language_sn']] = array('sn' => $result['language_sn'], 'fn' => $result['language_fn']);
    }
    $request->closeCursor();

    //DOCTYPE
    $results = request('SELECT P.page_name, T.page_title, T.description, T.keywords FROM pages_tl T LEFT JOIN languages L ON T.language = L.id_language RIGHT JOIN pages P ON T.page = P.id_page WHERE P.page_name = :page_name AND L.language_sn = :lang', array("page_name" => $page, 'lang' => $lang), true);
    extract($results);
    $request->closeCursor();

    //GET ALL DATA 

    //GET GLOBAL
    $results = request('SELECT T.variable_name, T.value FROM translations T LEFT JOIN languages L ON T.language = L.id_language WHERE L.language_sn = :lang AND T.variable_name LIKE "g_%"', array('lang' => $lang), false);

    $results = $results->fetchAll(PDO::FETCH_KEY_PAIR);
    $request->closeCursor();
    extract($results);

    $data = array(
        'page' => $page_name,
        'languages' => $languages,
        'doctype' => array(
            'lang' => $lang,
            'description' => $description,
            'keywords' => $keywords,
            'page_title' => $page_title
        ),
        'footer' => array(
            'g_link_title' => $g_link_title,
            'g_terms_page' => $g_terms_page,
            'g_cookie_page' => $g_cookie_page,
            'g_sitemap_page' => $g_sitemap_page,
            'g_other_page' => $g_other_page,
            'g_contact_page' => $g_contact_page,
            'g_report_page' => $g_report_page
        ),

    );
    $data['header'] = getHeaderData($lang);
    $data['nav'] = getNavData($lang);
    $data['misc'] = getMiscData($lang);
    $data['main'] = getMainData($page, $lang);
}
function getMainData($page, $lang)
{
    global $request;
    //GET PAGE UNIQUE DATA
    $rule = $page . '_%';
    $results = request("SELECT T.variable_name, T.value FROM translations T LEFT JOIN languages L ON T.language = L.id_language WHERE L.language_sn = :lang AND T.variable_name LIKE :rule", array('lang' => $lang, 'rule' => $rule), false);
    $results = $results->fetchAll(PDO::FETCH_KEY_PAIR);
    $request->closeCursor();
    extract($results);
    switch ($page) {
        case 'index':
            //RETURN RESULT
            return array(
                'index_video_title' => $index_video_title,
                'index_video_fail' => $index_video_fail,
                'index_discover_title' => $index_discover_title,
                'index_listen_title' => $index_listen_title,
                'index_listen_p' => $index_listen_p,
                'index_listen_button' => $index_listen_button,
                'index_compose_title' => $index_compose_title,
                'index_compose_p' => $index_compose_p,
                'index_compose_button' => $index_compose_button,
                'index_learn_title' => $index_learn_title,
                'index_learn_p' => $index_learn_p,
                'index_learn_button' => $index_learn_button
            );
            break;
        case 'about':
            //SORT Q&A FOR TWIG 
            $qa = array();
            $i = 0;
            foreach ($results as $key => $value) {
                if (preg_match('/(about_qa_q)/', $key)) {
                    $qa[$i] = array($key => $value);
                    $i++;
                }
            }
            $qa_ = array();
            for ($i = 0; $i < count($qa) / 2; $i++) {
                $qa_['q' . ($i + 1)] = array('q' => array_values($qa[$i])[0], 'a' => array_values($qa[$i + 1])[0]);
            }
            //RETURN RESULT
            return array(
                'about_project_title' => $about_project_title,
                'about_project_p' => $about_project_p,
                'about_us_title' => $about_us_title,
                'about_us_p' => $about_us_p,
                'about_qa_title' => $about_qa_title,
                'qa' => $qa_
            );
            break;
        case 'login':
            //RETURN RESULT
            return array(
                'login_login_title' => $login_login_title,
                'login_login_p' => $login_login_p,
                'login_login_username_pl' => $login_login_username_pl,
                'login_login_username_l' => $login_login_username_l,
                'login_login_password_pl' => $login_login_password_pl,
                'login_login_password_l' => $login_login_password_l,
                'login_login_remember' => $login_login_remember,
                'login_login_forgot_title' => $login_login_forgot_title,
                'login_login_forgot' => $login_login_forgot,
                'login_login_submit' => $login_login_submit,
                'login_signup_title' => $login_signup_title,
                'login_signup_p' => $login_signup_p,
                'login_signup_username_pl' => $login_signup_username_pl,
                'login_signup_mail_l' => $login_signup_mail_l,
                'login_signup_username_l' => $login_signup_username_l,
                'login_signup_check_pl' => $login_signup_check_pl,
                'login_signup_check_l' => $login_signup_check_l,
                'login_signup_submit' => $login_signup_submit,
                'login_password_tooltip' => $login_password_tooltip,
            );
            break;
        case 'contact':
            //RETURN RESULT
            return array(
                'contact_title' => $contact_title,
                'contact_p' => $contact_p,
                'contact_name_pl' => $contact_name_pl,
                'contact_name_l' => $contact_name_l,
                'contact_subject_pl' => $contact_subject_pl,
                'contact_subject_l' => $contact_subject_l,
                'contact_message_pl' => $contact_message_pl,
                'contact_message_l' => $contact_message_l,
                'contact_message_submit' => $contact_message_submit,
                'contact_mail' => $contact_mail,
                'contact_mailto' => $contact_mailto,
                'contact_mail_title' => $contact_mail_title,
                'contact_sm_title' => $contact_sm_title,
                'contact_sm_a1' => $contact_sm_a1,
                'contact_sm_t1' => $contact_sm_t1,
                'contact_sm_a2' => $contact_sm_a2,
                'contact_sm_t2' => $contact_sm_t2,
                'contact_sm_a3' => $contact_sm_a3,
                'contact_sm_t3' => $contact_sm_t3,
            );
            break;
        case 'dashboard':
            //RETURN RESULT
            return array(
                'dashboard_member' => $_SESSION['username'],
                'dashboard_hello' => $dashboard_hello,
                'dashboard_compose' => $dashboard_compose,
                'dashboard_loop_title' => $dashboard_loop_title,
                'dashboard_song_title' => $dashboard_song_title,
                'dashboard_album_title' => $dashboard_album_title,
                'dashboard_member_title' => $dashboard_member_title,
                'dashboard_member_p' => $dashboard_member_p,
                'dashboard_notif_title' => $dashboard_notif_title,
                'dashboard_notif_p' => $dashboard_notif_p,
                'dashboard_personnal_title' => $dashboard_personnal_title,
                'dashboard_username_title' => $dashboard_username_title,
                'dashboard_username' => $dashboard_username,
                'dashboard_password_title' => $dashboard_password_title,
                'dashboard_password' => $dashboard_password,
                'dashboard_account_title' => $dashboard_account_title,
                'dashboard_account' => $dashboard_account,
                'dashboard_stats' => $dashboard_stats,
                'dashboard_news' => $dashboard_news,
            );
            break;
        case 'forgot':
            //RETURN RESULT
            return array(
                'forgot_title' => $forgot_title,
                'forgot_p' => $forgot_p,
                'forgot_password_pl' => $forgot_password_pl,
                'forgot_password_l' => $forgot_password_l,
                'forgot_check_pl' => $forgot_check_pl,
                'forgot_check_l' => $forgot_check_l,
                'forgot_submit' => $forgot_submit,
            );
            break;
        case 'admin':
            if (isset($_GET['logout'])) {
                unset($_SESSION['admin']);
                header('Location:index.php');
            }
            if (isset($_SESSION['admin'])) {
                $main =  array(
                    "admin" => true,

                );
                //CONNECTED

            } else {
                if (isset($_POST['username']) && isset($_POST['password'])) {
                    //WANT TO CONNECT

                    $results = request('SELECT A.username, A.password FROM admin A WHERE A.username = :username', array('username' => htmlspecialchars($_POST['username'])), true);
                    if (!empty($results)) {
                        if (password_verify($_POST['password'], $results['password'])) {
                            $_SESSION['admin'] = true;
                            header('Location:admin.php');
                        } else {
                            header('Location:admin.php');
                        }
                    } else {
                        header('Location:admin.php');
                    }
                } else {
                    //NO CONNECTED
                    $main =  array(
                        "admin" => false,
                        'admin_title' => $admin_title,
                        'admin_p' => $admin_p,
                        'admin_username_pl' => $admin_username_pl,
                        'admin_username_l' => $admin_username_l,
                        'admin_password_pl' => $admin_password_pl,
                        'admin_password_l' => $admin_password_l,
                        'admin_submit' => $admin_submit,
                    );
                }
            }
            //RETURN DATA
            return $main;
            break;
    }
}

function getMiscData($lang)
{
    global $request;
    //GET PAGE UNIQUE DATA
    $rule = 'misc_%';
    $results = request("SELECT T.variable_name, T.value FROM translations T LEFT JOIN languages L ON T.language = L.id_language WHERE L.language_sn = :lang AND T.variable_name LIKE :rule", array('lang' => $lang, 'rule' => $rule), false);
    $results = $results->fetchAll(PDO::FETCH_KEY_PAIR);
    $request->closeCursor();
    extract($results);
    if (!isset($_GET['email_forgot'])) {
        $_GET['email_forgot'] = 'none';
    }
    return array(
        'soon' => $misc_soon,
        'misc_home_page_title' => $misc_home_page_title,
        'misc_logo_alt' => $misc_logo_alt,
        'loggin' => loggin(),
        'loader' => $misc_loader,
        'f_email' => $_GET['email_forgot'],
    );
}
function getHeaderData($lang)
{
    global $request;
    //GET PAGE UNIQUE DATA
    $rule = 'h_%';
    $results = request("SELECT T.variable_name, T.value FROM translations T LEFT JOIN languages L ON T.language = L.id_language WHERE L.language_sn = :lang AND T.variable_name LIKE :rule", array('lang' => $lang, 'rule' => $rule), false);
    $results = $results->fetchAll(PDO::FETCH_KEY_PAIR);
    $request->closeCursor();
    extract($results);

    return array(
        'h_background_alt' => $h_background_alt,
    );
}

function getNavData($lang, $current_page = null) //OPTIONAL PARAMETER FOR AJAX REQUEST
{
    global $request;
    //GET PAGE UNIQUE DATA
    $rule = 'n_%';
    $results = request("SELECT T.variable_name, T.value FROM translations T LEFT JOIN languages L ON T.language = L.id_language WHERE L.language_sn = :lang AND T.variable_name LIKE :rule", array('lang' => $lang, 'rule' => $rule), false);
    $results = $results->fetchAll(PDO::FETCH_KEY_PAIR);
    $request->closeCursor();
    extract($results);

    //STRONG ON SELECT PAGE
    if ($current_page == null) {
        $current_page = substr($_SERVER["SCRIPT_NAME"], strrpos($_SERVER["SCRIPT_NAME"], "/") + 1);
    }

    return array(
        'current' => $current_page,
        'n_home_page' => $n_home_page,
        'n_about_page' => $n_about_page,
        'n_about_page_title' => $n_about_page_title,
        'n_login_page' => $n_login_page,
        'n_login_page_title' => $n_login_page_title,
        'n_logout_page' => $n_logout_page,
        'n_logout_page_title' => $n_logout_page_title,
        'n_dashboard_page' => $n_dashboard_page,
        'n_dashboard_page_title' => $n_dashboard_page_title,
    );
}
function getPopUpData($popup, $lang)
{
    global $request;
    //GET PAGE UNIQUE DATA
    $rule = $popup . '_%';
    $results = request("SELECT T.variable_name, T.value FROM translations T LEFT JOIN languages L ON T.language = L.id_language WHERE L.language_sn = :lang AND T.variable_name LIKE :rule", array('lang' => $lang, 'rule' => $rule), false);
    $results = $results->fetchAll(PDO::FETCH_KEY_PAIR);
    $request->closeCursor();
    extract($results);
    switch ($popup) {
        case 'cookie':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'cookie_title' => $cookie_title,
                'cookie_true' => $cookie_true,
                'cookie_false' => $cookie_false,
                'cookie_a' => $cookie_a,
                'cookie_cross' => $cookie_cross,
            );
            break;
        case 'log':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'log_title' => $log_title,
                'log_cross' => $log_cross,
            );
            break;
        case 'logout':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'logout_title' => $logout_title,
                'logout_true' => $logout_true,
                'logout_false' => $logout_false,
                'logout_cross' => $logout_cross,
            );
            break;
        case 'exist_mail':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'exist_mail_title' => $exist_mail_title,
                'exist_mail_cross' => $exist_mail_cross,
            );
            break;
        case 'exist_username':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'exist_username_title' => $exist_username_title,
                'exist_username_cross' => $exist_username_cross,
            );
            break;
        case 'signup':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'signup_title' => $signup_title,
                'signup_cross' => $signup_cross,
            );
            break;
        case 'rules':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'rules_title' => $rules_title,
                'rules_cross' => $rules_cross,
            );
            break;
        case 'match':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'match_title' => $match_title,
                'match_cross' => $match_cross,
            );
            break;
        case 'mail':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'mail_title' => $mail_title,
                'mail_cross' => $mail_cross,
            );
            break;
        case 'update_username':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'update_username_title' => $update_username_title,
                'update_username_cross' => $update_username_cross,
                'update_username_current_pl' => $update_username_current_pl,
                'update_username_current_l' => $update_username_current_l,
                'update_username_new_pl' => $update_username_new_pl,
                'update_username_new_l' => $update_username_new_l,
                'update_username_password_pl' => $update_username_password_pl,
                'update_username_password_l' => $update_username_password_l,
                'update_username_submit' => $update_username_submit,
            );
            break;
        case 'valid_update_username':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'valid_update_username_title' => $valid_update_username_title,
                'valid_update_username_cross' => $valid_update_username_cross,
            );
            break;
        case 'update_password':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'update_password_title' => $update_password_title,
                'update_password_cross' => $update_password_cross,
                'update_password_username_pl' => $update_password_username_pl,
                'update_password_username_l' => $update_password_username_l,
                'update_password_old_pl' => $update_password_old_pl,
                'update_password_old_l' => $update_password_old_l,
                'update_password_new_pl' => $update_password_new_pl,
                'update_password_new_l' => $update_password_new_l,
                'update_password_new_c_pl' => $update_password_new_c_pl,
                'update_password_new_c_l' => $update_password_new_c_l,
                'update_password_submit' => $update_password_submit,
            );
            break;
        case 'valid_update_password':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'valid_update_password_title' => $valid_update_password_title,
                'valid_update_password_cross' => $valid_update_password_cross,
            );
            break;
        case 'delete_account':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'delete_account_title' => $delete_account_title,
                'delete_account_cross' => $delete_account_cross,
                'delete_account_true' => $delete_account_true,
                'delete_account_false' => $delete_account_false,
            );
            break;
        case 'contact_send':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'contact_send_title' => $contact_send_title,
                'contact_send_cross' => $contact_send_cross,

            );
            break;
        case 'forgot_password_ask':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'forgot_password_ask_title' => $forgot_password_ask_title,
                'forgot_password_ask_cross' => $forgot_password_ask_cross,
                'forgot_password_ask_pl' => $forgot_password_ask_pl,
                'forgot_password_ask_l' => $forgot_password_ask_l,
                'forgot_password_ask_submit' => $forgot_password_ask_submit,
            );
            break;
        case 'forgot_password_ok':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'forgot_password_ok_title' => $forgot_password_ok_title,
                'forgot_password_ok_cross' => $forgot_password_ok_cross,
            );
            break;
        case 'forgot_password_no_exist':
            //RETURN RESULT
            return array(
                'type' => $popup,
                'forgot_password_no_exist_title' => $forgot_password_no_exist_title,
                'forgot_password_no_exist_cross' => $forgot_password_no_exist_cross,
            );
            break;
        case 'translation':

            return array(
                'type' => $popup,
                'translates' => $GLOBALS['translates'],
                'translation_title' => $translation_title,
                'translation_cross' => $translation_cross,
                'translation_submit' => $translation_submit,
            );
            break;
    }
}

//COOKIE
function getCookie()
{
    return isset($_COOKIE['cookie']) ? true : false;
}

function setAllCookies()
{
    global $lang;
    //SET GENERAL COOKIE
    setcookie('cookie', 'true', time() + 60 * 60 * 24 * 30, '/');
    $_SESSION['cookie'] = true;

    //SET LANG COOKIE
    setcookie('lang', $lang, time() + 60 * 60 * 24 * 30, '/');
}

function deleteAllCookies()
{
    $_SESSION['cookie'] = false;
    setcookie('cookie', 'true', time() - 3600, '/');

    setcookie('lang', 'true', time() - 3600, '/');
}

//MAIL

function sendMail($dest, $user, $type, $lang, $token = null)
{
    global $request, $from;

    $from = 'no-reply@orphea-project.com';

    //GET PAGE UNIQUE DATA
    $rule = 'mail_' . $type . '_%';
    $results = request("SELECT T.variable_name, T.value FROM translations T LEFT JOIN languages L ON T.language = L.id_language WHERE L.language_sn = :lang AND T.variable_name LIKE :rule", array('lang' => $lang, 'rule' => $rule), false);
    $results = $results->fetchAll(PDO::FETCH_KEY_PAIR);
    $request->closeCursor();
    extract($results);

    $headers = "From: " . $from;
    $content = ${'mail_' . $type . '_content'};
    $corps = $user . ", " . "\n" . "\n"   . $content;
    if ($token !== null) {
        $end = ${'mail_' . $type . '_end'};
        $corps = $corps . "\n" . "\n" . $token . "\n" . "\n" . $end;
    }
    mail($dest, ${'mail_' . $type . '_object'}, $corps, $headers);
}
