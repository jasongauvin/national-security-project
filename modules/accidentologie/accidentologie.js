// INTERACTION GRAPHIQUE POUR LE MENU DROIT
interactionGraphiqueMenuDeNavigation(3, "accidentologie", "Boîte à outils accidentologie", 400, 10);
// /INTERACTION GRAPHIQUE POUR LE MENU DROIT

// LE STYLE CSS DU CONTENU HTML DU MENU DROIT
$("<link>").attr("rel","stylesheet").attr("type","text/css").attr("href","modules/accidentologie/accidentologie.css").appendTo("head");
// /LE STYLE CSS DU CONTENU HTML DU MENU DROIT

// LE CONTENU HTML DU MENU DROIT
$.get("modules/accidentologie/accidentologie.html", function (data) {
    $("#style_selector div:eq(1)").after().append(data);
});
// /LE CONTENU HTML DU MENU DROIT

var draw;

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
        $("#map").css("cursor", "visible");
    });



});


// $(document).on("click","#map",function (event){
//     map.removeInteraction(draw);
// });

// $(document).on('click', function (event) {
//     if (!$(event.target).closest('#map').length) {
//         console.log("yup");
//         map.removeInteraction(draw);
//     }
//   });


// /CHANGEMENT DE POINTEUR LORS DE L'AJOUT