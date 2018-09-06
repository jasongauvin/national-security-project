// DECLARATION DES VARIABLES
var agent1 = new ol.geom.Point([]);
var agent2 = new ol.geom.Point([]);

var agent1Feature = new ol.Feature({
    geometry: agent1
});
var agent2Feature = new ol.Feature({
    geometry: agent2
});

var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(({
        src: 'assets/img/agent_24.png'
    }))
});

agent1Feature.setStyle(iconStyle);
agent2Feature.setStyle(iconStyle);

var vectorSource = new ol.source.Vector({
    features: [agent1Feature, agent2Feature]
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

map.addLayer(vectorLayer);
// /DECLARATION DES VARIABLES

// INTERACTION GRAPHIQUE POUR LE MENU DROIT
interactionGraphiqueMenuDeNavigation(6, "suiviTempsReel", "Boîte à outils du suivi en temps réel", 43, 0);
// /INTERACTION GRAPHIQUE POUR LE MENU DROIT

// LE STYLE CSS DU CONTENU HTML DU MENU DROIT
if(!$('head').find('link[href="modules/suiviTempsReel/suiviTempsReel.css"][rel="stylesheet"]').length){
    $("<link>").attr("rel", "stylesheet").attr("type", "text/css").attr("href", "modules/suiviTempsReel/suiviTempsReel.css").appendTo("head");
}
// /LE STYLE CSS DU CONTENU HTML DU MENU DROIT

// LE CONTENU HTML DU MENU DROIT
$.get("modules/suiviTempsReel/suiviTempsReel.html", function (data) {
    $("#style_selector div:eq(1)").after().append(data);
});
// /LE CONTENU HTML DU MENU DROIT

// CACHER TOUS LES POP-UPS
popup.hide();
// CACHER TOUS LES POP-UPS

// SUPPRESSION DE TOUTES LES AUTRES COUCHES
supprimerCouches(undefined);
// /SUPPRESSION DE TOUTES LES AUTRES COUCHES

// PARTIE REMPLISSAGE DES INPUTS SELECT
data = {
    selection: true
}
success = function (resultat) {
    for(i=0; i<resultat.length; i++){
        if(i==0){
            $("#agent1").append("<option value='"+resultat[i][2]+"' selected>"+resultat[i][0]+" "+resultat[i][1]+" [ IMEI : "+resultat[i][2]+" ] </option>");
        }else{
            $("#agent1").append("<option value='"+resultat[i][2]+"'>"+resultat[i][0]+" "+resultat[i][1]+" [ IMEI : "+resultat[i][2]+" ] </option>");
        }

        if(i==resultat.length-1){
            $("#agent2").append("<option value='"+resultat[i][2]+"' selected>"+resultat[i][0]+" "+resultat[i][1]+" [ IMEI : "+resultat[i][2]+" ] </option>");
        }else{
            $("#agent2").append("<option value='"+resultat[i][2]+"'>"+resultat[i][0]+" "+resultat[i][1]+" [ IMEI : "+resultat[i][2]+" ] </option>");
        }
    }
}
error_fatale = function (jqXhr) {
    rapportErreurs(jqXhr);
    afficherNotif("erreur_fatale", "Une erreur est survenu lors du chargement des agents et leurs IMEIs");
}
ajax("modules/suiviTempsReel/suiviTempsReel.php", data, error_fatale, success);
// /PARTIE REMPLISSAGE DES INPUTS SELECT

// RÉCUPÉRATION DES POSITIONS DES AGENTS
$(document).off("click", "#suivre").on("click", "#suivre", function (e) {

data = {
    agents_pos: true,
    imei_agent1: $("#agent1").val(),
    imei_agent2: $("#agent2").val()
}
success = function (resultat) {
    agent1.setCoordinates(ol.proj.fromLonLat(resultat.agent1));
    agent2.setCoordinates(ol.proj.fromLonLat(resultat.agent2));

}
error_fatale = function (jqXhr) {
    rapportErreurs(jqXhr);
    afficherNotif("erreur_fatale", "Une erreur est survenu lors de la récupération des positions des agents");
}
ajax("modules/suiviTempsReel/suiviTempsReel.php", data, error_fatale, success);
});
// /RÉCUPÉRATION DES POSITIONS DES AGENTS