//####################################################################################
// SERVERS INFORMATION
//####################################################################################
var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var extend = require(basePath + '/node_modules/node.extend');
var wrench = require(basePath +  '/node_modules/wrench');
var SecretFile = require(basePath + '/libs/secretfile/secretfile.js');
var removeDirectory = require(basePath + '/node_modules/rimraf');
var childProcess = require('child_process');
var util = require('util');

var PortUtility = require(basePath + '/libs/portutility/portutility.js');


var ServersInformation = function(inOptions){
	var _this = this;
	var options = 
		{
			serverMaxCount:10, // count of servers to manage,
			ip:'0.0.0.0',
			cipInterfacePort:30900,
		}
	options = extend(options, inOptions);
	var serversHash = {};

	this.getServersHash = function(){
		return serversHash;
	}

	// BUILD SERVER IP AND PORTS DATA STRUCTURE
	//CHECK PORT AVAILIABILITY ETC...
	serversHash = serverBuildPorts(options.ip, options.serverMaxCount, options.cipInterfacePort);

	this.testReport = function(inServerNumber, inPostFunction){
		var portUtility = new PortUtility();
		var commonIp = serversHash[inServerNumber].websocket.domain.address;
		portUtility.testPortArray(
			[
				{
					key:'expressHttpPort',
					ip:commonIp,
					port:serversHash[inServerNumber].express.domain.port,
				},
				{
					key:'expressHttpsPort',
					ip:commonIp,
					port:serversHash[inServerNumber].express.secureDomain.port,
				},
				{
					key:'expressWebSocketClientPort',
					ip:commonIp,
					port:serversHash[inServerNumber].express.webSocketClient.port,
				},
				{
					key:'expressBridgeServicePort',
					ip:commonIp,
					port:serversHash[inServerNumber].express.bridgeService.port,
				},
				/*{
					key:'expressCipPort',
					ip:commonIp,
					port:serversHash[inServerNumber].express.cip.port,
				},*/



				{
					key:'websocketDomainPort',
					ip:commonIp,
					port:serversHash[inServerNumber].websocket.domain.port,
				},
				{
					key:'websocketServerPort',
					ip:commonIp,
					port:serversHash[inServerNumber].websocket.webSocketServer.port,
				},
				{
					key:'websocketBridgeServicePort',
					ip:commonIp,
					port:serversHash[inServerNumber].websocket.bridgeServices.port,
				},
				/*{
					key:'websocketCipPort',
					ip:commonIp,
					port:serversHash[inServerNumber].websocket.cip.port,
				}*/
			],
			function(inErr, inResult){
				var reportHash = {};
				reportHash['activeList'] = [];
				reportHash['unActiveList'] = [];
				reportHash['errorList'] = [];
				for(var theIndex in inResult){
					reportHash[inResult[theIndex].key] = inResult[theIndex];
					if(inResult[theIndex].inUse){
						reportHash['activeList'].push(inResult[theIndex].key);
					}else{
						reportHash['unActiveList'].push(inResult[theIndex].key);
					}

					if(inResult[theIndex].error){
						reportHash['errorList'].push(inResult[theIndex].key);
					}
				}
				//=====================================================
				// physical structure
				//=====================================================
				var expectedStructurePath = '/home/ben/git_project/cip/server_0';
				try {
					var stats = fs.lstatSync(expectedStructurePath);
					reportHash['physicalStructurePresent'] = stats.isDirectory();
				}
				catch(e){
					reportHash['physicalStructurePresent'] = false;
				}

				if(inPostFunction){inPostFunction(reportHash);}
			}
		);

	}



}

module.exports = ServersInformation;


//==================================================================================================
//===========================        TABLES        =================================================
//==================================================================================================


// /home/ben/git_project/cip/libs/serversinformation/serversinformation.js

var serverBuildPorts = function(inIp, inCount, inCipInterfacePort){
	var theJstruct = {};
	for(var inCountIndex = 0; inCountIndex < inCount; inCountIndex++){
		theJstruct[inCountIndex] = 
			{
				serverName:util.format('SERVER_%s', inCountIndex),
				serverNumber:inCountIndex,
				express:
					{
						domain:
							{
								address:util.format('http://%s', inIp),
								port:portScheme.http.min + inCountIndex,
							},
						secureDomain:
							{
								address:util.format('https://%s', inIp),
								port:portScheme.https.min + inCountIndex,
							},
						webSocketClient:
							{
								address:inIp,
								port:portScheme.websocket.min + inCountIndex,
								connectString:'hkjhkjh',
							},
						bridgeService:
							{
								address:inIp,
								port:portScheme.open.min + inCountIndex,
								security:'hkjhkjh',
							},
						cip:
							{
								host:inIp,
								port:inCipInterfacePort,
							}
					},


				websocket:
					{
						domain:
							{
								address:inIp,
								port:portScheme.http.min + inCountIndex,
							},
						webSocketServer:
							{
								address:inIp,
								port:portScheme.websocket.min + inCountIndex,
								connectString:'hkjhkjh',
							},
						bridgeServices:
							{
								host:inIp,
								port:portScheme.open.min + inCountIndex,
							},
						cip:
							{
								host:inIp,
								port:inCipInterfacePort,
							},
					}
			}
	}

return theJstruct;

}

var portScheme = 
	{
		http:
			{
				min:30000,
				max:30199,
			},
		https:
			{
				min:30200,
				max:30399,
			},
		websocket:
			{
				min:30400,
				max:30599,
			},
		cip:
			{
				http:30801,
				https:30800,
				interface:
					{
						min:30900,
						max:30999,
					},
			},
		open:
			{
				min:30600,
				max:30799,
			}
	}