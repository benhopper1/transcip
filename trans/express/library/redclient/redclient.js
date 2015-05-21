// https://github.com/mranney/node_redis
var path = require('path');
var basePath = path.dirname(require.main.filename);
var uuid = require(basePath + '/node_modules/node-uuid');
var redis = require(basePath + '/node_modules/redis');

var RedClient = function(){
	var _this = this;
	if(typeof global.redisCounter === 'undefined'){
		global.redisCounter = 0;
	}
	global.redisCounter++;
	console.log('redisCounter:' + redisCounter);

	var subscriptionHash = {};
	var transactionSubscriptionHash = {};
	var transactionHash = {};
	var redClient = redis.createClient();
	var redClient_sub = redis.createClient();

	//==================================================================
	//--  ERROR  ------------------------------------------------------
	//==================================================================
	redClient.on("error", function (err) {
		global.reportError('redClient (redClient)',{error:err}, 0);
	});
	redClient_sub.on("error", function (err) {
		global.reportError('redClient (redClient_sub)',{error:err}, 0);
	});

	redClient_sub.on("message", function (channel, message){
		message = JSON.parse(message);
		var theFunction = subscriptionHash[channel];
		if(theFunction){
			theFunction(message);
		}else{
			theFunction = transactionSubscriptionHash[channel];
			if(theFunction){
				// we got a transaction
				var theReturnChannel = message.returnChannel;
				if(theReturnChannel){
					var execFunc = function(returnData){
						redClient.publish(theReturnChannel, JSON.stringify(returnData));
					}
					theFunction(message.data, execFunc);
				}
			}
		}
	});

	this.send = function(inChannel, inJstruct){
		redClient.publish(inChannel, JSON.stringify(inJstruct));
	}

	this.sendTransaction = function(inChannel, inJstruct, inPostFunction){
		console.log('xx0');
		global.reportNotify('sendTransaction', 
			{
				inJstruct:'inJstruct',
				inChannel:inChannel,
			}, 0
		);

		var returnChannel = uuid.v1();
		console.log('xx1');
		transactionReturnClient = redis.createClient();
		//==================================================================
		//--  ERROR  ------------------------------------------------------
		//==================================================================
		transactionReturnClient.on("error", function (err) {
			global.reportError('redClient (transactionReturnClient)',{error:err}, 0);
		});
		console.log('xx2');
		transactionReturnClient.on("message", function (channel, message){
			console.log('xx3');
			global.reportNotify('redClient.on("message")', 
				{
					channel:channel,
					message:message,
				}, 0
			);
			var returningJstruct = transactionHash[channel];
			console.log('xx4');
			if(returningJstruct){
				console.log('xx5');
				var thePostFunction = returningJstruct.postFunction;
				console.log('xx6');
				var theClient = returningJstruct.transactionReturnClient;
				console.log('xx7');
				if(thePostFunction){thePostFunction(JSON.parse(message))}
				console.log('xx8');
				theClient.unsubscribe();
				theClient.end();
				transactionReturnClient.end();
				delete theClient;
				console.log('xx9');
			}
		});
		transactionHash[returnChannel] = 
			{
				postFunction:inPostFunction,
				transactionReturnClient:transactionReturnClient,
			}
			console.log('xx10');

		var wrapperJstruct = 
			{
				returnChannel:returnChannel,
				data:inJstruct
			}
			console.log('xx11');
		transactionReturnClient.on("subscribe", function (channel, count){
			if(channel == returnChannel){
				console.log('xx12');
				redClient.publish(inChannel, JSON.stringify(wrapperJstruct));
			}
			console.log('xx13');
		});
		console.log('xx14');
		transactionReturnClient.subscribe(returnChannel);
		console.log('xx15');
	}

	this.subscribe = function(inChannel, inPostFunction){
		subscriptionHash[inChannel] = inPostFunction;
		redClient_sub.subscribe(inChannel);
	}

	this.subscribeTransaction = function(inChannel, inPostFunction){
		transactionSubscriptionHash[inChannel] = inPostFunction;
		redClient_sub.subscribe(inChannel);
	}

	this.unsubscribe = function(inChannel){
		delete subscriptionHash[inChannel];
		delete transactionSubscriptionHash[inChannel];
		redClient_sub.unsubscribe(inChannel);
	}


}


module.exports = RedClient;