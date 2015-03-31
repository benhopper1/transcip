var path = require('path');
var basePath = path.dirname(require.main.filename);
var ConnectionsObject = require(basePath + '/models/connectionsmodel.js');
var connectionsObject = new ConnectionsObject();
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var DebugObject = require(basePath + '/libs/debug/debugobject.js');
var MaintenanceObject = require(basePath + '/libs/maintenance/maintenanceobject.js');
var moment = require(basePath + '/node_modules/moment');
var fs = require('fs');
var domain = require('domain');
var CipClient = require(basePath + '/libs/cip/client.js');
var CipRequestHandler = require(basePath + '/libs/cip/ciprequesthandler.js');
var CipMessenger = require(basePath + '/libs/cip/cipmessenger.js');
var util = require('util');




global.DEBUG_MODE = true;
global.CIP_ENABLED = false;

//==================================================================
//--  GLOBAL PAUSE  ------------------------------------------------
//==================================================================
global.pause = false;
global.setPause = function(){
	global.pause = true;
}

global.resume = function(){
	global.pause = false;
	/*if(global.pauseArray){
		for(var theIndex in global.pauseArray){
			if(global.pauseArray[theIndex].execFunction){
				global.pauseArray[theIndex].execFunction(global.pauseArray[theIndex].req, global.pauseArray[theIndex].res, global.pauseArray[theIndex].next);
			}
		}
	}*/
}



//==========================================================
// SCORE GLOBALS -------------------------------------------
//==========================================================
global.REQUEST_SCORE_INTERVAL_SECOND = 0;
global.PROCESSING_SCORE_INTERVAL_SECOND = 0;

global.requestScore = 0;
global.requestScoreOld = -1;
global.REQUEST_SCORE_COMMON = 1;

global.processingScore = 0;
global.processingOld = -1;
global.PROCESSING_SCORE_COMMON = 100;

global.scoreMaintenanceCycle = new MaintenanceObject(
	{
		label:'SCORE THING',
		when:
			{
				minute:MaintenanceObject.range(0,59),
			},
	}
);
global.scoreMaintenanceCycle.start();

global.scoreMaintenanceCycle.add(function(inOptions, inData){
	if(global.CIP_ENABLED){
		global.cipClient.sendCommand(
			{
				command:'remoteServerScore',
				data:
					{
						REQUEST_SCORE_INTERVAL_SECOND:global.REQUEST_SCORE_INTERVAL_SECOND,
						PROCESSING_SCORE_INTERVAL_SECOND:global.PROCESSING_SCORE_INTERVAL_SECOND,

						requestScore:global.requestScore,
						requestScoreOld:global.requestScoreOld,
						REQUEST_SCORE_COMMON:global.REQUEST_SCORE_COMMON,

						processingScore:global.processingScore,
						processingOld:global.processingOld,
						PROCESSING_SCORE_COMMON:global.PROCESSING_SCORE_COMMON,
					},
			}
		);
	}
});












//==========================================================
// REPORT ERROR --------------------------------------------
//==========================================================
var genErrorLog = new DebugObject(
	{
		label:'general',
		filePath:basePath + '/generror.log'
	}
);
global.reportError = function(inCaption, inData, inClass){
	console.log('===============  REPORT ERROR  =====================================');
	console.log('CAPTION:' + inCaption + '        CLASS:' + inClass);
	console.log('--------------------------------------------------------------------');
	console.dir(inData);
	console.log('====================================================================');
	genErrorLog.reportError(inCaption, inData);
}
//==========================================================
// REPORT NOTIFICATION -------------------------------------
//==========================================================
var genNotifyLog = new DebugObject(
	{
		label:'general',
		filePath:basePath + '/gennotify.log'
	}
);
global.reportNotify = function(inCaption, inData, inClass){
	//console.log(util.inspect({"FFFFFFFFFFF":'sss',ddd:888}, false, 2, true));
	console.log(util.inspect('===============  REPORT NOTIFY  =====================================', false, 2, true));
	console.log(util.inspect('CAPTION:' + inCaption + '        CLASS:' + inClass, false, 1, true));
	console.log('---------------------------------------------------------------------');
	console.dir(inData, false, 2, true);
	console.log(util.inspect('=====================================================================', false, 2, true));
	genNotifyLog.reportError(inCaption, inData);
}



