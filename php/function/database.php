<?php
//GENERATE DB CONNEXION
function db()
{
    global $bdd;
    require_once(dirname(__FILE__, 3) . '/php/settings/config.php');
    try {
        $bdd = new PDO('mysql:host=' . $host . ';dbname=' . $dbname . ';charset=' . $charset . '', $username, $password,  array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    } catch (Exception $e) {
        // header('Location: error.php?error=' . serialize($e->getMessage()));
        die('Error :' . $e->getMessage());
    }
}


//MAKE REQUEST
function request($sql, $prep, $fetch)
{
    global $bdd, $request;
    $request = $bdd->prepare($sql);
    $request->execute($prep);
    if ($fetch) {
        $result = $request->fetch();

        return $result;
    } else {
        return $request;
    }
}

$data = array(
    'HTTP_HOST' => 'www.orphea-project.com',
    'SCRIPT_NAME' => '/index.php',
    'REQUEST_URI' => '/index.php',
    'SCRIPT_FILENAME' => '/home/orpheab/www/index.php',
    'SERVER_NAME' => 'www.orphea-project.com',
    'HTTP_X_REMOTE_PROTO' => 'http',
    'SCRIPT_URI' => 'http://www.orphea-project.com/index.php',
    'SCRIPT_URL' => '/index.php',
    'DOCUMENT_ROOT' => '/home/orpheab/www',
    'PHP_SELF' => '/index.php',
);

$data2 = array(
    'HTTP_HOST' => 'localhost',
    'SCRIPT_NAME' => '/orphea/contact.php',
    'REQUEST_URI' => '/orphea/contact.php',
    'SCRIPT_FILENAME' => 'C:/Users/hadve/Google Drive/LP_IMAPP/PT - Projet Tuteure/ORPHEA/WEBSITE/contact.php',
    'SERVER_NAME' => 'localhost',
    'REQUEST_SCHEME' => 'http',
    'DOCUMENT_ROOT' => 'C:/wamp64/www',
    'PHP_SELF' => '/orphea/contact.php',
);
