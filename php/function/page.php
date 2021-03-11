<?php
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
        setcookie('lang', $lang, time() + 60 * 60 * 24 * 30);

        return $lang;
    } elseif (isset($_COOKIE['lang'])) {
        $lang = $_COOKIE['lang'];
        $languages = request('SELECT L.language_sn FROM languages L', array(), false);

        $arrayL = $languages->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array($lang, $arrayL)) {
            $lang = 'en';
        }
        $_SESSION['lang'] = $lang;
        setcookie('lang', $lang, time() + 60 * 60 * 24 * 30);

        return $lang;
    } elseif (isset($_SESSION['lang'])) {
        $lang = $_SESSION['lang'];
        $_SESSION['lang'] = $lang;
        setcookie('lang', $lang, time() + 60 * 60 * 24 * 30);

        return $lang;
    } elseif (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {        //CHECK BROWSER LANGUAGE TO SET LANGUAGE//
        $lang = $_SERVER['HTTP_ACCEPT_LANGUAGE'][0] . $_SERVER['HTTP_ACCEPT_LANGUAGE'][1];

        $languages = request('SELECT L.language_sn FROM languages L', array(), false);

        $arrayL = $languages->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array($lang, $arrayL)) {
            $lang = 'en';
        }
        $_SESSION['lang'] = $lang;
        setcookie('lang', $lang, time() + 60 * 60 * 24 * 30);

        return $lang;
    } else {
        $lang = "en";
        $_SESSION['lang'] = $lang;
        setcookie('lang', $lang, time() + 60 * 60 * 24 * 30);
        echo '5';
        return $lang;
    }
}

function trender($page, $main)
{
    global $data;
    require_once $_SERVER["CONTEXT_DOCUMENT_ROOT"] . "/include/init_twig.php";
    if ($main) {
        echo $twig->render($page . '.html.twig', $data);
    } else {
        echo $twig->render('page.html.twig', $data);
    }
}

function createPage($page)
{
    global $data, $request;

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
        'header' => array(
            'home_page' => $g_home_page,
            'home_page_title' => $g_home_page_title,
            'about_page' => $g_about_page,
            'about_page_title' => $g_about_page_title,
            'login_page' => $g_login_page,
            'login_page_title' => $g_login_page_title,
            'logo_alt' => $g_logo_alt,
            'background_alt' => $g_background_alt
        ),
        'footer' => array(
            'link_title' => $g_link_title,
            'terms_page' => $g_terms_page,
            'cookie_page' => $g_cookie_page,
            'sitemap_page' => $g_sitemap_page,
            'home_page_title' => $g_home_page_title,
            'logo_alt' => $g_logo_alt,
            'other_page' => $g_other_page,
            'contact_page' => $g_contact_page,
            'report_page' => $g_report_page
        ),

    );

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
    );
}
