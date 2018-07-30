<?php

// INCLURE DES FONCTIONS UTILES PHP-POSTGRES
require_once "../../assets/php/fonctions.php";
// /INCLURE DES FONCTIONS UTILES PHP-POSTGRES

// LE CAS D'INSERTION
if($_POST["insertion"]){
    //$requete = pg_query($db, "INSERT INTO accident VALUES (DEFAULT, 1, 2, true, 'blo blo blo', to_timestamp('16-05-2016 15:36:38', 'dd-mm-yyyy hh24:mi:ss'), st_geomfromtext('POINT(-71.064544 42.28787)', 4326))");
    // $a = colsTabVersJSON("accident");
    // //$requete = true;
    // //$requete = true;
    // echo $a; 
}
// /LE CAS D'INSERTION

// LE CAS D'IMPORTATION DU FICHIER EXCEL VERS LA TABLE ACCIDENT
if($_POST["importation"]){
    // RÉCUPÉRATION DES NOMS DE COLONNES DE LA TABLE
    $noms_cols_accident = colsTabVersArray("accident");
    // /RÉCUPÉRATION DES NOMS DE COLONNES DE LA TABLE

    // SUPPRESSION DE LA COLONNE GID
    array_shift($noms_cols_accident);
    // /SUPPRESSION DE LA COLONNE GID
    
    // COMPARAISON ENTRE LES NOMS DE COLONNES DE LA TABEL ET LES NOMS DE COLONNES DE FICHIER EXCEL
    $n = count(array_udiff($noms_cols_accident, $_POST['noms_cols_excel'], "strcasecmp"));
    // /COMPARAISON ENTRE LES NOMS DE COLONNES DE LA TABEL ET LES NOMS DE COLONNES DE FICHIER EXCEL
    if (!$n){

        $transaction = "BEGIN;";
        // INSERTION DANS LA TABLE
        for($i=0; $i<count($_POST["lignes_excel"]); $i++){
            $gravite = $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][1]]=="grave"? "null": (strpos($_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][1]], "plus") === false? "false": "true");
            $desc = $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][2]]? "'".$_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][2]]."'": "null";
            
            $transaction .= "INSERT INTO accident (".$_POST['noms_cols_excel'][0].", ".$_POST['noms_cols_excel'][1].", ".$_POST['noms_cols_excel'][2].", ".$_POST['noms_cols_excel'][3].", ".$_POST['noms_cols_excel'][4].", ".$_POST['noms_cols_excel'][5]." ) VALUES (".$_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][0]].", $gravite, $desc, to_timestamp('".$_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][3]]."', 'dd/mm/yyyy hh24:mi'),   st_geomfromtext('POINT(".explode(',', $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][4]])[0]." ".explode(',', $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][4]])[1].")', 4326)    , ".$_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][5]]." );";
            
        }

        $in = insertion("accident", $transaction .= "COMMIT;");

        echo json_encode(array(
            "type" => "succes",
            "msg" => $in." ".count($_POST["lignes_excel"])." accidents importés avec succès"
        ));
        
    }
    // CAS D'ERREUR DE SYNTAXE DES NOMS COLONNES
    else{

        if($n==1){
            echo json_encode(array(
                "type" => "erreur",
                "msg" => "Le nom de la colonne suivante dans le fichier Excel [ ".implode(array_udiff($_POST['noms_cols_excel'], $noms_cols_accident, "strcasecmp"))." ] ne respecte pas la même syntaxe dans la base de données [ ".implode(array_udiff($noms_cols_accident, $_POST['noms_cols_excel'], "strcasecmp"))." ]"
            ));
        }
        else{
            echo json_encode(array(
                "type" => "erreur",
                "msg" => "Les noms des colonnes suivantes dans le fichier Excel [ ".implode(', ', array_udiff($_POST['noms_cols_excel'], $noms_cols_accident, "strcasecmp"))." ] ne respectent pas la même syntaxe dans la base de données [ ".implode(', ', array_udiff($noms_cols_accident, $_POST['noms_cols_excel'], "strcasecmp"))." ]"
            ));
        }
        
    }
    // /CAS D'ERREUR DE SYNTAXE DES NOMS COLONNES

}
// /LE CAS D'IMPORTATION DU FICHIER EXCEL VERS LA TABLE ACCIDENT



// $csv = array_map('str_getcsv', file('test.csv'));


// $colonnes = array("Emplacement","Date","Heure","NbrBlesses","NbrMorts","typesVehicules");

// function verifCols($colsTabAccid, $colsCsv){
//    return $colsTabAccid == $colsCsv;
// }

// echo verifCols($colonnes, $csv[0]);

// echo $csv[0][0];


?>