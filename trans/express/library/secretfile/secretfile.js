//####################################################################################
// SecretFile, JSON rewrites from command line
//####################################################################################
var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var extend = require(basePath + '/node_modules/node.extend');

var JsonFile = require(basePath + '/node_modules/jsonfile');


var SecretFile = function(inFileAndPath){
	var _this = this;
	var fileAndPath = inFileAndPath;
	console.log('SecretFile instance Loaded');
	this.getInformation = function(){
		return JsonFile.readFileSync(inFileAndPath);
	}

	this.writeData = function(inData){
		var physicalData = JsonFile.readFileSync(inFileAndPath);
		var newData = extend(true, physicalData, inData);
		JsonFile.writeFileSync(fileAndPath, newData);
	}

	this.writeDomain = function(inData){
		var theData = {};
		theData = 
			{
				domain:
					{
						address: inData.address,
						port: parseInt(inData.port)
					}
			}
		_this.writeData(theData);
	}

	this.writeSecureDomain = function(inData){
		var theData = {};
		theData = 
			{
				secureDomain:
					{
						address: inData.address,
						port: parseInt(inData.port)
					}
			}
		_this.writeData(theData);
	}

	this.writeWebSocketClient = function(inData){
		var theData = {};
		theData = 
			{
				webSocketClient:
					{
						address: inData.address,
						port: parseInt(inData.port),
						security:inData.security
					}
			}
		_this.writeData(theData);
	}

	this.processCommandLineArgs = function(){
		if(process.argv.length > 2){
			var theData = {};
			theData.domain = {};
			theData.secureDomain = {};
			theData.webSocketClient = {};
			theData.bridgeService = {};

			if(process.argv[2]){
				theData.domain.address = process.argv[2]
			}
			if(process.argv[3]){
				theData.domain.port = parseInt(process.argv[3]);
			}
			if(process.argv[4]){
				theData.secureDomain.address = process.argv[4]
			}
			if(process.argv[5]){
				theData.secureDomain.port = parseInt(process.argv[5]);
			}
			if(process.argv[6]){
				theData.webSocketClient.address = process.argv[6]
			}
			if(process.argv[7]){
				theData.webSocketClient.port = parseInt(process.argv[7]);
				//TODO BRIDGE remove later when not used..
				var calculatedBridgePort = (parseInt(process.argv[7]) - 30400) + 30600;
				theData.bridgeService.port = calculatedBridgePort;
				console.log('calculatedBridgePort is:' + calculatedBridgePort);
			}
			if(process.argv[8]){
				theData.webSocketClient.connectString = process.argv[8];
			}

			_this.writeData(theData);
		}
	}
}

module.exports = SecretFile;