//####################################################################################
// NewServer, JSON rewrites from command line
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

var NewServer = function(inOptions){
	var _this = this;
	var options = 
		{
			mainServerPathSource		:false,
			mainServerPathTarget		:false,
			sourcePublicPath			:false,
			targetPublicPath			:false,

			serverNumber				:false,

			expressCmdDetail:false,
			websocketCmdDetail:false,

		}
	options = extend(options, inOptions);
	var expressServerProcess;
	var websocketProcess;

	this.createFileSystem = function(inPostFunction){
		global.reportNotify('newserver.createFileSystem', 'Entered');
		console.log('createFileSystem ENTERED');
		if(!(options.mainServerPathSource) || !(options.mainServerPathTarget)){
			global.reportError('newserver.createFileSystem', 'Need a source and target for operation!!');
			return;
		}

		var testArray = [];
		global.reportNotify('STARTING newserver.createFileSystem', 
			{
				sourcePath:options.mainServerPathSource,
				targetPath:options.mainServerPathTarget,
				serverNumber:options.serverNumber,
			}, 0
		);
		wrench.copyDirRecursive(options.mainServerPathSource, options.mainServerPathTarget, 
			{
				forceDelete: true,
				excludeHiddenUnix: false,
				preserveFiles: true,
				preserveTimestamps: true,
				inflateSymlinks: false,
				include:function(filename, dir) {
					testArray.push({dir:dir, fileName:filename});
					if(dir.indexOf(options.mainServerPathSource + "/public") != -1 || dir.indexOf("/.git") != -1){
						return false;
					}
					return true; 
				}
			}
			,function(){
				global.reportNotify('COMPLETED newserver.createFileSystem', 
					{
						sourcePath:options.mainServerPathSource,
						targetPath:options.mainServerPathTarget,
						serverNumber:options.serverNumber,
					}, 0
				);
				_this.createPublicLink();
				_this.createAllBootScripts(
					{

						expressServerPath	:options.mainServerPathTarget + '/express',
						websocketServerPath	:options.mainServerPathTarget + '/websocket',
						serverNumber		:options.serverNumber,

					}, function(err){
						if(inPostFunction){inPostFunction();}
					}
				);


			}
		);

	}



	this.createAllBootScripts = function(inBootScriptOptions, inPostFunction){
		var bootScriptOptions = 
			{
				expressServerPath	:false,
				websocketServerPath	:false,
				serverNumber		:false,
			}

		bootScriptOptions = extend(bootScriptOptions, inBootScriptOptions);
		var serverUid = 'SERVER_' + bootScriptOptions.serverNumber;
		//==========================================
		// EXPRESS BASH BOOT FOREVER----------------
		//==========================================
		_this.writeBashBootFile(
			{
				fileNameAndPath:bootScriptOptions.expressServerPath + '/server_start_forever.sh',
				execlines:
					[
						util.format('cd %s/',bootScriptOptions.expressServerPath),
						util.format('%s/node_modules/forever/bin/forever --uid "%s" -w app.js %s &',bootScriptOptions.expressServerPath, serverUid, options.expressCmdDetail),
						util.format('thepid=$!'),
						util.format('echo "kill $thepid" >server_kill.sh &'),
					],
				onError:false,
				onSave:function(){
					//==========================================
					// EXPRESS BASH BOOT -----------------------
					//==========================================
					console.log('onSave:' + bootScriptOptions.expressServerPath + '/server_start.sh');
					_this.writeBashBootFile(
						{
							fileNameAndPath:bootScriptOptions.expressServerPath + '/server_start.sh',
							execlines:
								[
									util.format('cd %s/',bootScriptOptions.expressServerPath),
									util.format('node app.js %s &', options.expressCmdDetail),
									util.format('thepid=$!'),
									util.format('echo "kill $thepid" >server_kill.sh &'),
								],
							onError:false,
							onSave:function(){
								console.log('onSave:' + bootScriptOptions.expressServerPath + '/server_start.sh');


								//===========  WEBSOCKET STUFF HERE  ====================================================


								//==========================================
								// WEBSOCKET BASH BOOT FOREVER -------------
								//==========================================
								_this.writeBashBootFile(
									{
										fileNameAndPath:bootScriptOptions.websocketServerPath + '/server_start_forever.sh',
										execlines:
											[
												util.format('cd %s/',bootScriptOptions.websocketServerPath),
												util.format('%s/node_modules/forever/bin/forever --uid "%s" -w wsapp.js %s &', bootScriptOptions.websocketServerPath, serverUid, options.websocketCmdDetail),
												util.format('thepid=$!'),
												util.format('echo "kill $thepid" >server_kill.sh &'),
											],
										onError:false,
										onSave:function(){
											//==========================================
											// WEBSOCKET BASH BOOT ---------------------
											//==========================================
											_this.writeBashBootFile(
												{
													fileNameAndPath:bootScriptOptions.websocketServerPath + '/server_start.sh',
													execlines:
														[
															util.format('cd %s/',bootScriptOptions.websocketServerPath),
															util.format('node wsapp.js %s &', options.websocketCmdDetail),
															util.format('thepid=$!'),
															util.format('echo "kill $thepid" >server_kill.sh &'),
														],
													onError:false,
													onSave:function(){
														console.log('onSave:' + bootScriptOptions.websocketServerPath + '/server_start.sh');
														if(inPostFunction){inPostFunction();}
													}
												}
											);
										}
									}
								);

							}
						}
					);
				}
			}
		);



	}


	this.createPublicLink = function(){
		console.log('=====================================================');
		console.log('CREATE PUBLIC LINK');
		console.log('=====================================================');
		if(options.sourcePublicPath == false || options.targetPublicPath == false){
			return false;
		}

		try{  //basePath + '/desta/ignor'
			fs.renameSync(options.targetPublicPath, options.targetPublicPath + '_na');
		}catch(e){
			console.log('No Directory to rename, that is OK too:' + e);
			global.reportError('newserver.createPublicLink error on rename old folder', 
				{
					sourcePath:options.targetPublicPath,
					targetPath:options.targetPublicPath,
					serverNumber:options.serverNumber,
					error:err,
				}, 0
			);
		}

		try{
			fs.symlinkSync(options.sourcePublicPath, options.targetPublicPath);
		}catch(e){
			console.log('ERROR creating public link for server instance ??? fs.symlinkSync:' + e);
			global.reportError('newserver.createPublicLink error on rename sync', 
				{
					sourcePath:options.targetPublicPath,
					targetPath:options.targetPublicPath,
					serverNumber:options.serverNumber,
					error:err,
				}, 0
			);
			return;
		}

		global.reportNotify('newserver.createPublicLink DONE', 
			{
				sourcePath:options.targetPublicPath,
				targetPath:options.targetPublicPath,
				serverNumber:options.serverNumber,
			}, 0
		);
	}

	/*this.writePhpBootFile = function(inPhpOptions){
		var _this = this;
		var phpOptions = 
			{
				execlines:[],
				onSave:false,
				onError:false,

			}
		var phpOptions = extend(true, phpOptions, inPhpOptions);

		var stringOfArray = '';
		for(arrayIndex in phpOptions.execlines){
			stringOfArray += 'echo exec("' + phpOptions.execlines[arrayIndex] + '");\n';
		}

		var finalString = '<?php\n' + stringOfArray + '\n';

		fs.writeFile(options.mainServerPathTarget + '/express/boot.php', finalString, function (err) {
			if(err){
				console.log('ERROR:');
				console.dir(err);
				if(phpOptions.onError){phpOptions.onError(err);}
				return;
			}
			console.log('php saved!');
			if(phpOptions.onSave){phpOptions.onSave();}
		});
	}*/

	this.writeBashBootFile = function(inWbOptions){
		var _this = this;
		var wbOptions = 
			{
				fileNameAndPath:options.mainServerPathTarget + '/express/boot.sh',
				execlines:[],
				onError:false,
				onSave:false,
			}
		var wbOptions = extend(true, wbOptions, inWbOptions);

		var stringOfArray = '';
		for(arrayIndex in wbOptions.execlines){
			stringOfArray += wbOptions.execlines[arrayIndex] + '\n'
		}

		var finalString = '#!/bin/bash\n' + stringOfArray ;

		fs.writeFile(wbOptions.fileNameAndPath, finalString, function (err) {
			if(err){
				global.reportError('newserver.writeBashBootFile error on save', 
					{
						fileName:wbOptions.fileNameAndPath,
						serverNumber:options.serverNumber,
						error:err,
						finalString:finalString
					}, 0
				);
				if(wbOptions.onError){wbOptions.onError(err);}
				return;
			}
			console.log('bash saved!');
			global.reportNotify('writeBashBootFile SAVED', 
					{
						serverNumber:options.serverNumber,
						fileName:wbOptions.fileNameAndPath,
						finalString:finalString,
					}, 0
				);
			if(wbOptions.onSave){wbOptions.onSave();}
		});
	}

	this.bootExpressServer = function(inExpressPostFunction){
		console.log('bootExpressServer ENETERED');
		//##var execPath = '/home/ben/git_project/cip/server_0/express/node_modules/forever/bin/forever /home/ben/git_project/cip/server_0/express/app.js';
		//##var execPath = util.format('%s/express/node_modules/forever/bin/forever %s/express/app.js %s' ,options.mainServerPathTarget ,options.mainServerPathTarget, options.expressCmdDetail);
		//##var execPath = 'cd /home/ben/git_project/cip/server_0/express/ && /home/ben/git_project/cip/server_0/express/node_modules/forever/bin/forever --uid "SERVER_0" -w app.js http://192.168.0.16 30000 https://192.168.0.16 30200 hkjhkjh 1';
		//var execPath = util.format('cd %s/express/ && %s/express/node_modules/forever/bin/forever  --uid "SERVER_%s" -w app.js %s', options.mainServerPathTarget,options.mainServerPathTarget ,options.serverNumber, options.expressCmdDetail);
		//var execPath = util.format('cd %s/express/ && %s/express/node_modules/forever/bin/forever -o %s/express/server.log --uid "SERVER_%s" -w app.js %s', options.mainServerPathTarget,options.mainServerPathTarget, options.mainServerPathTarget ,options.serverNumber, options.expressCmdDetail);

		if(options.foreverEnabled){
			var execPath = util.format('cd %s/express/ && bash server_start_forever.sh  > /dev/null 2>&1 &', options.mainServerPathTarget);
			console.log(execPath);
			var expressServerProcess = childProcess.exec(execPath, function (error, stdout, stderr){
				if(error){
					global.reportError('newserver.bootExpressServer', 
						{
							serverNumber:options.serverNumber,
							serverType:'express',
							error:error,
							stdout:stdout,
							stderr:stderr,
						}, 0
					);
				}
				global.reportNotify('LOADING newserver.bootExpressServer', 
					{
						serverNumber:options.serverNumber,
						serverType:'express',
						error:error,
						stdout:stdout,
						stderr:stderr,
					}, 0
				);
				if(inExpressPostFunction){inExpressPostFunction();}
			})
		}else{

			var execPath = util.format('cd %s/express/ && bash server_start.sh  > /dev/null 2>&1 &', options.mainServerPathTarget);
			console.log(execPath);
			var expressServerProcess = childProcess.exec(execPath, function (error, stdout, stderr){
				if(error){
					global.reportError('newserver.bootExpressServer', 
						{
							serverNumber:options.serverNumber,
							serverType:'express',
							error:error,
							stdout:stdout,
							stderr:stderr,
						}, 0
					);
				}
				global.reportNotify('LOADING newserver.bootExpressServer', 
					{
						serverNumber:options.serverNumber,
						serverType:'express',
						error:error,
						stdout:stdout,
						stderr:stderr,
					}, 0
				);
				if(inExpressPostFunction){inExpressPostFunction();}
			})
		}

	}

	this.bootWebsocketServer = function(inPostFunction){
		console.log('bootWebsocketServer ENETERED');
		//##var execPath = '/home/ben/git_project/cip/server_0/express/node_modules/forever/bin/forever /home/ben/git_project/cip/server_0/websocket/wsapp.js';
		//var execPath = util.format('cd %s/websocket/ && %s/websocket/node_modules/forever/bin/forever  --uid "SERVER_%s" -w wsapp.js %s', options.mainServerPathTarget,options.mainServerPathTarget ,options.serverNumber, options.websocketCmdDetail);
		//var execPath = util.format('cd %s/websocket/ && %s/websocket/node_modules/forever/bin/forever -o %s/websocket/server.log --uid "SERVER_%s" -w wsapp.js %s', options.mainServerPathTarget,options.mainServerPathTarget ,options.mainServerPathTarget ,options.serverNumber, options.websocketCmdDetail);
		if(options.foreverEnabled){
			var execPath = util.format('cd %s/websocket/ && bash server_start_forever.sh  > /dev/null 2>&1 &', options.mainServerPathTarget);
			var webSocketServerProcess = childProcess.exec(execPath, function (error, stdout, stderr){
				if(error){
					global.reportError('newserver.bootWebsocketServer', 
						{
							serverNumber:options.serverNumber,
							serverType:'webSocket',
							error:error,
							stdout:stdout,
							stderr:stderr,
						}, 0
					);
				}

				global.reportNotify('LOADING newserver.bootWebsocketServer', 
					{
						serverNumber:options.serverNumber,
						serverType:'webSocket',
						error:error,
						stdout:stdout,
						stderr:stderr,
					}, 0
				);

				if(inPostFunction){inPostFunction();}
			})

		}else{
			var execPath = util.format('cd %s/websocket/ && bash server_start.sh  > /dev/null 2>&1 &', options.mainServerPathTarget);
			var webSocketServerProcess = childProcess.exec(execPath, function (error, stdout, stderr){
				if(error){
					global.reportError('newserver.bootWebsocketServer', 
						{
							serverNumber:options.serverNumber,
							serverType:'webSocket',
							error:error,
							stdout:stdout,
							stderr:stderr,
						}, 0
					);
				}
				global.reportNotify('LOADING newserver.bootWebsocketServer', 
					{
						serverNumber:options.serverNumber,
						serverType:'webSocket',
						error:error,
						stdout:stdout,
						stderr:stderr,
					}, 0
				);
				if(inPostFunction){inPostFunction();}
			})
		}
	}


	this.killExpressServer = function(inPostFunction){
		var execPath = util.format('cd %s/express/ && bash server_kill.sh  > /dev/null 2>&1 &', options.mainServerPathTarget);
		var expressServerProcess = childProcess.exec(execPath, function (error, stdout, stderr){
			if(error){
				global.reportError('newserver.killExpressServer', 
					{
						serverNumber:options.serverNumber,
						serverType:'express',
						error:error,
						stdout:stdout,
						stderr:stderr,
					}, 0
				);
			}

			global.reportNotify('KILLING newserver.killExpressServer', 
				{
					serverNumber:options.serverNumber,
					serverType:'express',
					error:error,
					stdout:stdout,
					stderr:stderr,
				}, 0
			);
			if(inPostFunction){inPostFunction();}
		})
	}

	this.killWebsocketServer = function(inPostFunction){
		var execPath = util.format('cd %s/websocket/ && bash server_kill.sh  > /dev/null 2>&1 &', options.mainServerPathTarget);
		var expressServerProcess = childProcess.exec(execPath, function (error, stdout, stderr){
			if(error){
				global.reportError('newserver.killExpressServer', 
					{
						serverNumber:options.serverNumber,
						serverType:'websocket',
						error:error,
						stdout:stdout,
						stderr:stderr,
					}, 0
				);
			}

			global.reportNotify('KILLING newserver.killWebsocketServer', 
				{
					serverNumber:options.serverNumber,
					serverType:'websocket',
					error:error,
					stdout:stdout,
					stderr:stderr,
				}, 0
			);
			if(inPostFunction){inPostFunction();}
		})
	}


	this.setPermissions = function(){
		var staticPermissions = 
			{
				recursivePermissions:
					[
						{
							path:options.mainServerPathTarget,
							mode:0755
						}
					],
				permissions:
					[
						{

						}
					],
			}
		//EXECUTE--------------------options.mainServerPathSource
		var theRecPerms = staticPermissions.recursivePermissions;
		if(theRecPerms){
			for(var theRecPermsIndex in theRecPerms){
				if(theRecPerms[theRecPermsIndex].path && theRecPerms[theRecPermsIndex].mode){
					global.reportNotify('PERMISSIONS', 
						{
							path:theRecPerms[theRecPermsIndex].path,
							mode:theRecPerms[theRecPermsIndex].mode,
						}, 0
					);
					wrench.chmodSyncRecursive(theRecPerms[theRecPermsIndex].path, theRecPerms[theRecPermsIndex].mode);
				}
			}
		}

		var thePerms = staticPermissions.permissions;
		if(thePerms){
			for(var thePermsIndex in thePerms){
				if(thePerms[thePermsIndex].path && thePerms[thePermsIndex].mode){
					global.reportNotify('PERMISSIONS', 
						{
							path:thePerms[thePermsIndex].path,
							mode:thePerms[thePermsIndex].mode,
						}, 0
					);
					fs.chmodSync(thePerms[thePermsIndex].path, thePerms[thePermsIndex].mode);
				}
			}
		}

	}

}

module.exports = NewServer;