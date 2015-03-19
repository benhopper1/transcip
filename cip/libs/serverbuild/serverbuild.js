//####################################################################################
// ServerBuild, JSON rewrites from command line
//####################################################################################
console.log('Server Build Loading');
var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var extend = require(basePath + '/node_modules/node.extend');
var finish = require(basePath + '/node_modules/finish');
var PortUtility = require(basePath + '/libs/portutility/portutility.js');
var util = require('util');
var NewServer = require(basePath + '/libs/newserver/newserver.js');
var ServersInformation = require(basePath + '/libs/serversinformation/serversinformation.js');
var wrench = require(basePath +  '/node_modules/wrench');
//var SecretFile = require(basePath + '/libs/secretfile/secretfile.js');
//var removeDirectory = require(basePath + '/node_modules/rimraf');
//var childProcess = require('child_process');




var ServerBuild = function(inOptions){
	global.reportNotify('ServerBuild constructor', 'Entered');
	var expressServerName = false;
	var websocketServerName = false;
	var _this = this;
	this.httpUrl = {};
	this.httpsUrl = {};
	var state = 'unloaded';
	var oldState = false;
	var newServer;
	var onStateChangeFunctionArray = [];
	var options = 
		{
			serverNumber:0,
			serverIp:false,
			onStateChange:false,
		}
	;
	options = extend(options, inOptions);

	if(options.onStateChange){
		onStateChangeFunctionArray.push(options.onStateChange);
	}

	expressServerName = 'Server_ex_' + (30400 + options.serverNumber);
	websocketServerName = 'Server_ws_' + (30400 + options.serverNumber);

	global.reportNotify('INSTANCE MADE, SERVERS NOT RUNNING YET', 
		{
			expressServerName:expressServerName,
			websocketServerName:websocketServerName,
		}, 0
	);

	global.serverBuildsHash['server_' + options.serverNumber] = _this;

	this.setOnStateChange = function(inFunction){
		onStateChangeFunctionArray.push(inFunction);
	}


	this.reportOnStateChange = function(newState, oldState){
		global.reportNotify('STATE CHANGE', 
			{
				buildServerName:_this.getServerBuildName(),
				caption:oldState + ' -> ' + newState,
				state:newState,
				oldState:oldState,
			}, 0
		);
		for(var theIndex in onStateChangeFunctionArray){
			onStateChangeFunctionArray[theIndex](newState, oldState);
		}
	}

	this.getState = function(){
		return state;
	}

	var setState = function(inState){
		oldState = state;
		state = inState;
		if(oldState != state){
			_this.reportOnStateChange(state, oldState);
		}
	}

	this.lock = function(){
		if(_this.getState() == 'running'){
			setState('lockedRunning');
		}
	}

	this.unlock = function(){
		if(_this.getState() == 'lockedRunning'){
			setState('running');
		}
	}

	this.getRequestScore = function(){
		return Math.floor(Math.random() * (1000 - 5)) + 5;
	}

	this.getProcessingScore = function(){
		return Math.floor(Math.random() * (1000000 - 3000)) + 3000;
	}

	this.getServerBuildName = function(){
		return ServerBuild.ServerNumberToServerBuildName(options.serverNumber);
	}
	this.getServerName = function(){
		return ServerBuild.ServerNumberToServerName(options.serverNumber);
	}

	this.kill = function(){
		console.log('KILLING ME');
		newServer.killExpressServer(function(){
			console.log('killExpressServer callback entered');
			delete global.serverBuildsHash['server_' + options.serverNumber];
			newServer.killWebsocketServer(function(){
				console.log('killWebsocketServer callback entered');
				if(global.activeServersHash[_this.getExpressServerName()]){
					delete global.activeServersHash[_this.getExpressServerName()];
				}
				if(global.activeServersHash[_this.getWebsocketServerName()]){
					delete global.activeServersHash[_this.getWebsocketServerName()];
				}

				_this.cleanQrCountHash();
				_this.cleanQrHash();
				_this.cleanServerHashOfArray();
				_this.cleanUserId_hashOfArray();

				//delete global.serverBuildsHash['server_' + options.serverNumber];
			});
		});
	}
	//TODO:fix this crapt  HORRIBLE AGORYTHIM-------------------------------------
	this.cleanUserId_hashOfArray = function(){
		var wsName = _this.getWebsocketServerName();
		var theKeys = global.userId_hashOfArray.getKeys();
		for(theKeysIndex in theKeys){
			var theRecord = global.userId_hashOfArray.getArrayFromHash(theKeys[theKeysIndex])[0];
			if(theRecord && theRecord.serverName == wsName){
				global.userId_hashOfArray.removeArrayFromHash(theKeys[theKeysIndex]);
			}
		}
	}

	this.cleanServerHashOfArray = function(){
		global.serverHashOfArray.removeArrayFromHash(_this.getWebsocketServerName());
	}

	this.cleanQrCountHash = function(){
		var wsName = _this.getWebsocketServerName();
		var theRecord = global.qrCountHashByServer[wsName];
		if(theRecord){
			delete global.qrCountHashByServer[wsName];
		}
	}

	this.cleanQrHash = function(){
		var wsName = _this.getWebsocketServerName();
		for(var qrKey in global.qrHash){
			var theRecord = global.qrHash[qrKey];
			if(theRecord.serverName == wsName){
				delete global.qrHash[qrKey];
			}
		}
	}

	this.getExpressServerName = function(){
		return expressServerName;
	}

	this.getWebsocketServerName = function(){
		return websocketServerName;
	}

	this.create = function(inCreateOptions, inPostFunction){
		var createOptions = 
			{
				copyEnabled:false,
				setPermissions:false,
				foreverEnabled:false,
				launch:true,
			}
		;

		createOptions = extend(createOptions, inCreateOptions);

		if(createOptions.copyEnabled || createOptions.setPermissions){
			setState('creating');
		}else{
			setState('booting');
		}


		var configData = fs.readFileSync(basePath + '/cip.conf', 'utf8');
		configData = JSON.parse(configData);

		var serversInformation = new ServersInformation(
			{
				serverMaxCount:190,
				ip:options.serverIp,
			}
		);


		serversInformation.testReport(options.serverNumber, function(inReport){
			console.log('TEST REPORT');
			console.dir(inReport);

			_this.httpUrl = 
				{
					protocol:'http:',
					ip:inReport.expressHttpPort.ip,
					port:inReport.expressHttpPort.port,
				}
			;
			_this.httpsUrl = 
				{
					protocol:'https:',
					ip:inReport.expressHttpPort.ip,
					port:inReport.expressHttpsPort.port,
				}
			;


			var expressCmdDetail = util.format('http://%s %s https://%s %s %s %s %s %s',
					inReport.expressHttpPort.ip,
					inReport.expressHttpPort.port,
					inReport.expressHttpPort.ip,
					inReport.expressHttpsPort.port, 
					inReport.expressHttpPort.ip,
					inReport.expressWebSocketClientPort.port,
					'hkjhkjh',
					'1'
			);
			console.log('expressCmdDetail:' + expressCmdDetail);
			var websocketCmdDetail = util.format('%s %s %s %s', 
				inReport.websocketServerPort.ip,
				inReport.websocketServerPort.port,
				'hkjhkjh',
				'1'
			);
			console.log('websocketCmdDetail:' + websocketCmdDetail);

			var newServerFolderPath = basePath + '/server_' + options.serverNumber;
			newServer = new NewServer(
				{
					mainServerPathSource:path.join(basePath, '../', 'trans'),
					mainServerPathTarget:newServerFolderPath,
					sourcePublicPath:path.join(basePath, '../', 'trans', 'express', 'public'),
					targetPublicPath:newServerFolderPath + '/express/public',
					serverNumber:options.serverNumber,

					expressCmdDetail:expressCmdDetail,
					websocketCmdDetail:websocketCmdDetail,

					foreverEnabled:createOptions.foreverEnabled,

				}
			);



			console.log("WEBSOCKET CMD:" + 'cd ' + newServerFolderPath + '/websocket' + ' && ' + ' node wsapp.js ' + websocketCmdDetail);
			// VERY LONG ASYNC OPERATION--------
			if(createOptions.copyEnabled){
				console.log('COPY FILES FOR NEW SERVER');
				newServer.createFileSystem(function(){
					console.log('newServer.createFileSystem CALL BACK');
					if(createOptions.launch){
						setState('booting');
						newServer.bootExpressServer(function(){
							console.log('backfrom express BOOT');
							newServer.bootWebsocketServer(function(){
								console.log('backfrom WebsocketServer BOOT');
								//TODO: move this
								if(createOptions.setPermissions){
									newServer.setPermissions();
								}
								setState('running');
								if(inPostFunction){inPostFunction();}
							});
						});
					}else{
						// do not boot---
						setState('unloaded');
						if(inPostFunction){inPostFunction();}
					}
				});
			}else{
				if(createOptions.setPermissions){
					newServer.setPermissions();
				}


				if(createOptions.launch){
					setState('booting');
					newServer.bootExpressServer(function(){
						console.log('backfrom express BOOT');
						newServer.bootWebsocketServer(function(){
							console.log('backfrom WebsocketServer BOOT');
							//global.serverBuildsHash['server_' + options.serverNumber] = _this;
							setState('running');
							if(inPostFunction){inPostFunction();}
						});
					});
				}else{
					if(inPostFunction){inPostFunction();}
				}
				
				//newServer.quickLoadServer();
			}


		});//end testReport


	}




}

