var path = require('path');
var basePath = path.dirname(require.main.filename);
var uuid = require(basePath + '/node_modules/node-uuid');
var fs = require('fs');
var portscanner = require(basePath + '/node_modules/portscanner');
var finish = require(basePath + '/node_modules/finish');
var extend = require(basePath + '/node_modules/node.extend');

var portScheme = 
	{
		domainUnsecurePort:
			{
				min:30000,
				max:30199,
			},
		domainSecurePort:
			{
				min:30200,
				max:30399,
			},
		websocketPort:
			{
				min:30400,
				max:30599,
			},
		openPort:
			{
				min:30600,
				max:30799,
			},

	}
;


var PortUtility = function(){
	var _this = this;

	this.getNextPort = function(inSchemeUnit, inPostFunction, inMinPort){
		var thePortUnit = portScheme[inSchemeUnit];
		if(thePortUnit){
			var theMin = (inMinPort > thePortUnit.min) ? inMinPort : thePortUnit.min;
			portscanner.findAPortNotInUse(theMin, thePortUnit.max, '127.0.0.1', function(error, port){
				if(error){console.log('Port looking error: ' + error);}
				console.log('AVAILABLE PORT AT: ' + port);
				if(port in global.prepairingPorts){
					_this.getNextPort(inSchemeUnit, inPostFunction, port +1 );
				}else{
					if(inPostFunction){inPostFunction(error, port);}
				}

			})
		}
	}

	this.testPort = function(inPort, inIp, inPostFunction){
		portscanner.checkPortStatus(inPort, inIp, function(error, status){
			var result = 
				{
					ip:inIp,
					port:inPort,
					inUse:(status == 'open') ? true : false,
					error:error,
				}
			if(inPostFunction){inPostFunction(result);}
		})
	}

	this.testPortArray = function(inArray, inPostFunction){
		var finalResultArray = [];
		finish.map(inArray, function(value, done){
			_this.testPort(value.port, value.ip, function(result){
				result.key = value.key;
				finalResultArray.push(extend(true,{},result));
				done();
			});

		},
		//completed Function--------------------------------
		function(err, results){
			if(inPostFunction){
				inPostFunction(err, finalResultArray);
			}
		});
	}
}

module.exports = PortUtility;