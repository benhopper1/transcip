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
	var _this = this;
	var options = 
		{
			serverNumber:0,
			serverIp:false,
		}
	;
	options = extend(options, inOptions);

	this.create = function(inCreateOptions, inPostFunction){
		var createOptions = 
			{
				copyEnabled:false,
				setPermissions:false,
				foreverEnabled:false,
			}
		;

		createOptions = extend(createOptions, inCreateOptions);
		var configData = fs.readFileSync(basePath + '/cip.conf', 'utf8');
		configData = JSON.parse(configData);

		var serversInformation = new ServersInformation(
			{
				serverMaxCount:5,
				ip:options.serverIp,
			}
		);


		serversInformation.testReport(options.serverNumber, function(inReport){
			console.log('TEST REPORT');
			console.dir(inReport);


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
			var newServer = new NewServer(
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
					newServer.bootExpressServer(function(){
						console.log('backfrom express BOOT');
						newServer.bootWebsocketServer(function(){
							console.log('backfrom WebsocketServer BOOT');
							if(createOptions.setPermissions){
								newServer.setPermissions();
							}
							if(inPostFunction){inPostFunction();}
						});
					});
				});
			}else{
				if(createOptions.setPermissions){
					newServer.setPermissions();
				}

				newServer.bootExpressServer(function(){
					console.log('backfrom express BOOT');
					newServer.bootWebsocketServer(function(){
						console.log('backfrom WebsocketServer BOOT');
						if(inPostFunction){inPostFunction();}
					});
				});
				
				//newServer.quickLoadServer();
			}


		});//end testReport


	}




}

module.exports = ServerBuild;