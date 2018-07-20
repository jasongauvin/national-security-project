// CHANGEMENT DE CLASSE CSS D'UN ÉLÉMENT IDENTIFIÉ PAR UN ID
function changerClasseCss(id, classe) {
    $('#' + id).attr('class', classe);
}
// /CHANGEMENT DE CLASSE CSS D'UN ÉLÉMENT IDENTIFIÉ PAR UN ID

// INTERACTION GRAPHIQUE POUR CHAQUE MODULE DANS LE MENU PRINCIPAL DE NAVIGATION
function interactionGraphiqueMenuDeNavigation(ordre, idModule, titreMenuDroit) {

    // AFFICHAGE DE BOUTON TOGGLE DU MENU DROIT
    $("#Boutontoggle").css("display", "block");
    // /AFFICHAGE DE BOUTON TOGGLE DU MENU DROIT

    // CHANGEMENT DE TEXTE DANS LE TITRE DU BORD [ TABLEAU DE BORD / ... ]
    $("#tabBord").text($('#' + idModule).text());
    // /CHANGEMENT DE TEXTE DANS LE TITRE DU BORD [ TABLEAU DE BORD / ... ]

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
}
// /INTERACTION GRAPHIQUE POUR CHAQUE MODULE DANS LE MENU PRINCIPAL DE NAVIGATION
