//model----------------
var path = require('path');
var basePath = path.dirname(require.main.filename);
var extend = require(basePath + '/node_modules/node.extend');
var GoogleModel  = require(basePath + '/models/googlemodel.js').getInstance();
//var fs = require('fs');
//var RedClient = require(basePath + '/libs/redclient/redclient.js');

var Model = function(){
	var _this = this;
	var redClient = global.redClient;
/*

	redClient.subscribeTransaction('cipInformation', function(inMessage, done){
		if(!(inMessage.command)){done({});}
		if(inMessage.command == 'getUserInformation'){
			var userDataArray = global.userId_hashOfArray.getArrayFromHash(inMessage.userId);
			done(
				{
					userDataArray:userDataArray,
				}
			);
			return;
		}

		done({});
	});
*/

//=============================================================================================================================================
//--  MAIN COMMUNICATION CHANNELS  (NON_SUB)---------------------------------------------------------------------------------------------------
//=============================================================================================================================================

	//==================================================================
	//--  ADD WAITING QR  ----------------------------------------------
	//==================================================================
	redClient.subscribe('addWaitingQr', function(inMessage){
		global.reportNotify('INFORMATION MODEL addWaitingQr', 
			{
				message:inMessage,
			}, 0
		);
		if(inMessage && inMessage.waitingId){
			global.qrHash[inMessage.waitingId] = 
				{
					serverName:inMessage.serverName,
					waitingId:inMessage.waitingId,
					transportData:inMessage.transportData,
				}
			if(global.qrCountHashByServer[inMessage.serverName]){
				global.qrCountHashByServer[inMessage.serverName]++;
			}else{
				global.qrCountHashByServer[inMessage.serverName] = 1;
			}
		}
	});

	//==================================================================
	//--  REMOVE WAITING QR  -------------------------------------------
	//==================================================================
	redClient.subscribe('removeWaitingQr', function(inMessage){
		global.reportNotify('INFORMATION MODEL removeWaitingQr', 
			{
				message:inMessage,
			}, 0
		);

		if(inMessage && inMessage.waitingId){
			if(global.qrHash[inMessage.waitingId]){
				delete global.qrHash[inMessage.waitingId];
				global.qrCountHashByServer[inMessage.serverName]-- ;
			}
		}
	});

	//==================================================================
	//--  REMOVE WAITING QR  -------------------------------------------
	//==================================================================
	redClient.subscribeTransaction('findWaitingQr', function(inMessage, done){

		var foundQrData = global.qrHash[inMessage.waitingId];
			if(foundQrData){
				var serverInfo = global.activeServersHash[foundQrData.serverName];
				var ip = serverInfo.configData.webSocketServer.address;
				var port = serverInfo.configData.webSocketServer.port;
				var security = serverInfo.configData.webSocketServer.connectString;

				done(
					{
						action:'reconnect',
						waitingId:inMessage.waitingId,
						ip:ip,
						port:port,
						security:security,
						newFullPathInformationRoute:'http://' + ip + ':' + (parseInt(port) - 400) + '/information/default',
						transportData:inMessage.transportData,
						serverName:foundQrData.serverName,
					}
				);

				return;
			}

		done({});
	});

	//==================================================================
	//--  ADD CONECTION  -----------------------------------------------
	//==================================================================
	redClient.subscribe('addConnection', function(inMessage){
		global.reportNotify('INFORMATION MODEL addConnection', 
			{
				message:inMessage,
			}, 0
		);

		global.deviceTokenId_Hash[inMessage.deviceTokenId] = 
			{
				entryTime:new Date().getTime(),
				userId:inMessage.userId,
				deviceId:inMessage.deviceId,
				serverConnectionId:'inConnection.connectionId',
				deviceTokenId:inMessage.deviceTokenId,
				serverName:inMessage.serverName,
			}
		;

		global.serverHashOfArray.add(inMessage.serverName, inMessage.deviceTokenId);

		//find out which servers have the userId on them and then send to the remoteFamilyBroadcast for each server matching criteria...
		// check userId_hashOfArray before you add this entry....

		var serverBurstHash = {};
		var theUsersArray = global.userId_hashOfArray.getArrayFromHash(inMessage.userId);
		for(var theIndex in theUsersArray){
			serverBurstHash[theUsersArray[theIndex].serverName] = theUsersArray[theIndex].serverName;
		}

		//delete any match server entry, we do not need to broadcast local again!!
		if(serverBurstHash[inMessage.serverName]){
			delete serverBurstHash[inMessage.serverName];
		}

		//BURST LOOP---------------------------------------
		for(var theKey in serverBurstHash){
			//@@@@ RED CLIENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			global.redClient.send(theKey, 
				{
					command:'remoteFamilyBroadcast',
					data:
						{
							userId:inMessage.userId,
							serverName:inMessage.serverName,
							deviceTokenId:inMessage.deviceTokenId,
							deviceId:inMessage.deviceId,
							deviceType:inMessage.deviceType,
							userAgent:inMessage.userAgent,
							action:inMessage.action,
							//extraDataLayer:false,
						},
				}
			);
			//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		}


		global.userId_hashOfArray.add(inMessage.userId, 
			{
				entryTime:new Date().getTime(),
				deviceTokenId:inMessage.deviceTokenId,
				serverConnectionId:'inMessage.connectionId',
				serverName:inMessage.serverName,
				deviceType:inMessage.deviceType,
				deviceId:inMessage.deviceId,
				userAgent:inMessage.userAgent,
				userId:inMessage.userId,
			}
		);






		//TODO:not needed
		//global.serverConnectionId_hashOfArray.add(inConnection.connectionId******, inMessage.deviceTokenId);
	});

	//==================================================================
	//--  REMOVE CONECTION  -----------------------------------------------
	//==================================================================
	redClient.subscribe('removeConnection', function(inMessage){
		global.reportNotify('INFORMATION MODEL removeConnection', 
			{
				message:inMessage,
			}, 0
		);

		delete global.deviceTokenId_Hash[inMessage.deviceTokenId];

		//BURST SECTION--------------------------------------------------------------------------------------------------------
		var serverBurstHash = {};
		var theUsersArray = global.userId_hashOfArray.getArrayFromHash(inMessage.userId);
		for(var theIndex in theUsersArray){
			serverBurstHash[theUsersArray[theIndex].serverName] = theUsersArray[theIndex].serverName;
		}

		//delete any match server entry, we do not need to broadcast local again!!
		if(serverBurstHash[inMessage.serverName]){
			delete serverBurstHash[inMessage.serverName];
		}

		//BURST LOOP---------------------------------------
		for(var theKey in serverBurstHash){
			//@@@@ RED CLIENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			global.redClient.send(theKey, 
				{
					command:'remoteFamilyBroadcast',
					data:
						{
							userId:inMessage.userId,
							serverName:inMessage.serverName,
							deviceTokenId:inMessage.deviceTokenId,
							deviceId:inMessage.deviceId,
							deviceType:inMessage.deviceType,
							userAgent:inMessage.userAgent,
							action:inMessage.action,
							//extraDataLayer:false,
						},
				}
			);
			//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		}//end for & END OF BURST SECTION ------------------------------------------------------------------------------------------

		var userIdArray = global.userId_hashOfArray.getArrayFromHash(inMessage.userId);
		for(var userIdArrayIndex in userIdArray){
			if(userIdArray[userIdArrayIndex].deviceTokenId == inMessage.deviceTokenId){
				global.userId_hashOfArray.removeItemFromSpecificHash(inMessage.userId, userIdArray[userIdArrayIndex]);
			}
		}





		//TODO:remove or replace??
		//global.serverConnectionId_hashOfArray.removeItemFromSpecificHash(inConnection.connectionId, cipLayer_json.deviceTokenId);
		global.serverHashOfArray.removeItemFromSpecificHash(inMessage.serverName, inMessage.deviceTokenId);


	});
	

	//==================================================================
	//--  FIND USER  -------------------------------------------
	//==================================================================
	redClient.subscribeTransaction('findUserOnServer', function(inMessage, done){
		global.reportNotify('INFORMATION MODEL findUserOnServer', 
			{
				message:inMessage,
			}, 0
		);


		var userIdArray = [];
		userIdArray = global.userId_hashOfArray.getArrayFromHash(inMessage.userId);
		global.reportNotify('CIP findWaitingQr2', 
			{
				userIdArray:userIdArray,
				userId:inMessage.userId,

			}
			, 0);

		for(var theIndex in userIdArray){
			var serverInfo = global.activeServersHash[userIdArray[theIndex].serverName];
			var ip = serverInfo.configData.webSocketServer.address;
			var port = serverInfo.configData.webSocketServer.port;
			var security = serverInfo.configData.webSocketServer.connectString;
			userIdArray[theIndex].ip = ip;
			userIdArray[theIndex].port = port;
			userIdArray[theIndex].security = security;
			userIdArray[theIndex].newFullPathInformationRoute = 'http://' + ip + ':' + (parseInt(port) - 400) + '/information/default';
		}

		done(
			{
				transportData:inMessage.transportData,
				foundUsersArray:userIdArray,
			}
		);
	});

	//==================================================================
	//--  REMOTE SERVER SCORE  -----------------------------------------
	//==================================================================
	redClient.subscribe('remoteServerScore', function(inMessage){
		global.reportNotify('INFORMATION MODEL remoteServerScore', 
			{
				message:inMessage,
			}, 0
		);

		var theServerBuildInstance = global.ServerBuild.getServerByServerName(inMessage.serverName);
		if(theServerBuildInstance){
			var thePassingData = inMessage;
			thePassingData.serverType = inMessage.serverType;
			theServerBuildInstance.addNewScoreEntry(thePassingData);
		}

	});

/*	//==================================================================
	//--  SERVER KILLED  -----------------------------------------------
	//==================================================================
	redClient.subscribe('serverKilled', function(inMessage){
		global.reportNotify('INFORMATION MODEL serverKilled', 
			{
				message:inMessage,
			}, 0
		);

		



	});
	*/
	//==================================================================
	//--  ON SERVER START  ---------------------------------------------
	//==================================================================
	redClient.subscribe('onServerStart', function(inMessage){
		global.reportNotify('INFORMATION MODEL onServerStart', 
			{
				message:inMessage,
			}, 0
		);

		var theServerName = inMessage.serverName;

		//@@@@ RED CLIENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		redClient.sendTransaction(theServerName + '_query',
			{
				command:'sendServerName',
				//params:false,
				//data:false,

			},function(inReturnData){

				var serverBuildName = 'server_' + (parseInt(inReturnData.serverName.slice(-3)) - 400);

				global.reportNotify('INFORMATION MODEL NEW SERVER', 
					{
						//resultData:inReturnData,
						serverName:inReturnData.serverName,
						serverBuildName:serverBuildName,
					}, 0
				);

				global.activeServersHash[inReturnData.serverName] = 
					{
						serverName:inReturnData.serverName,
						serverBuildName:serverBuildName,
						serverNumber:inReturnData.serverNumber,
						serverStartTime:inReturnData.serverStartTime,
						serverType:inReturnData.serverType,
						configData:inReturnData.configData,
					}
				var theServerBuildInstance = global.ServerBuild.getServerByServerBuildName(serverBuildName);
				if(theServerBuildInstance){
					//theServerBuildInstance.setCipClientConnection(inConnection, cipLayer_json.serverType);
				}else{
					global.reportError('INFORMATION MODEL NEW SERVER',
						{
								error:'NO ServerBuild INSTANCE',
								serverName:inReturnData.serverName,
								serverBuildName:serverBuildName,
						}, 0
					);
				}
				//@@@@ RED CLIENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
				//@@@@@@@ storeCipServerData (send cip data to new server) @@@@@@@@@@@@@@@@@@@@@@@@@
				//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
				redClient.send(inReturnData.serverName, 
					{
						command:'storeCipServerData',
						params:false,
						data:
							{
								domain:
									{
										address:global.configData.domain.address,
										port:global.configData.domain.port,
									},
								secureDomain:
									{
										address:global.configData.secureDomain.address,
										port:global.configData.secureDomain.port,
									},
							},
					}
				);
				//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

			}//- end function ---
		);
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


	});


