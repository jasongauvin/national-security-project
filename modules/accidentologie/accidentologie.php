<?php
// INCLURE LES PARAMÈTRES DE CONNEXION AVEC LA BASE DE DONNÉES
include("../../assets/php/connect.php");
// /INCLURE LES PARAMÈTRES DE CONNEXION AVEC LA BASE DE DONNÉES

// LE CAS D'INSERTION
if($_POST["insert"]){
    $requete = pg_query($db, "INSERT INTO accidentologie VALUES (DEFAULT, null, null, null, '$_POST[typesVehicules]', st_geomfromtext('POINT(-71.064544 42.28787)', 4326))");
    echo $requete? '{"success": true}': '{"success": false}'; 
}
// /LE CAS D'INSERTION



// $csv = array_map('str_getcsv', file('test.csv'));


// $colonnes = array("Emplacement","Date","Heure","NbrBlesses","NbrMorts","typesVehicules");

// function verifCols($colsTabAccid, $colsCsv){
//    return $colsTabAccid == $colsCsv;
// }

// echo verifCols($colonnes, $csv[0]);

// echo $csv[0][0];


?>