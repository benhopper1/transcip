var path = require('path');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
configData = JSON.parse(configData);

module.exports.controller = function(app){



	app.get('/jqm/message', function(req, res){
		console.log('cookie userId:' + req.cookies.userId);
		//if(req.cookies.userId){
			console.log("/jqm/message");
			res.render('message/message.jqm.jade',
				{
					userId:req.cookies.userId,
					deviceId:"815",//req.cookies.deviceId,
					URL:configData.domain.address + ":" + configData.domain.port,
					androidAppRoute:configData.androidAppRoute,
					webSocketClient:configData.webSocketClient,
					defaultUserImageUrl:configData.defaultUserImageUrl,
					defaultMemberImageUrl:configData.defaultMemberImageUrl,
					data:
						{
						}
				}
			);
		/*}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/smsManager    YOUR NOT LOGED IN????");
			/*res.render('contacts/widget_contactscollection.jade',
				{

				}
			);
		}*/
	});

	app.post('/jqm/message', function(req, res){
		console.log('cookie userId:' + req.cookies.userId);
		//console.dir(req);
		//if(req.cookies.userId){
			console.log("/jqm/message");
			res.render('message/message.jqm.jade',
				{
					userId:req.cookies.userId,
					deviceId:"815",//req.cookies.deviceId,
					URL:configData.domain.address + ":" + configData.domain.port,
					androidAppRoute:configData.androidAppRoute,
					webSocketClient:configData.webSocketClient,
					defaultUserImageUrl:configData.defaultUserImageUrl,
					defaultMemberImageUrl:configData.defaultMemberImageUrl,
					data:req.body,
				}
			);
		/*}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/smsManager    YOUR NOT LOGED IN????");
			/*res.render('contacts/widget_contactscollection.jade',
				{

				}
			);
		}*/
	});






}