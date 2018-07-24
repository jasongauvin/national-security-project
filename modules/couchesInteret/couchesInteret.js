// INTERACTION GRAPHIQUE POUR LE MENU DROIT
interactionGraphiqueMenuDeNavigation(1, "couchesInteret", "Les couches disponibles", 350, 170);
// /INTERACTION GRAPHIQUE POUR LE MENU DROIT

// LE STYLE CSS DU CONTENU HTML DU MENU DROIT
$("<link>").attr("rel","stylesheet").attr("type","text/css").attr("href","modules/couchesInteret/couchesInteret.css").appendTo("head");
// /LE STYLE CSS DU CONTENU HTML DU MENU DROIT

// LE CONTENU HTML DU MENU DROIT
$.get("modules/couchesInteret/couchesInteret.html", function (data) {
    $("#style_selector div:eq(1)").after().append(data);
});
// /LE CONTENU HTML DU MENU DROIT

// GESTION DES CHECKBOX DES COUCHES DISPONIBLES
$(document).on("change","#mosquees",function () {
    if (this.checked) {
        changerClasseCss("listeCoucheMosquees", "dropdown open");
        critere = 301;
        getNearbyPois(critere);
        nearbyPoisGeometryVector.changed();
    } else {
        changerClasseCss("listeCoucheMosquees", "dropdown hidden");
        removePoisFeatures('Mosquée');
    }
});

$(document).on("change","#ecoles",function () {
    if (this.checked) {
        changerClasseCss("listeCoucheEcoles", "dropdown open");
        critere = 142;
        getNearbyPois(critere);
        nearbyPoisGeometryVector.changed();
    } else {
        changerClasseCss("listeCoucheEcoles", "dropdown hidden");
        removePoisFeatures('Ecole Supérieure Et Institut Public');
    }
});

$(document).on("change","#banques",function () {
    changerClasseCss("listeCoucheBanques", "dropdown open");
    if (this.checked) {
        critere = 150;
        getNearbyPois(critere);
        nearbyPoisGeometryVector.changed();
    } else {
        changerClasseCss("listeCoucheBanques", "dropdown hidden");
        removePoisFeatures('Banque');
    }
});

$(document).on("change","#hotels",function () {
    changerClasseCss("listeCoucheHotels", "dropdown open");
    if (this.checked) {
        critere = 266;
        getNearbyPois(critere);
        nearbyPoisGeometryVector.changed();
    } else {
        changerClasseCss("listeCoucheHotels", "dropdown hidden");
        removePoisFeatures('Hôtel');
    }
});


function removePoisFeatures(categorie) {
    nearbyPoisGeometryVector.getSource().forEachFeature(function (feature) {
        if (feature.get('souscategorie') == categorie) {
            nearbyPoisGeometryVector.getSource().removeFeature(feature);
        }
    });
    $("#nearby_pois_count").empty();
    $("#nearby_pois_count").append(nearbyPoisGeometryVector.getSource().getFeatures().length + ' POIS');
}

