// DECLARATION DES VARIABLES
var agent_police_geojson = new ol.format.GeoJSON(), source_couche_accident = new ol.source.Vector();
var draw, json, coords;
// /DECLARATION DES VARIABLES

// INTERACTION GRAPHIQUE POUR LE MENU DROIT
interactionGraphiqueMenuDeNavigation(3, "accidentologie", "Boîte à outils accidentologie", 500, 0);
// /INTERACTION GRAPHIQUE POUR LE MENU DROIT

// LE STYLE CSS DU CONTENU HTML DU MENU DROIT
$("<link>").attr("rel", "stylesheet").attr("type", "text/css").attr("href", "modules/accidentologie/accidentologie.css").appendTo("head");
// /LE STYLE CSS DU CONTENU HTML DU MENU DROIT

// LE CONTENU HTML DU MENU DROIT
$.get("modules/accidentologie/accidentologie.html", function (data) {
    $("#style_selector div:eq(1)").after().append(data);
});
// /LE CONTENU HTML DU MENU DROIT

// AFFICHAGE DE LA COUCHE ACCIDENT
actualiserCoucheAccident();
// /AFFICHAGE DE LA COUCHE ACCIDENT

$(document).on("click", "#pointerAccidentologie", function () {

    // CHANGEMENT DE POINTEUR LORS DE L'AJOUT

    $("#map").mouseover(function () {
        $("#map").css("cursor", "none");

        var source = new ol.source.Vector();

        draw = new ol.interaction.Draw({
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

    }).mouseout(function () {
        map.removeInteraction(draw);
        $("#map").css("cursor", "visible");
    });

    map.on('click', function (evt) {
        coords = ol.proj.toLonLat(evt.coordinate);
        $("#pointerAccidentologie").html('<i class="clip-plus-circle"></i> ' + coords[0].toFixed(6) + ", " + coords[1].toFixed(6));
    });

});


$(document).on("click", "#ajouter", function (e) {
    e.preventDefault();

    data = {
        ajout: true,
        nbrBlesses: $("#nbrBlesses").val() == 0 ? "null" : $("#nbrBlesses").val(),
        nbrMorts: $("#nbrMorts").val() == 0 ? "null" : $("#nbrMorts").val(),
        gravite: $("#gravite").val() == "" ? "null" : $("#gravite").val(),
        desc: $("#desc").val(),
        dateHeure: $("#date").val() + " " + $("#heure").val(),
        emplacement: coords,
    }

    error_fatale = function (jqXhr) {
        rapportErreurs(jqXhr);
        afficherNotif("erreur_fatale", "Une erreur est survenu lors d'ajout de l'accident");
    }

    success = function (resultat) {
        if (resultat.type == "succes") {
            afficherNotif("succes", resultat.msg);
            actualiserCoucheAccident();
        }
    }

    ajax("modules/accidentologie/accidentologie.php", data, error_fatale, success);

});

$(document).on("change", "#fichierExcel", function () {

    // $("#barreProgres").fadeIn(200);
    // $("#barreProgres").css("display", "block");

    function exporterExcelVersJSON() {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
        /*Checks whether the file is a valid excel file*/
        if (regex.test($("#fichierExcel").val().toLowerCase())) {
            var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
            if ($("#fichierExcel").val().toLowerCase().indexOf(".xlsx") > 0) {
                xlsxflag = true;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                /*Converts the excel data in to object*/
                if (xlsxflag) {
                    var workbook = XLSX.read(data, { type: 'binary' });
                }
                else {
                    var workbook = XLS.read(data, { type: 'binary' });
                }
                /*Gets all the sheetnames of excel in to a variable*/
                var sheet_name_list = workbook.SheetNames;

                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
                sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
                    /*Convert the cell value to Json*/
                    if (xlsxflag) {
                        exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                    }
                    else {
                        exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                    }
                    if (exceljson.length > 0 && cnt == 0) {
                        getJSON(exceljson);
                    }
                });
            }
            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                reader.readAsArrayBuffer($("#fichierExcel")[0].files[0]);
            }
            else {
                reader.readAsBinaryString($("#fichierExcel")[0].files[0]);
            }

        }
        else {
            afficherNotif("warning", "Veuillez ajouter un fichier Excel valide");
        }
    }

    exporterExcelVersJSON();

    function getJSON(exceljson) {
        json = exceljson;

        // L'APPEL AJAX AVEC LES PARAMÈTRES
        data = {
            importation: true,
            noms_cols_excel: Object.keys(json[0]),
            lignes_excel: json
        }
        error_fatale = function (jqXhr) {
            rapportErreurs(jqXhr);
            afficherNotif("erreur_fatale", "Une erreur est survenu lors de l'importation des accidents");
        }
        success = function (resultat) {
            if (resultat.type == "erreur") {
                afficherNotif("erreur", resultat.msg);
            }
            else if (resultat.type == "succes") {
                afficherNotif("succes", resultat.msg);
                actualiserCoucheAccident();
            }
        }

        ajax("modules/accidentologie/accidentologie.php", data, error_fatale, success);
        // /L'APPEL AJAX AVEC LES PARAMÈTRES
    }

});


function actualiserCoucheAccident() {

    // DÉFINITION DU STYLE DE LA COUCHE ACCIDENT
    var styleCoucheAccident = function (feature) {

        var src = 'assets/img/accident.png';
        var style_accident = {
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
        return style_accident[feature.getGeometry().getType()];
    }
    // /DÉFINITION DU STYLE DE LA COUCHE ACCIDENT

    // DÉFINITION DE LA COUCHE ACCIDENT
    var coucheAccident = new ol.layer.Vector({
        name: 'CoucheAccident',
        title: 'Couche Accident',
        visible: true,
        source: source_couche_accident,
        style: styleCoucheAccident
    });
    // /DÉFINITION DE LA COUCHE ACCIDENT

    // SUPPRESSION DU CONTENU DE LA COUCHE ACCIDENT 
    source_couche_accident.clear();
    // /SUPPRESSION DU CONTENU DE LA COUCHE ACCIDENT

    // L'APPEL AJAX AVEC LES PARAMÈTRES
    data = {
        selection: true
    }
    success = function (result) {
        var features = agent_police_geojson.readFeatures(result, { featureProjection: 'EPSG:3857' });
        source_couche_accident.addFeatures(features);
        afficherNotif("info", "La couche des accidents a été bien actualisée");
    }
    error_fatale = function (jqXhr) {
        rapportErreurs(jqXhr);
        afficherNotif("erreur_fatale", "Une erreur est survenu lors du chargement de la couche des accidents");
    }
    ajax("modules/accidentologie/accidentologie.php", data, error_fatale, success);
    // /L'APPEL AJAX AVEC LES PARAMÈTRES

    // L'AJOUT DE LA COUCHE ACCIDENT À LA CARTE
    map.addLayer(coucheAccident);
    // /L'AJOUT DE LA COUCHE ACCIDENT À LA CARTE

}
