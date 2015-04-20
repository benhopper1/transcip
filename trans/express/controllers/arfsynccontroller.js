var path = require('path');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
configData = JSON.parse(configData);
var basePath = path.dirname(require.main.filename);
var url = require('url');








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
					androidAppRoute:'http://play.google.com/store/apps/details?id=hopper.arfsync.v001',//configData.androidAppRoute,
					productsRoute:configData.domain.address + ":" + configData.domain.port + '/products/products',
					webSocketClient:configData.webSocketClient,
					defaultUserImageUrl:configData.defaultUserImageUrl,
					defaultMemberImageUrl:configData.defaultMemberImageUrl,
					data:
						{
						}
				}
			);
		}else{
			var url_parts = url.parse(req.url, false, false);

			var reloadUrl;
			if(req.protocol == 'http'){
				reloadUrl = global.cipServerData.domain.address + ':' + global.cipServerData.domain.port + url_parts.pathname;
			}
			if(req.protocol == 'https'){
				reloadUrl = global.cipServerData.secureDomain.address + ':' + global.cipServerData.secureDomain.port + url_parts.pathname;
			}
			global.reportNotify('/jqm/arfsync', reloadUrl, 0);
			res.render('arfsync/arfsync.jqm.jade',
				{
					userId:req.cookies.userId,
					deviceId:"815",//req.cookies.deviceId,
					URL:configData.domain.address + ":" + configData.domain.port,
					reloadUrl:reloadUrl,
					androidAppRoute:configData.androidAppRoute,
					webSocketClient:configData.webSocketClient,
					defaultUserImageUrl:configData.defaultUserImageUrl,
					defaultMemberImageUrl:configData.defaultMemberImageUrl,
					productsRoute:'/products/products',
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