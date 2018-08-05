
//ICON DE LA RUBRIQUE RAFRAICHIR

var refresh_icon = 'assets/img/refresh-64.png';
var directions_icon = 'assets/img/directions-64.png';

 //MENU 

 var contextmenu_items = [
    {
        text: 'Direction',
        icon: directions_icon,
        items: [
          {
            text: 'A partir d\'ici',
            icon: fromHere_icon,
            callback: roadFromHere
          },
          {
            text: 'Vers ici',
            icon: toHere_icon,
            callback: roadToHere
          }
        ]
    },
    {
        text: 'Rafraichir la carte',
        icon: refresh_icon,
        callback: reloadMap
    },
    '-' // this is a separator
    
    ];

    var contextmenu = new ContextMenu({
        width: 180,
        items: contextmenu_items
    });
    map.addControl(contextmenu);

    //FONCTION DU CALLBACK DE LA RUBRIQUE RAFRAICHIR 

    function reloadMap(obj){
        loadAgentPolice('update');
        refreshAgentPoliceTable(-6.835259, 34.016575);
    }

    function roadFromHere(obj){
        $("#find_location_map_content").hide();
        $("#nearby_pois_map_content").hide();
        $("#direction_road_map_content").show();
        var c = ol.proj.transform(obj.coordinate, 'EPSG:3857', 'EPSG:4326');
        getSelectedAddressRoad('Wher you clicked: Start', c[0], c[1], 'start_location_suggestion_list','start_location_input', 'start');
    }
            
    function roadToHere(obj){
        $("#find_location_map_content").hide();
        $("#nearby_pois_map_content").hide();
        $("#direction_road_map_content").show();
        var c = ol.proj.transform(obj.coordinate, 'EPSG:3857', 'EPSG:4326');
        getSelectedAddressRoad('Wher you clicked: Destination', c[0], c[1], 'destination_suggestion_list','destination_input', 'destination');

    }