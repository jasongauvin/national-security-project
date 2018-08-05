<?php

// INCLURE DES FONCTIONS UTILES PHP-POSTGRES
require_once "../../assets/php/fonctions.php";
// /INCLURE DES FONCTIONS UTILES PHP-POSTGRES

function ConvertDistance ($longueur) {
	//$longueur input en kilometre

	//on le converti ensuite en metre
	$longueur=round($longueur,0);
	if ($longueur>=1000) {
	$longueur = round($longueur,0);
	$longueur_metre=$longueur % 1000;
	$longueur_km = ($longueur - $longueur_metre)/1000;
	$msg= $longueur_km.'km'.$longueur_metre.'m';
	} else {
	$msg= $longueur.'m';
	}
	return $msg;
}
// LE CAS D'IMPORTATION DU FICHIER EXCEL VERS LA TABLE AGENT
if($_POST["importation"]){
    // RÉCUPÉRATION DES NOMS DE COLONNES DE LA TABLE
    $noms_cols_agent = colsTabVersArray("agent");
    // /RÉCUPÉRATION DES NOMS DE COLONNES DE LA TABLE
	 
	// SUPPRESSION DE LA COLONNE GID
    array_shift($noms_cols_agent);
    // /SUPPRESSION DE LA COLONNE GID
    
    // COMPARAISON ENTRE LES NOMS DE COLONNES DE LA TABEL ET LES NOMS DE COLONNES DE FICHIER EXCEL
    $n = count(array_udiff($noms_cols_agent, $_POST['noms_cols_excel'], "strcasecmp"));
    // /COMPARAISON ENTRE LES NOMS DE COLONNES DE LA TABEL ET LES NOMS DE COLONNES DE FICHIER EXCEL
    if (!$n){

        $transaction = "BEGIN;";
        // INSERTION DANS LA TABLE
        for($i=0; $i<count($_POST["lignes_excel"]); $i++){

			$mobilite = $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][2]]=="mobile"? "true": "false";
            
            $transaction .= "INSERT INTO agent (".$_POST['noms_cols_excel'][0].", ".$_POST['noms_cols_excel'][1].", ".$_POST['noms_cols_excel'][2].", ".$_POST['noms_cols_excel'][3].", ".$_POST['noms_cols_excel'][4]." ) VALUES ('".$_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][0]]."','".$_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][1]]."', $mobilite,  to_timestamp('".$_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][3]]."', 'dd/mm/yyyy hh24:mi'),   st_geomfromtext('POINT(".explode(',', $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][4]])[0]." ".explode(',', $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][4]])[1].")', 4326));";
            
        }

        executerRequete($transaction .= "COMMIT;");
        
        echo json_encode(array(
            "type" => "succes",
            "msg" => $in." ".count($_POST["lignes_excel"])." Les agents ont été importés avec succès"
        ));
        
    }
    // CAS D'ERREUR DE SYNTAXE DES NOMS COLONNES
    else{

        if($n==1){
            echo json_encode(array(
                "type" => "erreur",
                "msg" => "Le nom de la colonne suivante dans le fichier Excel [ ".implode(array_udiff($_POST['noms_cols_excel'], $noms_cols_agent, "strcasecmp"))." ] ne respecte pas la même syntaxe dans la base de données [ ".implode(array_udiff($noms_cols_agent, $_POST['noms_cols_excel'], "strcasecmp"))." ]"
            ));
        }
        else{
            echo json_encode(array(
                "type" => "erreur",
                "msg" => "Les noms des colonnes suivantes dans le fichier Excel [ ".implode(', ', array_udiff($_POST['noms_cols_excel'], $noms_cols_agent, "strcasecmp"))." ] ne respectent pas la même syntaxe dans la base de données [ ".implode(', ', array_udiff($noms_cols_agent, $_POST['noms_cols_excel'], "strcasecmp"))." ]"
            ));
        }
        
    }
    // /CAS D'ERREUR DE SYNTAXE DES NOMS COLONNES

}
// /LE CAS D'IMPORTATION DU FICHIER EXCEL VERS LA TABLE AGENT
if($_POST['ajout']){
	
	$insert_agent = executerRequete("INSERT INTO agent VALUES (DEFAULT, '".$_POST['nom']."', '".$_POST['prenom']."', true, DEFAULT, st_geomfromtext('POINT(".$_POST['emplacement'][0]." ".$_POST['emplacement'][1].")', 4326) )");
	
	if($insert_agent){
		echo json_encode(array(
			"type" => "succes",
			"msg" => "L'agent a été ajouté avec succès"
			));
		}
	}


