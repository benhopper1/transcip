console.log('loading-->----------------------->--  F a m i l y   C o n t r o l l e r  --<-----------------------');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');
//var RedClient = require(basePath + '/libs/redclient/redclient.js');
var redClient = global.redClient;

//------------------>--COMMUNICATION--<-------------
var Controller = function(router){

	router.familyBroadcast = function(inWss, inWs, inUserId, inTransportLayer){
		console.log('familyBroadcast executing');

		var familyTokenArray = inWss.userHashArrayOfDeviceTokenId.getArrayFromHash(inTransportLayer.toJson().userId);
		for(index in familyTokenArray){
			console.log('--------->-- Broadcasting ------to :');
			(inWss.connectedClientHistoryData[familyTokenArray[index]]).ws.send(inTransportLayer.toString());
		}
	}

	router.type('transactionToServer', function(inWss, inWs, inTransportLayer){
		console.log('+_+_+_+_transactionToServer' + inTransportLayer.toJson().userId);
		//==================================================================
		//--  allUserData  -------------------------------------------------
		//==================================================================
		if(inTransportLayer.toJson().routingLayer.command == 'allUserData'){
			global.reportNotify('allUserData', inTransportLayer.toJson(), 0);

			//@@@@ RED CLIENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			global.redClient.sendTransaction('CIP_query',
				{
					command:'allUserData',
					params:false,
					data:
						{
							userId:inWs.userId,
							serverName:global.SEVER_NAME,
							deviceTokenId:inWs.deviceTokenId,
						},
				},function(inParams){
					global.reportNotify('allUserData', inParams, 0);
					var transportLayer2 = inTransportLayer.getTransportLayerOnly();
					transportLayer2.addRoutingLayer(
						{
							type:'transactionToClient',
						}
					);
					//userServerData.action = 'noReconnect';
					//userServerData.transportData = inParams.transportData;
					transportLayer2.addDataLayer(inParams);//inParams);
					inWs.send(transportLayer2.toString());
				}
			);
			//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			

		}





		//==================================================================
		//--  findUserOnServer  --------------------------------------------
		//==================================================================
		if(inTransportLayer.toJson().routingLayer.command == 'findFirstServerForUser'){
			//@@@@ RED CLIENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			global.redClient.sendTransaction('CIP_query',
				{
					command:'findFirstServerForUser',
					params:false,
					data:
						{
							userId:inWs.userId,
							serverName:global.SEVER_NAME,
							//transportData:inTransportLayer.toJson(),
						},
				},function(inParams){
					global.reportNotify('findFirstServerForUser', inParams, 0);
					if(inParams){
						var userServerData = inParams;
						var transportLayer2 = inTransportLayer.getTransportLayerOnly();
						transportLayer2.addRoutingLayer(
							{
								type:'transactionToClient',
								command:'userFound',
							}
						);
						//userServerData.action = 'reconnect';
						userServerData.transportData = inTransportLayer.toJson();
						transportLayer2.addDataLayer(userServerData);//inParams);
						inWs.send(transportLayer2.toString());

						return;

					}else{
						var userServerData = {};
						var transportLayer2 = inTransportLayer.getTransportLayerOnly();
						transportLayer2.addRoutingLayer(
							{
								type:'transactionToClient',
								command:'noNewServerForuserFound',
							}
						);
						userServerData.action = 'noReconnect';
						//userServerData.transportData = inParams.transportData;
						transportLayer2.addDataLayer(userServerData);//inParams);
						inWs.send(transportLayer2.toString());
						return;
					}
				}
			);
			//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

		}

		//==================================================================
		//--  findUserOnServer  --------------------------------------------
		//==================================================================
		if(inTransportLayer.toJson().routingLayer.command == 'findUserOnServer'){
			var familyTokenArray = inWss.userHashArrayOfDeviceTokenId.getArrayFromHash(inWs.userId);
			if(familyTokenArray.length > 1){
				//this server should be used, stay here
				global.reportNotify('findUserOnServer', 
					{
						something:'familyTokenArray.length > 1',
					}, 0
				);

			}else{
				global.reportNotify('findUserOnServer', 
					{
						something:'familyTokenArray.length NOT > 1',
					}, 0
				);

				//@@@@ RED CLIENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
				redClient.sendTransaction('findUserOnServer',
					{
						userId:inWs.userId,
						transportData:inTransportLayer.toJson(),

					},function(inParams){
							global.reportNotify('findUserOnServer', 
								{
									something:'redClient callback',
									inParams:inParams,
								}, 0
							);

							//var userOnServerHash = {};
							var userServerData = {};
							for(var theIndex in inParams.foundUsersArray){
								if(inParams.foundUsersArray[theIndex].serverName != global.SEVER_NAME){
									userServerData = inParams.foundUsersArray[theIndex];
									break;
								}
							}

							global.reportNotify('findUserOnServer', 
								{
									something:'redClient server of interest',
									userServerData:userServerData,
								}, 0
							);



							if(userServerData){
								global.reportNotify('redClient Callback through function', inParams, 0);
								//transaction return---------
								var transportLayer2 = inTransportLayer.getTransportLayerOnly();
								transportLayer2.addRoutingLayer(
									{
										type:'transactionToClient',
										command:'userFound',
									}
								);
								userServerData.action = 'reconnect';
								userServerData.transportData = inParams.transportData;
								transportLayer2.addDataLayer(userServerData);//inParams);
								inWs.send(transportLayer2.toString());

								return;
							}else{
								var transportLayer3 = inTransportLayer.getTransportLayerOnly();
								transportLayer3.addRoutingLayer(
									{
										type:'transactionToClient',
										command:'userNotFound'
									}
								);
								transportLayer3.addDataLayer(
									{
										na:'noData'
									}
								);

								inWs.send(transportLayer3.toString());
							}



					}
				);
				//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

			}
		}

		//==================================================================
		//--  CREDENTIALS  ------------------------------------------------
		//==================================================================
		if(inTransportLayer.toJson().routingLayer.command == 'returnAllCredentialsForUser'){
			console.log('commandForServer in router routs{{command == returnAllCredentialsForUser}}');
			var familyTokenArray = inWss.userHashArrayOfDeviceTokenId.getArrayFromHash(inWs.userId);
			var credentialsPackage = [];
			for(index in familyTokenArray){
				var currentDeviceWs = (inWss.connectedClientHistoryData[familyTokenArray[index]]).ws
				var credentialPackage = 
					{
						deviceId:currentDeviceWs.deviceId,
						deviceNumber:currentDeviceWs.deviceNumber,
						userAgent:currentDeviceWs.userAgent,
						deviceType:currentDeviceWs.deviceType,
						deviceTokenId:currentDeviceWs.deviceTokenId
					};
				credentialsPackage.push(credentialPackage);
			}
			
			var TL_replyForClient = inTransportLayer.getTransportLayerOnly();
			TL_replyForClient.addRoutingLayer(
				{
					type:'transactionToClient',
					command:'credentialResults'
				}
			);

			TL_replyForClient.addDataLayer(
				{
					credentialsPackage:credentialsPackage
				}
			);
			inWs.send(TL_replyForClient.toString());
		}


		//==================================================================
		//--  Server Information  ------------------------------------------------
		//==================================================================
		if(inTransportLayer.toJson().routingLayer.command == 'serverInformation'){
			//@@@@ RED CLIENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			redClient.sendTransaction('CIP_query',
				{
					command:'serverInformation',
					params:false,
					data:
						{
							serverName:inTransportLayer.toJson().dataLayer.serverName,
							test:'test',
						},
				},function(inParams){
					global.reportNotify('serverInformation', inParams, 0);
					var transportLayer3 = inTransportLayer.getTransportLayerOnly();
					transportLayer3.addRoutingLayer(
						{
							type:'transactionToClient',
						}
					);
					transportLayer3.addDataLayer(inParams);

					inWs.send(transportLayer3.toString());
				}
			);
			//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		}


	});




}


module.exports = Controller;