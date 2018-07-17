// CHAMP DE RECHERCHE
$("#champRecherche").on('keyup', function (event) {
    var addrVal = $("#champRecherche").val();
    if ($("#champRecherche").val().length) {
        $("#listeAddr").show();
        getAddressList(addrVal, 'listeAddr', "http://www.navcities.com/api/geocoding/?user=demo&maxNumberOfPois=5&find=");
    } else {
        $("#listeAddr").hide();
    }
});

function getAddressList(string, id, url) {
    var res = '';
    $.ajax({
        url: url + string,
        data: {
        },
        type: 'GET',
        dataType: 'JSON',
        async: true,
        cache: false,
        timeout: 5000,
        success: function (result) {
            var features = result.features;
            if (features.length > 0) {
                res += '<div id="listeChampRecherche" class="list-group" style="max-height: 200px; overflow-y: auto;">';
                for (var i = 0; i < features.length; i++) {

                    var name = features[i].properties.nom;
                    name = name.replace(/[']/g, "|");
                    if (features[i].properties.typedata == 'POI') {
                        res += '<a href="javascript:void(0)" onclick="getSelectedAddress(\'' + name + '\', ' + features[i].geometry.coordinates[0] + ', ' + features[i].geometry.coordinates[1] + ',\'' + id + '\');" class="list-group-item list-group-item-action"><i class="icon icon-location3"></i> ' + features[i].properties.nom + ' ' + features[i].properties.adresse + '</a>';

                    } else if (features[i].properties.typedata == 'Localite') {
                        res += '<a href="javascript:void(0)" onclick="getSelectedAddress(\'' + name + '\', ' + features[i].geometry.coordinates[0] + ', ' + features[i].geometry.coordinates[1] + ',\'' + id + '\');" class="list-group-item list-group-item-action"><i class="icon icon-address"></i> ' + features[i].properties.adresse + '</a>';
                    } else {
                        res += '<a href="javascript:void(0)" onclick="getSelectedAddress(\'' + name + '\', ' + features[i].geometry.coordinates[0] + ', ' + features[i].geometry.coordinates[1] + ',\'' + id + '\');" class="list-group-item list-group-item-action"><i class="icon icon-timeline"></i>' + features[i].properties.nom + '</a>';
                    }

                }
                res += '</div>';
                $("#" + id).empty();
                $("#" + id).append(res);
            }
        },
        error: function () {
            console.log('error parsing');
        },
        complete: function () {

        }
    });
}

var mapAdvancedSearch_AddressStyle = new ol.style.Style({
    image: new ol.style.Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'assets/img/marker.png'
    })
});

var mapAdvancedSearch_AddressGeometryVector = new ol.layer.Vector(
    {
        name: 'MapAdvancedSearch_Address',
        source: new ol.source.Vector(),
        style: mapAdvancedSearch_AddressStyle
    });

var map_advanced_search_address_popup = new ol.Overlay.Popup(
    {
        popupClass: "black", //"tips anim", "tooltips", "warning" "black" "default", "tips", "shadow",
        closeBox: false,
        onclose: function () { console.log("You close the box"); },
        positioning: 'bottom-right',
        autoPan: true,
        autoPanAnimation: { duration: 100 }
    });

function getSelectedAddress(name, longitude, latitude, id) {
    mapAdvancedSearch_AddressGeometryVector.getSource().clear();
    map_advanced_search_address_popup.hide(undefined, '');
    name = name.replace(/[|]/g, "'")
    //console.log(name+'||'+longitude+'||'+latitude);
    //$("#champRecherche").val(name);
    // $("#nearby_address").empty();
    // $("#nearby_address").append(name);
    // $("#" + id).hide();
    var point_pos_search_inp = new ol.geom.Point(
        ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857')
    );
    //console.log(point_pos_search_inp);
    var point_position_search_inp = new ol.Feature(point_pos_search_inp);
    mapAdvancedSearch_AddressGeometryVector.getSource().addFeature(point_position_search_inp);
    var defaultCenter = ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857');
    //map.getView().setZoom(10);
    map_advanced_search_address_popup.show(mapAdvancedSearch_AddressGeometryVector.getSource().getFeatures()[0].getGeometry().getCoordinates(), name);
    /*var extent = mapAdvancedSearch_AddressGeometryVector.getSource().getExtent();
    map.getView().fit(extent, map.getSize());
    map.getView().setZoom(10);*/
    view.animate({
        center: defaultCenter,
        duration: 2000,
        zoom: 20
    });
    //getNearbyPois(critere);
}


map.addLayer(mapAdvancedSearch_AddressGeometryVector);
//map.addOverlay(map_advanced_search_address_popup);



// /CHAMP DE RECHERCHE