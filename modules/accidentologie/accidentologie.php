<?php

// INCLURE DES FONCTIONS UTILES PHP-POSTGRES
require_once "../../assets/php/fonctions.php";
// /INCLURE DES FONCTIONS UTILES PHP-POSTGRES

// LE CAS D'INSERTION
if($_POST["insertion"]){
    //$requete = pg_query($db, "INSERT INTO accident VALUES (DEFAULT, 1, 2, true, 'blo blo blo', to_timestamp('16-05-2016 15:36:38', 'dd-mm-yyyy hh24:mi:ss'), st_geomfromtext('POINT(-71.064544 42.28787)', 4326))");
    $a = colsTabVersJSON("accident");
    //$requete = true;
    //$requete = true;
    echo $a; 
}
// /LE CAS D'INSERTION

// LE CAS DE COMPARAISON
if($_POST["importation"]){
    // RÉCUPÉRATION DES NOMS DE COLONNES DE LA TABLE ACCIDENT
    $noms_cols_accident = colsTabVersArray("accident");
    // /RÉCUPÉRATION DES NOMS DE COLONNES DE LA TABLE ACCIDENT

    // SUPPRESSION DE LA COLONNE GID
    array_shift($noms_cols_accident);
    // /SUPPRESSION DE LA COLONNE GID
    
    // COMPARAISON ENTRE LES NOMS DE COLONNES DE LA TABEL ACCIDENT ET LES NOMS DE COLONNES DE FICHIER EXCEL
    print_r (array_udiff($noms_cols_accident, $_POST['noms_cols_excel'], "strcasecmp")? array_udiff($noms_cols_accident, $_POST['noms_cols_excel'], "strcasecmp"): true);
    // /COMPARAISON ENTRE LES NOMS DE COLONNES DE LA TABEL ACCIDENT ET LES NOMS DE COLONNES DE FICHIER EXCEL

    // if normale
}
// /LE CAS DE COMPARAISON



// $csv = array_map('str_getcsv', file('test.csv'));


// $colonnes = array("Emplacement","Date","Heure","NbrBlesses","NbrMorts","typesVehicules");

// function verifCols($colsTabAccid, $colsCsv){
//    return $colsTabAccid == $colsCsv;
// }

// echo verifCols($colonnes, $csv[0]);

// echo $csv[0][0];


?>