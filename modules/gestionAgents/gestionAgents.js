// DECLARATION DES VARIABLES
var agent_police_geojson = new ol.format.GeoJSON(), source_couche_agent = new ol.source.Vector();
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

        var src = 'assets/img/agent1_32.png';
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

$(document).on("click", "#pointerAgents", function () {

    // CHANGEMENT DE POINTEUR LORS DE L'AJOUT

    $("#map").mouseover(function () {
        $("#map").css("cursor", "none");

        var source = new ol.source.Vector();

        draw = new ol.interaction.Draw({
            type: 'Point',
            source: source,
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'assets/img/agent1_32.png',
                    size: [128, 128],
                    opacity: 1,
                    scale: 0.4
                })
            })
        });

        map.addInteraction(draw);

    }).mouseout(function () {
        map.removeInteraction(draw);
        $("#map").css("cursor", "visible");
    });

    map.on('click', function (evt) {
        coords = ol.proj.toLonLat(evt.coordinate);
        $("#pointerAgents").html('<i class="clip-plus-circle"></i> ' + coords[0].toFixed(6) + ", " + coords[1].toFixed(6));
    });

});

$(document).on("click", "#ajouter", function (e) {
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
