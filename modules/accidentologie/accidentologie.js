// INTERACTION GRAPHIQUE POUR LE MODULE ACCIDENTOLOGIE
$("#accidentologie").parent().click(function () {
    interactionGraphiqueMenuDeNavigation(3, "accidentologie", "Boîte à outils accidentologie", 400, 10);

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
                <a id='pointerAccidentologie' class='btn btn-primary' href='#'><i class='clip-plus-circle'></i> Pointer sur la carte</a>\
                <div class='input-group'><input data-date-format='dd-mm-yyyy' data-date-viewmode='years' class='form-control date-picker' type='date'><span class='input-group-addon'><i class='clip-calendar'></i></span></div>\
                <div class='input-group'><input class='form-control date-picker' type='time' name='alerttime'><span class='input-group-addon'><i class='clip-clock'></i></span></div>\
                <div class='input-group'><input class='form-control date-picker' type='int' placeholder='nbr blessés' ><span class='input-group-addon'><i class='clip-user-4'></i></span></div>\
                <div class='input-group'><input class='form-control date-picker' type='int' placeholder='nbr morts' ><span class='input-group-addon'><i class='clip-user-3'></i></span></div>\
				<div class='form-group'>\
                    <label for='form-field-select-4'>\
                        Types de véhicules\
                    </label>\
                    <select class='form-control' multiple>\
                        <option value='Voiture'>Voiture</option>\
                        <option value='Moto'>Moto</option>\
                        <option value='Velo'>Vélo</option>\
                        <option value='quad'>Quad</option>\
                        <option value='camion'>Camion</option>\
                        <option value='autobus'>Autobus</option>\
                    </select>\
                </div>\
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



$(document).on("click","#pointerAccidentologie",function () {

// CHANGEMENT DE POINTEUR LORS DE L'AJOUT
$("#map").css("cursor","none");

var source = new ol.source.Vector();

var draw = new ol.interaction.Draw({
    type: 'Point',
    source: source,
    style: new ol.style.Style({
        image: new ol.style.Icon({
            src: 'assets/img/pointeur.png',
            size: [128, 128],
            opacity: 1,
            scale: 0.4
        })
    })
});
map.addInteraction(draw);

});
// /CHANGEMENT DE POINTEUR LORS DE L'AJOUT