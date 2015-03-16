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
					//userId:req.session.userData.userId,
					//deviceId:"815",
					//URL:configData.domain.address + ":" + configData.domain.port,
					//androidAppRoute:configData.androidAppRoute,
					//webSocketClient:configData.webSocketClient,
					//defaultUserImageUrl:configData.defaultUserImageUrl,
					//defaultMemberImageUrl:configData.defaultMemberImageUrl,
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

}