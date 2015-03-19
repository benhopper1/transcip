console.log('loading-->----------------------->--  CIP REQUEST HANDLER  --<-----------------------');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var uuid = require(basePath + '/node_modules/node-uuid');
var fs = require('fs');
var moment = require(basePath + '/node_modules/moment');

var CipRequestHandler = function(inCipClient){
	var _this = this;
	var cipClient = inCipClient;

	var functionHash = {};

	this.handleRequest = function(inCipLayer_json, inTransportLayer_json){
		console.log('handlerRequest');
		console.log('inCipLayer_json');
		console.dir(inCipLayer_json);

		if(inCipLayer_json && inCipLayer_json.command == 'sendServerName'){
			_this.sendServerName();
		}

		if(inCipLayer_json && inCipLayer_json.command == 'execFunction'){
			_this.executeFunctionHash(inCipLayer_json.functionId, inCipLayer_json.params);
		}
	}


	this.sendServerName = function(){
		var configData = fs.readFileSync(basePath + '/wsmain.conf', 'utf8');
		configData = JSON.parse(configData);
		var cipTransportLayer = new TransportLayer();
		cipTransportLayer.cipLayer =
			{
				type:'toCipInformation',
				isWsPassThrough:false,
				command:'requestedServerName',
				serverName:global.SEVER_NAME,
				serverNumber:configData.webSocketServer.port,
				serverStartTime:global.SERVER_START_TIME,
				serverType:global.SERVER_TYPE,
				configData:configData,

			}
		cipClient.send(cipTransportLayer);
	}


	this.serverForcefulShutDown = function(){
	}


	// LIKE TRANSACTION--------------------------------
	this.addToFunctionHash = function(inId, inFunction){
		functionHash[inId] = 
			{
				theFunction:inFunction,
				entryTime:moment(),
			}
	}

	this.executeFunctionHash = function(inId, inParams){
		var theFunction = functionHash[inId];
		if(theFunction && theFunction.theFunction){
			theFunction.theFunction(inParams);
			delete functionHash[inId];
		}
	}

	this.killServer = function(){
		process.exit();
	}
}

module.exports = CipRequestHandler;



/*		
		//================================================================
		// CIP NOTIFICATION
		//================================================================
		var cipTransportLayer = transportLayer;
		cipTransportLayer.cipLayer =
			{
				type:'toCipInformation',
				isWsPassThrough:false,
				command:'addConnection',
				userId:inWs.userId,
				deviceId:inData.toJson().routingLayer.usingDeviceId,
				deviceTokenId:inWs.deviceTokenId,
				serverName:global.SEVER_NAME,
			}
		router.getCipClient().send(cipTransportLayer);
		//END OF CIP
*/