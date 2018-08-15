// DECLARATION DES VARIABLES
var agent_police_geojson = new ol.format.GeoJSON(), source_couche_agent = new ol.source.Vector();
var draw, json, coords, coucheAgent;
// /DECLARATION DES VARIABLES

// LE STYLE CSS DU CONTENU HTML DU MENU DROIT
if(!$('head').find('link[href="modules/gestionAgents/gestionAgents.css"][rel="stylesheet"]').length){
    $("<link>").attr("rel", "stylesheet").attr("type", "text/css").attr("href", "modules/gestionAgents/gestionAgents.css").appendTo("head");
}
// /LE STYLE CSS DU CONTENU HTML DU MENU DROIT

// LE CONTENU HTML DU MENU DROIT
$.get("modules/gestionAgents/gestionAgents.html", function (data) {
    $("#style_selector div:eq(1)").after().append(data);
});
// /LE CONTENU HTML DU MENU DROIT

// INTERACTION GRAPHIQUE POUR LE MENU DROIT
interactionGraphiqueMenuDeNavigation(2, "gestionAgents", "Boîte à outils gestion des agents", 43, 5);
// /INTERACTION GRAPHIQUE POUR LE MENU DROIT

// AFFICHAGE DE LA COUCHE AGENT
actualiserCoucheAgent();
// /AFFICHAGE DE LA COUCHE AGENT

// SUPPRESSION DE TOUTES LES AUTRES COUCHES SAUF LA COUCHE PASSÉE EN PARAMÈTRE
supprimerCouches(coucheAgent);
// /SUPPRESSION DE TOUTES LES AUTRES COUCHES SAUF LA COUCHE PASSÉE EN PARAMÈTRE


// CAS DE MODIFICATION
function singleclick (evt) {
    features = [];
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        layer = [coucheAgent];
        return feature;
    });
    if (feature) {
        $("#modifierAgentBouton").prop("disabled", false);
        
        $("#pointerAgentModifier").hide();
        $("#pointerAgentModifierNouvEmplace").show();

        $("#pointerAgentModifier").html("<i class='clip-plus-circle'></i> Localisez le nouveau emplacement de l'agent")

        $("#modifierAgent #Nom").next().addClass("active");
        $("#modifierAgent #Prenom").next().addClass("active");
        $("#modifierAgent #Mobilite").next().addClass("active");

        $("#modifierAgent #Nom").val(feature.get("nom"));
        $("#modifierAgent #Prenom").val(feature.get("prenom"));
        $("#modifierAgent #Mobilite").val(feature.get("mobilite")=='t'? "true" : "false");
        gid = feature.get("gid");
    }

};

function onClique(evt){
    coords = ol.proj.toLonLat(evt.coordinate);
    $("#pointerAgentModifierNouvEmplace").html('<i class="clip-plus-circle"></i> ' + coords[0].toFixed(6) + ", " + coords[1].toFixed(6));
}

$(document).on("click", "#reinitModifAgent", function() {
    $("#modifierAgent")[0].reset();
    $("#modifierAgentBouton").prop("disabled", true);
    coords = null;

    if ($("#pointerAgentModifierNouvEmplace").is(":visible") && $("#pointerAgentModifierNouvEmplace").text().indexOf("l") >= 0 ) {
        map.un("pointermove", activerPointeurSurFeatures);
        map.un("singleclick", singleclick);
        $("#pointerAgentModifierNouvEmplace").hide();
        $("#pointerAgentModifier").show();

    }else{
        map.un("pointermove", activerPointeurSurFeatures);
        map.un("singleclick", singleclick);
        map.un("click", onClique);
        $("#pointerAgentModifierNouvEmplace").html("<i class='clip-plus-circle'></i> Localisez le nouveau emplacement de l'agent");
        $("#pointerAgentModifierNouvEmplace").hide();
        $("#pointerAgentModifier").show();
    }
});

$(document).on("click", "#pointerAgentModifier", function (evt) {
    if ($("#collapseThree").attr("class") == "panel-collapse collapse in") {
        map.on("pointermove", activerPointeurSurFeatures);
    }
    map.on("singleclick", singleclick);

});

