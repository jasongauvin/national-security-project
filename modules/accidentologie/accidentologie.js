// DECLARATION DES VARIABLES
var agent_police_geojson = new ol.format.GeoJSON(), source_couche_accident = new ol.source.Vector();
var draw, json, coords, coucheAccident, execFonc = false;
// /DECLARATION DES VARIABLES

// INTERACTION GRAPHIQUE POUR LE MENU DROIT
interactionGraphiqueMenuDeNavigation(3, "accidentologie", "Boîte à outils accidentologie", 43, 0);
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

$(document).on("click", "#reinitAccident", function() {
    execFonc = false;
    $("#modifierAccident")[0].reset();
    $("#pointerAccidentModifier").html("<i class='clip-plus-circle'></i> Localiser l'emplacement d'accident");
});

$(document).on("click", "#pointerAccidentAjouter", function () {
    // CHANGEMENT DE POINTEUR LORS DE L'AJOUT

    $("#map").mouseover(function () {
        $("#map").css("cursor", "none");
        map.removeInteraction(draw);
        draw = new ol.interaction.Draw({
            type: 'Point',
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
        $("#pointerAccidentAjouter").html('<i class="clip-plus-circle"></i> ' + coords[0].toFixed(6) + ", " + coords[1].toFixed(6));
    });

});

$(document).on("click", "#pointerAccidentModifier", function (evt) {

    if (!execFonc) {
        map.on("pointermove", activerPointeurSurFeatures);

        map.on('singleclick', function (evt) {
            var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                layer = [coucheAccident];
                return feature;
            });
            if (feature) {

                $("#pointerAccidentModifier").html("<i class='clip-plus-circle'></i> Localiser le nouveau emplacement d'accident")

                $("#modifierAccident #nbrBlesses").next().addClass("active");
                $("#modifierAccident #nbrMorts").next().addClass("active");
                $("#modifierAccident #description").next().addClass("active");
                $("#modifierAccident #heurem").next().addClass("active");
                $("#modifierAccident #datem").next().addClass("active");

                $("#modifierAccident #nbrBlesses").val(feature.get("nbrblesses"));
                $("#modifierAccident #nbrMorts").val(feature.get("nbrmorts"));
                $("#modifierAccident #gravite").val(feature.get("gravite") == 'f' ? "false" : (feature.get("gravite") == 't' ? "true" : "null"));
                $("#modifierAccident #description").val(feature.get("description"));
                $("#modifierAccident #heurem").val(feature.get("dateheure").split(" ")[1]);
                $("#modifierAccident #datem").val(feature.get("dateheure").split(" ")[0]);
                execFonc = true;
            }
        });
    }else{
        map.un("pointermove", activerPointeurSurFeatures);

        map.on('click', function (evt) {
            coords = ol.proj.toLonLat(evt.coordinate);
            $("#pointerAccidentModifier").html('<i class="clip-plus-circle"></i> ' + coords[0].toFixed(6) + ", " + coords[1].toFixed(6));
        });
        // console.log("exec");
    }
    // console.log("clkickmodif");

    // $("#map").mouseover(function () {
    //     $("#map").css("cursor", "none");
    //     map.removeInteraction(draw);
    //     draw = new ol.interaction.Draw({
    //         type: 'Point',
    //         style: new ol.style.Style({
    //             image: new ol.style.Icon({
    //                 src: 'assets/img/main.png',
    //                 size: [64, 64],
    //                 opacity: 1
    //             })
    //         })
    //     });

    //     map.addInteraction(draw);

    // }).mouseout(function () {
    //     map.removeInteraction(draw);
    //     $("#map").css("cursor", "visible");
    // });



    // var mapListenerInfoBull;

    //         var container = document.getElementById('agent_popup');
    //     	var content1 = document.getElementById('agent_popup_content');
    //     	var closer = document.getElementById('popup-closer');

    //     	var overlay = new ol.Overlay({
	// 	        element: container,
	// 	        autoPan: true,
	// 	        autoPanAnimation: {
	// 	        	duration: 300
	// 	        }
	//       	});

    //     	map.addOverlay(overlay);

	//       	closer.onclick = function() {
	// 	        overlay.setPosition(undefined);
	// 	        closer.blur();
	// 	        return false;
    //           };
              
    // mapListenerInfoBull = function(e) {
    //     var feature = map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {    
    //         return feature;
    //     });
    //     var layer = map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {    
    //         return layer;
    //     });

    //     if(feature && (layer!=null)) {
    //            if( layer.get('name') == 'Nearby Pois') {
    //                console.log('ggggggggggggggggg');
    //                var c_popup_content = '<div class="card" style="margin-top: 10px;margin-bottom: -5px;">';		
    //             c_popup_content	+= '<div class="card-body" style="border-bottom: 1px solid;">';
    //                 c_popup_content	+='<h5><i class="icon-ribbon"></i> '+feature.get('nom')+'</h5>';
    //                 c_popup_content	+='<p class="mb-1"><i class="icon-bookmark2"></i> '+feature.get("categorie")+'</p>';
    //                 c_popup_content	+='<p class="mb-1"><i class="'+sscat+'" style="color: orange"></i> '+feature.get("souscategorie")+' </p>';
    //                 c_popup_content	+='<p class="mb-1"><i class="icon-location-outline"></i> '+feature.get('adresse')+'</p>';
    //                 if(feature.get("tl") != ""){
    //                     c_popup_content+='<p class="mb-1"><small><i class="icon-phone" style="color: green"></i> '+feature.get("tl")+'</small></p>';
    //                 }
    //                 if(feature.get("fax") !=""){
    //                     c_popup_content+='<p class="mb-1"><small><i class="icon-tv2"  style="color: blue"></i> '+feature.get("fax")+'</small></p>';
    //                 }
    //                 if(feature.get("email") !=""){
    //                     c_popup_content+='<p class="mb-1"><small><i class="icon-mail5"  style="color: red"></i> '+feature.get("email")+'</small></p>';
    //                 }
    //                 if(feature.get("siteweb") !=""){
    //                     c_popup_content+='<p class="mb-1"><small><i class="icon-at"  style="color: black"></i> '+feature.get("siteweb")+'</small></p>';
    //                 }
    //                 c_popup_content	+='</div>';
    //                 c_popup_content +='<ul class="user-settings-list"><li style="width:25%;"><a href="javascript:void(0);" title="Agents à proximité" onclick="getNearbyAgentsPopup(\''+feature.get('nom')+'\','+feature.getGeometry().getCoordinates()[0]+','+feature.getGeometry().getCoordinates()[1]+');"><div class="icon"><i class="icon-account_circle"></i></div></a></li><li style="width:25%;"><a href="javascript:void(0);" title="Pois à proximité" onclick="getNearbyPoisPopup(\''+feature.get('nom')+'\','+feature.getGeometry().getCoordinates()[0]+','+feature.getGeometry().getCoordinates()[1]+');"><div class="icon red"><i class="icon-location3"></i></div></a></li><li style="width:25%;"><a href="javascript:void(0);" title="Itinéraire à partir d\'ici" onclick="roadPopup(\''+feature.get('nom')+'\','+feature.getGeometry().getCoordinates()[0]+','+feature.getGeometry().getCoordinates()[1]+',\'start_location_suggestion_list\', \'start_location_input\', \'start\', \'pois\');"><div class="icon yellow"><i class="icon-call_missed_outgoing"></i></div></a></li><li style="width:25%;"><a href="javascript:void(0);" title="Itinéraire vers ici" onclick="roadPopup(\''+feature.get('nom')+'\','+feature.getGeometry().getCoordinates()[0]+','+feature.getGeometry().getCoordinates()[1]+',\'destination_suggestion_list\', \'destination_input\', \'destination\', \'pois\');"><div class="icon yellow"><i class="icon-call_missed"></i></div></a></li></ul>';
    //                 c_popup_content	+='</div>';
    //             //content.innerHTML = '<div class="card text-white bg-grey"><div class="card-header">Header</div><div class="card-body"><h4 class="card-title">Dark card</h4><p class="card-text">Some quick example text to build on the card title and make up the bulk of the card\'s content.</p><ul class="list-group list-group-flush"><li class="list-group-item">Cras justo odio</li></ul></div></div>';
    //             //console.log(c_popup_content);
    //             content1.innerHTML = c_popup_content  ;
    //             overlay.setPosition(feature.getGeometry().getCoordinates());
    //            }else if( layer.get('name') == 'PoliceAgnetsLayer'){
    //                var c_popup_content = '<div class="card" style="margin-top: 10px;margin-bottom: -5px;">';		
    //             c_popup_content	+= '<div class="card-body" style="border-bottom: 1px solid;">';
    //                 c_popup_content	+='<h5><i class="icon-ribbon"></i> '+feature.get('nom')+'</h5>';
    //                 c_popup_content	+='<p class="mb-1"><i class="icon-profile-male" style="color:yellow"></i> De type '+feature.get("type")+'</p>';
    //                 c_popup_content	+='<p class="mb-1"><i class="icon-clock4" style="color: orange"></i> Crée le '+feature.get("date_creation")+' </p>';
    //             c_popup_content	+='</div>';
    //                 c_popup_content +='<ul class="user-settings-list"><li style="width:25%;"><a href="javascript:void(0);" title="Agents à proximité" onclick="getNearbyAgentsPopup(\''+feature.get('nom')+'\','+feature.getGeometry().getCoordinates()[0]+','+feature.getGeometry().getCoordinates()[1]+');"><div class="icon"><i class="icon-account_circle"></i></div></a></li><li style="width:25%;"><a href="javascript:void(0);" title="Pois à proximité" onclick="getNearbyPoisPopup(\''+feature.get('nom')+'\','+feature.getGeometry().getCoordinates()[0]+','+feature.getGeometry().getCoordinates()[1]+');"><div class="icon red"><i class="icon-location3"></i></div></a></li><li style="width:25%;"><a href="javascript:void(0);" title="Itinéraire à partir d\'ici" onclick="roadPopup(\''+feature.get('nom')+'\','+feature.getGeometry().getCoordinates()[0]+','+feature.getGeometry().getCoordinates()[1]+',\'start_location_suggestion_list\', \'start_location_input\', \'start\', \'agent\');"><div class="icon yellow"><i class="icon-call_missed_outgoing"></i></div></a></li><li style="width:25%;"><a href="javascript:void(0);" title="Itinéraire vers ici" onclick="roadPopup(\''+feature.get('nom')+'\','+feature.getGeometry().getCoordinates()[0]+','+feature.getGeometry().getCoordinates()[1]+',\'destination_suggestion_list\', \'destination_input\', \'destination\', \'agent\');"><div class="icon yellow"><i class="icon-call_missed"></i></div></a></li></ul>';
    //                 c_popup_content	+='</div>';
    //             content1.innerHTML = c_popup_content  ;
    //             overlay.setPosition(feature.getGeometry().getCoordinates());
    //            }
    //        }else{
    //            overlay.setPosition(undefined);
    //         closer.blur();
    //         return false;
    //        }
    // }

    // mapClickEventKeyInfoBull= map.on('click', mapListenerInfoBull);


});


$(document).on("click", "#ajouterAccident", function (e) {
    e.preventDefault();

    data = {
        ajout: true,
        nbrBlesses: $("#nbrBlesses").val()? $("#nbrBlesses").val(): "null",
        nbrMorts: $("#nbrMorts").val()? $("#nbrMorts").val(): "null",
        gravite: $("#gravite").val()? $("#gravite").val(): "null",
        desc: $("#description").val()? "'"+$("#description").val()+"'": "null",
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

$(document).on("click", "#modifierAccident", function (e){
    e.preventDefault();

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
    coucheAccident = new ol.layer.Vector({
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