//=============================================================================================================================================
//--  SUB COMMUNICATION CHANNELS  -------------------------------------------------------------------------------------------------------------------
//=============================================================================================================================================
	//==================================================================
	//--  NO RETURN COMM  ----------------------------------------------
	//==================================================================
	redClient.subscribe('CIP', function(inMessage){
		var options = 
			{
				command:false,
				params:false,
				data:false,
			}
		options = extend(options, inMessage);


		var ExecutionObject = 
			{
					//==================================================================
					//--  SERVER KILLED  -----------------------------------------------
					//==================================================================
					serverKilled:function(params, data){
						global.reportNotify('INFORMATION MODEL (sub cmd) serverKilled', data, 0);
						//global.cipServerData = data;
					},
					//==================================================================
					//--  REMOTE ERROR  ------------------------------------------------
					//==================================================================
					remoteError:function(params, data){
						//global.reportNotify('STORE CIP SERVER DATA', data, 0);
						//global.cipServerData = data;
					},
					newServerBuild:function(params, data){
						
					},
					timedSecurityToken:function(params, data){
						global.reportNotify('INFORMATION MODEL (sub cmd) timedSecurityToken', data, 0);
						global.securityTokenObject.add(data);
					},
			}

		if(Object.keys(ExecutionObject).indexOf(options.command) != -1){
			ExecutionObject[options.command](options.params, options.data);
		}else{
			global.reportError('INFORMATION MODEL ' + global.SEVER_NAME,
				{
						command:options.command,
						error:'command does not exist',
						message:inMessage,
				}, 0
			);
			return;
		}



	});


	//==================================================================
	//--  QUERY COMM  --------------------------------------------------
	//==================================================================
	redClient.subscribeTransaction('CIP' + '_query', function(inMessage, done){
		if(!(inMessage.command)){done({});}
		/*global.reportNotify('Information', 
			{
				message:inMessage,
			}, 0
		);*/
		var options = 
			{
				command:false,
				params:false,
				data:false,
			}
		options = extend(options, inMessage);


		var QueryObject = 
			{
				commands:function(params, data){
					var commandsArray = Object.keys(QueryObject);
					done(
						{
							commandsArray:commandsArray,
						}
					);
				},
				//==================================================================
				//--  GET SECURITY TOKEN  ------------------------------------------
				//==================================================================
				getSecurityTokenJstruct:function(params, data){
					global.reportNotify('INFORMATION MODEL (sub cmd) timedSecurityToken', data, 0);
					var result  = global.securityTokenObject.getSecurityTokenJstruct(data.securityToken);
					done(result);
				},
				//==================================================================
				//--  GOOGLE VERIFY  -----------------------------------------------
				//==================================================================
				googleVerify:function(params, data){
					global.reportNotify('INFORMATION MODEL (sub cmd) googleVerify', data, 0);
					//var result  = global.securityTokenObject.getSecurityTokenJstruct(data.securityToken);
					//cip google model here for verify.....
					GoogleModel.verifyInformation(data.googleData, function(inBool){
						result = 
							{
								isVerified:inBool,
							}
						done(result);
					});
				},
				//==================================================================
				//--  FIND FIRST SERVER FOR USER  ----------------------------------
				//==================================================================
				findFirstServerForUser:function(params, data){
					global.reportNotify('INFORMATION MODEL (sub cmd) findFirstServerForUser', data, 0);
					var options = 
						{
							serverName:false,
							userId:false,
						}
					options = extend(options, data);

					var userHashOfArray = global.userId_hashOfArray.getArrayFromHash(options.userId);
					for(var theIndex in userHashOfArray){
						var theRecord = userHashOfArray[theIndex];
						if(theRecord && theRecord.serverName != options.serverName){
							var serverInfo = global.activeServersHash[userHashOfArray[theIndex].serverName];
							done(
								{
									action:'reconnect',
									serverName:userHashOfArray[theIndex].serverName,
									ip:serverInfo.configData.webSocketServer.address,
									port:serverInfo.configData.webSocketServer.port,
									security:serverInfo.configData.webSocketServer.connectString,
									wsInformationRoute:'http://' + serverInfo.configData.webSocketServer.address + ':' + (parseInt(serverInfo.configData.webSocketServer.port) - 400) + '/information/default',
									deviceTokenId:userHashOfArray[theIndex].deviceTokenId,
								}
							);
							return;
						}
					}// end for --
					done({});
				},
				//==================================================================
				//--  ALL USER DATA  -----------------------------------------------
				//==================================================================
				allUserData:function(params, data){
					global.reportNotify('INFORMATION MODEL (sub cmd) allUserData', data, 0);
					var userStuffArray = global.userId_hashOfArray.getArrayFromHash(data.userId);
					done(
						{
							dataArray:userStuffArray,
							deviceTokenId:data.deviceTokenId,
							serverName:data.serverName,
						}
					);

				},
				//==================================================================
				//--  SERVER INFORMATION  ------------------------------------------
				//==================================================================
				serverInformation:function(params, data){
					global.reportNotify('INFORMATION MODEL (sub cmd) serverInformation', data, 0);
					var options = 
						{
							serverName:false,
						}
					;
					options = extend(true, options, data);
					var serverInfo = global.activeServersHash[options.serverName];
					if(serverInfo){
						done(
							{
								ip:serverInfo.configData.webSocketServer.address,
								port:serverInfo.configData.webSocketServer.port,
								security:serverInfo.configData.webSocketServer.connectString,
								wsInformationRoute:'http://' + serverInfo.configData.webSocketServer.address + ':' + (parseInt(serverInfo.configData.webSocketServer.port) - 400) + '/information/default',
							}
						);
					}else{
						done({});
					}

				},

			}

		if(Object.keys(QueryObject).indexOf(options.command) != -1){
			QueryObject[options.command](options.params, options.data);
		}else{
			done(
				{
					error:'no command by that name',
					commands:Object.keys(QueryObject),
				}
			);
			return;
		}


	});



}

module.exports = Model;
