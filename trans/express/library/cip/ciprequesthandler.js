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
		global.reportNotify('handleRequest xx', 
			{
				inCipLayer_json:inCipLayer_json,
			}, 0
		);

		if(inCipLayer_json && inCipLayer_json.command == 'sendServerName'){
			// add cip server data
			if(inCipLayer_json.cipServerData){
				_this.storeCipServerData(inCipLayer_json.cipServerData);
			}
			//send back this server info
			_this.sendServerName();
			return;
		}
		//TODO: think this shld be removed per cip
		if(inCipLayer_json && inCipLayer_json.command == 'storeCipServerData'){
			_this.storeCipServerData();
			return;
		}

		if(inCipLayer_json && inCipLayer_json.command == 'recordRoutesChange'){
			if(inCipLayer_json.enabled){
				global.RECORD_ROUTES = true;
			}else{
				global.RECORD_ROUTES = false;
			}
			global.reportNotify('recordRoutesChange', 
				{
					value:global.RECORD_ROUTES,
				}, 0
			);
			return;
		}

		if(inCipLayer_json && inCipLayer_json.command == 'storeUserRequestChange'){
			if(inCipLayer_json.enabled){
				global.DATABASE_STORE_USER_REQUEST_DATA = true;
			}else{
				global.DATABASE_STORE_USER_REQUEST_DATA = false;
			}
			return;
		}


		//global.DATABASE_STORE_USER_REQUEST_DATA
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

	this.storeCipServerData = function(inData){
		global.reportNotify('STORE CIP SERVER DATA', inData, 0);
		global.cipServerData = inData;
	}

	this.serverForcefulShutDown = function(){

	}
}

module.exports = CipRequestHandler;
