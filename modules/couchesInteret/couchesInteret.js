var geojsonFormat_geom = new ol.format.GeoJSON();

// CHANGEMENT DE CLASSE CSS
function changerClasseCss(id, classe) {
    $('#' + id).attr('class', classe);
}
// /CHANGEMENT DE CLASSE CSS

// INTERACTION POUR COUCHES D'INTÉRÊT
$("#couchesInteret").click(function () {
    $("#Boutontoggle").attr('class', 'style-toggle open');
    document.getElementById("style_selector_container").style.display = "block";
    document.getElementById("Boutontoggle").style.display = "block";
    $("#titreMenuDroit").text('Les couches disponibles');

});
// /INTERACTION POUR COUCHES D'INTÉRÊT

// L'AFFICHAGE DES LISTES DES COUCHES DANS LE HEADER
// $("#listeCoucheBanques").attr('class', 'dropdown');
// /L'AFFICHAGE DES LISTES DES COUCHES DANS LE HEADER


// GESTION DES CHECKBOX DES COUCHES DISPONIBLES

$("#mosquees").change(function () {
    if (this.checked) {
        changerClasseCss("listeCoucheMosquees", "dropdown open");
        critere = 301;
        getNearbyPois(critere);
        nearbyPoisGeometryVector.changed();
    } else {
        changerClasseCss("listeCoucheMosquees", "dropdown hidden");
        critere = null;

        removePoisFeatures('Mosquée');
        $('#ulMosquees').empty();
        $('#ulMosquees').append('<div><br><br><p class="text-center">Pas de données à afficher.</p></div>');
    }
});

$("#ecoles").change(function () {
    if (this.checked) {
        changerClasseCss("listeCoucheEcoles", "dropdown open");
        critere = 142;
        getNearbyPois(critere);
        nearbyPoisGeometryVector.changed();
    } else {
        changerClasseCss("listeCoucheEcoles", "dropdown hidden");
        critere = null;
        removePoisFeatures('Ecole Supérieure Et Institut Public');
        $('#ulEcoles').empty();
        $('#ulEcoles').append('<div><br><br><p class="text-center">Pas de données à afficher.</p></div>');
    }
});

$("#banques").change(function () {
    changerClasseCss("listeCoucheBanques", "dropdown open");
    if (this.checked) {
        critere = 150;
        getNearbyPois(critere);
        nearbyPoisGeometryVector.changed();
    } else {
        changerClasseCss("listeCoucheBanques", "dropdown hidden");
        critere = null;
        removePoisFeatures('Banque');
        $('#ulBanques').empty();
        $('#ulBanques').append('<div><br><br><p class="text-center">Pas de données à afficher.</p></div>');
    }
});

$("#hotels").change(function () {
    changerClasseCss("listeCoucheHotels", "dropdown open");
    if (this.checked) {
        critere = 266;
        getNearbyPois(critere);
        nearbyPoisGeometryVector.changed();
    } else {
        changerClasseCss("listeCoucheHotels", "dropdown hidden");
        critere = null;
        removePoisFeatures('Hôtel');
        $('#ulHotels').empty();
        $('#ulHotels').append('<div><br><br><p class="text-center">Pas de données à afficher.</p></div>');
    }
});


function removePoisFeatures(categorie) {
    nearbyPoisGeometryVector.getSource().forEachFeature(function (feature) {
        if (feature.get('souscategorie') == categorie) {
            nearbyPoisGeometryVector.getSource().removeFeature(feature);
        }
        /*console.log("removed");
        console.log(feature);
        vectorLayer.getSource().removeFeature(feature);*/
    });
    $("#nearby_pois_count").empty();
    $("#nearby_pois_count").append(nearbyPoisGeometryVector.getSource().getFeatures().length + ' POIS');
}



