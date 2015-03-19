var path = require('path');
var fs = require('fs');
var basePath = path.dirname(require.main.filename);
/*var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
configData = JSON.parse(configData);*/

module.exports.controller = function(app){

	app.get('/information/trans', function(req, res){
		//if(userModel.verifySession(req,res)){


			res.render('information/trans.jqm.jade',
				{
					serversReport:global.ServerBuild.getStatusReport(),
					testKey1:'testvalue1',
					activeServersHash:global.activeServersHash,
					connections:deviceTokenId_Hash,
					data:
						{
						}
				}
			);


		/*}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactselectpopup    YOUR NOT LOGED IN????");
		}*/
	});


	app.post('/admin/killserver', function(req, res){
		var serverName = req.body.serverName;
		console.log('name 000 :' + serverName);
		if(serverName){
			var theServer = global.serverBuildsHash[serverName];
			if(theServer){
				theServer.kill();
			}
		}
	});


	app.post('/admin/doServerAction', function(req, res){
		console.log('/admin/doServerAction');
		console.dir(req.body);
		if(req.body.serverBuildName && req.body.action){
			if(req.body.type = 'serverAction'){
				var theServer = global.ServerBuild.getAllServers()[req.body.serverBuildName];
				if(theServer){
					if(req.body.action == 'kill'){
						theServer.kill();
					}
					if(req.body.action == 'start'){
						theServer.create(
							{
								copyEnabled:false,
								setPermissions:false,
								foreverEnabled:false,
							},
							function(){
								
							}
						);
					}
					if(req.body.action == 'restart'){
						global.ServerBuild.restart(req.body.serverBuildName);
					}
					if(req.body.action == 'lock'){
						theServer.lock();
					}
					if(req.body.action == 'unlock'){
						theServer.unlock();
					}
				}
			}

			if(req.body.type = 'fileAction'){
				if(req.body.action == 'createNextFileSystem'){
					global.ServerBuild.createNextFileSystem();
				}

				if(req.body.action == 'launchNexServer'){
					global.ServerBuild.launchNexServer();
				}
			}




		}
	});


}