// INTERACTION GRAPHIQUE POUR LE MENU DROIT
interactionGraphiqueMenuDeNavigation(3, "accidentologie", "Boîte à outils accidentologie", 500, 0);
// /INTERACTION GRAPHIQUE POUR LE MENU DROIT

// LE STYLE CSS DU CONTENU HTML DU MENU DROIT
$("<link>").attr("rel","stylesheet").attr("type","text/css").attr("href","modules/accidentologie/accidentologie.css").appendTo("head");
// /LE STYLE CSS DU CONTENU HTML DU MENU DROIT

// LE CONTENU HTML DU MENU DROIT
$.get("modules/accidentologie/accidentologie.html", function (data) {
    $("#style_selector div:eq(1)").after().append(data);
});
// /LE CONTENU HTML DU MENU DROIT

var draw, json;

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

    map.on('click', function(evt){
    var coords = ol.proj.toLonLat(evt.coordinate);
    var lat = coords[1];
    var lon = coords[0];
    $("#pointerAccidentologie").html('<i class="clip-plus-circle"></i> '+lon.toFixed(6)+", "+lat.toFixed(6))
    
    });
    
});


$(document).on("click", "#ajouter", function (e) {
    e.preventDefault();
    
    console.log($("#nbrBlesses").val());
    console.log($("#nbrMorts").val());
    console.log($("#gravite").val());
    console.log($("#desc").val());
    console.log($("#heure").val());
    console.log($("#date").val())

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
            console.log("Veuillez ajouter un fichier Excel valide!");  
        }
    }

    exporterExcelVersJSON();

    function getJSON(exceljson){
        json = exceljson;
        
        data = {
            importation: true,
            noms_cols_excel: Object.keys(json[0]),
            lignes_excel: json
        }
        ajax("modules/accidentologie/accidentologie.php", data);    
    }
   
});