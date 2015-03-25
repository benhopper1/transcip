var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var extend = require(basePath + '/node_modules/node.extend');
var TransportLayer = require(basePath + '/library/transportlayer.js');
var net = require('net');
var domain = require('domain');
var uuid = require(basePath + '/node_modules/node-uuid');
var moment = require(basePath + '/node_modules/moment');

var CipClient = function(inJstruct){
	var _this = this;
	this.domain = domain.create();
	this.isConnected = false;
	var transactionHash = {};

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
		client.connect(options.port, options.host, function(){
			if(options.onConnect){
				options.onConnect(client);
			}
		});

		client.on('data', function(inTransportLayer_str){
			var transportLayer = new TransportLayer();
			transportLayer.fromClientBuild(inTransportLayer_str);
			var transportLayer_json = transportLayer.toJson();

			var cipLayer_json = _this.getCipLayer(transportLayer_json);

			if(cipLayer_json.type == 'transResp'){
				_this.onTransactionResponse(cipLayer_json, transportLayer_json);
			}else{
				if(options.onData){
					options.onData(transportLayer_json);
				}
			}



			//EVENTS THAT MATTER-------------------
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
		});//end client on
	});
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

	client.on('error', function(e){
		global.reportError('CipClient.net.socket.client.onError', 
			{
				error:e,
				possible:'cip server not up and client trying to connect',
			}
			, 0
		);
		//set to retry cip every 1 minute until connected......
	});

	client.on('close', function(){
		if(options.onClose){
			options.onClose();
		}
	});

	this.send = function(inTransportLayer){
		console.log('CIP CLIENT SEND:');
		console.dir(inTransportLayer);
		//@@@@ DOMAIN GAURD @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		_this.domain.run(function(){
			client.write(JSON.stringify(inTransportLayer));
			if(options.onSend){
				options.onSend(inTransportLayer);
			}
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		});
	}

	this.sendCommand = function(inSndCmdOptions){
		//global.reportNotify('sendCommand', inSndCmdOptions, 0);
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

	this.sendTransaction = function(inSendTransactionOptions, inTransactionPostFunction){
		var sendTransactionOptions = 
			{
				command:false,
				type:'toCipTransaction',
				data:false,
				isWsPassThrough:false,
			}
		sendTransactionOptions = extend(true, sendTransactionOptions, inSendTransactionOptions);
		var newTransactionId = uuid.v1();
		transactionHash[newTransactionId] = 
			{
				entryMoment:moment(),
				postFunction:inTransactionPostFunction
			}
		//TODO:schedule clean up for fails here
		var cipTransportLayer = new TransportLayer();
		cipTransportLayer.cipLayer =
			{
				type:sendTransactionOptions.type,
				isWsPassThrough:sendTransactionOptions.isWsPassThrough,
				command:sendTransactionOptions.command,
				data:sendTransactionOptions.data,
				serverName:global.SEVER_NAME,
				serverType:global.SERVER_TYPE,
				transactionId:newTransactionId,

			}
		_this.send(cipTransportLayer);
	}

	this.onTransactionResponse = function(inCipLayer, inTransportLayer){
		if(inCipLayer.transactionId){
			var theFunc = transactionHash[inCipLayer.transactionId].postFunction;
			if(theFunc){
				theFunc(inCipLayer.data);
			}
			delete transactionHash[inCipLayer.transactionId];
		}
	}

	this.testConnection = function(inTestConnectionOptions){
		var testConnectionOptions = 
			{
				data:false,
				timeout:3000, // if false no timed fail happens
				onSuccess:false,
				onFail:false,
			}
		testConnectionOptions = extend(true, testConnectionOptions, inTestConnectionOptions);
		var alreadyFailed = false;

		var theTimer;
		if(testConnectionOptions.timeout){
			var startMoment = moment();
			theTimer = setTimeout(function(){
				alreadyFailed = true;
				if(testConnectionOptions.onFail){
					testConnectionOptions.onFail(
						{
							error:'timedOut',
							timeoutInterval:testConnectionOptions.timeout,
							start:startMoment.format("YYYY-MM-DD HH:mm:ss"),
							end:moment().format("YYYY-MM-DD HH:mm:ss"),
						}
					);
				}
			},testConnectionOptions.timeout);
		}

		_this.sendTransaction(
			{
				command:'testConnection',
				data:testConnectionOptions.data,
			}, 
			function(inData){
				if(theTimer){clearTimeout(theTimer);}
				if(!(alreadyFailed)){
					if(testConnectionOptions.onSuccess){testConnectionOptions.onSuccess(inData);}
				}
			}
		);
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