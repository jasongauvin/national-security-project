<?php

// INCLURE DES FONCTIONS UTILES PHP-POSTGRES
require_once "../../assets/php/fonctions.php";
// /INCLURE DES FONCTIONS UTILES PHP-POSTGRES

// LE CAS DE SELECTION RUES-BOUCHONS
if($_POST['rue_bouchon']){
	$req = executerRequete("SELECT id, \"name\", \"on\" FROM rues4emearrondissement WHERE ST_Intersects(geom, ST_Buffer(ST_GeographyFromText('SRID=4326;POINT(".$_POST['coords'][0]." ".$_POST['coords'][1].")'), 0.01))
	");
    
    if($req) {
		while($ligne = pg_fetch_assoc($req)) {
            echo json_encode(
                [intval($ligne['id']), $ligne['name'],$ligne['on']]
            );
        }
    }
}
// /LE CAS DE SELECTION RUES-BOUCHONS

?>