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


$(document).on("change", "#fichierExcel", function (e) {
    $(".fileupload-loading").css("display", "block");
    //ExportToTable();

    insertAjax();
});

function ExportToTable() {  
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
                        var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);  
                    }  
                    else {  
                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);  
                    }  
                    if (exceljson.length > 0 && cnt == 0) {  
                        BindTable(exceljson);  
                        cnt++;
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
        alert("Veuillez ajouter un fichier Excel valide!");  
    }  
}

// STOCKAGE DE JSON DANS LA TABLE ACCIDENTOLOGIE
function BindTable(jsondata) { 
    var columns = BindTableHeader(jsondata);

    for (var i = 0; i < jsondata.length; i++) {

        console.log("############ ligne "+i);
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = jsondata[i][columns[colIndex]];  
            if (cellValue == null)  
                cellValue = "";
            console.log(cellValue);
        }  
    }  
}  

// OBTENTION DE TOUS LES NOMS DE COLONNES À PARTIR DE JSON
function BindTableHeader(jsondata) {
    var columnSet = [];

    for (var i = 0; i < jsondata.length; i++) {
        var rowHash = jsondata[i];
        for (var key in rowHash) {
            if (rowHash.hasOwnProperty(key)) {
                if ($.inArray(key, columnSet) == -1) {
                    columnSet.push(key);
                }
            }
        }
    }
    return columnSet;
}


function insertAjax(){
$.ajax({
    url: "modules/accidentologie/accidentologie.php",
    data:{
        insert  :true,
        typesVehicules   	:"test, camion"
        // type    :$("#add_police_agent_select_type").val(),
        // geom    : $("#add_police_agent_input_geom").val()
    },
    type: 'POST',
    dataType: 'JSON',
    cache: false,
    timeout: 1000,
    success: function(result) {
        console.log(result.success? "Succès": "Échoué");
        // runAgentPoliceNotification('Vous avez bien ajouté un agent ', 'success', 'Ajout de nouveau agent ', '<i class="icon-success-large-outline"></i>');
        // refreshAgentPoliceTable(-6.835259, 34.016575);
        // loadAgentPolice('update');
    },
    error: function(jqXhr){
        console.log("Erreur");
        console.log(jqXhr.responseText);
    },
    complete: function(){
        console.log("complete");
        // $("#add_police_agent_modal").modal('hide');
    }
});
}

// /OBTENTION DE TOUS LES NOMS DE COLONNES À PARTIR DE JSON



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