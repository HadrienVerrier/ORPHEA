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
            'link_title' => $g_link_title,
            'terms_page' => $g_terms_page,
            'cookie_page' => $g_cookie_page,
            'sitemap_page' => $g_sitemap_page,
            'other_page' => $g_other_page,
            'contact_page' => $g_contact_page,
            'report_page' => $g_report_page
        ),

    );
    $data['header'] = getHeaderData($lang);
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

    return array(
        'soon' => $misc_soon,
        'home_page_title' => $misc_home_page_title,
        'logo_alt' => $misc_logo_alt,
        'loggin' => loggin(),
    );
}
function getHeaderData($lang, $current_page = null)
{
    global $request;
    //GET PAGE UNIQUE DATA
    $rule = 'h_%';
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
        'home_page' => $h_home_page,
        'about_page' => $h_about_page,
        'about_page_title' => $h_about_page_title,
        'login_page' => $h_login_page,
        'login_page_title' => $h_login_page_title,
        'background_alt' => $h_background_alt,
        'logout_page' => $h_logout_page,
        'logout_page_title' => $h_logout_page_title,
        'dashboard_page' => $h_dashboard_page,
        'dashboard_page_title' => $h_dashboard_page_title,
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
                'type' => 'cookie',
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
                'type' => 'log',
                'log_title' => $log_title,
                'log_cross' => $log_cross,
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