console.dir(process.argv);
if(process.argv[5]){
	if(process.argv[5] && parseInt(process.argv[5]) == 1){
		console.log('WS is  Cip Enabled');
		global.CIP_ENABLED = true;
	}
}


global.SERVER_START_TIME = moment().format("YYYY-MM-DD HH:mm:ss");
global.SERVER_TYPE = 'webSocket';


var SecretFile = require('./libs/secretfile/secretfile.js');
var secretFile = new SecretFile(basePath + '/wsmain.conf');
secretFile.processCommandLineArgs();

console.log('ws Mobile Service........loading');
var theUrl = require('url');
//console.log("theUrl:"+theUrl.href);


//----readin my secrets /git ignored conf file-----
var configData = fs.readFileSync(basePath + '/wsmain.conf', 'utf8');
configData = JSON.parse(configData);


var Connection = require(basePath + '/models/connection.js');
//---done statically here so connection will be prepared for future and share
var connection = Connection.getMaybeCreate(
	{
		instanceName:'arf',
		host:configData.mysqlServerConnection.hostIp,
		user:configData.mysqlServerConnection.user,
		password:configData.mysqlServerConnection.password,
		database:configData.mysqlServerConnection.databaseName
	}
);

//UNSECURE SECTION-------------------------------------------------------------
/*var WebSocketServer = require(basePath + '/node_modules/ws').Server
  , wss = new WebSocketServer(
	{
		host:configData.webSocketServer.address,
		port: configData.webSocketServer.port
	}
);*/
//END OF UNSECURE SECTION------------------------------------------------------

//SECURE SECTION-------------------------------------------------------------
var ws_cfg = {
	ssl: true,
	port: configData.webSocketServer.port,
	ssl_key: 	fs.readFileSync(	basePath 	+	'/node_modules/key.pem'		),
	ssl_cert: 	fs.readFileSync(	basePath 	+	'/node_modules/cert.pem'	)
};

global.SEVER_NAME = 'Server_ws_' + configData.webSocketServer.port;


var processRequest = function(req, res) {
	console.log("Request received.")
};


var https = require('https');
var app = null;

app = https.createServer({
	key: ws_cfg.ssl_key,
	cert: ws_cfg.ssl_cert
}, processRequest).listen(ws_cfg.port);

var WebSocketServer = require(basePath + '/node_modules/ws').Server;
var wss = new WebSocketServer( {server: app});
//END OF SECURE SECTION------------------------------------------------------



console.log('WebSocketServer on ip:port ' + configData.webSocketServer.address + ':' + configData.webSocketServer.port);



wss.waitDeviceTokenIdHash = {};
wss.connectedDeviceHash = {};
wss.connectedClientHistoryData = {};

var HashOfArrayObject = require(__dirname + '/libs/hashofarrayobject.js');
wss.userHashArrayOfDeviceTokenId = new HashOfArrayObject(false);


// DEBUG ========================================================
DebugObject.debugify('wsapp.wss.waitDeviceTokenIdHash', wss.waitDeviceTokenIdHash);
DebugObject.debugify('wsapp.wss.connectedDeviceHash', wss.connectedDeviceHash);
DebugObject.debugify('wsapp.wss.connectedClientHistoryData', wss.connectedClientHistoryData);
DebugObject.debugify('wsapp.wss.userHashArrayOfDeviceTokenId.getHash()', wss.userHashArrayOfDeviceTokenId.getHash());

var maintenanceObject = new MaintenanceObject(
	{
		label:'debugingReport',
		when:
			{
				second: MaintenanceObject.range(0, 60, 5),
			},
	}
);
var funcId = maintenanceObject.add(function(inThelabel, inTheObject){
	DebugObject.dumpSizeReport();
})

maintenanceObject.start();


//==== MAINTENANCE SETUP ============================================================================
global.maintenance_0_20_40 = new MaintenanceObject(
	{
		label:'maintenance_0_20_40',
		when:
			{
				minute:[0, 20, 40],
				//second:[10,20,30,40,50,60,70,80] //DEBUG SETTING
			},
	}
);
global.maintenance_0_20_40.start();

