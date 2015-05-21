console.log('loading-->----------------------->--  G O O G L E  C o n t r o l l e r  --<-----------------------');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var uuid = require(basePath + '/node_modules/node-uuid');
var moment = require(basePath + '/node_modules/moment');
var userModel = require(basePath + '/models/usermodel.js').getInstance();

//------------------>--COMMUNICATION--<-------------
var Controller = function(router){


	router.type('transactionToServer', function(inWss, inWs, inTransportLayer){

		if(inTransportLayer.toJson().routingLayer.command == 'googleLogin'){
			global.reportNotify('googleLogin', 
				{
					dataLayer:inTransportLayer.toJson().dataLayer,
				}, 0
			);

			// USE CIP RED CLIENT TRANSACTION TO VERIFY PAYLOAD OF GOOGLE CLIENT STUFF----------
			//@@@@ RED CLIENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			global.redClient.sendTransaction('CIP_query',
				{
					command:'googleVerify',
					params:false,
					data:inTransportLayer.toJson().dataLayer,

				},function(inReturnData){
					if(inReturnData && inReturnData.isVerified){
						var waitingTransportLayer = inTransportLayer;

						//VERIFY USER NAME, bring back password for strang login, should fix latter. (No PASSWORD SHOULD EVER LEAVE DB MODEL)
						var userName = inTransportLayer.toJson().dataLayer.googleData.email;
						userModel.userExistRetPass(userName, function(err, row){
							if(!(err) && row){
								waitingTransportLayer.toJson().dataLayer.userName = userName; 
								waitingTransportLayer.toJson().dataLayer.password = row.password;
								waitingTransportLayer.toJson().routingLayer.type = "setupToServer";
								router.reportOnRoute(inWss, inWs, waitingTransportLayer);

								//RETURN TRANSACTION BACK
								var transactionTransportLayer = inTransportLayer.getTransportLayerOnly();
								transactionTransportLayer.addRoutingLayer(
									{
										type:'transactionToClient',
									}
								);
								transactionTransportLayer.addDataLayer(
									{
										returning:'forCallback!!!',
										isConnected:true
									}
								);
								inWs.send(transactionTransportLayer.toString());
								return;
							}
						});
					}else{
						//RETURN TRANSACTION BACK
						//==================================================================
						//--  ERROR LOGIN  ------------------------------------------------
						//==================================================================
						global.reportError('Google controller bad login attempt!!',
							{
									error:inReturnData,
									data:inTransportLayer.toJson().dataLayer,
							}, 0
						);
						var transactionTransportLayer = inTransportLayer.getTransportLayerOnly();
						transactionTransportLayer.addRoutingLayer(
							{
								type:'transactionToClient',
							}
						);
						transactionTransportLayer.addDataLayer(
							{
								returning:'forCallback!!!',
								isConnected:false
							}
						);
						inWs.send(transactionTransportLayer.toString());
						return;
					}
				}
			);
			//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@




		}

	});




}


module.exports = Controller;