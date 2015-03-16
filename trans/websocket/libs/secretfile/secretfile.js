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

	this.processCommandLineArgs = function(){
		console.log('processCommandLineArgs');
		if(process.argv.length > 2){
			var theData = {};
			theData.webSocketServer = {};
			theData.bridgeServices = {};
			if(process.argv[2]){
				theData.webSocketServer.address = process.argv[2]
			}

			if(process.argv[3]){
				//30400 : 30599
				if(parseInt(process.argv[3]) > 30399 && parseInt(process.argv[3]) < 30600){
					theData.webSocketServer.port = parseInt(process.argv[3]);
					//TODO BRIDGE remove later when not used..
					var calculatedBridgePort = (parseInt(process.argv[3]) - 30400) + 30600;
					theData.bridgeServices.port = calculatedBridgePort;
					console.log('calculatedBridgePort is:' + calculatedBridgePort);
				}else{
					console.log('WebSocket Port Not in ACCEPTABLE RANGE 30400 : 30599 is:' + process.argv[3]);
				}
			}
			if(process.argv[4]){
				theData.webSocketServer.connectString = process.argv[4]
			}
			_this.writeData(theData);
		}else{
			console.log('no cmd lines');
		}
	}
}

module.exports = SecretFile;