<?php

// INCLURE DES FONCTIONS UTILES PHP-POSTGRES
require_once "../../assets/php/fonctions.php";
// /INCLURE DES FONCTIONS UTILES PHP-POSTGRES

// LE CAS D'AJOUT
if($_POST["ajout"]){
    $var = executerRequete("INSERT INTO crime VALUES (DEFAULT, ".$_POST['type'].", ".$_POST['gravite'].", ".$_POST['desc'].", to_timestamp('".$_POST['dateHeure']."', 'dd/mm/yyyy hh24:mi'), st_geomfromtext('POINT(".$_POST['emplacement'][0]." ".$_POST['emplacement'][1].")', 4326) )");
    if($var){
    echo json_encode(array(
        "type" => "succes",
        "msg" => "Le crime a été bien ajouté avec succès"
        ));
    }
}
// /LE CAS D'AJOUT

// LE CAS DE LA MODIFICATION OU BIEN LE DÉPLACEMENT
if($_POST['modification']){
    if($_POST['emplacement']){
        $var = executerRequete("UPDATE crime SET type = ".$_POST['type'].", gravite = ".$_POST['gravite'].", description = ".$_POST['desc'].", dateheure = to_timestamp('".$_POST['dateHeure']."', 'dd/mm/yyyy hh24:mi'), emplacement = st_geomfromtext('POINT(".$_POST['emplacement'][0]." ".$_POST['emplacement'][1].")', 4326) WHERE gid = ".$_POST['gid']."");
    }else{
        $var = executerRequete("UPDATE crime SET type = ".$_POST['type'].", gravite = ".$_POST['gravite'].", description = ".$_POST['desc'].", dateheure = to_timestamp('".$_POST['dateHeure']."', 'dd/mm/yyyy hh24:mi') WHERE gid = ".$_POST['gid']."");
    }

    if($var){
    echo json_encode(array(
        "type" => "succes",
        "msg" => "Le crime a été bien modifié / déplacé avec succès"
        ));
    }
}
// LE CAS DE LA MODIFICATION OU BIEN LE DÉPLACEMENT

// LE CAS D'IMPORTATION DU FICHIER EXCEL VERS LA TABLE CRIME
if($_POST["importation"]){
    // RÉCUPÉRATION DES NOMS DE COLONNES DE LA TABLE
    $noms_cols_crime = colsTabVersArray("crime");
    // /RÉCUPÉRATION DES NOMS DE COLONNES DE LA TABLE

    // SUPPRESSION DE LA COLONNE GID
    array_shift($noms_cols_crime);
    // /SUPPRESSION DE LA COLONNE GID
    
    // COMPARAISON ENTRE LES NOMS DE COLONNES DE LA TABEL ET LES NOMS DE COLONNES DE FICHIER EXCEL
    $n = count(array_udiff($noms_cols_crime, $_POST['noms_cols_excel'], "strcasecmp"));
    // /COMPARAISON ENTRE LES NOMS DE COLONNES DE LA TABEL ET LES NOMS DE COLONNES DE FICHIER EXCEL
    if (!$n){

        $transaction = "BEGIN;";
        // INSERTION DANS LA TABLE
        for($i=0; $i<count($_POST["lignes_excel"]); $i++){
            $gravite = $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][1]]=="grave"? "null": (strpos($_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][1]], "plus") === false? "false": "true");
            $desc = $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][2]]? "'".$_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][2]]."'": "null";
            
            switch ($_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][0]]) {
                case "Violence familiale":
                    $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][0]]=0;
                    break;
                case "Agression sexuelle":
                    $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][0]]=1;
                    break;
                case "Harcèlement criminel":
                    $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][0]]=2;
                    break;
                case "Violence et menaces physiques":
                    $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][0]]=3;
                    break;
                case "Conduite avec facultés affaiblies":
                    $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][0]]=4;
                    break;
                case "Vol et autres crimes contre les biens":
                    $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][0]]=5;
                    break;
                case "Autres":
                    $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][0]]=6;
                    break;
            }
            $transaction .= "INSERT INTO crime ( ".$_POST['noms_cols_excel'][0].", ".$_POST['noms_cols_excel'][1].", ".$_POST['noms_cols_excel'][2].", ".$_POST['noms_cols_excel'][3].", ".$_POST['noms_cols_excel'][4]." ) VALUES (".$_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][0]].", $gravite, $desc, to_timestamp('".$_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][3]]."', 'dd/mm/yyyy hh24:mi'),   st_geomfromtext('POINT(".explode(',', $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][4]])[0]." ".explode(',', $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][4]])[1].")', 4326)  );";
            
        }

        executerRequete($transaction .= "COMMIT;");
        
        echo json_encode(array(
            "type" => "succes",
            "msg" => $in." ".count($_POST["lignes_excel"])." les crimes ont été importés avec succès"
        ));
        
    }
    // CAS D'ERREUR DE SYNTAXE DES NOMS COLONNES
    else{

        if($n==1){
            echo json_encode(array(
                "type" => "erreur",
                "msg" => "Le nom de la colonne suivante dans le fichier Excel [ ".implode(array_udiff($_POST['noms_cols_excel'], $noms_cols_crime, "strcasecmp"))." ] ne respecte pas la même syntaxe dans la base de données [ ".implode(array_udiff($noms_cols_crime, $_POST['noms_cols_excel'], "strcasecmp"))." ]"
            ));
        }
        else{
            echo json_encode(array(
                "type" => "erreur",
                "msg" => "Les noms des colonnes suivantes dans le fichier Excel [ ".implode(', ', array_udiff($_POST['noms_cols_excel'], $noms_cols_crime, "strcasecmp"))." ] ne respectent pas la même syntaxe dans la base de données [ ".implode(', ', array_udiff($noms_cols_crime, $_POST['noms_cols_excel'], "strcasecmp"))." ]"
            ));
        }
        
    }
    // /CAS D'ERREUR DE SYNTAXE DES NOMS COLONNES

}
// /LE CAS D'IMPORTATION DU FICHIER EXCEL VERS LA TABLE CRIME

// LE CAS SELECTION
if($_POST['selection']){
    $feature = array();
    $result = executerRequete("SELECT gid, type, gravite, description, to_char(dateheure, 'DD/MM/YYYY HH24:MI') AS dateheure, st_asgeojson(emplacement) AS geom FROM crime");
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
    $var = executerRequete("DELETE FROM crime WHERE gid = ".$_POST['gid']."");
    if($var){
    echo json_encode(array(
        "type" => "succes",
        "msg" => "Le crime a été supprimé avec succès"
        ));
    }
}
// LE CAS SUPPRESSION
?>