function getNearbyPois(critere) {

    if (mapAdvancedSearch_AddressGeometryVector.getSource().getFeatures().length > 0) {
        var features = mapAdvancedSearch_AddressGeometryVector.getSource().getFeatures();
        var coordinates = ol.proj.transform(features[0].getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');

        var res = '', res_b = '', res_e = '', res_h = '', res_m = '';

        $.ajax({
            url: 'http://www.navcities.com/api/proximite/?user=demo&maxNumberOfPois=20',
            data: {
                lon: coordinates[0],
                lat: coordinates[1],
                crit: critere
            },
            type: 'GET',
            dataType: 'JSON',
            async: true,
            cache: false,
            timeout: 1000,
            success: function (result) {
                //console.log(result.features.length +'|'+nearbyPoisGeometryVector.getSource().getFeatures().length);
                if (critere == 301) {
                    $("#nbrMosquees").empty();
                    // $("#nbrMosquees").append((result.features.length + nearbyPoisGeometryVector.getSource().getFeatures().length));
                    $("#nbrMosquees").append((result.features.length));
                    $("#nbrMosqueesTitre").text($('#nbrMosquees').text() + " Mosquées disponibles");
                }
                else if (critere == 142) {
                    $("#nbrEcoles").empty();
                    // $("#nbrEcoles").append((result.features.length + nearbyPoisGeometryVector.getSource().getFeatures().length));
                    $("#nbrEcoles").append((result.features.length));
                    $("#nbrEcolesTitre").text($('#nbrEcoles').text() + " Écoles disponibles");

                }
                else if (critere == 150) {
                    $("#nbrBanques").empty();
                    // $("#nbrBanques").append((result.features.length + nearbyPoisGeometryVector.getSource().getFeatures().length));
                    $("#nbrBanques").append((result.features.length));
                    $("#nbrBanquesTitre").text($('#nbrBanques').text() + " Banques disponibles");

                }
                else if (critere == 266) {
                    $("#nbrHotels").empty();
                    // $("#nbrHotels").append((result.features.length + nearbyPoisGeometryVector.getSource().getFeatures().length));
                    $("#nbrHotels").append((result.features.length));
                    $("#nbrHotelsTitre").text($('#nbrHotels').text() + " Hôtels disponibles");

                }


                var features = geojsonFormat_geom.readFeatures(result, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });

                nearbyPoisGeometryVector.getSource().addFeatures(features);
                var f = nearbyPoisGeometryVector.getSource().getFeatures();

                if (f.length > 0) {
                    res += '<div class="todo-actions" style="overflow-y: scroll; height:250px;" >';
                    res += '<span class="desc">';

                    function arrayColumn(arr, n) {
                        return arr.map(x => x[n]);
                    }

                    var ar = [];
                    for (var i = 0; i < f.length; i++) {
                        ar.push([i, f[i].get("distance")]);
                    }

                    ar.sort(function (a, b) {
                        return a[1] - b[1];
                    });

                    for (var j = 0,i = arrayColumn(ar, 0)[0]; j < f.length; i = arrayColumn(ar, 0)[++j]) {
                        //console.log(f[i]);
                        
                        var dis = ((f[i].get("distance") < 1000) ? Math.round(f[i].get("distance")) + ' m' : (f[i].get("distance") / 1000).toFixed(3) + ' km');
                       
                        if (f[i].get('souscategorie') == 'Ecole Supérieure Et Institut Public') {
                            res_e += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res_e += '<div class="d-flex w-100 justify-content-between"><h5 style="margin-top: 0px;margin-bottom: 0px;" ><i class="glyphicon glyphicon-bookmark" style="margin-top: 11px;color: #007aff;"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary" style="background-color: #ff1744;" >' + dis + '</span></small><br /></div>';
                            res_e += '<strong>' + f[i].get("adresse") + '</strong><br />' + f[i].get("categorie") + '<br /><small>' + f[i].get("souscategorie") + '</small><br />';

                            if (f[i].get("tl") != "") {
                                res_e += '<small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small><br />';
                            }
                            if (f[i].get("fax") != "") {
                                res_e += '<small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small><br />';
                            }
                            if (f[i].get("email") != "") {
                                res_e += '<small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small><br />';
                            }
                            if (f[i].get("siteweb") != "") {
                                res_e += '<small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small><br />';
                            }
                        } else if (f[i].get('souscategorie') == 'Hôtel') {
                            res_h += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res_h += '<div class="d-flex w-100 justify-content-between"><h5 style="margin-top: 0px;margin-bottom: 0px;" ><i class="glyphicon glyphicon-bookmark" style="margin-top: 11px;color: #007aff;"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary" style="background-color: #ff1744;" >' + dis + '</span></small><br /></div>';
                            res_h += '<strong>' + f[i].get("adresse") + '</strong><br />' + f[i].get("categorie") + '<br /><small>' + f[i].get("souscategorie") + '</small><br />';

                            if (f[i].get("tl") != "") {
                                res_h += '<small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small><br />';
                            }
                            if (f[i].get("fax") != "") {
                                res_h += '<small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small><br />';
                            }
                            if (f[i].get("email") != "") {
                                res_h += '<small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small><br />';
                            }
                            if (f[i].get("siteweb") != "") {
                                res_h += '<small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small><br />';
                            }
                        } else if (f[i].get('souscategorie') == 'Banque') {
                            res_b += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res_b += '<div class="d-flex w-100 justify-content-between"><h5 style="margin-top: 0px;margin-bottom: 0px;" ><i class="glyphicon glyphicon-bookmark" style="margin-top: 11px;color: #007aff;"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary" style="background-color: #ff1744;" >' + dis + '</span></small><br /></div>';
                            res_b += '<strong>' + f[i].get("adresse") + '</strong><br />' + f[i].get("categorie") + '<br /><small>' + f[i].get("souscategorie") + '</small><br />';

                            if (f[i].get("tl") != "") {
                                res_b += '<small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small><br />';
                            }
                            if (f[i].get("fax") != "") {
                                res_b += '<small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small><br />';
                            }
                            if (f[i].get("email") != "") {
                                res_b += '<small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small><br />';
                            }
                            if (f[i].get("siteweb") != "") {
                                res_b += '<small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small><br />';
                            }
                        } else if (f[i].get('souscategorie') == 'Mosquée') {
                            res_m += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res_m += '<div class="d-flex w-100 justify-content-between"><h5 style="margin-top: 0px;margin-bottom: 0px;" ><i class="glyphicon glyphicon-bookmark" style="margin-top: 11px;color: #007aff;"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary" style="background-color: #ff1744;" >' + dis + '</span></small><br /></div>';
                            res_m += '<strong>' + f[i].get("adresse") + '</strong><br />' + f[i].get("categorie") + '<br /><small>' + f[i].get("souscategorie") + '</small><br />';

                            if (f[i].get("tl") != "") {
                                res_m += '<small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small><br />';
                            }
                            if (f[i].get("fax") != "") {
                                res_m += '<small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small><br />';
                            }
                            if (f[i].get("email") != "") {
                                res_m += '<small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small><br />';
                            }
                            if (f[i].get("siteweb") != "") {
                                res_m += '<small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small><br />';
                            }
                        }

                    }

                    var fin = '</span></div>';
                }

                if (critere == 301) {
                    $("#ulMosquees").empty();
                    $("#ulMosquees").append(res+res_m+fin);
                } else if (critere == 150) {
                    $("#ulBanques").empty();
                    $("#ulBanques").append(res+res_b+fin);
                } else if (critere == 142) {
                    $("#ulEcoles").empty();
                    $("#ulEcoles").append(res+res_e+fin);
                } else if (critere == 266) {
                    $("#ulHotels").empty();
                    $("#ulHotels").append(res+res_h+fin);
                }


            },
            error: function () {
                console.log('error parse !');
            },
            complete: function () {
                // var extent = nearbyPoisGeometryVector.getSource().getExtent();
                // map.getView().fit(extent, map.getSize());
            }
        });
    }
}

