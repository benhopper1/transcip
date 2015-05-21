//model----------------
var path = require('path');
var basePath = path.dirname(require.main.filename);
var extend = require(basePath + '/node_modules/node.extend');
var fs = require('fs');
var TransportLayer = require(basePath + '/libs/transportlayer.js');
//var RedClient = require(basePath + '/libs/redclient/redclient.js');

var Model = function(){
	var _this = this;
	var redClient = global.redClient;

	//==================================================================
	//--  NO RETURN COMM  ----------------------------------------------
	//==================================================================
	redClient.subscribe(global.SEVER_NAME, function(inMessage){
		global.reportNotify('INFORMATION MODEL ' + global.SEVER_NAME, 
			{
				message:inMessage,
			}, 0
		);

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
					//--  STORE CIP SERVER DATA  ---------------------------------------
					//==================================================================
					//used in controller for redirection url builds
					storeCipServerData:function(params, data){
						global.reportNotify('STORE CIP SERVER DATA', data, 0);
						global.cipServerData = data;
					},
					//==================================================================
					//--  KILL THIS SERVER  --------------------------------------------
					//==================================================================
					killServer:function(params, data){
						global.reportNotify('killServer', data, 0);
						process.exit();
					},
					//==================================================================
					//--  REMOTE FAMILY BROADCAST  -------------------------------------
					//==================================================================
					remoteFamilyBroadcast:function(params, data){
						global.reportNotify('remoteFamilyBroadcast', 
							{
								data:data,
							}, 0
						);

						var options = 
							{
								userId:false,
								serverName:false,
								fromTokenId:false,
								deviceId:false,
								deviceNumber:'na',
								deviceType:false,
								userAgent:false,
								extraDataLayer:false,
								deviceTokenId:false
								//action:'remote_login',
							}
						options = extend(true, options, data);
						//build advise package......
						var transportLayer = new TransportLayer();
						transportLayer.toClientBuild(options.userId, 'na', '$ecurity', false);
						transportLayer.addRoutingLayer(
							{
								type:'tokenToTokenUseFilter',
								filterKey:'filter',
								filterValue:'advise',
								fromDeviceTokenId:options.fromTokenId
							}
						);

						if(options.action){
							transportLayer.addDataLayer(
								{
									deviceNumber:options.deviceNumber,
									deviceType:options.deviceType,
									userAgent:options.userAgent,
									action:'remote_' + options.action,
									extraDataLayer:options.extraDataLayer,
									serverName:options.serverName,
									deviceTokenId:options.deviceTokenId,
								}
							);
						}else{
							transportLayer.addDataLayer(
								{
									deviceNumber:options.deviceNumber,
									deviceType:options.deviceType,
									userAgent:options.userAgent,
									action:'remote_login',
									extraDataLayer:options.extraDataLayer,
									serverName:options.serverName,
									deviceTokenId:options.deviceTokenId,
								}
							);
						}

						//verify user exist on this server, if not then just ignore...
						var familyTokenArray = global.wss.userHashArrayOfDeviceTokenId.getArrayFromHash(options.userId);
						for(index in familyTokenArray){
							console.log('--------->-- remote Broadcasting ------to :');
							(global.wss.connectedClientHistoryData[familyTokenArray[index]]).ws.send(transportLayer.toString());
						}
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






/*	redClient.subscribeTransaction(global.SEVER_NAME, function(inMessage, done){
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
	});*/
	//==================================================================
	//--  QUERY COMM  --------------------------------------------------
	//==================================================================
	redClient.subscribeTransaction(global.SEVER_NAME + '_query', function(inMessage, done){
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
				getName:function(params, data){
					done(
						{
							serverName:global.SEVER_NAME,
							myName:'Ben Hopper5566',
						}
					);
				},
				usersCount:function(params, data){
					done({});
				},
				sendServerName:function(params, data){
					var configData = fs.readFileSync(basePath + '/wsmain.conf', 'utf8');
					configData = JSON.parse(configData);
					done(
						{
							serverName:global.SEVER_NAME,
							serverNumber:configData.webSocketServer.port,
							serverStartTime:global.SERVER_START_TIME,
							serverType:global.SERVER_TYPE,
							configData:configData,
						}
					);
				},
				serverScore:function(params, data){
					done(global.scoreCurrentJstruct);
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
