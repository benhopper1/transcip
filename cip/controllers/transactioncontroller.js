console.log('loading-->----------------------->--  TRANSACTION CONTROLLER  --<-----------------------');


var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var HashArrayObject = require(basePath + '/libs/hashofarrayobject.js');
var extend = require(basePath + '/node_modules/node.extend');









//------------------>--COMMUNICATION--<-------------
var Controller = function(router){
	var _this = this;




	//============================================================================
	//------ >  toCipTransaction  < ----------------------------------------------
	//============================================================================
	router.type('toCipTransaction', function(inConnection, inTransportLayer_json){
		console.log('toCipTransaction');
		console.dir(inTransportLayer_json);
		var cipLayer_json = inTransportLayer_json.cipLayer;

		//@@@@@@@@@@@@ REQUESTED SERVER NAME  RETURNED @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		if(cipLayer_json.command == 'testConnection'){
			console.log(' testConnection cmd OK enetered');
			var serverName = cipLayer_json.serverName;
			console.log(cipLayer_json.command + ' in CIP catch:' + serverName);

			var theResponseData = 
				{
					testKet:'testValue from transaction thingy 77',
				}

			_this.respondToTransaction(inConnection, cipLayer_json, theResponseData);
		}


	});//end router.type toCipTransaction


	this.respondToTransaction = function(inConnection, inReceivedCipLayer, inData, inRespondToTransactionOptions){
		var respondToTransactionOptions = 
			{
				command:false,// probly never needed on transaction
				type:'transResp'
			}
		respondToTransactionOptions = extend(true, respondToTransactionOptions, inRespondToTransactionOptions);
		console.log('TEST5555');
		console.dir({
					cipLayer:
						{
							isWsPassThrough:false,
							type:respondToTransactionOptions.type, //overridable
							command:respondToTransactionOptions.command,
							transactionId:inReceivedCipLayer.transactionId,
							data:inData
						},
				});
		inConnection.send(
				{
					cipLayer:
						{
							isWsPassThrough:false,
							type:respondToTransactionOptions.type, //overridable
							command:respondToTransactionOptions.command,
							transactionId:inReceivedCipLayer.transactionId,
							data:inData
						},
				}
		);
		/*inConnection.socket.write(
			JSON.stringify(
				{
					cipLayer:
						{
							isWsPassThrough:false,
							type:respondToTransactionOptions.type, //overridable
							command:respondToTransactionOptions.command,
							transactionId:inReceivedCipLayer.transactionId,
							data:inData
						},
				}
			)
		);*/

	}
}

module.exports = Controller;