//@ ::: when a device disconnects a timer starts, 
//@ ::: after a period it will be removed from history....
global.maintenance_0_20_40.add(function(inOptions, inData){
	var clientHistoryHash = wss.connectedClientHistoryData;
	for(var clientHistoryHashIndex in clientHistoryHash){
		var expireMoment = clientHistoryHash[clientHistoryHashIndex].expireMoment;
		if(expireMoment && moment().isAfter(expireMoment)){
			console.log('REMOVEING clientHistoryHash entry, is expired');
			delete clientHistoryHash[clientHistoryHashIndex];
		}
	}

});
// ======== END OF MAINTENANCE SECTION ===========================================================



var CommunicationRouter = require(basePath + '/node_modules/communicationrouter/communicationrouter.js');
var communicationRouter = new CommunicationRouter();
console.log('path:' + __dirname + '/controllers');
communicationRouter.loadAllFilesInFolderAsControllers(__dirname + '/controllers');

//==============================================================================
//> -- CIP ---------------------------------------------------------------------
//==============================================================================
var cipClient;
var cipRequestHandler;
if(global.CIP_ENABLED){
	global.reportNotify('CIP', 'CIP INTERFACE STARTING');
	cipClient = new CipClient(
		{
			host:configData.cip.host,
			port:configData.cip.port,
			serverName:global.SEVER_NAME,
			onData:function(inTransportLayer_json){
				//console.log('cipClient onData');
				//console.dir(inTransportLayer_json);
				global.reportNotify('cip.onData.inTransportLayer_json', inTransportLayer_json, 1);
				//communicationRouter.reportOnRoute(wss, ws, inTransportLayer_json);
				/*if(inTransportLayer_json.cipLayer && inTransportLayer_json.cipLayer.isWsPassThrough){
					console.log('YOU HAVE A PASSTHRUE!!!!!');
				}*/
				cipRequestHandler.handleRequest(inTransportLayer_json.cipLayer, inTransportLayer_json);

			},
			onCipData:function(inCipLayer_json, inTransportLayer_json){
				global.reportNotify('cip.onCipData.inTransportLayer_json', inTransportLayer_json, 1);
				//console.log('cipClient onCipData');

			},
			onWsData:function(inCipLayer_json, inTransportLayer_json){
				global.reportNotify('cip.onWsData.inTransportLayer_json', inTransportLayer_json, 1);
				//console.log('cipClient onWsData');
			},
		}
	);
	//@@@@ GLOBAL @@@@@@@@@@@@@@@@@@@@@@@@@@@@
	global.cipClient = cipClient;
	global.cipMessenger = new CipMessenger(cipClient);

	cipRequestHandler = new CipRequestHandler(cipClient);
	global.cipRequestHandler = cipRequestHandler;

	communicationRouter.setCipClient(cipClient);
}

// END OF CIP
if(global.CIP_ENABLED){
	/*
	global.cipClient.sendCommand(
		{
			command:'remoteError',
			data:
				{
					testKey0:'HELLO BEN HOPPER 22',
				},
		}
	);
	*/
	setTimeout(function(){
		global.cipClient.testConnection(
			{
				data:'whatever here',
				timeout:10,
				onSuccess:function(inData){
					console.log('SUCCESS global.cipClient.testConnection:');
					console.dir(inData);
				},
				onFail:function(inData){
					console.log('FAIL global.cipClient.testConnection:');
					console.dir(inData);
				},
			}
		);
	},3000)
}












