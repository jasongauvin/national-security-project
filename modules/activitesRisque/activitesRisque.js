// DECLARATION DES VARIABLES

// /DECLARATION DES VARIABLES

// INTERACTION GRAPHIQUE POUR LE MENU DROIT
interactionGraphiqueMenuDeNavigation(5, "activitesRisque", "Boîte à outils des activités à risque", 43, 0);
// /INTERACTION GRAPHIQUE POUR LE MENU DROIT

// LE STYLE CSS DU CONTENU HTML DU MENU DROIT
if(!$('head').find('link[href="modules/activitesRisque/activitesRisque.css"][rel="stylesheet"]').length){
    $("<link>").attr("rel", "stylesheet").attr("type", "text/css").attr("href", "modules/activitesRisque/activitesRisque.css").appendTo("head");
}
// /LE STYLE CSS DU CONTENU HTML DU MENU DROIT

// LE CONTENU HTML DU MENU DROIT
$.get("modules/activitesRisque/activitesRisque.html", function (data) {
    $("#style_selector div:eq(1)").after().append(data);
});
// /LE CONTENU HTML DU MENU DROIT

// CACHER TOUS LES POP-UPS
popup.hide();
// CACHER TOUS LES POP-UPS

// SUPPRESSION DE TOUTES LES AUTRES COUCHES
supprimerCouches();
// /SUPPRESSION DE TOUTES LES AUTRES COUCHES