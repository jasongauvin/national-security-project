// DECLARATION DES VARIABLES
var agent_police_geojson = new ol.format.GeoJSON(), source_couche_agent = new ol.source.Vector();
var draw, json, coords, coucheAgent;
// /DECLARATION DES VARIABLES

// LE STYLE CSS DU CONTENU HTML DU MENU DROIT
$("<link>").attr("rel", "stylesheet").attr("type", "text/css").attr("href", "modules/gestionAgents/gestionAgents.css").appendTo("head");
// /LE STYLE CSS DU CONTENU HTML DU MENU DROIT

// LE CONTENU HTML DU MENU DROIT
$.get("modules/gestionAgents/gestionAgents.html", function (data) {
    $("#style_selector div:eq(1)").after().append(data);
});
// /LE CONTENU HTML DU MENU DROIT

// INTERACTION GRAPHIQUE POUR LE MENU DROIT
interactionGraphiqueMenuDeNavigation(2, "gestionAgents", "Boîte à outils gestion des agents", 43, 5);
// /INTERACTION GRAPHIQUE POUR LE MENU DROIT

actualiserCoucheAgent();

function actualiserCoucheAgent() {

    // DÉFINITION DU STYLE DE LA COUCHE AGENT
    var styleCoucheAgent = function (feature) {

        var src = 'assets/img/agent_24.png';
        var style_agent = {
            'Point':
                new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: src
                    })
                })
        };
        return style_agent[feature.getGeometry().getType()];
    }
    // /DÉFINITION DU STYLE DE LA COUCHE AGENT

    // DÉFINITION DE LA COUCHE AGENT
    var coucheAgent = new ol.layer.Vector({
        name: 'CoucheAgent',
		title: 'Couche Agent',
        visible: true,
        source: source_couche_agent,
        style: styleCoucheAgent
    });
    // /DÉFINITION DE LA COUCHE AGENT

    // SUPPRESSION DU CONTENU DE LA COUCHE AGENT 
    source_couche_agent.clear();
    // /SUPPRESSION DU CONTENU DE LA COUCHE AGENT

    // L'APPEL AJAX AVEC LES PARAMÈTRES
    data = {
        selection: true
    }
    success = function (result) {
        var features = agent_police_geojson.readFeatures(result, { featureProjection: 'EPSG:3857' });
        source_couche_agent.addFeatures(features);
        afficherNotif("info", "La couche des agents a été bien actualisée");
    }
    error_fatale = function (jqXhr) {
        rapportErreurs(jqXhr);
        afficherNotif("erreur_fatale", "Une erreur est survenu lors du chargement de la couche des agents");
    }
    ajax("modules/gestionAgents/gestionAgents.php", data, error_fatale, success);
    // /L'APPEL AJAX AVEC LES PARAMÈTRES

    // L'AJOUT DE LA COUCHE AGENT À LA CARTE
    map.addLayer(coucheAgent);
    // /L'AJOUT DE LA COUCHE AGENT À LA CARTE

}

$(document).on("click", "#pointerAgentAjouter", function () {
    changerPointeurAjout("agent.png");
    map.on('click', function (evt) {
        coords = ol.proj.toLonLat(evt.coordinate);
        $("#pointerAgentAjouter").html('<i class="clip-plus-circle"></i> ' + coords[0].toFixed(6) + ", " + coords[1].toFixed(6));
    });

});

$(document).on("click", "#ajouterAgent", function (e) {
    e.preventDefault();

    data = {
		ajout: true,
		nom: $("#Prenom").val(),
		prenom: $("#Nom").val(),
        emplacement: coords,
    }

    error_fatale = function (jqXhr) {
        rapportErreurs(jqXhr);
        afficherNotif("erreur_fatale", "Une erreur est survenu lors de l'ajout d'un agent");
    }

    success = function (resultat) {
        if (resultat.type == "succes") {
            afficherNotif("succes", resultat.msg);
            actualiserCoucheAgent();
        }
    }

    ajax("modules/gestionAgents/gestionAgents.php", data, error_fatale, success);

});

$(document).on("change", "#fichierExcel", function () {

    // $("#barreProgres").fadeIn(200);
    // $("#barreProgres").css("display", "block");

    function exporterExcelVersJSON() {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
        /*Checks whether the file is a valid excel file*/
        if (regex.test($("#fichierExcel").val().toLowerCase())) {
            var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
            if ($("#fichierExcel").val().toLowerCase().indexOf(".xlsx") > 0) {
                xlsxflag = true;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                /*Converts the excel data in to object*/
                if (xlsxflag) {
                    var workbook = XLSX.read(data, { type: 'binary' });
                }
                else {
                    var workbook = XLS.read(data, { type: 'binary' });
                }
                /*Gets all the sheetnames of excel in to a variable*/
                var sheet_name_list = workbook.SheetNames;

                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
                sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
                    /*Convert the cell value to Json*/
                    if (xlsxflag) {
                        exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                    }
                    else {
                        exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                    }
                    if (exceljson.length > 0 && cnt == 0) {
                        getJSON(exceljson);
                    }
                });
            }
            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                reader.readAsArrayBuffer($("#fichierExcel")[0].files[0]);
            }
            else {
                reader.readAsBinaryString($("#fichierExcel")[0].files[0]);
            }

        }
        else {
            afficherNotif("warning", "Veuillez ajouter un fichier Excel valide");
        }
    }

    exporterExcelVersJSON();

    function getJSON(exceljson) {
        json = exceljson;

        // L'APPEL AJAX AVEC LES PARAMÈTRES
        data = {
            importation: true,
            noms_cols_excel: Object.keys(json[0]),
            lignes_excel: json
        }
        error_fatale = function (jqXhr) {
            rapportErreurs(jqXhr);
            afficherNotif("erreur_fatale", "Une erreur est survenu lors de l'importation des agents");
        }
        success = function (resultat) {
            if (resultat.type == "erreur") {
                afficherNotif("erreur", resultat.msg);
            }
            else if (resultat.type == "succes") {
                afficherNotif("succes", resultat.msg);
                actualiserCoucheAgent();
            }
        }

        ajax("modules/gestionAgents/gestionAgents.php", data, error_fatale, success);
        // /L'APPEL AJAX AVEC LES PARAMÈTRES
    }

});


$(document).on("change", "#fichierExcel", function () {

function getJSON(exceljson) {
	json = exceljson;

	// L'APPEL AJAX AVEC LES PARAMÈTRES
	data = {
		importation: true,
		noms_cols_excel: Object.keys(json[0]),
		lignes_excel: json
	}
	error_fatale = function (jqXhr) {
		rapportErreurs(jqXhr);
		afficherNotif("erreur_fatale", "Une erreur est survenu lors de l'importation des agents");
	}
	success = function (resultat) {
		if (resultat.type == "erreur") {
			afficherNotif("erreur", resultat.msg);
		}
		else if (resultat.type == "succes") {
			afficherNotif("succes", resultat.msg);
			actualiserCoucheAccident();
		}
	}

	ajax("modules/gestionAgents/gestionAgents.php", data, error_fatale, success);
	// /L'APPEL AJAX AVEC LES PARAMÈTRES
}

});