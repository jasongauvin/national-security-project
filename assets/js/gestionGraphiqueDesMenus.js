// CHANGEMENT DE CLASSE CSS D'UN ÉLÉMENT IDENTIFIÉ PAR UN ID
function changerClasseCss(id, classe) {
    $('#' + id).attr('class', classe);
}
// /CHANGEMENT DE CLASSE CSS D'UN ÉLÉMENT IDENTIFIÉ PAR UN ID

// INTERACTION GRAPHIQUE POUR CHAQUE MODULE DANS LE MENU PRINCIPAL DE NAVIGATION
function interactionGraphiqueMenuDeNavigation(ordre, idModule, titreMenuDroit, largeurMenu, marginTop) {

    // CHANGEMENT DE TEXTE DANS LA BALISE <title>
    $("title").text($('#' + idModule).text());
    // /CHANGEMENT DE TEXTE DANS LA BALISE <title>

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
    $("#style_selector").css("width", largeurMenu+"%");
    // /DIMENSIONNEMENT DE LA LARGEUR DU MENU DROIT

    // DIMENSIONNEMENT DU MARGIN HAUT DU MENU DROIT
    $("#style_selector").css("margin-top", marginTop+"%");
    // DIMENSIONNEMENT DU MARGIN HAUT DU MENU DROIT
    
    // AFFICHAGE DU CONTENEUR DU MENU DROIT
    $("#style_selector_container").css("display", "block");
    // /AFFICHAGE DU CONTENEUR DU MENU DROIT

}
// /INTERACTION GRAPHIQUE POUR CHAQUE MODULE DANS LE MENU PRINCIPAL DE NAVIGATION

// GESTION DES NOTIFICATIONS
function afficherNotif(type, msg, temps = 10000) {
    var classe, titre;
    if (type == "erreur") {
        classe = "alert alert-block alert-danger fade in";
        titre = "<i class='clip-cancel-circle-2' ></i> Erreur !";
    }
    else if (type == "succes") {
        classe = "alert alert-block alert-success fade in";
        titre = "<i class='clip-checkmark-circle-2'></i> Succès !";
    }
    else if (type == "erreur_fatale") {
        classe = "alert alert-block alert-danger fade in";
        titre = "<i class='clip-cancel-circle-2' ></i> Erreur !";
    }
    else if (type == "warning") {
        classe = "alert alert-block alert-warning fade in";
        titre = "<i class='clip-warning' ></i> Attention !";
    } else if (type == "info") {
        classe = "alert alert-block alert-info fade in";
        titre = "<i class='clip-info-2' ></i> Info !"
    }

    // DÉFINITION DU STYLE ET CONTENU DE NOTIFICATION
    $.notify.addStyle('style', {
        html:
            "<div id='notif' style='width: 440px;'>" +
                "<button data-dismiss='alert' class='close' type='button'>" +
                    "&times;" +
                "</button>" +
                "<h4 class='alert-heading' data-notify-html='title'></h4>" +
                "<p data-notify-html='contenu'></p>" +
            "</div>"
    });

    $.notify({
        title: titre,
        contenu: msg
    }, {
            style: 'style',
            className: classe,
            autoHide: true,
            autoHideDelay: temps,
            showAnimation: 'slideDown',
            hideAnimation: 'slideUp',
            clickToHide: true
        });
    // /DÉFINITION DU STYLE ET CONTENU DE NOTIFICATION

    $("#notif").removeClass("notifyjs-foo-base notifyjs-foo-alert");
    $("#notif").addClass("alert");
    $('.notifyjs-container').css('left', '-633px');
    $('.notifyjs-container').css('top', '99px');

}
// /GESTION DES NOTIFICATIONS