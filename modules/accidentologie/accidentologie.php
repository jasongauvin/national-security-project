<?php

// INCLURE DES FONCTIONS UTILES PHP-POSTGRES
require_once "../../assets/php/fonctions.php";
// /INCLURE DES FONCTIONS UTILES PHP-POSTGRES

// LE CAS D'AJOUT
if($_POST["ajout"]){
    $var = executerRequete("INSERT INTO accident VALUES (DEFAULT, ".$_POST['nbrBlesses'].", ".$_POST['nbrMorts'].", ".$_POST['gravite'].", ".$_POST['desc'].", to_timestamp('".$_POST['dateHeure']."', 'dd/mm/yyyy hh24:mi'), st_geomfromtext('POINT(".$_POST['emplacement'][0]." ".$_POST['emplacement'][1].")', 4326) )");
    if($var){
    echo json_encode(array(
        "type" => "succes",
        "msg" => "L'accident a été bien ajouté avec succès"
        ));
    }
}
// /LE CAS D'AJOUT

// LE CAS DE LA MODIFICATION OU BIEN LE DÉPLACEMENT
if($_POST['modification']){
    if($_POST['emplacement']){
        $var = executerRequete("UPDATE accident SET nbrblesses = ".$_POST['nbrBlesses'].", nbrmorts = ".$_POST['nbrMorts'].", gravite = ".$_POST['gravite'].", description = ".$_POST['desc'].", dateheure = to_timestamp('".$_POST['dateHeure']."', 'dd/mm/yyyy hh24:mi'), emplacement = st_geomfromtext('POINT(".$_POST['emplacement'][0]." ".$_POST['emplacement'][1].")', 4326) WHERE gid = ".$_POST['gid']."");
    }else{
        $var = executerRequete("UPDATE accident SET nbrblesses = ".$_POST['nbrBlesses'].", nbrmorts = ".$_POST['nbrMorts'].", gravite = ".$_POST['gravite'].", description = ".$_POST['desc'].", dateheure = to_timestamp('".$_POST['dateHeure']."', 'dd/mm/yyyy hh24:mi') WHERE gid = ".$_POST['gid']."");
    }

    if($var){
    echo json_encode(array(
        "type" => "succes",
        "msg" => "L'accident a été bien modifié / déplacé avec succès"
        ));
    }
}
// LE CAS DE LA MODIFICATION OU BIEN LE DÉPLACEMENT

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

        executerRequete($transaction .= "COMMIT;");
        
        echo json_encode(array(
            "type" => "succes",
            "msg" => $in." ".count($_POST["lignes_excel"])." accidents ont été importés avec succès"
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

// LE CAS SELECTION
if($_POST['selection']){
    $feature = array();
    $result = executerRequete("SELECT gid ,nbrblesses, nbrmorts, gravite, description, to_char(dateheure, 'DD/MM/YYYY HH24:MI') AS dateheure, st_asgeojson(emplacement) AS geom FROM accident");
        if($result) {
		    while($row = pg_fetch_assoc($result)) {
		    	$row['removable']='true';
			    $type = '"type": "Feature"';
	            $geometry = '"geometry": '.$row['geom'];
	            unset($row['geom']);
	            $properties = '"properties": '.json_encode($row);
	            $feature[] = '{'.$type.', '.$geometry.', '.$properties.'}';
				
            }
            $header = '{"type": "FeatureCollection", "features": [';
            $footer = ']}';
		    if(count($feature) > 0) {
			    echo $header.implode(', ', $feature).$footer;
		    }
		    else {
			    echo '{"type":"FeatureCollection", "features":"empty"}';
		    }
        }
}
// /LE CAS SELECTION

// LE CAS SUPPRESSION
if($_POST["suppression"]){
    $var = executerRequete("DELETE FROM accident WHERE gid = ".$_POST['gid']."");
    if($var){
    echo json_encode(array(
        "type" => "succes",
        "msg" => "L'accident a été bien supprimé avec succès"
        ));
    }
}
// LE CAS SUPPRESSION

// LE CAS DE LA TABLE ATTRIBUTAIRE
if($_POST['tableAttributaire']){

    $colonnes = array();
    $noms_cols = array("Id", "Nombre de blessés", "Nombre de morts", "Gravité", "Description", "Date et heure");
    $donnees = array();

    for($i = 0; $i < count(colsTabVersArray("accident"))-1; $i++){
        array_push($colonnes, array(
            "data" => colsTabVersArray("accident")[$i],
            "name" => mb_strtoupper($noms_cols[$i])
            )
        );
    }

    $req = executerRequete("SELECT gid , COALESCE(nbrblesses, 0) AS nbrblesses, COALESCE(nbrmorts, 0) as nbrmorts, CASE WHEN gravite THEN 'Plus grave' WHEN gravite = false THEN 'Moins grave' WHEN gravite IS NULL THEN 'Grave' END AS gravite, COALESCE(description, 'Pas de description') as description, to_char(dateheure, 'DD/MM/YYYY HH24:MI') AS dateheure FROM accident");
        if($req) {
		    while($ligne = pg_fetch_assoc($req)) {
                array_push($donnees, array(
                    colsTabVersArray("accident")[0] => $ligne[colsTabVersArray("accident")[0]],
                    colsTabVersArray("accident")[1] => $ligne[colsTabVersArray("accident")[1]],
                    colsTabVersArray("accident")[2] => $ligne[colsTabVersArray("accident")[2]],
                    colsTabVersArray("accident")[3] => $ligne[colsTabVersArray("accident")[3]],
                    colsTabVersArray("accident")[4] => $ligne[colsTabVersArray("accident")[4]],
                    colsTabVersArray("accident")[5] => $ligne[colsTabVersArray("accident")[5]],
                    )
                );
            }
        }
    
    echo json_encode(array("data" => $donnees) + array("columns" => $colonnes));
}
// /LE CAS DE LA TABLE ATTRIBUTAIRE


// LE CAS DU STATISTIQUES
if($_POST['statistiques']){
    $donnees = array();
    if(!$_POST["dateHeureFin"] && $_POST["dateHeureDeb"]){
        $req = executerRequete("SELECT SUM (COALESCE(nbrmorts, 0)+COALESCE(nbrblesses, 0)) AS nbrvictimes, EXTRACT(epoch FROM dateheure)*1000 AS dateheure FROM accident WHERE dateheure >= to_timestamp('".$_POST['dateHeureDeb']."', 'DD/MM/YYYY HH24:MI') GROUP BY dateheure ORDER BY dateheure");
    }
    if($req) {
		while($ligne = pg_fetch_assoc($req)) {
            array_push($donnees, array(
                intval($ligne["dateheure"]),
                intval($ligne["nbrvictimes"])
                )
            );
        }
    }
    
    echo json_encode($donnees);
}
// /LE CAS DE LA TABLE ATTRIBUTAIRE

?>