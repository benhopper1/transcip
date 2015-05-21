console.log('loading-->----------------------->--  L o g   I n   L o g   O u t   C o n t r o l l e r  --<-----------------------');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var SecurityModel = require(basePath + '/models/securitymodel.js');
//var RedClient = require(basePath + '/libs/redclient/redclient.js');
var redClient = global.redClient;
var moment = require(basePath + '/node_modules/moment');
//------------------>--COMMUNICATION--<-------------
var Controller = function(router){

	router.type('setupToServer', function(inWss, inWs, inTransportLayer){
		console.log('setupToServer routing........');
		if(inWs.isConnected){console.log('can not be connect to execute here!!!, kicking you out!!!');return;}

		var transportLayer_json = inTransportLayer.toJson();
		console.log('your in setupToServer');
		SecurityModel.verify(
			{
				transportLayer:transportLayer_json,
				dataLayer:transportLayer_json.dataLayer,
				onDone:function(err, data, info, newDeviceId){
					console.log('info->:' + info);
					if(info == 'newDeviceIdCreated' || info == 'dataCheckedGood'){

						//$SECURITY TOKEN HERE-----
						var securityToken = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
						var googleData = transportLayer_json.dataLayer.googleData;

						if(googleData){
							//REMOVE ID TOKEN-----too big to store, but here if needed NOW!!!!
							googleData.idToken = false;
							global.reportNotify('googleData', 
								{
									googleData:googleData,
									//googleData:transportLayer_json.dataLayer.googleData,
								}, 0
							);
						}

						//@@@@ RED CLIENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
						redClient.send('CIP', 
							{
								command:'timedSecurityToken',
								params:false,
								data:
									{
										securityToken:securityToken,
										expireMoment:moment().add(60, 's'),
										userId:parseInt(transportLayer_json.userId),
										googleData:googleData,
									},
							}
						);
						//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


						console.log('onDone----');
						inWs.isConnected = true;
						inWs.userName = data.dataLayer.userName;
						inWs.password = data.dataLayer.password;
						var TL_replyForClient = new TransportLayer();
						TL_replyForClient.toClientBuild(data.userId, data.deviceId, securityToken, data.transactionId);
						if(info == 'newDeviceIdCreated'){
							inWss.connectedDeviceHash[newDeviceId.toString()] = inWs;
							inWs.userId = transportLayer_json.userId;
							inWs.deviceId = newDeviceId.toString();
							inWs.securityToken = securityToken;
							inWs.deviceNumber = data.dataLayer.deviceNumber;
							inWs.userAgent = data.dataLayer.userAgent;
							inWs.deviceType = data.dataLayer.deviceType;
							
							TL_replyForClient.addRoutingLayer(
								{
									type:'commandForClient',
									command:'connectedToServer',
									subCommand:'changeDeviceId',
									newDeviceId:newDeviceId,
									usingDeviceId:newDeviceId

								}
							);
						}else{
							inWss.connectedDeviceHash[data.deviceId.toString()] = inWs;
							inWs.userId = transportLayer_json.userId;
							inWs.deviceId = data.deviceId.toString();
							inWs.securityToken = securityToken;
							inWs.deviceNumber = data.dataLayer.deviceNumber;
							inWs.userAgent = data.dataLayer.userAgent;
							inWs.deviceType = data.dataLayer.deviceType;
							TL_replyForClient.addRoutingLayer(
								{
									type:'commandForClient',
									command:'connectedToServer',
									usingDeviceId:data.deviceId.toString()
								}
							);
						}

						router.reportOnSuccessfulLogin(inWss, inWs, TL_replyForClient, inTransportLayer);
						inWs.send(TL_replyForClient.toString());

					}
				},


				onInvalid:function(err, data, info){
					console.log('onInvalid---');
					inWs.isConnected = false;

					var TL_replyForClient = new TransportLayer();
					TL_replyForClient.toClientBuild(data.userId, data.deviceId, data.securityToken, data.transactionId);
					TL_replyForClient.addRoutingLayer(
						{
							type:'requestClientCredentials',
							message:'attemptFailed'
						}
					);

					inWs.send(TL_replyForClient.toString());

				}
			}
		);

		return;






	});

}


module.exports = Controller;