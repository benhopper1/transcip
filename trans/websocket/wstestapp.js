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

global.DEBUG_MODE = true;


console.log('ws Mobile Service........loading');
var theUrl = require('url');
console.log("theUrl:"+theUrl.href);


//----readin my secrets /git ignored conf file-----
var configData = fs.readFileSync('wsmain.conf', 'utf8');
configData = JSON.parse(configData);


var Connection = require(__dirname + '/models/connection.js');
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


//host:configData.webSocketServer.address,
var ws_cfg = {
	ssl: true,
	port: configData.webSocketServer.port,
	ssl_key: 	fs.readFileSync(	basePath 	+	'/node_modules/key.pem'		),
	ssl_cert: 	fs.readFileSync(	basePath 	+	'/node_modules/cert.pem'	)
};

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

var CommunicationRouter = require(basePath + '/node_modules/communicationrouter/communicationrouter.js');
var communicationRouter = new CommunicationRouter();
console.log('path:' + __dirname + '/controllers');
communicationRouter.loadAllFilesInFolderAsControllers(__dirname + '/controllers');




// ======== END OF MAINTENANCE SECTION ===========================================================





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
var TcpServer = require(basePath + '/libs/tcpservices/tcpserver.js');
var tcpServer = new TcpServer(
	{
		host:configData.bridgeServices.host,
		port:configData.bridgeServices.port,
		onInstall:function(){},
		onDisconnect:function(){},
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








