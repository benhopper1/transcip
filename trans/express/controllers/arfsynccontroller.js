var path = require('path');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
configData = JSON.parse(configData);
var basePath = path.dirname(require.main.filename);









module.exports.controller = function(app){



	app.get('/jqm/arfsync', function(req, res){
		console.log("/jqm/arfsync");
		/*req.session.destroy(function(err) {
			console.log('Session Started');
		})*/
		if(app.isMobile(req.headers['user-agent'])){
			res.render('mobile/mobilearfsync.jade',
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
		}else{
			res.render('arfsync/arfsync.jqm.jade',
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
		}
	});



	app.get('/arfsync', function(req, res){
		console.log("/arfsync");
		req.session.destroy(function(err) {
			console.log('Session Started');
		})
		if(app.isMobile(req.headers['user-agent'])){
			res.render('mobile/mobilearfsync.jade',
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
		}else{
			res.render('arfsync/arfsync.jade',
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
		}
	});

	app.get('/arfsync/information', function(req, res){
		console.log("/arfsync/information");
		res.render('arfsync/information.jade',
			{
				userId:req.cookies.userId,
				deviceId:"815",//req.cookies.deviceId,
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				defaultUserImageUrl:configData.defaultUserImageUrl,
				defaultMemberImageUrl:configData.defaultMemberImageUrl,
				data:
					{
					}
			}
		);
	});

	app.get('/mobile/arfsync', function(req, res){
		console.log("/mobile/arfsync");
		res.render('mobile/mobilearfsync.jade',
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
	});












}