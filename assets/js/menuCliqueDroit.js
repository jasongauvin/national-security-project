
//ICON DE LA RUBRIQUE RAFRAICHIR

var refresh_icon = 'assets/img/refresh-64.png';

 //MENU 

 var contextmenu_items = [
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

