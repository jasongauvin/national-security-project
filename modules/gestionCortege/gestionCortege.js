// DECLARATION DES VARIABLES
var source = new ol.source.Vector({ wrapX: false });
var trajet = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#FF8800',
            width: 3
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#FF8800'
            })
        })
    })
});
var draw, snap;
var modify = new ol.interaction.Modify({ source: source });
var pts_inters, buffer_trajet;
// /DECLARATION DES VARIABLES

// INTERACTION GRAPHIQUE POUR LE MENU DROIT
interactionGraphiqueMenuDeNavigation(7, "gestionCortege", "Boîte à outils de la gestion du cortège", 43, 0);
// /INTERACTION GRAPHIQUE POUR LE MENU DROIT

// LE STYLE CSS DU CONTENU HTML DU MENU DROIT
if (!$('head').find('link[href="modules/gestionCortege/gestionCortege.css"][rel="stylesheet"]').length) {
    $("<link>").attr("rel", "stylesheet").attr("type", "text/css").attr("href", "modules/gestionCortege/gestionCortege.css").appendTo("head");
}
// /LE STYLE CSS DU CONTENU HTML DU MENU DROIT

// LE CONTENU HTML DU MENU DROIT
$.get("modules/gestionCortege/gestionCortege.html", function (data) {
    $("#style_selector div:eq(1)").after().append(data);
});
// /LE CONTENU HTML DU MENU DROIT

// CACHER TOUS LES POP-UPS
popup.hide();
// CACHER TOUS LES POP-UPS

// SUPPRESSION DE TOUTES LES AUTRES COUCHES
supprimerCouches();
// /SUPPRESSION DE TOUTES LES AUTRES COUCHES

// STYLE DES BOUCHONS
function style_pts() {
    return [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: 'black' }),
            stroke: new ol.style.Stroke({
                color: [255, 0, 0], width: 2
            })
        })
    }),
    new ol.style.Style({
        fill: new ol.style.Fill({
            color: '#00C851'
        }),
        stroke: new ol.style.Stroke({
            color: '#000000',
            width: 3
        }),
        text: new ol.style.Text({
            font: '13px sans-serif',
            fill: new ol.style.Fill({ color: '#00C851' }),
            stroke: new ol.style.Stroke({
                color: '#000000', width: 3
            }),
            text: this.get('description')
            ,
            offsetX: 45,
            offsetY: 0,
            rotation: 0
        })
    })
    ];
}
// /STYLE DES BOUCHONS

// AJOUT D'INTERACTION DRAW
function addInteractions() {
    draw = new ol.interaction.Draw({
        source: source,
        type: "LineString"
    });
    map.addInteraction(draw);
    snap = new ol.interaction.Snap({ source: source });
    map.addInteraction(snap);
}
// /AJOUT D'INTERACTION DRAW

// DESSIN DU TRAJET
$(document).off("click", "#dessinerCheminGestionCortege").on("click", "#dessinerCheminGestionCortege", function (e) {

    source.clear();
    map.addLayer(trajet);
    map.addInteraction(modify);
    addInteractions();

});
// /DESSIN DU TRAJET

// REINITIALISATION DU DESSIN
$(document).off("click", "#reinitGestionCortege").on("click", "#reinitGestionCortege", function (e) {
    source.clear();
    map.removeLayer(buffer_trajet);
    
    map.removeInteraction(modify);
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    map.removeLayer(trajet);

    map.removeLayer(pts_inters);
    map.removeLayer(buffer_trajet);
});
// /REINITIALISATION DU DESSIN

$(document).off("click", "#appliquerGestionCortege").on("click", "#appliquerGestionCortege", function (e) {
    map.removeInteraction(modify);
    map.removeInteraction(draw);
    map.removeInteraction(snap);

    map.removeLayer(pts_inters);
    map.removeLayer(buffer_trajet);

    if(trajet.getSource().getFeatures().length === 0){
        afficherNotif("warning", "Veuillez dessiner un trajet");
    }else if(trajet.getSource().getFeatures().length > 1){
        afficherNotif("warning", "Veuillez dessiner un seul trajet, vous avez dessiné plusieurs trajets");
    }else{

        // BUFFER DE LA MARCHE
        buffer = turf.buffer(coucheVersGeoJSON(trajet), 10/1000); // Unité kilomètre

        buffer_trajet = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: geojson.readFeatures(buffer, { featureProjection: 'EPSG:3857' })
            }),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: [0, 188, 212, 0.7]
                })
              })
        });
        map.addLayer(buffer_trajet);
        // /BUFFER DE LA MARCHE

        // POINTS D'INTERSECTION
        intersection = turf.lineIntersect(coucheVersGeoJSON(coucheRues), buffer);
        
        pts_inters = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: geojson.readFeatures(intersection, { featureProjection: 'EPSG:3857' })
            })
        });
        id_bouchon = 1;
        pts_inters.getSource().getFeatures().forEach(function (pts) {
            //tab_bouchons.push(ol.proj.toLonLat(pts.getGeometry().getCoordinates()));
            pts.set('description', "   Bouchon N° " + id_bouchon++);
            pts.setStyle(style_pts);
        });

        map.addLayer(pts_inters);
        // /POINTS D'INTERSECTION
    }


});

