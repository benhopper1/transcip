console.log('loading-->----------------------->--  Q R   C o n t r o l l e r  --<-----------------------');
var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var uuid = require(basePath + '/node_modules/node-uuid');
var DebugObject = require(basePath + '/libs/debug/debugobject.js');

var hashOfWaitingWs = {};


//------------------>--COMMUNICATION--<-------------
var Controller = function(router){
	DebugObject.debugify('qrController.hashOfWaitingWs', hashOfWaitingWs);
	// handled as transaction....   return...routingLayer.type == 'transactionToClient'
	router.type('transactionToServer', function(inWss, inWs, inTransportLayer){
		console.log('qr in router routs!!!!!');

		//---client side waiting for device to scan code--------------------
		if(inTransportLayer.toJson().routingLayer.command == 'waitForQr'){
			var waitingId = uuid.v1();
			inWs.waitingId = waitingId;
			console.log('waitForQr routing command!!!!!' + waitingId);

			//add to waiting hash--------
			hashOfWaitingWs[waitingId] = 
				{
					wss:inWss,
					ws:inWs,
					transportLayer:inTransportLayer
				};

			inWss.waitDeviceTokenIdHash[waitingId] = inWs;
			//@@@@ CIP @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			if(global.CIP_ENABLED){
				global.cipMessenger.addWaitingQr(
					{
						waitingId:waitingId,
						transportData:inTransportLayer.toJson(),
					}
				);
			}
			//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

			//cleanup entry
			inWs.cleanupFunctionHash['removeFromWaitingQ'] = function(){
				delete inWss.waitDeviceTokenIdHash[inWs.waitingId];
				//@@@@ CIP @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
				if(global.CIP_ENABLED){
					global.cipMessenger.removeWaitingQr(
						{
							waitingId:waitingId,
							//transportData:inTransportLayer.toJson(),
						}
					);
				}
				//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			}

			var transactionTransportLayer = inTransportLayer.getTransportLayerOnly();
			transactionTransportLayer.addRoutingLayer(
				{
					type:'transactionToClient'
				}
			);
			transactionTransportLayer.addDataLayer(
				{
					cmd:'syncMResponse',
					cd:waitingId
				}
			);

			inWs.send(transactionTransportLayer.toString());
		}//end connectByQr------------------------------------------------------


		//device scanned code, asking server to login the waiting client by scan code-----

		if(inTransportLayer.toJson().routingLayer.command == 'connectWaitingQr'){

			console.log('connectWaitingQr');
			console.log('cmd' + inTransportLayer.toJson().dataLayer.cmd);
			console.log('cd' + inTransportLayer.toJson().dataLayer.cd);
			console.log('dump hashOfWaitingWs--------------------');
			console.log('geting from hash:' + inTransportLayer.toJson().dataLayer.cd);

			var waitingData = hashOfWaitingWs[inTransportLayer.toJson().dataLayer.cd];
			if(waitingData){
				var waitingTransportLayer = waitingData.transportLayer;
				waitingTransportLayer.toJson().dataLayer.userName = inWs.userName;
				waitingTransportLayer.toJson().dataLayer.password = inWs.password;
				waitingTransportLayer.toJson().routingLayer.type = "setupToServer";
				router.reportOnRoute(waitingData.wss, waitingData.ws, waitingTransportLayer);
				delete  hashOfWaitingWs[inTransportLayer.toJson().dataLayer.cd];
				//@@@@ CIP @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
				if(global.CIP_ENABLED){
					global.cipMessenger.removeWaitingQr(
						{
							waitingId:inTransportLayer.toJson().dataLayer.cd,
						}
					);
				}
				//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			}else{
				console.log('wait code is not on this server!!!!!');
				//@@@@ CIP @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
				if(global.CIP_ENABLED){
					global.cipMessenger.findWaitingQr(
						{
							waitingId:inTransportLayer.toJson().dataLayer.cd,
							transportData:inTransportLayer.toJson(),
						},
						// CALLBACK---------------------
						function(inParams){
							global.reportNotify('CIP Callback through function', inParams, 0);
							// need filter for reconnect / mobile migration
							var transportLayer = inTransportLayer.getTransportLayerOnly();
							transactionTransportLayer.addRoutingLayer(
								{
									type:'tokenToTokenUseFilter',
									filterValue:'mobileMigration',
									filterKey:'filter',

									fromDeviceTokenId:'0',
									toDeviceTokenId:'0',
									fromUserId:'0'
								}
							);
							transactionTransportLayer.addDataLayer(
								inParams
							);

							inWs.send(transactionTransportLayer.toString());
						}
					);
				}
				//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



			}

			var transactionTransportLayer = inTransportLayer.getTransportLayerOnly();
			transactionTransportLayer.addRoutingLayer(
				{
					type:'transactionToClient'
				}
			);
			transactionTransportLayer.addDataLayer(
				{
					returning:'forCallback!!!',
					qrCode:inTransportLayer.toJson().dataLayer.cd
				}
			);
			inWs.send(transactionTransportLayer.toString());
		}

	});





	//case:user is in hashOfWaitingWs and waiting, decides to unload page,
	//now disconect happens, cleanup here and ignore everywhere else, no userId etc...
	router.onDisconnect(function(inWss, inWs){
		if(!(inWs.waitingId)){return false;}
		if(hashOfWaitingWs[inWs.waitingId]){
			console.log('deleted waiting entry from hashOfWaitingWs');
			delete hashOfWaitingWs[inWs.waitingId];
		}
	});







}

module.exports = Controller;