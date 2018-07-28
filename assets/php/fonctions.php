<?php

// INCLURE LES PARAMÈTRES DE CONNEXION AVEC LA BASE DE DONNÉES
require_once "connect.php";
// /INCLURE LES PARAMÈTRES DE CONNEXION AVEC LA BASE DE DONNÉES

// OBTENTION D'UN TABLEAU CONTIENT LES NOMS DE COLONNES D'UNE TABLE
function colsTabVersArray($nom_table){
    $res = array();
    $req = pg_query($GLOBALS["db"], "SELECT column_name FROM information_schema.columns WHERE table_name = '$nom_table'");
    while($ligne = pg_fetch_row($req)){
        $res[] = $ligne[0];
    }
    return $res;
}
// /OBTENTION D'UN TABLEAU CONTIENT LES NOMS DE COLONNES D'UNE TABLE

?>