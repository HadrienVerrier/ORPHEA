<?php
//GENERATE DB CONNEXION
function db()
{
    global $bdd;
    require_once($_SERVER["CONTEXT_DOCUMENT_ROOT"] . 'php/settings/config.php');
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
