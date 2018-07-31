// TRAITEMENT AJAX
function ajax(url, data, error) {
    $.ajax({
        url: url,
        data: data,
        type: 'POST',
        dataType: 'JSON',
        success: function (resultat) {

            if (resultat.type == "erreur") {
                afficherNotif("erreur", resultat.msg);
                fermerNotif(10000);
            }
            else if (resultat.type == "succes") {
                afficherNotif("succes", resultat.msg);
                fermerNotif(10000);
            }
        },
        error: error
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