// STATIC ............................................................................................
ServerBuild.serverBuildNameToServerName = function(inValue){
	var serverNumber = ServerBuild.serverBuildNameToServerNumber(inValue);
	var result = 
		{
			express:'Server_ex_30' + (400 + serverNumber),
			websocket:'Server_ws_30' + (400 + serverNumber),
		}
	return result;
}

ServerBuild.serverBuildNameToServerNumber = function(inValue){
	return parseInt(inValue.replace('server_',''));
}

ServerBuild.ServerNumberToServerName = function(inValue){
	var result = 
		{
			express:'Server_ex_30' + (400 + inValue),
			websocket:'Server_ws_30' + (400 + inValue),
		}
	return result;
}

ServerBuild.ServerNumberToServerBuildName = function(inValue){
	return 'server_' + inValue;
}

ServerBuild.ServerNameToServerBuildName = function(inValue){
	return 'server_' + ServerBuild.ServerNameToServerNumber(inValue);
}

ServerBuild.ServerNameToServerNumber = function(inValue){
	return (parseInt(inValue.slice( -3 ))) - 400;
}


ServerBuild.getServerDirectories = function(srcpath, inPostFunction){
	fs.readdir(srcpath, function(err, files){
		var serverDirectoryArray = [];
		var serverNumberArray = [];
		for(var fileIndex in files){
			if(fs.statSync(path.join(srcpath, files[fileIndex])).isDirectory()){
				if(files[fileIndex].indexOf('server_') != -1){
					serverDirectoryArray.push(files[fileIndex]);
					serverNumberArray.push(parseInt(files[fileIndex].replace('server_', '')));
				}
			}
		}
		if(inPostFunction){inPostFunction(serverDirectoryArray, serverNumberArray);}
	});
}