function getNearbyPois(critere) {

    if (mapAdvancedSearch_AddressGeometryVector.getSource().getFeatures().length > 0) {
        var features = mapAdvancedSearch_AddressGeometryVector.getSource().getFeatures();
        var coordinates = ol.proj.transform(features[0].getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');

        var res = '';
        $.ajax({
            url: 'http://www.navcities.com/api/proximite/?user=demo&maxNumberOfPois=20',
            data: {
                lon: coordinates[0],
                lat: coordinates[1],
                crit: critere
            },
            type: 'GET',
            dataType: 'JSON',
            async: false,
            cache: false,
            timeout: 1000,
            success: function (result) {
                //console.log(result);
                if (critere == 301) {
                    $("#nbrMosquees").empty();
                    $("#nbrMosquees").append((result.features.length + nearbyPoisGeometryVector.getSource().getFeatures().length));
                    $("#nbrMosqueesTitre").text($('#nbrMosquees').text() + " Mosquées disponibles");
                }
                else if (critere == 142) {
                    $("#nbrEcoles").empty();
                    $("#nbrEcoles").append((result.features.length + nearbyPoisGeometryVector.getSource().getFeatures().length));
                    $("#nbrEcolesTitre").text($('#nbrEcoles').text() + " Écoles disponibles");

                }
                else if (critere == 150) {
                    $("#nbrBanques").empty();
                    $("#nbrBanques").append((result.features.length + nearbyPoisGeometryVector.getSource().getFeatures().length));
                    $("#nbrBanquesTitre").text($('#nbrBanques').text() + " Banques disponibles");

                }
                else if (critere == 266) {
                    $("#nbrHotels").empty();
                    $("#nbrHotels").append((result.features.length + nearbyPoisGeometryVector.getSource().getFeatures().length));
                    $("#nbrHotelsTitre").text($('#nbrHotels').text() + " Hôtels disponibles");

                }


                var features = geojsonFormat_geom.readFeatures(result, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });

                nearbyPoisGeometryVector.getSource().addFeatures(features);
                var f = nearbyPoisGeometryVector.getSource().getFeatures();
                //console.log(f);

                if (f.length > 0) {
                    res += '<div class="todo-actions">';
                    for (var i = 0; i < f.length; i++) {

                        var dis = ((f[i].get("distance") < 1000) ? Math.round(f[i].get("distance")) + ' m' : Math.round(f[i].get("distance") / 1000) + ' km');
                        if (f[i].get('souscategorie') == 'Super Marché Et Surface Commerciale') {
                            sscat = "icon icon-cart";
                            //name.replace(/[']/g, "|");
                            res += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';

                            res += '<div class="desc"><h5><i class="icon-ribbon"></i> ' + f[i].get("nom") + '</h5><small><span class="label label-danger">' + dis + '</span></small></div>';
                            res += '<p class="mb-1"><i class="icon-location-outline"></i> ' + f[i].get("adresse") + '</p><p class="mb-1"><i class="icon-bookmark2"></i> ' + f[i].get("categorie") + '</p><p class="mb-1"><small><i class="' + sscat + '" style="color: orange"></i> ' + f[i].get("souscategorie") + '</small></p>';
                            //res += '<hr>';
                            if (f[i].get("tl") != "") {
                                res += '<p class="mb-1"><small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small></p>';
                            }
                            if (f[i].get("fax") != "") {
                                res += '<p class="mb-1"><small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small></p>';
                            }
                            if (f[i].get("email") != "") {
                                res += '<p class="mb-1"><small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small></p>';
                            }
                            if (f[i].get("siteweb") != "") {
                                res += '<p class="mb-1"><small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small></p>';
                            }
                        } else if (f[i].get('souscategorie') == 'Librairie Et Papeterie') {
                            sscat = "icon icon-library";
                            //name.replace(/[']/g, "|");
                            res += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res += '<div class="d-flex w-100 justify-content-between"><h5><i class="icon-ribbon"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary">' + dis + '</span></small></div>';
                            res += '<p class="mb-1"><i class="icon-location-outline"></i> ' + f[i].get("adresse") + '</p><p class="mb-1"><i class="icon-bookmark2"></i> ' + f[i].get("categorie") + '</p><p class="mb-1"><small><i class="' + sscat + '" style="color: orange"></i> ' + f[i].get("souscategorie") + '</small></p>';
                            res += '<hr>';
                            if (f[i].get("tl") != "") {
                                res += '<p class="mb-1"><small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small></p>';
                            }
                            if (f[i].get("fax") != "") {
                                res += '<p class="mb-1"><small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small></p>';
                            }
                            if (f[i].get("email") != "") {
                                res += '<p class="mb-1"><small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small></p>';
                            }
                            if (f[i].get("siteweb") != "") {
                                res += '<p class="mb-1"><small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small></p>';
                            }
                        } else if (f[i].get('souscategorie') == 'Ecole Supérieure Et Institut Public') {
                            sscat = "icon icon-library";
                            //name.replace(/[']/g, "|");
                            res += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res += '<div class="d-flex w-100 justify-content-between"><h5><i class="icon-ribbon"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary">' + dis + '</span></small></div>';
                            res += '<p class="mb-1"><i class="icon-location-outline"></i> ' + f[i].get("adresse") + '</p><p class="mb-1"><i class="icon-bookmark2"></i> ' + f[i].get("categorie") + '</p><p class="mb-1"><small><i class="' + sscat + '" style="color: orange"></i> ' + f[i].get("souscategorie") + '</small></p>';
                            if (f[i].get("tl") != "") {
                                res += '<p class="mb-1"><small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small></p>';
                            }
                            if (f[i].get("fax") != "") {
                                res += '<p class="mb-1"><small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small></p>';
                            }
                            if (f[i].get("email") != "") {
                                res += '<p class="mb-1"><small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small></p>';
                            }
                            if (f[i].get("siteweb") != "") {
                                res += '<p class="mb-1"><small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small></p>';
                            }
                        } else if (f[i].get('souscategorie') == 'Hôtel') {
                            sscat = "icon icon-local_hotel";
                            //name.replace(/[']/g, "|");
                            res += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res += '<div class="d-flex w-100 justify-content-between"><h5><i class="icon-ribbon"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary">' + dis + '</span></small></div>';
                            res += '<p class="mb-1"><i class="icon-location-outline"></i> ' + f[i].get("adresse") + '</p><p class="mb-1"><i class="icon-bookmark2"></i> ' + f[i].get("categorie") + '</p><p class="mb-1"><small><i class="' + sscat + '" style="color: orange"></i> ' + f[i].get("souscategorie") + '</small></p>';
                            res += '<hr>';
                            if (f[i].get("tl") != "") {
                                res += '<p class="mb-1"><small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small></p>';
                            }
                            if (f[i].get("fax") != "") {
                                res += '<p class="mb-1"><small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small></p>';
                            }
                            if (f[i].get("email") != "") {
                                res += '<p class="mb-1"><small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small></p>';
                            }
                            if (f[i].get("siteweb") != "") {
                                res += '<p class="mb-1"><small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small></p>';
                            }
                        } else if (f[i].get('souscategorie') == 'Banque') {
                            sscat = "icon icon-credit";
                            //name.replace(/[']/g, "|");
                            res += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res += '<div class="d-flex w-100 justify-content-between"><h5><i class="icon-ribbon"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary">' + dis + '</span></small></div>';
                            res += '<p class="mb-1"><i class="icon-location-outline"></i> ' + f[i].get("adresse") + '</p><p class="mb-1"><i class="icon-bookmark2"></i> ' + f[i].get("categorie") + '</p><p class="mb-1"><small><i class="' + sscat + '" style="color: orange"></i> ' + f[i].get("souscategorie") + '</small></p>';
                            res += '<hr>';
                            if (f[i].get("tl") != "") {
                                res += '<p class="mb-1"><small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small></p>';
                            }
                            if (f[i].get("fax") != "") {
                                res += '<p class="mb-1"><small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small></p>';
                            }
                            if (f[i].get("email") != "") {
                                res += '<p class="mb-1"><small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small></p>';
                            }
                            if (f[i].get("siteweb") != "") {
                                res += '<p class="mb-1"><small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small></p>';
                            }
                        } else if (f[i].get('souscategorie') == 'Mosquée') {
                            sscat = "icon icon-home6";
                            //name.replace(/[']/g, "|");
                            res += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res += '<div class="d-flex w-100 justify-content-between"><h5><i class="icon-ribbon"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary">' + dis + '</span></small></div>';
                            res += '<p class="mb-1"><i class="icon-location-outline"></i> ' + f[i].get("adresse") + '</p><p class="mb-1"><i class="icon-bookmark2"></i> ' + f[i].get("categorie") + '</p><p class="mb-1"><small><i class="' + sscat + '" style="color: orange"></i> ' + f[i].get("souscategorie") + '</small></p>';
                            // res += '<hr>';

                            if (f[i].get("tl") != "") {
                                res += '<p class="mb-1"><small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small></p>';
                            }
                            if (f[i].get("fax") != "") {
                                res += '<p class="mb-1"><small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small></p>';
                            }
                            if (f[i].get("email") != "") {
                                res += '<p class="mb-1"><small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small></p>';
                            }
                            if (f[i].get("siteweb") != "") {
                                res += '<p class="mb-1"><small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small></p>';
                            }
                        }

                    }
                    res += '</div>';
                }

                // if (critere == 70) {
                //     $("#shopping_tab").empty();
                //     $("#shopping_tab").append(res);
                // } else 
                
                if (critere == 301) {
                    $("#ulMosquees").empty();
                    $("#ulMosquees").append(res);
                } else if (critere == 150) {
                    $("#ulBanques").empty();
                    $("#ulBanques").append(res);
                } else if (critere == 142) {
                    $("#ulEcoles").empty();
                    $("#ulEcoles").append(res);
                } else if (critere == 266) {
                    $("#ulHotels").empty();
                    $("#ulHotels").append(res);
                }


            },
            error: function () {
                console.log('error parse !');
            },
            complete: function () {
                $("#main_pois_list_content").show();
                $('.pois-toggle').removeClass('close').addClass('open');
                $('.pois-toggle').empty();
                $('.pois-toggle').append('<i class="icon-chevron-thin-right"></i>');
                /*var extent = nearbyPoisGeometryVector.getSource().getExtent();
                map.getView().fit(extent, map.getSize());*/
            }
        });
    }
    //http://www.navcities.com/api/proximite/?lon=-6.8&lat=33.4&crit=263&userkey=demo
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

    if (feature.get('souscategorie') == 'Super Marché Et Surface Commerciale') {
        theGlyph = "fa-cart-plus";
        form = "circle";
        fontSize = 0.8;
        radius = 14;
        color = "#ecb255";
        fillColor = "#3f4455";
        strokeColor = "#ecb255";
        sscat = "icon icon-cart";
    } else if (feature.get('souscategorie') == 'Banque') {
        theGlyph = "fa-usd";
        form = "circle";
        fontSize = 0.8;
        radius = 14;
        color = "#ecb255";
        fillColor = "#3f4455";
        strokeColor = "#ecb255";
        sscat = "icon icon-credit";
    } else if (feature.get('souscategorie') == 'Mosquée') {
        ;
        theGlyph = "fa-usd";
        form = "circle";
        fontSize = 0.8;
        radius = 14;
        color = "#537e84";
        fillColor = "#3f4455";
        strokeColor = "#1b6873";
        sscat = "icon icon-home6";
    } else if (feature.get('souscategorie') == 'Librairie Et Papeterie') {

        theGlyph = "maki-town_hall";
        form = "circle";
        fontSize = 0.8;
        radius = 14;
        color = "#e03636";
        fillColor = "#3f4455";
        strokeColor = "#e81212";
        sscat = "icon icon-library";
    } else if (feature.get('souscategorie') == 'Ecole Supérieure Et Institut Public') {

        theGlyph = "maki-town_hall";
        form = "circle";
        fontSize = 0.8;
        radius = 14;
        color = "#e03636";
        fillColor = "#3f4455";
        strokeColor = "#e81212";
        sscat = "icon icon-library";
    } else if (feature.get('souscategorie') == 'Hôtel') {

        theGlyph = "fa-hotel";
        form = "circle";
        fontSize = 0.8;
        radius = 14;
        color = "#985f7f";
        fillColor = "#3f4455";
        strokeColor = "#dc228a";
        sscat = "icon icon-local_hotel";
    }

    var st = [];
    // Shadow style
    st.push(new ol.style.Style(
        {
            image: new ol.style.Shadow(
                {
                    radius: 15,
                    blur: 5,
                    offsetX: 0,
                    offsetY: 0,
                    fill: new ol.style.Fill(
                        {
                            color: "rgba(0,0,0,0.5)"
                        })
                })
        })
    );
    // Font style
    st.push(new ol.style.Style(
        {
            image: new ol.style.FontSymbol(
                {
                    form: form, //"hexagone", 
                    gradient: false,
                    glyph: theGlyph,//car[Math.floor(Math.random()*car.length)], 
                    fontSize: Number(fontSize),
                    radius: Number(radius),
                    //offsetX: -15,
                    rotation: Number(0) * Math.PI / 180,
                    //rotateWithView: $("#rwview").prop('checked'),
                    offsetY: true ? -Number(radius) : 0,
                    color: color,
                    fill: new ol.style.Fill(
                        {
                            color: fillColor
                        }),
                    stroke: new ol.style.Stroke(
                        {
                            color: strokeColor,
                            width: Number(2)
                        })
                }),
            stroke: new ol.style.Stroke(
                {
                    width: 2,
                    color: '#f80'
                }),
            fill: new ol.style.Fill(
                {
                    color: [255, 136, 0, 0.6]
                })
        })
    );
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
            map.getView().setZoom(17);
        }
    });
    removeActiveClass();
    $(el).addClass("active");
}

var poi_popup = new ol.Overlay.Popup(
    {
        popupClass: "default anim", //"tooltips", "warning" "black" "default", "tips", "shadow",
        closeBox: true,
        onclose: function () { removeActiveClass(); },
        positioning: 'bottom-auto',
        autoPan: true,
        autoPanAnimation: { duration: 100 }
    });
map.addOverlay(poi_popup);


function removeActiveClass() {
    $("#pois_list_content").find('div.tab-content').find('a').removeClass('active');
}

// /GESTION DES CHECKBOX DES COUCHES DISPONIBLES