if($_POST['supression']){
	$delete_agent = executerRequete("DELETE from agent where gid=".$_POST['gid']);
	
	if($delete_agent){
		echo json_encode(array(
			"type" => "succes",
			"msg" => "L'agent a été supprimé avec succès"
			));
		}
	}
if($_POST['list']){
	$query = "SELECT gid, nom, date_creation, type, st_x(the_geom) as longitude, st_y(the_geom) as latitude FROM agent ";
	if($query) {
        $result = pg_query($db,$query);
        if($result) {
		    while($row = pg_fetch_assoc($result)) {
		    	$list[] = array(
		    		'gid' => $row['gid'],
		    		'nom' => $row['nom'], 
		    		'date_creation' => $row['date_creation'], 
		    		'type' => $row['type'], 
		    		'longitude' => $row['longitude'], 
		    		'latitude' => $row['latitude']  

		    	);
				
            }
            echo json_encode($list);
        }else{
        	echo '{}';
			exit;
        }
    }else{
    	echo '{}';
		exit;
    }
}

if($_GET['table']){
	$lon = $_GET["lon"];
	$lat = $_GET["lat"];
	

	if($query) {
        $result =executerRequete("SELECT gid, nom, date_creation, type, st_x(the_geom) as longitude, st_y(the_geom) as latitude, st_Distance(ST_Transform(the_geom,900913),ST_Transform(ST_GeomFromText('POINT(".$_GET["lon"]." ".$_GET["lat"].")',4326),900913)) as dis FROM agent order by dis asc");
        if($result) {
		    while($row = pg_fetch_assoc($result)) {
		    	if($row['type']=='Fixe'){
		    		$type='<span class="badge badge-success">'.$row['type'].'</span>';
		    	}else{
		    		$type='<span class="badge badge-secondary">'.$row['type'].'</span>';
		    	}
		    	$list[] = array(
		    		'gid' => $row['gid'],
		    		'nom' => $row['nom'], 
		    		'date_creation' => date('d/m/Y H:i:s',strtotime($row['date_creation'])), 
		    		'type' => $type, 
		    		'longitude' => $row['longitude'], 
		    		'latitude' => $row['latitude'],
		    		'distance' => '<span class="badge badge-secondary">'.ConvertDistance($row['dis']).'</span>',
		    		'action' => '<button type="button" class="btn btn-outline-primary btn-rounded btn-sm" style="margin-right:3px;"><i class="icon-location2" title="Localiser" onclick="locateAgent('.$row['longitude'].','.$row['latitude'].');"></i></button><button type="button" class="btn btn-outline-primary btn-rounded btn-sm" style="margin-right:3px;"><i class="icon-eyedropper" title="Modifier" onclick="updateAgent('.$row['gid'].');"></i></button><button type="button" class="btn btn-outline-primary btn-rounded btn-sm" style="margin-right:3px;" title="Supprimer" onclick="deleteAgent('.$row['gid'].');"><i class="icon-bin"></i></button>' 
		    	);
				
            }
            echo '{"data" :'.json_encode($list).'}';
        }else{
        	echo '{}';
			exit;
        }
    }else{
    	echo '{}';
		exit;
    }
}

if($_POST['selection']){
	$result = executerRequete("SELECT gid, nom, prenom, st_asgeojson(emplacement) as geom FROM agent");
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
exit();
pg_close($db);

?>