ServerBuild.launchServersByNumberArray = function(inOptions, inPostFunction){
	ServerBuild.startVacantCalculation();
	options = 
		{
			severIp:'127.0.0.1',
			serverNumberArray:false,
		}
	options = extend(true, options, inOptions);
	var finalResultArray = [];

	finish.map(options.serverNumberArray, function(value, done){
		var serverBuild = new ServerBuild(
			{
				serverNumber:value,
				serverIp:options.severIp,
			}
		);

		serverBuild.create(
			{
				copyEnabled:false,
				setPermissions:false,
				foreverEnabled:false,
			},
			function(){
				console.log('Server Created index:' + value);
				finalResultArray.push(serverBuild);
				done();
			}
		);
	},
	//completed Function--------------------------------
	function(err, results){
		if(inPostFunction){
			inPostFunction(err, finalResultArray);
		}
	});
}

ServerBuild.launchAllServers = function(inOptions, inPostFunction){
	ServerBuild.startVacantCalculation();
	options = 
		{
			severIp:'127.0.0.1'
		}
	options = extend(true, options, inOptions);
	var finalResultArray = [];

	ServerBuild.getServerDirectories(basePath, function(directories, serverNumbers){
		finish.map(serverNumbers, function(value, done){
			var serverBuild = new ServerBuild(
				{
					serverNumber:value,
					serverIp:options.severIp,
				}
			);

			serverBuild.create(
				{
					copyEnabled:false,
					setPermissions:false,
					foreverEnabled:false,
				},
				function(){
					console.log('Server Created index:' + value);
					finalResultArray.push(serverBuild);
					done();
				}
			);
		},
		//completed Function--------------------------------
		function(err, results){
			if(inPostFunction){
				inPostFunction(err, finalResultArray);
			}
		});
	});
}

//has filesystem and is not loaded yet!!!
ServerBuild.launchNexServer = function(inIp, inPostfunction){
	if(!(inIp)){inIp = global.ip;}
	ServerBuild.startVacantCalculation();
	var servers = ServerBuild.getAllServers();

	ServerBuild.getServerDirectories(basePath, function(directories, serverNumbers){
		var serverNumberHash = {};
		for(var theIndex in serverNumbers){
			serverNumberHash[serverNumbers[theIndex].toString()] = true;
		}
		var creativeServerNumber = 0;
		console.log('hashLookkup787:');
		console.dir(serverNumberHash[creativeServerNumber.toString()]);
		var goodFind = false;
		while(serverNumberHash[creativeServerNumber.toString()]){
			var theServer = servers[ServerBuild.ServerNumberToServerBuildName(creativeServerNumber)];
			if(theServer){
				creativeServerNumber++;
			}else{
				goodFind = true;
				break;
			}
		}
		if(goodFind){
			ServerBuild.launchServersByNumberArray(
				{
					severIp:inIp,
					serverNumberArray:[creativeServerNumber],
				}
			);
		}


	});
}