function nearbyPoisStyle(feature, resolution) {
    var s = getFeatureStyle(feature);
    return s;
};

var nearbyPoisGeometryVector = new ol.layer.Vector(
    {
        name: 'Nearby Pois',
        source: new ol.source.Vector(),
        style: nearbyPoisStyle
    });
map.addLayer(nearbyPoisGeometryVector);


function getFeatureStyle(feature) {

    var st = [];

    function AppliquerStyleIcone(img){
        st.push(new ol.style.Style({
            image: new ol.style.Icon( ({
              anchor: [0.5, 46],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              src: "assets/img/"+img+".png"
            }))
          }));
    }

    switch (feature.get('souscategorie')) {
        case "Banque":
            AppliquerStyleIcone("banque");
            break;
        case "Mosquée":
            AppliquerStyleIcone("mosquee");    
            break;
        case "Ecole Supérieure Et Institut Public":
            AppliquerStyleIcone("ecole");
            break;
        case "Hôtel":
            AppliquerStyleIcone("hotel");
            break;
    }
    
    return st;
}

function zoomToPoi(nom, coord0, coord1, el) {
    nearbyPoisGeometryVector.getSource().forEachFeature(function (feature) {
        var name = feature.get('nom').replace(/[']/g, "|");
        var cx = feature.get('x');
        var cy = feature.get('y');
        if (name == nom && cx == coord0 && cy == coord1) {
            var ext = feature.getGeometry().getExtent();
            map.getView().fit(ext, map.getSize());
            var coordinates = ol.proj.transform([Number(feature.get('x')), Number(feature.get('y'))], 'EPSG:4326', 'EPSG:3857');
            poi_popup.show(feature.getGeometry().getCoordinates(), name);
            map.getView().setZoom(18);
        }
    });
    // removeActiveClass();
    $(el).addClass("active");
}

var poi_popup = new ol.Overlay.Popup(
    {
        popupClass: "default anim", //"default anim" "tooltips", "warning" "black" "default", "tips", "shadow",
        closeBox: true,
       // onclose: function () { /*removeActiveClass();*/ },
        positioning: 'bottom-auto',
        autoPan: true,
        autoPanAnimation: { duration: 100 }
    });
map.addOverlay(poi_popup);


// function removeActiveClass() {
//     $("#pois_list_content").find('div.tab-content').find('a').removeClass('active');
// }

// /GESTION DES CHECKBOX DES COUCHES DISPONIBLES