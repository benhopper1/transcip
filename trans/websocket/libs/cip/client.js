var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var extend = require(basePath + '/node_modules/node.extend');
//var uuid = require(basePath + '/node_modules/node-uuid');
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var net = require('net');
var domain = require('domain');



var CipClient = function(inJstruct){
	console.log('CipClient ENETERED');
	var _this = this;
	this.domain = domain.create();

	var options = 
		{
			host:'',
			port:0,
			serverName:false,
			onData:false,
			onCipData:false,
			onWsData:false,
			onSend:false,
			onClose:false,
			onConnect:false,
		}
	options = extend(options, inJstruct);

	//=============================================
	//DOMAIN ON ERROR -----------------------------
	//=============================================
	_this.domain.on('error', function(er){
		global.reportError('CipClient.domain.onError', err, 0);
	});

	var client = new net.Socket();
	//@@@@ DOMAIN GAURD @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	_this.domain.run(function(){
		console.log('CipClient client.connect');
		client.connect(options.port, options.host, function(){
			console.log('Connecting to CIP');
			console.log('CIP Host:' + options.host);
			console.log('CIP Port' + options.port);
			if(options.onConnect){
				options.onConnect(client);
			}
		});


		client.on('data', function(inTransportLayer_str){
			console.log('DATA: ' + inTransportLayer_str);

			var transportLayer = new TransportLayer();
			transportLayer.fromClientBuild(inTransportLayer_str);
			var transportLayer_json = transportLayer.toJson();

			if(options.onData){
				options.onData(transportLayer_json);
			}

			//EVENTS THAT MATTER-------------------
			var cipLayer_json = _this.getCipLayer(transportLayer_json);
			var ws_json = _this.getWsData(transportLayer_json);
			//_this.removeCipLayer(); //TODO ADD THIS AFTER TESTING
			if(options.onWsData && ws_json){
				options.onWsData(ws_json, transportLayer_json);
			}

			if(options.onCipData && cipLayer_json){
				if(!(cipLayer_json.isWsPassThrough)){
					options.onCipData(cipLayer_json, transportLayer_json);
				}
			}
		});
	});
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

	client.on('error', function(e){
		global.reportError('CipClient.net.socket.client.onError', 
			{
				error:e,
				possible:'cip server not up and client trying to connect',
			}
			, 0);
	});

	client.on('close', function(){
		if(options.onClose){
			options.onClose();
		}
	});

	this.send = function(inTransportLayer){
		//@@@@ DOMAIN GAURD @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		_this.domain.run(function(){
			client.write(JSON.stringify(inTransportLayer));
			if(options.onSend){
				options.onSend(inTransportLayer);
			}
		});
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	}

	this.sendCommand = function(inSndCmdOptions){
		global.reportNotify('sendCommand', inSndCmdOptions, 0);
		var sndCmdOptions = 
			{
				command:false,
				type:'toCipInformation',
				data:false,
				isWsPassThrough:false,
			}
		sndCmdOptions = extend(true, sndCmdOptions, inSndCmdOptions);

		var cipTransportLayer = new TransportLayer();
		cipTransportLayer.cipLayer =
			{
				type:sndCmdOptions.type,
				isWsPassThrough:sndCmdOptions.isWsPassThrough,
				command:sndCmdOptions.command,
				data:sndCmdOptions.data,
				serverName:global.SEVER_NAME,
				serverType:global.SERVER_TYPE,

			}
		_this.send(cipTransportLayer);

	}

	this.destroy = function(){
		client.destroy();
	}

	this.getCipLayer = function(inJson){
		if(inJson.cipLayer){
			return inJson.cipLayer;
		}else{
			return false;
		}
	}

	this.removeCipLayer = function(inJson){
		if(inJson.cipLayer){
			delete inJson.cipLayer;
		}
	}

	this.getWsData = function(inJson){
		if(inJson.cipLayer){
			if(inJson.cipLayer.ws){
				return inJson.cipLayer.ws;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}

	this.removeWsData = function(inJson){
		if(inJson.cipLayer){
			if(inJson.cipLayer.ws){
				delete inJson.cipLayer;
			}
		}
	}

	this.wsToCip = function(inOptions){
		var options = 
			{
				userId:false,
				deviceId:false,
				securityToken:false,
				deviceNumber:false,
				userAgent:false,
				deviceType:false,
			}
		options = extend(options, inOptions);
	}

}



module.exports = CipClient;