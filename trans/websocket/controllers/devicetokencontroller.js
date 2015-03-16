console.log('loading-->----------------------->--  D e v i c e    T o k e n   C o n t r o l l e r  --<-----------------------');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var uuid = require(basePath + '/node_modules/node-uuid');
var moment = require(basePath + '/node_modules/moment');

//------------------>--COMMUNICATION--<-------------
var Controller = function(router){
	var CLIENT_HISTORY_EXPIRE_SECONDS = 60 * 60; // 1 - HOUR
	//var CLIENT_HISTORY_EXPIRE_SECONDS = 20;//60 * 60; // 1 - HOUR DEBUG SETTING, can REMOVE


	router.onSuccessfulLogin(function(inWss, inWs, inData, setupTransportLayer){
		console.log('router.onSuccessfulLogin (data):');
		var deviceTokenId;

		for(key in inWss.connectedClientHistoryData){
			if(inData.toJson().routingLayer.usingDeviceId == inWss.connectedClientHistoryData[key].deviceId){
				//existing id match!!!!! use the key
				deviceTokenId = key;
			}
		}

		if(!(deviceTokenId)){
			deviceTokenId = uuid.v1();
		}
		inWs.deviceTokenId = deviceTokenId;
		inWss.connectedClientHistoryData[deviceTokenId] = 
			{
				deviceId:inData.toJson().routingLayer.usingDeviceId,
				ws:inWs,
				expireMoment:false,
				//entryTimeStamp:moment().format("YYYY-MM-DD HH:mm:ss"),
			}
		;

		//cleanup ---------------------------------------------------------------------------
		if(inWs.deviceType == 'desktopBrowser'){
			//no sense in keeping desktop in history
			inWs.cleanupFunctionHash['removeFrom_userHashArrayOfDeviceTokenId'] = function(){
				delete inWss.connectedClientHistoryData[inWs.deviceTokenId];
			}
		}

		inWs.cleanupFunctionHash['removeFrom_connectedClientHistoryData'] = function(){
			var theCountOf = inWss.userHashArrayOfDeviceTokenId.getArrayFromHash(inWs.userId);
			if(!(theCountOf) || theCountOf.length < 2){
				inWss.userHashArrayOfDeviceTokenId.removeArrayFromHash(inWs.userId);
			}
		}

		inWs.cleanupFunctionHash['setExpireTimeForHistory'] = function(){
			var connectedHistorDataRef = inWss.connectedClientHistoryData[inWs.deviceTokenId];
			if(connectedHistorDataRef){
				connectedHistorDataRef.expireMoment = moment().add(CLIENT_HISTORY_EXPIRE_SECONDS, 's');
			}
		}










		//inWs.lastDeviceId;
		//inWs.lastTokenDeviceId;

		//add device to user   ,,, one to many---
		inWss.userHashArrayOfDeviceTokenId.add(inWs.userId, inWs.deviceTokenId);
		console.log('dump of userHashArrayOfDeviceTokenId');
		inWss.userHashArrayOfDeviceTokenId.dump();

		//build advise package......
		var transportLayer = new TransportLayer();
		transportLayer.toClientBuild(inWs.userId, 'na', inWs.securityToken, false);
		transportLayer.addRoutingLayer(
			{
				type:'tokenToTokenUseFilter',
				filterKey:'filter',
				filterValue:'advise',
				fromDeviceTokenId:inWs.deviceTokenId
			}
		);

		transportLayer.addDataLayer(
			{
				deviceNumber:inWs.deviceNumber,
				deviceType:inWs.deviceType,
				userAgent:inWs.userAgent,
				action:'login'
			}
		);

		router.familyBroadcast(inWss, inWs, inWs.userId, transportLayer);
		if(global.CIP_ENABLED){
			//================================================================
			// CIP NOTIFICATION
			//================================================================
			var cipTransportLayer = transportLayer;
			cipTransportLayer.cipLayer =
				{
					type:'toCipInformation',
					isWsPassThrough:false,
					command:'addConnection',
					userId:inWs.userId,
					deviceId:inData.toJson().routingLayer.usingDeviceId,
					deviceTokenId:inWs.deviceTokenId,
					serverName:global.SEVER_NAME,
				}
			router.getCipClient().send(cipTransportLayer);
			//END OF CIP
		}


	});



	router.onDisconnect(function(inWss, inWs){
		//remove from connected devices for specific user

		//================================================================
		// CIP NOTIFICATION
		//================================================================
		if(global.CIP_ENABLED){
			var cipTransportLayer = new TransportLayer();
			cipTransportLayer.cipLayer =
				{
					type:'toCipInformation',
					isWsPassThrough:false,
					command:'removeConnection',
					userId:inWs.userId,
					deviceId:inWs.deviceId,
					deviceTokenId:inWs.deviceTokenId,
					serverName:global.SEVER_NAME,
				}
			router.getCipClient().send(cipTransportLayer);
			//END OF CIP
		}


		delete inWss.connectedDeviceHash[inWs.deviceId];
		inWss.userHashArrayOfDeviceTokenId.removeItemFromSpecificHash(inWs.userId, inWs.deviceTokenId);
	
		//advise of disconnect-----------
		var transportLayer = new TransportLayer();
		transportLayer.toClientBuild(inWs.userId, 'na', inWs.securityToken, false);
		transportLayer.addRoutingLayer(
			{
				type:'tokenToTokenUseFilter',
				filterKey:'filter',
				filterValue:'advise',
				fromDeviceTokenId:inWs.deviceTokenId
			}
		);

		transportLayer.addDataLayer(
			{
				deviceNumber:inWs.deviceNumber,
				deviceType:inWs.deviceType,
				userAgent:inWs.userAgent,
				action:'logout'
			}
		);
		console.log('before familyBroadcast');
		//console.dir(transportLayer.toJson());
		router.familyBroadcast(inWss, inWs, inWs.userId, transportLayer);
	});







	router.type('tokenToTokenUseFilter', function(inWss, inWs, inTransportLayer){
		console.log('tokenToTokenUseFilter in router routs!!!!!');
		if(inTransportLayer.toJson().routingLayer.toDeviceTokenId){
			var toWs = (inWss.connectedClientHistoryData[inTransportLayer.toJson().routingLayer.toDeviceTokenId]).ws;
			inTransportLayer.toJson().deviceId = 0;
			inTransportLayer.toJson().routingLayer.fromDeviceTokenId = inWs.deviceTokenId;
			inTransportLayer.toJson().routingLayer.fromUserId = inWs.userId;
			toWs.send(inTransportLayer.toString());
		}
	});
}


module.exports = Controller;