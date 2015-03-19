console.log('loading-->----------------------->--  T r a n s a c t i o n   C o n t r o l l e r  --<-----------------------');


var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var HashArrayObject = require(basePath + '/libs/hashofarrayobject.js');










//------------------>--COMMUNICATION--<-------------
var Controller = function(router){

	//============================================================================
	//------ >  CONNECT < --------------------------------------------------------
	//============================================================================
	router.onConnect(function(inConnection){
		console.log('CONNECT from roiter');
		//console.dir(inJstruct);
		//inConnection.socket.write(startupMessage());
		inConnection.socket.write(requestServerNameMessage());

	});

	//============================================================================
	//------ >  DISCONNECT < -----------------------------------------------------
	//============================================================================
	router.onDisconnect(function(inConnection){
		console.log('DISCONNECT from roiter');
		console.dir(inConnection);
	});

	//============================================================================
	//------ >  OnType TEST< -----------------------------------------------------
	//============================================================================
	router.type('test', function(inConnection, inData){
		console.log('Test from roiter');
		console.dir(inData);
		inConnection.socket.write("TEST BACK TO YOU");
	});


	//============================================================================
	//------ >  toCipInformation  < ----------------------------------------------
	//============================================================================
	router.type('toCipInformation', function(inConnection, inTransportLayer_json){
		console.log('toCipInformation from roiter');
		console.dir(JSON.stringify(inTransportLayer_json));
		var cipLayer_json = inTransportLayer_json.cipLayer;

		//@@@@@@@@@@@@ USER DEVICE CONNECTED @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		if(cipLayer_json.command == 'addConnection'){
			console.log('Connecting SERVER -> :' + cipLayer_json.serverName);
			global.deviceTokenId_Hash[cipLayer_json.deviceTokenId] = 
				{
					entryTime:new Date().getTime(),
					userId:cipLayer_json.userId,
					deviceId:cipLayer_json.deviceId,
					serverConnectionId:inConnection.connectionId,
					deviceTokenId:cipLayer_json.deviceTokenId,
					serverName:cipLayer_json.serverName,
				}
			;

			global.serverHashOfArray.add(cipLayer_json.serverName, cipLayer_json.deviceTokenId);

			global.userId_hashOfArray.add(cipLayer_json.userId, 
				{
					entryTime:new Date().getTime(),
					deviceTokenId:cipLayer_json.deviceTokenId,
					serverConnectionId:inConnection.connectionId,
					serverName:cipLayer_json.serverName,
				}
			);

			global.serverConnectionId_hashOfArray.add(inConnection.connectionId, cipLayer_json.deviceTokenId);

			console.log('global.deviceTokenId_Hash');
			console.dir(global.deviceTokenId_Hash);

			console.log('global.userId_hashOfArray');
			console.dir(global.userId_hashOfArray.getArrayFromHash(cipLayer_json.userId));

			console.log('global.serverConnectionId_hashOfArray');
			console.dir(global.serverConnectionId_hashOfArray);

		}

		//cipLayer_json.deviceTokenId
		//cipLayer_json.userId
		//inConnection.connectionId
		//
		//@@@@@@@@@@@@ USER DEVICE DISCONNECTED @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		if(cipLayer_json.command == 'removeConnection'){
			delete global.deviceTokenId_Hash[cipLayer_json.deviceTokenId];

			var userIdArray = global.userId_hashOfArray.getArrayFromHash(cipLayer_json.userId);
			for(var userIdArrayIndex in userIdArray){
				if(userIdArray[userIdArrayIndex].deviceTokenId == cipLayer_json.deviceTokenId){
					global.userId_hashOfArray.removeItemFromSpecificHash(cipLayer_json.userId, userIdArray[userIdArrayIndex]);
				}
			}

			global.serverConnectionId_hashOfArray.removeItemFromSpecificHash(inConnection.connectionId, cipLayer_json.deviceTokenId);
			global.serverHashOfArray.removeItemFromSpecificHash(cipLayer_json.serverName, cipLayer_json.deviceTokenId);

			console.log('global.deviceTokenId_Hash');
			console.dir(global.deviceTokenId_Hash);

			console.log('global.userId_hashOfArray');
			console.dir(global.userId_hashOfArray.getArrayFromHash(cipLayer_json.userId));

			console.log('global.serverConnectionId_hashOfArray');
			console.dir(global.serverConnectionId_hashOfArray);
		}

		//@@@@@@@@@@@@ REQUESTED SERVER NAME  RETURNED @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		if(cipLayer_json.command == 'requestedServerName'){
			var serverName = cipLayer_json.serverName;
			console.log('requestedServerName in CIP catch:' + serverName);
			global.activeServersHash[serverName] = 
				{
					serverName:cipLayer_json.serverName,
					serverBuildName:'server_' + (parseInt(cipLayer_json.serverName.slice(-3)) - 400),
					serverNumber:cipLayer_json.serverNumber,
					serverStartTime:cipLayer_json.serverStartTime,
					serverType:cipLayer_json.serverType,
					configData:cipLayer_json.configData,
				}
		}
		//@@@@@@@@@@@@ NEW WAITING QR CODE @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		if(cipLayer_json.command == 'addWaitingQr'){

			global.reportNotify('CIP addWaitingQr', cipLayer_json, 0);
			if(cipLayer_json.data && cipLayer_json.data.waitingId){
				global.qrHash[cipLayer_json.data.waitingId] = 
					{
						serverName:cipLayer_json.serverName,
						waitingId:cipLayer_json.data.waitingId,
						transportData:cipLayer_json.data.transportData,
					}
				if(global.qrCountHashByServer[cipLayer_json.serverName]){
					global.qrCountHashByServer[cipLayer_json.serverName]++;
				}else{
					global.qrCountHashByServer[cipLayer_json.serverName] = 1;
				}
				//global.qrCountHashByServer[cipLayer_json.serverName]++ ;
			}
		}

		//@@@@@@@@@@@@ REMOVE WAITING QR CODE @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		if(cipLayer_json.command == 'removeWaitingQr'){

			global.reportNotify('CIP removeWaitingQr', cipLayer_json, 0);

			global.reportNotify('CIP removeWaitingQr BEFORE', global.qrHash, 0);

			if(cipLayer_json.data && cipLayer_json.data.waitingId){
				if(global.qrHash[cipLayer_json.data.waitingId]){
					delete global.qrHash[cipLayer_json.data.waitingId];
					global.qrCountHashByServer[cipLayer_json.serverName]-- ;
				}
			}

			global.reportNotify('CIP removeWaitingQr AFTER', global.qrHash, 0);
		}

		//@@@@@@@@@@@@ FIND WAITING QR CODE @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		if(cipLayer_json.command == 'findWaitingQr'){
			global.reportNotify('CIP findWaitingQr', cipLayer_json, 0);

			var foundQrData = global.qrHash[cipLayer_json.data.waitingId];
			if(foundQrData){

				var serverInfo = global.activeServersHash[foundQrData.serverName];
				var ip = serverInfo.configData.webSocketServer.address;
				var port = serverInfo.configData.webSocketServer.port;
				var security = serverInfo.configData.webSocketServer.connectString;

				inConnection.socket.write(
					JSON.stringify(
						{
							cipLayer:
								{
									isWsPassThrough:false,
									command:'execFunction',
									functionId:cipLayer_json.functionId,
									params:
										{
											action:'reconnect',
											waitingId:cipLayer_json.data.waitingId,
											ip:ip,
											port:port,
											security:security,
											newFullPathInformationRoute:'http://' + ip + ':' + (parseInt(port) - 400) + '/information/default',
											transportData:cipLayer_json.data.transportData,
											serverName:foundQrData.serverName,
										},
								},
						}
					)
				);

			}

			/*if(cipLayer_json.data && cipLayer_json.data.waitingId){
				if(global.qrHash[cipLayer_json.data.waitingId]){
					delete global.qrHash[cipLayer_json.data.waitingId];
				}
			}*/

		}

		//@@@@@@@@@@@@ serverKilled @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		if(cipLayer_json.command == 'serverKilled'){
			global.reportNotify('CIP received serverKilled', 
				{
					transportData:cipLayer_json,
				}
				, 0
			);
		}





	});












	var testTransport = '{"userId":"","deviceId":"","securityToken":"$ecurity4","transactionId":1426015067665,"routingLayer":{"type":"transactionToToken","stage":"sourceOut","sourceTokenId":"bd149b50-c759-11e4-ba0b-ff75b05fcdc1", "targetTokenId":"bd049b50-c759-11e4-ba0b-ff75b05fcdc8","command":"webMenu","action":"openWebMenuActivity"},"dataLayer":{"url":"/webmenu/normalmenu"}}'

	//============================================================================
	//------ >  MESSAGE STARTUP TO NEW CONNECTED CLIENT---------------------------
	//============================================================================
	var startupMessage = function(){
		var message = 
			{
				cipLayer:
					{
						isWsPassThrough:true,
						command:'test',
						message:'this is a test message',
						sourceServerName:false,
						targetServerName:false,
						ws:
							{
								transportLayer:testTransport,
								mydtaaa:'lllll',
							}
					},
			}

		return JSON.stringify(message);
	}

	//============================================================================
	//------ >  MESSAGE REQUEST SERVER NAME --------------------------------------
	//============================================================================
	var requestServerNameMessage = function(){
		var configData = fs.readFileSync('cip.conf', 'utf8');
		configData = JSON.parse(configData);
		var message = 
			{
				cipLayer:
					{
						isWsPassThrough:false,
						command:'sendServerName',
						message:'this is a test message',
						sourceServerName:false,
						targetServerName:false,
						cipServerData:configData,
						//cipServerData:JSON.parse(getCipServerData()).cipLayer.cipServerData,
						/*ws:
							{
								transportLayer:testTransport,
								mydtaaa:'lllll',
							}*/
					},
			}

		return JSON.stringify(message);
	}

/*	//============================================================================
	//------ >  MESSAGE/DATA TO CLIENT STORE THIS CIP SERVER DATA ----------------
	//============================================================================
	var getCipServerData = function(){
		var message = 
			{
				cipLayer:
					{
						isWsPassThrough:false,
						command:'storeCipServerData',
						cipServerData:
							{
								domain:
									{
										address:'domainAddress',
										port:1111,
									},
								secureDomain:
									{
										address:'secureDomain address',
										port:2222,
									},
							},
					},
			}

		return JSON.stringify(message);
	}*/




	//requestServerNameMessage

}

module.exports = Controller;