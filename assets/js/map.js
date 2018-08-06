// DECLARATION DES VARIABLES
var defaultCenter = ol.proj.transform([-6.835259, 34.016575], 'EPSG:4326', 'EPSG:3857');
var defaultExtent = [-840080.4335449198, 3988950.4443487297, -674212.0821660873, 4072419.6792361424];
var geojsonFormat_geom = new ol.format.GeoJSON();
var draw;
var navcitiesXYZSource = new ol.source.XYZ({
    attributions: [new ol.Attribution({
        html: 'Tiles © <a href="https://www.navcities.com">Navcities</a>'
    })],
    url: "http://www.navcities.com/mapcache/tms/1.0.0/lintermediaire@NavG/{z}/{x}/{-y}.png"
});
var navcitiesMaps = new ol.layer.Tile({
    name: 'Navcities Maps',
    visible: true,
    preload: Infinity,
    source: navcitiesXYZSource
});
var view = new ol.View({
    center: defaultCenter,
    extent: defaultExtent,
    zoom: 13,
    minZoom: 13,
    maxZoom: 18
})
var map = new ol.Map({
    layers: [navcitiesMaps],
    target: 'map',
    view: view
});
// /DECLARATION DES VARIABLES

// ACTIVATION DE POINTEUR SUR LES FEATURES
function activerPointeurSurFeatures(e){
    if (e.dragging) return;
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);

    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
}
// /ACTIVATION DE POINTEUR SUR LES FEATURES

// CHANGEMENT DE POINTEUR LORS DE L'AJOUT
function changerPointeurAjout(icone = "pointeur.png") {

    draw = new ol.interaction.Draw({
        type: 'Point',
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: "assets/img/"+icone,
                size: [128, 128],
                opacity: 1,
                scale: 0.4
            })
        })
    });

    $("#map").mouseover(function () {
        if ($("#collapseTwo").attr("class") == "panel-collapse collapse in") {
            $("#map").css("cursor", "none");
            map.addInteraction(draw);
        } else {
            map.removeInteraction(draw);
            $("#map").css("cursor", "default");
        }
    });

    $("#map").mouseout(function () {
        map.removeInteraction(draw);
        $("#map").css("cursor", "visible");
    });

}
// /CHANGEMENT DE POINTEUR LORS DE L'AJOUT
