console.log('loading-->----------------------->--  CIP REQUEST HANDLER  --<-----------------------');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/library/transportlayer.js');
var uuid = require(basePath + '/node_modules/node-uuid');
var fs = require('fs');

var CipRequestHandler = function(inCipClient){
	var _this = this;
	var cipClient = inCipClient;

	this.handleRequest = function(inCipLayer_json, inTransportLayer_json){
		if(inCipLayer_json && inCipLayer_json.command == 'sendServerName'){
			_this.sendServerName();
		}
	}


	this.sendServerName = function(){
		var configData = fs.readFileSync(basePath + '/main.conf', 'utf8');
		configData = JSON.parse(configData);
		var cipTransportLayer = new TransportLayer();
		cipTransportLayer.cipLayer =
			{
				type:'toCipInformation',
				isWsPassThrough:false,
				command:'requestedServerName',
				serverName:global.SEVER_NAME,
				serverNumber:configData.webSocketClient.port,
				serverStartTime:global.SERVER_START_TIME,
				serverType:global.SERVER_TYPE,
				configData:configData,

			}
		cipClient.send(cipTransportLayer);
	}

	this.serverForcefulShutDown = function(){

	}
}

module.exports = CipRequestHandler;
