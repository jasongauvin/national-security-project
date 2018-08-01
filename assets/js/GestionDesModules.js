// VARIABLES GLOBALES
// ACTIVER LE RAPPORT D'ERREURS (AFFICHAGE DES ERREURS DANS LE CONSOLE DU NAVIGATEUR)
var rappErreurs = true;
// /ACTIVER LE RAPPORT D'ERREURS (AFFICHAGE DES ERREURS DANS LE CONSOLE DU NAVIGATEUR)
// /VARIABLES GLOBALES

// AFFICHAGE DU RAPPORT D'ERREURS
function rapportErreurs(err){
    if(rappErreurs){
        console.log(err.responseText);
    }
}
// AFFICHAGE DU RAPPORT D'ERREURS

// TRAITEMENT AJAX
function ajax(url, data, error, success = function (resultat) {
    if (resultat.type == "erreur") {
        afficherNotif("erreur", resultat.msg);
    }
    else if (resultat.type == "succes") {
        afficherNotif("succes", resultat.msg);
    }
}, complete = null) {

    $.ajax({
        url: url,
        data: data,
        type: 'POST',
        dataType: 'JSON',
        success: success,
        error: error,
        complete: complete
    });
}
// /TRAITEMENT AJAX

// CHARGEMENT DU SCRIPT DU MODULE COUCHES D'INTÉRÊT LORS DU CLIQUE
$("#couchesInteret").parent().click(function () {
    $.getScript("modules/couchesInteret/couchesInteret.js");
});
// /CHARGEMENT DU SCRIPT DU MODULE COUCHES D'INTÉRÊT LORS DU CLIQUE

// CHARGEMENT DU SCRIPT DU MODULE GESTION DES AGENTS LORS DU CLIQUE
$("#gestionAgents").parent().click(function () {
    $.getScript("modules/gestionAgents/gestionAgents.js");
});
// /CHARGEMENT DU SCRIPT DU MODULE GESTION DES AGENTS LORS DU CLIQUE

// CHARGEMENT DU SCRIPT DU MODULE ACCIDENTOLOGIE LORS DU CLIQUE
$("#accidentologie").parent().click(function () {
    $.getScript("modules/accidentologie/accidentologie.js");
});
// /CHARGEMENT DU SCRIPT DU MODULE ACCIDENTOLOGIE LORS DU CLIQUE