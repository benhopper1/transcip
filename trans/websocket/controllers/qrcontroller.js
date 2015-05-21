console.log('loading-->----------------------->--  Q R   C o n t r o l l e r  --<-----------------------');
var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var uuid = require(basePath + '/node_modules/node-uuid');
var DebugObject = require(basePath + '/libs/debug/debugobject.js');
//var RedClient = require(basePath + '/libs/redclient/redclient.js');
var redClient = global.redClient;


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
			//@@@@ RED CLIENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			redClient.send('addWaitingQr', 
				{
					serverName:global.SEVER_NAME,
					waitingId:waitingId,
					transportData:inTransportLayer.toJson(),
				}
			);
			//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

			//cleanup entry
			inWs.cleanupFunctionHash['removeFromWaitingQ'] = function(){
				delete inWss.waitDeviceTokenIdHash[inWs.waitingId];
				//@@@@ RED CLIENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
				redClient.send('removeWaitingQr', 
					{
						serverName:global.SEVER_NAME,
						waitingId:waitingId,
					}
				);
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
			var waitingData = hashOfWaitingWs[inTransportLayer.toJson().dataLayer.cd];
			if(waitingData){
				var waitingTransportLayer = waitingData.transportLayer;
				waitingTransportLayer.toJson().dataLayer.userName = inWs.userName;
				waitingTransportLayer.toJson().dataLayer.password = inWs.password;
				waitingTransportLayer.toJson().routingLayer.type = "setupToServer";
				router.reportOnRoute(waitingData.wss, waitingData.ws, waitingTransportLayer);
				delete  hashOfWaitingWs[inTransportLayer.toJson().dataLayer.cd];
				//@@@@ RED CLIENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
				redClient.send('removeWaitingQr', 
					{
						serverName:global.SEVER_NAME,
						waitingId:inTransportLayer.toJson().dataLayer.cd,
					}
				);
				//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			}else{
				console.log('wait code is not on this server!!!!!');
				//@@@@ RED CLIENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
				redClient.sendTransaction('findWaitingQr',
					{
						serverName:global.SEVER_NAME,
						waitingId:inTransportLayer.toJson().dataLayer.cd,
						transportData:inTransportLayer.toJson(),

					},function(inReturnData){
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
						transactionTransportLayer.addDataLayer(inReturnData);
						inWs.send(transactionTransportLayer.toString());
					}
				);
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