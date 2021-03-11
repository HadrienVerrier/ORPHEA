<?php
//GENERATE DB CONNEXION
function db()
{
    global $bdd;
    try {
        $bdd = new PDO('mysql:host=localhost;dbname=pt2020-2021_verrier;charset=utf8', 'root', '',  array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    } catch (Exception $e) {
        // header('Location: error.php?error=' . serialize($e->getMessage()));
        die('Erreur :' . $e->getMessage());
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