//
ServerBuild.createNextFileSystem = function(inIp, inPostfunction){
	if(!(inIp)){inIp = global.ip;}
	ServerBuild.getServerDirectories(basePath, function(directories, serverNumbers){
		var serverNumberHash = {};
		for(var theIndex in serverNumbers){
			serverNumberHash[serverNumbers[theIndex].toString()] = true;
		}
		var creativeServerNumber = 0;
		while(serverNumberHash[creativeServerNumber.toString()]){
			console.log(creativeServerNumber);
			creativeServerNumber++;
		}

		var serverBuild = new ServerBuild(
			{
				serverNumber:creativeServerNumber,
				serverIp:inIp,
			}
		);

		serverBuild.create(
			{
				copyEnabled:true,
				setPermissions:true,
				foreverEnabled:false,
				launch:false,
			},
			function(){
				console.log('createNextFileSystem callback:' + creativeServerNumber + 1);
			}
		);


	});
}

//AUTO CREATES INSTANCES FOR EXISTING FILESYSTEMS....
ServerBuild.init = function(inOptions, inPostFunction){
	ServerBuild.startVacantCalculation();
	options = 
		{
			severIp:'127.0.0.1'
		}
	options = extend(true, options, inOptions);
	var finalResultArray = [];

	ServerBuild.getServerDirectories(basePath, function(directories, serverNumbers){
		finish.map(serverNumbers, function(value, done){
			var serverBuild = new ServerBuild(
				{
					serverNumber:value,
					serverIp:options.severIp,
				}
			);

			console.log('Server Created index:' + value);
			finalResultArray.push(serverBuild);
			done();
		},
		//completed Function--------------------------------
		function(err, results){
			if(inPostFunction){
				inPostFunction(err, finalResultArray);
			}
		});
	});
}

ServerBuild.getRunningServers = function(){
	var resultArray = [];
	for(var theKey in global.serverBuildsHash){
		if(global.serverBuildsHash[theKey].getState() == 'running'){
			resultArray.push(global.serverBuildsHash[theKey]);
		}
	}
	return resultArray;
}

ServerBuild.getAllServers = function(){
	return global.serverBuildsHash;
}


ServerBuild.getBestVacantServer = function(inUseUnsecure){
	if(inUseUnsecure){
		return ServerBuild.bestVacantServerInstance.httpUrl;
	}else{
		return ServerBuild.bestVacantServerInstance.httpsUrl;
	}
}

// must be call initialy for calculation of redirection route.....
ServerBuild.bestVacantServerInstance = false;
ServerBuild.vacantCountRunning = false;
ServerBuild.startVacantCalculation = function(){
	if(ServerBuild.vacantCountRunning){return;}
	ServerBuild.vacantCountRunning = true;
	global.maintenance_0_20_40.add(function(inOptions, inData){
		console.log('ServerBuild startVacantCalculation 555');
		var runningServersArray = ServerBuild.getRunningServers();
		var leastServer = false;
		if(runningServersArray.length > 0){
			leastServer = runningServersArray[0];
			for(var theIndex in runningServersArray){
				var theServer = runningServersArray[theIndex];
				if(theServer.getProcessingScore() < leastServer.getProcessingScore()){
					leastServer = theServer;
				}
			}
		}else{
			// no running servers, need a default route saying no servers yet come back soon!!
		}

		ServerBuild.bestVacantServerInstance = leastServer;
		if(ServerBuild.bestVacantServerInstance){
			global.reportNotify('ServerBuild.bestVacantServerInstance', 
				{
					serverName:ServerBuild.bestVacantServerInstance.getServerBuildName(),
					secure:ServerBuild.getBestVacantServer(),
					unSecure:ServerBuild.getBestVacantServer(true),
				},0
			);

		}else{
			global.reportNotify('ServerBuild.bestVacantServerInstance', "NO SERVER YET!!!!");
		}

	});
}

ServerBuild.getStatusReport = function(){
	var allServers = ServerBuild.getAllServers();
	var resultReportArray = [];

	for(var theIndex in allServers){
		var theServer = allServers[theIndex];
		resultReportArray.push(
			{
				name:theServer.getServerBuildName(),
				state:theServer.getState(),
				requestScore:theServer.getRequestScore(),
				processingScore:theServer.getProcessingScore(),
			}
		);
	}

	return resultReportArray;
}

ServerBuild.restart = function(inServerName){
	var theServer = ServerBuild.getAllServers()[inServerName];
	if(theServer){
		theServer.kill();
		setTimeout(function(){
			var serverBuild = new ServerBuild(
				{
					serverNumber:ServerBuild.serverBuildNameToServerNumber(inServerName),
					serverIp:global.ip,
				}
			);
		},4000);
	}

}




module.exports = ServerBuild;