$(document).on("click", "#pointerAgentModifierNouvEmplace", function (evt) {
    map.un("singleclick", singleclick);
    map.un("pointermove", activerPointeurSurFeatures);
    map.on("click", onClique);
});

$(document).on("click", "#modifierAgentBouton", function (e){
    e.preventDefault();
    data = {
        modification: true,
        nom: $("#modifierAgent #Nom").val()? "'"+$("#modifierAgent #Nom").val()+"'": "null",
        prenom: $("#modifierAgent #Prenom").val()? "'"+$("#modifierAgent #Prenom").val()+"'": "null",
        mobilite: $("#modifierAgent #Mobilite").val(),
        emplacement: coords,
        gid: gid
    }
    
    beforeSend = function(xhr){
        if(!$("#modifierAgent #Nom").val()){
            xhr.abort();
            afficherNotif("warning", "Veuillez saisir le nom de l'agent");
        }if(!$("#modifierAgent #Prenom").val()){
            xhr.abort();
            afficherNotif("warning", "Veuillez saisir le prénom de l'agent");
        }
    }
    error_fatale = function (jqXhr) {
        rapportErreurs(jqXhr);
        afficherNotif("erreur_fatale", "Une erreur est survenu lors de la modification ou bien de déplacement de l'agent");
    }
    success = function (resultat) {
        if (resultat.type == "succes") {
            afficherNotif("succes", resultat.msg);
            actualiserCoucheAgent();
        }
    }
    ajax("modules/gestionAgents/gestionAgents.php", data, error_fatale, success, undefined, beforeSend);
});

// /CAS DE MODIFICATION 


// CAS D'AJOUT D'UN AGENT
$(document).on("click", "#pointerAgentAjouter", function () {
    changerPointeurAjout("agent_24.png");
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
        mobilite: $("#Mobilite").val(),
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

$(document).on("click", "#reinitAjoutAgent", function(e) {
    $("#pointerAgentAjouter").html("<i class='clip-plus-circle'></i> Localiser l'emplacement de l'agent");
    coords = null;
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
// /CAS D'AJOUT D'UN AGENT

// PARTIE SUPPRESSION
function singleclick2 (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        layer = [coucheAgent];
        return feature;
    });
    if (feature) {
        $("#SupprimerAgentBouton").prop("disabled", false);
        $("#pointerAgentSupprimer").html('<i class="clip-plus-circle"></i> Agent N° ' + feature.get("gid"));
        gid = feature.get("gid");
    }
};

$(document).on("click", "#reinitSuppAgent", function(e) {
    $("#pointerAgentSupprimer").html("<i class='clip-plus-circle'></i> Localiser l'emplacement de l'agent");
    $("#SupprimerAgentBouton").prop("disabled", true);
    map.un("pointermove", activerPointeurSurFeatures);
    map.un("singleclick", singleclick2);
});

$(document).on("click", "#pointerAgentSupprimer", function (e) {
    if ($("#collapseFour").attr("class") == "panel-collapse collapse in") {
        map.on("pointermove", activerPointeurSurFeatures);
    }
    map.on("singleclick", singleclick2);

});

$(document).on("click", "#SupprimerAgentBouton", function (e) {
    e.preventDefault();
    data = {
        suppression: true,
        gid: gid,
    }
    error_fatale = function (jqXhr) {
        rapportErreurs(jqXhr);
        afficherNotif("erreur_fatale", "Une erreur est survenu lors de la suppression de l'agent");
    }
    success = function (resultat) {
        if (resultat.type == "succes") {
            afficherNotif("succes", resultat.msg);
            actualiserCoucheAgent();
        }
    }
    ajax("modules/gestionAgents/gestionAgents.php", data, error_fatale, success);

});
// /PARTIE SUPPRESSION

// FONCTION D'ACTUALISATION DE LA COUCHE AGENT
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
    coucheAgent = new ol.layer.Vector({
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
// /FONCTION D'ACTUALISATION DE LA COUCHE AGENT

// REMPLIR LA TABLE ATTRIBUTAIRE DE LA TABLE ACCIDENT
remplirTableAttributaire("agent", "modules/gestionAgents/gestionAgents.php");
// /REMPLIR LA TABLE ATTRIBUTAIRE DE LA TABLE ACCIDENT

