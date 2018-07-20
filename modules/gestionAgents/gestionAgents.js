// INTERACTION GRAPHIQUE POUR LE MODULE GESTION DES AGENTS
$("#gestionAgents").parent().click(function () {
	interactionGraphiqueMenuDeNavigation(2, "gestionAgents", "Boîte à outils gestion des agents");
});
// /INTERACTION GRAPHIQUE POUR LE MODULE GESTION DES AGENTS

var agent_icon = 'assets/img/agent-64.png';
var add_police_agent_DrawInteraction;
			var wktFormat_add_police_agent = new ol.format.WKT();
			var wkt_add_police_agent ='';

			function addPoliceAgentInteraction() {
				add_police_agent_DrawInteraction = new ol.interaction.Draw({
				  source: agentPoliceVectorLayer.getSource(),
				  type: 'Point'
				});
				map.addInteraction(add_police_agent_DrawInteraction);
				drawendPoliceAgentInteraction();
			}
			
			function drawendPoliceAgentInteraction(){
				add_police_agent_DrawInteraction.on('drawend', function (e) {
					wkt_add_police_agent = wktFormat_add_police_agent.writeFeature(e.feature, {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
					//console.log(wkt_add_police_agent);
					$("#add_police_agent_input_geom").val('');
					$("#add_police_agent_input_nom").val('');
					$("#add_police_agent_input_geom").val(wkt_add_police_agent);
					$("#add_police_agent_modal").modal('show');
        			//editionToolsShowFormModal(lr[0],'create',0,wkt_add_police_agent);
				});
			}

			$("#add_police_agent").on('click', function(){
				map.removeInteraction(add_police_agent_DrawInteraction);
				addPoliceAgentInteraction();
			});

			$("#add_police_agent_btn_cancel").on('click', function(){
				$("#add_police_agent_modal").modal('hide');
				//add_police_agent_DrawInteraction.removeLastPoint();

				var emptyFeature = agentPoliceVectorLayer.getSource().getFeatures()[agentPoliceVectorLayer.getSource().getFeatures().length-1];
            	agentPoliceVectorLayer.getSource().removeFeature(emptyFeature);

            	//updateAgentPolice();
				agentPoliceVectorLayer.getSource().changed();

			});

			$("#add_police_agent_btn_save").on('click', function(){
				if($("#add_police_agent_input_nom").val()==''){
					runAgentPoliceNotification('Veuillez saisir le nom !', 'warning', 'Nouveau Agent', '<i class="icon-flag-outline"></i>');
				}else if($("#add_police_agent_input_geom").val()==''){
					runAgentPoliceNotification('Geometry is missing !', 'warning', 'Nouveau Agent', '<i class="icon-flag-outline"></i>');
				}else{
					$.ajax({
						url: 'assets/php/agent.php',
						data:{
							insert  :true,
							nom   	:$("#add_police_agent_input_nom").val(),
							type    :$("#add_police_agent_select_type").val(),
							geom    : $("#add_police_agent_input_geom").val()
						},
						type: 'POST',
						dataType: 'JSON',
						async: false,
						cache: false,
						timeout: 1000,
						success: function(result) {
							console.log(result);
							runAgentPoliceNotification('Vous avez bien ajouté un agent ', 'success', 'Ajout de nouveau agent ', '<i class="icon-success-large-outline"></i>');
							refreshAgentPoliceTable(-6.835259, 34.016575);
							loadAgentPolice('update');
						},
						error: function(){
							$("#add_police_agent_modal").modal('hide');
						},
						complete: function(){
							$("#add_police_agent_modal").modal('hide');
						}
					});
				}
			});

			var add_police_agent_notification = $('#add_police_agent_notification').notify({
				removeIcon: '<i class="icon-times"></i>'
			});

			function runAgentPoliceNotification(message, type, title, icon){
				add_police_agent_notification.show(message, {
					type: type,
					title: title,
					icon: icon,
					delay: 2000,
					url_target: '_blank',
					mouse_over: null,
					animate: {
						enter: 'animated lightSpeedIn',
						exit: 'animated lightSpeedOut'
					}
				});
			}
var agent_police_geojson = new ol.format.GeoJSON();
				var createTextStyle = function(feature, resolution){
					
					return new ol.style.Text({
						textAlign: 'Center',
						textBaseline: 'Middle',
						//font: feature.get('fonttext')!='' ? feature.get('fonttext') : '12px Calibri,sans-serif',
						font : '18px Calibri,sans-serif',
						text: feature.get('type'),
						fill: new ol.style.Fill({ color: 'rgba(207, 16, 175, 1)' }),
						stroke: new ol.style.Stroke({
							color: 'rgba(10, 9, 9, 1)', 
							width:  1
						}),
						offsetX: 0,
						offsetY: 0,
						placement: 'point',
						//maxAngle: maxAngle,
						overflow: false,
						padding: [0,0,0,0]
						/*rotation: rotation*/
					});
				}
				var agentPoliceStyleFynction = function(feature, resolution) {
					var src ='';
					if(feature.get('type')=='Fixe'){
						src = 'assets/img/police_32.png';
					}else{
						src = 'assets/img/agent1_32.png';
					}
			        var agent_police_style = {
			            'Point':
			            	new ol.style.Style({
				             	image: new ol.style.Icon({
				                    anchor: [0.5,0.5],
				                    anchorXUnits: 'fraction',
				                    anchorYUnits: 'fraction',
				                    //size:40,
				                    /*rotation: (Math.PI/180)*(feature.get('dir')),*/
				                    src: src
				                }),
				                text: new ol.style.Text({
					                font: 'bold 12px Open Sans Light',
					                textAlign: 'center',
					                textBaseline: 'bottom',
					                text: feature.get('nom')+' ('+feature.get('type')+')',
					                fill: new ol.style.Fill({ color: 'rgba(0, 0, 247)' }),
									stroke: new ol.style.Stroke({
										color: 'rgba(10, 9, 9, 0)', 
										width:  1
									}),
									offsetX: 0,
									offsetY: -15
					            })
				            })
			    	};
			    	return agent_police_style[feature.getGeometry().getType()];
			   }

			   	var agentPoliceSourceLayer = new ol.source.Vector();
				var agentPoliceVectorLayer = new ol.layer.Vector({
					name:'PoliceAgnetsLayer',
					title: 'Police Agnets Layer',
					visible: true,
					source: agentPoliceSourceLayer,
					style:agentPoliceStyleFynction
				});
				map.addLayer(agentPoliceVectorLayer);

				function loadAgentPolice(param){
				    agentPoliceSourceLayer.clear();
				    $.ajax({
						url: 'assets/php/agent.php',
						data:{
							select  :true
						},
						type: 'POST',
						dataType: 'JSON',
						/*async: false,
						cache: false,
						timeout: 2000,*/
						success: function(result) {
							var features = agent_police_geojson.readFeatures(result,{featureProjection: 'EPSG:3857'});
				        	agentPoliceSourceLayer.addFeatures(features);
						},
						error: function(){
							runAgentPoliceNotification('Une erreur est survenu lors du chargement de la couche des agents de police!', 'danger', 'Liste des agents ', '<i class="icon-info-outline"></i>');
						},
						complete: function(){
							if(param == 'update'){
								runAgentPoliceNotification('La couche des agents de police a été bien actualisée', 'info', 'Liste des agents ', '<i class="icon-info-large-outline"></i>');
							}
							
						}
					});
				}
				loadAgentPolice('update');