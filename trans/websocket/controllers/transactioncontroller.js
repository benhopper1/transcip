//transactionToServer

console.log('loading-->----------------------->--  T r a n s a c t i o n   C o n t r o l l e r  --<-----------------------');
var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var HashArrayObject = require(basePath + '/libs/hashofarrayobject.js');
var MaintenanceObject = require(basePath + '/libs/maintenance/maintenanceobject.js');
var moment = require(basePath + '/node_modules/moment');

var TRANSACTION_CLEANUP_TIME_SECONDS = 30 * 60; // 30 minutes

//------------------>--COMMUNICATION--<-------------
var Controller = function(router){

	var hashOfTokenTransactions = {};

//TODO: remove this after test......, replaced with global maintenance
	/*var maintenanceObject = new MaintenanceObject(
		{
			label:'TESTING MAINTENANCE v.000',
			when:
				{
					minute:[0, 20, 40],
				},
		}
	);
	maintenanceObject.add(function(inSS, inS){
		console.log('hashOfTokenTransactions SIZE:' + Object.keys(hashOfTokenTransactions).length);
		
		for(var theKey in hashOfTokenTransactions){
			var theExpireMoment = hashOfTokenTransactions[theKey].expireMoment;


			console.log('NOW:' + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
			console.log('EXPIRES:' + theExpireMoment.format("dddd, MMMM Do YYYY, h:mm:ss a"));
			if(moment().isAfter(theExpireMoment)){
				console.log('REMOVEING transAction is expired');
				delete hashOfTokenTransactions[theKey];
			}
		}

	})
	maintenanceObject.start();*/

	global.maintenance_0_20_40.add(function(inOptions, inData){
		for(var theKey in hashOfTokenTransactions){
			var theExpireMoment = hashOfTokenTransactions[theKey].expireMoment;

			console.log('NOW:' + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
			console.log('EXPIRES:' + theExpireMoment.format("dddd, MMMM Do YYYY, h:mm:ss a"));
			if(moment().isAfter(theExpireMoment)){
				console.log('REMOVEING transAction is expired');
				delete hashOfTokenTransactions[theKey];
			}
		}

	});


	//###########################################################################
	//------ >  t r a n s a c t i o n   S e r i e s   T o T o k e n < -----------
	//###########################################################################
	router.type('transactionSeriesToToken', function(inWss, inWs, inTransportLayer){
		if(inTransportLayer.toJson().routingLayer.stage == 'firstSourceOut'){
			console.log('firstSourceOut transactionSeriesToToken');
			var transactionId = inTransportLayer.toJson().routingLayer.transactionSeriesId;
			var sourceTokenId = inWs.deviceTokenId;
			var targetTokenId = inTransportLayer.toJson().routingLayer.targetTokenId;

			hashOfTokenTransactions[transactionId] = 
				{
					sourceTokenId:sourceTokenId,
					targetTokenId:targetTokenId,
					expireMoment:moment().add(TRANSACTION_CLEANUP_TIME_SECONDS, 's'),
				};

			if(!(inWss.connectedClientHistoryData[targetTokenId])){console.log('ws not exist!!!!'); return false;};
			var targetWs = inWss.connectedClientHistoryData[targetTokenId].ws;
			inTransportLayer.toJson().userId = '';
			inTransportLayer.toJson().deviceId = '';
			inTransportLayer.toJson().securityToken = '$haha';
			inTransportLayer.toJson().routingLayer.stage = 'firstServerOut';

			if(targetWs){
				targetWs.send(inTransportLayer.toString());
			}

		}

		//nextSourceOut
		if(inTransportLayer.toJson().routingLayer.stage == 'nextSourceOut'){
			var transactionId = inTransportLayer.toJson().routingLayer.transactionSeriesId;
			var sourceTokenId = inWs.deviceTokenId;
			var hashedObject = hashOfTokenTransactions[transactionId];

			if(!(hashedObject)){
				console.log('ERROR - > transaction id not exist in waiting hash store ???, will exit from server side return tosource transaction');
				return false;
			}

			var targetTokenId = hashedObject.targetTokenId;

			if(!(inWss.connectedClientHistoryData[targetTokenId])){console.log('ws not exist!!!!'); return false;};

			var targetWs = inWss.connectedClientHistoryData[targetTokenId].ws;
			inTransportLayer.toJson().userId = '';
			inTransportLayer.toJson().deviceId = '';
			inTransportLayer.toJson().securityToken = '$haha';
			inTransportLayer.toJson().routingLayer.stage = 'nextServerOut';

			if(targetWs){
				targetWs.send(inTransportLayer.toString());
			}

		}

		if(inTransportLayer.toJson().routingLayer.stage == 'targetOut' || inTransportLayer.toJson().routingLayer.stage == 'targetFinal'){
			var transactionId = inTransportLayer.toJson().routingLayer.transactionSeriesId;
			var oldStage = inTransportLayer.toJson().routingLayer.stage;
			if(!(hashOfTokenTransactions[transactionId])){
				console.log('ERROR - > transaction id not exist in waiting hash store ???, will exit from server side return tosource transaction');
				return false;
			}

			var targetTokenId = hashOfTokenTransactions[transactionId].targetTokenId;
			var sourceTokenId = hashOfTokenTransactions[transactionId].sourceTokenId;

			var backToSourceWs = inWss.connectedClientHistoryData[sourceTokenId].ws;
			inTransportLayer.toJson().userId = '';
			inTransportLayer.toJson().deviceId = '';
			inTransportLayer.toJson().securityToken = '$hah2';
			inTransportLayer.toJson().routingLayer.stage = 'serverOut2';

			backToSourceWs.send(inTransportLayer.toString());
			if(hashOfTokenTransactions[transactionId]){
				if(oldStage == 'targetFinal'){
					delete hashOfTokenTransactions[transactionId];
				}
			}
		}


	});
	//###########################################################################
	//------ >  t r a n s a c t i o n T o T o k e n < ---------------------------
	//###########################################################################
	router.type('transactionToToken', function(inWss, inWs, inTransportLayer){

		console.log('transactionToToken in router routs!!!!!');

		if(inTransportLayer.toJson().routingLayer.stage == 'sourceOut'){
			var transactionId = inTransportLayer.toJson().transactionId;
			var sourceTokenId = inWs.deviceTokenId;
			var targetTokenId = inTransportLayer.toJson().routingLayer.targetTokenId;

			hashOfTokenTransactions[transactionId] = 
				{
					sourceTokenId:sourceTokenId,
					targetTokenId:targetTokenId,
					expireMoment:moment().add(TRANSACTION_CLEANUP_TIME_SECONDS, 's'),
				};

			if(!(inWss.connectedClientHistoryData[targetTokenId])){console.log('ws not exist!!!!'); return false;};
			var targetWs = inWss.connectedClientHistoryData[targetTokenId].ws;
			inTransportLayer.toJson().userId = '';
			inTransportLayer.toJson().deviceId = '';
			inTransportLayer.toJson().securityToken = '$haha';
			inTransportLayer.toJson().routingLayer.stage = 'serverOut';

			if(targetWs){
				targetWs.send(inTransportLayer.toString());
			}
		}



		if(inTransportLayer.toJson().routingLayer.stage == 'targetOut'){
			var transactionId = inTransportLayer.toJson().transactionId;

			if(!(hashOfTokenTransactions[transactionId])){
				console.log('ERROR - > transaction id not exist in waiting hash store ???, will exit from server side return tosource transaction');
				return false;
			}

			var targetTokenId = hashOfTokenTransactions[transactionId].targetTokenId;
			var sourceTokenId = hashOfTokenTransactions[transactionId].sourceTokenId;

			var backToSourceWs = inWss.connectedClientHistoryData[sourceTokenId].ws;
			inTransportLayer.toJson().userId = '';
			inTransportLayer.toJson().deviceId = '';
			inTransportLayer.toJson().securityToken = '$hah2';
			inTransportLayer.toJson().routingLayer.stage = 'serverOut2';

			backToSourceWs.send(inTransportLayer.toString());
			if(hashOfTokenTransactions[transactionId]){
				delete hashOfTokenTransactions[transactionId];
			}
		}


	});

	//TODO: tak this out if not used, why here??
	//############################################################################################
	//---- > -- TEMP FILES -- < ------------------------------------------------------------------
	//############################################################################################
	var tmpFilesHashOfArray = new HashArrayObject();
	router.type('transactionToServer', function(inWss, inWs, inTransportLayer){
		console.log('dump of ');
		if(inTransportLayer.toJson().routingLayer.command == 'addFiles'){
			tmpFilesHashOfArray.add(inWs.deviceTokenId, 
				{
					tag:'',
					fileInformation:'',
					entryTimeStamp:''
				}
			);

			tmpFilesHashOfArray.dump();
		}

		if(inTransportLayer.toJson().routingLayer.command == 'reportOfFiles'){

		}

		if(inTransportLayer.toJson().routingLayer.command == 'getPathsForTags'){

		}
	});


}

module.exports = Controller;