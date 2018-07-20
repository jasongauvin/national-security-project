// INTERACTION GRAPHIQUE POUR LE MODULE ACCIDENTOLOGIE
$("#accidentologie").parent().click(function () {
    interactionGraphiqueMenuDeNavigation(3, "accidentologie", "Boîte à outils accidentologie", 400, 100);

    // LE CONTENU DU MENU DROIT
$("#style_selector div:eq(1)").after().append("\
<div class='panel panel-default'>\
<div class='panel-body'>\
    <div class='panel-group accordion-custom accordion-teal' id='accordion' style='margin-bottom: 0px;' >\
        <div class='panel panel-default'>\
            <div class='panel-heading'>\
                <h4 class='panel-title'>\
                <a class='accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseOne'>\
                    Importation\
                </a></h4>\
            </div>\
            <div id='collapseOne' class='panel-collapse collapse'>\
                <div class='panel-body'>\
                    Anim pariatur cliche \
                </div>\
            </div>\
        </div>\
        <div class='panel panel-default'>\
            <div class='panel-heading'>\
                <h4 class='panel-title'>\
                <a class='accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseTwo'>\
                    Ajout\
                </a></h4>\
            </div>\
            <div id='collapseTwo' class='panel-collapse collapse'>\
                <div class='panel-body'>\
                    Anim\
                </div>\
            </div>\
        </div>\
        <div class='panel panel-default'>\
            <div class='panel-heading'>\
                <h4 class='panel-title'>\
                <a class='accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseThree'>\
                    Modification\
                </a></h4>\
            </div>\
            <div id='collapseThree' class='panel-collapse collapse'>\
                <div class='panel-body'>\
                    Anim\
                </div>\
            </div>\
        </div>\
        <div class='panel panel-default'>\
            <div class='panel-heading'>\
                <h4 class='panel-title'>\
                <a class='accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseFour'>\
                    Suppression\
                </a></h4>\
            </div>\
            <div id='collapseFour' class='panel-collapse collapse'>\
                <div class='panel-body'>\
                    Anim\
                </div>\
            </div>\
        </div>\
    </div>\
</div>\
</div>\
");
// /LE CONTENU DU MENU DROIT
});
// /INTERACTION GRAPHIQUE POUR LE MODULE ACCIDENTOLOGIE

