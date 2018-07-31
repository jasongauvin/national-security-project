// CHANGEMENT DE CLASSE CSS D'UN ÉLÉMENT IDENTIFIÉ PAR UN ID
function changerClasseCss(id, classe) {
    $('#' + id).attr('class', classe);
}
// /CHANGEMENT DE CLASSE CSS D'UN ÉLÉMENT IDENTIFIÉ PAR UN ID

// INTERACTION GRAPHIQUE POUR CHAQUE MODULE DANS LE MENU PRINCIPAL DE NAVIGATION
function interactionGraphiqueMenuDeNavigation(ordre, idModule, titreMenuDroit, largeurMenu, marginTop) {

    // CHANGEMENT DE TEXTE DANS LE TITRE DU BORD [ TABLEAU DE BORD / ... ]
    $("#tabBord").text($('#' + idModule).text());
    // /CHANGEMENT DE TEXTE DANS LE TITRE DU BORD [ TABLEAU DE BORD / ... ]

    // CHANGEMENT DE L'ICONE DU BORD
    $("#iconeTabBord").attr('class', $('#' + idModule).prev().attr("class"));
    // /CHANGEMENT DE L'ICONE DU BORD

    // ENLÈVEMENT DE LA CLASSE "active open" DE TOUS LES SOUS ÉLÉMENTS DE LA CLASSE main-navigation-menu
    $('.main-navigation-menu li').each(function () {
        this.className = '';
    });
    // /ENLÈVEMENT LA CLASSE "active open" DE TOUS LES SOUS ÉLÉMENTS DE LA CLASSE main-navigation-menu

    // CHANGEMENT DE LA COULEUR DU MENU PASSÉ EN PARAMÈTRE
    $(".main-navigation-menu li:eq(" + ordre + ")").attr('class', 'active open');
    // /CHANGEMENT DE LA COULEUR DU MENU PASSÉ EN PARAMÈTRE

    // TITRE DU MENU DROIT
    $("#titreMenuDroit").text(titreMenuDroit);
    // /TITRE DU MENU DROIT

    // AFFICHAGE DE BOUTON TOGGLE DU MENU DROIT
    $("#boutonToggle").css("display", "block");
    changerClasseCss("boutonToggle", "style-toggle open");
    // /AFFICHAGE DE BOUTON TOGGLE DU MENU DROIT

    // DIMENSIONNEMENT DE LA LARGEUR DU MENU DROIT
    $("#style_selector").css("width", largeurMenu+"px");
    // /DIMENSIONNEMENT DE LA LARGEUR DU MENU DROIT

    // DIMENSIONNEMENT DU MARGIN HAUT DU MENU DROIT
    $("#style_selector").css("margin-top", marginTop+"px");
    // DIMENSIONNEMENT DU MARGIN HAUT DU MENU DROIT
    
    // AFFICHAGE DU CONTENEUR DU MENU DROIT
    $("#style_selector_container").css("display", "block");
    // /AFFICHAGE DU CONTENEUR DU MENU DROIT

}
// /INTERACTION GRAPHIQUE POUR CHAQUE MODULE DANS LE MENU PRINCIPAL DE NAVIGATION

// FERMETURE DE NOTIFICATIONS
function fermerNotif(temps) {
    window.setTimeout(function () {
        $('#notification').removeClass("in");
        $('#notification').addClass("out");
        $("#notification").css("display", "none");
    }, temps);
}
// /FERMETURE DE NOTIFICATIONS

function afficherNotif(type, msg) {
    if (type == "erreur") {
        $("#notification").attr("class", "alert alert-block alert-danger fade in");
        $("#notification h4 ").html("<i class='clip-cancel-circle-2' ></i> Erreur !");
        $("#notification p").html(msg);
        $("#notification").css("display", "block");
    }
    else if (type == "succes") {
        $("#notification").attr("class", "alert alert-block alert-success fade in");
        $("#notification h4 ").html("<i class='clip-checkmark-circle-2'></i> Succès !");
        $("#notification p").html(msg);
        $("#notification").css("display", "block");
    }
    else if (type == "erreur_fatale") {
        $("#notification").attr("class", "alert alert-block alert-danger fade in");
        $("#notification h4 ").html("<i class='clip-cancel-circle-2' ></i> Erreur !");
        $("#notification p").html(msg);
        $("#notification").css("display", "block");
    }
}