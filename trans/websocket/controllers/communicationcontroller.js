console.log('loading-->----------------------->--  C o m m u n i c a t i o n   C o n t r o l l e r  --<-----------------------');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');

//------------------>--COMMUNICATION--<-------------
var Controller = function(router){

	router.type('deviceToDeviceUseFilter', function(inWss, inWs, inTransportLayer){
		console.log('deviceToDeviceUseFilter in router routs!!!!!');

		var toDeviceId = inTransportLayer.toJson().routingLayer.toDeviceId;
		console.dir(Object.keys(inWss.connectedDeviceHash));
		var clientConnection = inWss.connectedDeviceHash[toDeviceId];
		if(clientConnection){
			console.log('conection is live from ' + inTransportLayer.toJson().deviceId + " to " + inTransportLayer.toJson().routingLayer.toDeviceId);
			var newTransportLayer = new TransportLayer();
			newTransportLayer.toClientBuild(inTransportLayer.toJson().userId, inTransportLayer.toJson().routingLayer.toDeviceId, inTransportLayer.toJson().securityToken, false);

			newTransportLayer.addRoutingLayer(
				{
					type:'deviceToDeviceUseFilter',
					filterKey:inTransportLayer.toJson().routingLayer.filterKey,
					filterValue:inTransportLayer.toJson().routingLayer.filterValue,
					fromDeviceId:inTransportLayer.toJson().deviceId,
					toDeviceId:toDeviceId
				}
			);

			if(inTransportLayer.toJson().dataLayer){
				newTransportLayer.addDataLayer(inTransportLayer.toJson().dataLayer);
			}

			(inWss.connectedDeviceHash[toDeviceId]).send(newTransportLayer.toString());
		}

	});

}


module.exports = Controller;