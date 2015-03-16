console.log('loading-->----------------------->--  C I P  C o n t r o l l e r  --<-----------------------');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var uuid = require(basePath + '/node_modules/node-uuid');
var moment = require(basePath + '/node_modules/moment');


//------------------>--COMMUNICATION--<-------------
var Controller = function(router){


	/*router.type('tokenToTokenUseFilter', function(inWss, inWs, inTransportLayer){


		console.log('tokenToTokenUseFilter in router routs!!!!!');
		if(inTransportLayer.toJson().routingLayer.toDeviceTokenId){
			var toWs = (inWss.connectedClientHistoryData[inTransportLayer.toJson().routingLayer.toDeviceTokenId]).ws;
			inTransportLayer.toJson().deviceId = 0;
			inTransportLayer.toJson().routingLayer.fromDeviceTokenId = inWs.deviceTokenId;
			inTransportLayer.toJson().routingLayer.fromUserId = inWs.userId;
			toWs.send(inTransportLayer.toString());
		}
	});*/




}


module.exports = Controller;