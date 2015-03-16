var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var uuid = require(basePath + '/node_modules/node-uuid');
var fs = require('fs');

var CipMessenger = function(inCipClient){
	var _this = this;
	var cipClient = inCipClient;


	this.addWaitingQr = function(inData){
		var cipTransportLayer = new TransportLayer();
		cipTransportLayer.cipLayer =
			{
				type:'toCipInformation',
				isWsPassThrough:false,
				command:'addWaitingQr',
				serverName:global.SEVER_NAME,
				data:inData,

			}
		cipClient.send(cipTransportLayer);
	}

	this.removeWaitingQr = function(inData){
		var cipTransportLayer = new TransportLayer();
		cipTransportLayer.cipLayer =
			{
				type:'toCipInformation',
				isWsPassThrough:false,
				command:'removeWaitingQr',
				serverName:global.SEVER_NAME,
				data:inData,

			}
		cipClient.send(cipTransportLayer);
	}

	this.findWaitingQr = function(inData, inPostFunction){
		var functionId = uuid.v1();
		global.cipRequestHandler.addToFunctionHash(functionId, inPostFunction);




		var cipTransportLayer = new TransportLayer();
		cipTransportLayer.cipLayer =
			{
				type:'toCipInformation',
				isWsPassThrough:false,
				command:'findWaitingQr',
				functionId:functionId,
				serverName:global.SEVER_NAME,
				data:inData,

			}
		cipClient.send(cipTransportLayer);
	}

}

module.exports = CipMessenger;