wss.on('connection', function(ws){
	if(global.DEBUG_MODE){
		ws.clientDomain = domain.create();
	}

	//cleanupFunctionHash init--------------------
	ws.cleanupFunctionHash = {};

	communicationRouter.reportOnConnect(wss, ws);
	ws['isConnected'] = false;
	console.log('onConnection -evt-');
	console.log('info:');

	ws.on('close', function(){
		for(var key in ws.cleanupFunctionHash){
			console.log('CLEANUP executing:' + key);
			ws.cleanupFunctionHash[key]();
		}
		communicationRouter.reportOnDisconnect(wss, ws);
	});

	ws.on('message', function(message){
		console.log('onMessage');
		console.dir(message);
		transportLayer = new TransportLayer();
		transportLayer.fromClientBuild(message);
		var transportLayer_json = transportLayer.toJson();
		console.dir(transportLayer_json.routingLayer);

		communicationRouter.reportOnRoute(wss, ws, transportLayer);







		//client not connected and not sending login details is rejected with routing type...
		if(!(ws.isConnected) && !(transportLayer_json.routingLayer.type == 'setupToServer')){
			TL_fromClient_notConnected = new TransportLayer();
			TL_fromClient_notConnected.fromClientBuild(message);
			var fromClient_notConnected_json = TL_fromClient_notConnected.toJson();


			var TL_requestForClient = new TransportLayer();
			TL_requestForClient.toClientBuild(fromClient_notConnected_json.userId, fromClient_notConnected_json.deviceId, fromClient_notConnected_json.securityToken, fromClient_notConnected_json.transactionId);
			TL_requestForClient.addRoutingLayer(
				{
					type:'requestClientCredentials'
				}
			);
			
			ws.send(TL_requestForClient.toString());
			return;
		}
	});



});//END CONNECT





//######################################################################################
//----------- > -- S E R V E R   B R I D G E   S E R V I C E S -- < --------------------
//######################################################################################
console.log('BridgeService:');
console.log('HOST:' + configData.bridgeServices.host);
console.log('PORT:' + configData.bridgeServices.port);
var TcpServer = require(basePath + '/libs/tcpservices/tcpserver.js');
var tcpServer = new TcpServer(
	{
		host:configData.bridgeServices.host,
		port:configData.bridgeServices.port,
		onInstall:function(){},
		onDisconnect:function(){
			global.reportNotify('[wsapp] tcpServer.onDisconnect')
		},
		onConnect:function(){},
		onMessage:function(server, client, data){
			console.log('xxxxx:' + data.request);
			if(!(data)){return;}
			if(data.request){
				if(data.request == 'getUserIdAndDeviceId'){
					if(data.deviceTokenId){
						var currentDeviceTokenId;

						console.log('dump waitDeviceTokenIdHash -----------------');
						console.dir(wss.waitDeviceTokenIdHash);
						var theWs = wss.waitDeviceTokenIdHash[data.deviceTokenId];
						if(!(theWs)){
							//not exist in waiter
							console.log('not exist in waiter ----- looked for :' + data.deviceTokenId);
							client.send(
								{
									response:'bad'
								}
							);
							return;
						}

						delete wss.waitDeviceTokenIdHash[data.deviceTokenId];
						var userId = wss.userHashArrayOfDeviceTokenId.getFirstKeyByValue(theWs.deviceTokenId);
						console.log('userId for lookup:' + userId);
						if(userId){
							client.send(
								{
									userId:userId
								}
							);
							return;
						}else{
							client.send(
								{
									response:'bad'
								}
							);
							return;
						}
					}
				}
			}

			if(data.request == 'test'){
				client.send(
					{
						response:'testOK'
					}
				);
				return;
			}

			client.send(
					{
						response:'bad'
					}
				);
			return;
		}
	}
);


//========================================================================
// CLEAN UP AND EXIT FACILITY
//========================================================================
process.stdin.resume();//so the program will not close instantly
function exitHandler(options, err){
	global.reportNotify('PROCESS ON EXIT STARTED', 
		{
			options:options,
			error:err
		}, 0
	);
	if(options.cleanup){
		global.reportNotify('WSAPP', 'EXITING APP', 0);
		console.log('clean');
		//close mysql connections

		// close all websockets..............
		wss.clients.forEach(function each(client){
			console.log('CLOSING CLIENT:' + client.deviceTokenId);
			for(var key in client.cleanupFunctionHash){
				console.log('CLEANUP executing:' + key);
				client.cleanupFunctionHash[key]();
			}
			client.close();
		});



		Connection.terminateAll();

		global.cipClient.sendCommand(
			{
				command:'serverKilled',
				type:'toCipInformation',
				data:false,
				isWsPassThrough:false,
			}
		);

		global.cipClient.destroy();
		//close cip connection......

	}
	if(err){
		console.log(err.stack);
	}
	if(options.exit){
		process.exit();
	}
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));




