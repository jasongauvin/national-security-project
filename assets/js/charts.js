Highcharts.setOptions({
    lang: {
        loading: 'Chargement...',
        months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
        weekdays: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        shortMonths: ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'aoû', 'sep', 'oct', 'nov', 'déc'],
        exportButtonTitle: "Exporter",
        printButtonTitle: "Imprimer",
        rangeSelectorFrom: "Du",
        rangeSelectorTo: "au",
        rangeSelectorZoom: "Période",
        downloadPNG: 'Télécharger en format PNG',
        downloadJPEG: 'Télécharger en format JPEG',
        downloadPDF: 'Télécharger en format PDF',
        downloadSVG: 'Télécharger en format SVG',
        resetZoom: "Réinitialiser le zoom",
        resetZoomTitle: "Réinitialiser le zoom",
        thousandsSep: " ",
        decimalPoint: ',',
        printChart: "Imprimer le graphe",
        downloadCSV: "Télécharger en format CSV",
        downloadXLS: "Télécharger en format EXCEL"
    },

    exporting: {
        sourceWidth: 1162,
        buttons: {
          contextButton: {
            menuItems: ["printChart",
                        "separator",
                        "downloadPNG",
                        "downloadJPEG",
                        "downloadPDF",
                        "downloadSVG",
                        "separator",
                        "downloadCSV",
                        "downloadXLS"]
          }
        },
        chartOptions: {
            subtitle: null,
        }
    },

    credits: false
});


function chartZoomable(container, data, titre) {
    
    Highcharts.chart(container, {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: titre
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Cliquez et faites glisser dans la zone du tracé pour zoomer' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Temps'
            }
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Nombre de victimes'
            },
            min: 0
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: 'Nombre de victimes',
            data: data
        }]
    });
}

function chartPie(container, data, titre, couleurs) {

    Highcharts.chart(container, {
        colors: couleurs,
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        title: {
            text: titre
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                showInLegend: true,
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Pourcentage',
            data: data
        }]
    });
}