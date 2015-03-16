var path = require('path');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
configData = JSON.parse(configData);
var basePath = path.dirname(require.main.filename);
var extend = require(basePath + '/node_modules/node.extend');








module.exports.controller = function(app){





	app.post('/webMenu/normalMenu', function(req, res){
		console.log("/webMenu/normMenu post");
		req.session.destroy(function(err){
			console.log('Session Started');
		})

		console.log('COOKIE USERID:' + req.cookies.userId);



		res.render('webmenu/normalmenu.jade',
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

	app.get('/webMenu/normalMenu', function(req, res){
		console.log("/webMenu/normMenu GET");
		/*req.session.destroy(function(err){
			console.log('Session Started');
		})*/
		res.render('webmenu/normalmenu.jade',
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

	app.get('/webMenu/contactsMenu', function(req, res){
		console.log("/webMenu/normMenu GET");
		/*req.session.destroy(function(err){
			console.log('Session Started');
		})*/
		res.render('webmenu/contactsmenu.jade',
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

	app.post('/webMenu/contactsMenu', function(req, res){
		console.log("/webMenu/normMenu POST");
		/*req.session.destroy(function(err){
			console.log('Session Started');
		})*/
		console.log('webmenu/contactsmenu.jade req.cookies.userId:' + req.cookies.userId);
		res.render('webmenu/contactsmenu.jade',
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

	app.post('/webMenu/genericMenu', function(req, res){
		console.log("/webMenu/genericMenu post");
		var options = 
			{
				userId:req.cookies.userId,
				deviceId:"815",//req.cookies.deviceId,
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				defaultUserImageUrl:configData.defaultUserImageUrl,
				defaultMemberImageUrl:configData.defaultMemberImageUrl,
				data:
					{
					},
				menuData:{}
			}
		options = extend(options, req.body);
		res.render('webmenu/genericmenu.jade', options);
	});


 //=== > AUTO MENU < ===================================================================


	app.get('/webMenu/automenu', function(req, res){
		console.log("/webMenu/automenu post");

		var menu_json = fs.readFileSync(path.dirname(require.main.filename) + '/public/json/menu.json', 'utf8');
		menu_json = JSON.parse(menu_json);

		var options = 
			{
				userId:req.cookies.userId,
				deviceId:"815",//req.cookies.deviceId,
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				defaultUserImageUrl:configData.defaultUserImageUrl,
				defaultMemberImageUrl:configData.defaultMemberImageUrl,
				data:
					{
					},
				menuData:{},
				isGet:true
			}
		options = extend(options, menu_json);
		res.render('webmenu/automenu.jade', options);
	});

	app.post('/webMenu/automenu', function(req, res){
		console.log("/webMenu/automenu");
		var menu_json = fs.readFileSync(path.dirname(require.main.filename) + '/public/json/menu.json', 'utf8');
		menu_json = JSON.parse(menu_json);
		var options = 
			{
				userId:req.cookies.userId,
				deviceId:"815",//req.cookies.deviceId,
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				defaultUserImageUrl:configData.defaultUserImageUrl,
				defaultMemberImageUrl:configData.defaultMemberImageUrl,
				data:
					{
					},
				menuData:{},
				isGet:false
			}
		//options = extend(options, req.body);
		options = extend(options, menu_json);
		res.render('webmenu/automenu.jade', options);
	});

	//==================================================================================


	app.get('/webMenu/jqm/automenu', function(req, res){
		console.log("/webMenu/jqm/automenu get");

		//var menu_json = fs.readFileSync(path.dirname(require.main.filename) + '/public/json/menu.json', 'utf8');
		//menu_json = JSON.parse(menu_json);

		var options = 
			{
				userId:req.cookies.userId,
				deviceId:"815",//req.cookies.deviceId,
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				defaultUserImageUrl:configData.defaultUserImageUrl,
				defaultMemberImageUrl:configData.defaultMemberImageUrl,
				data:
					{
					},
				//menuData:{},
				isGet:true
			}
		//options = extend(options, menu_json);
		res.render('webmenu/automenu.jqm.jade', options);
	});

	app.post('/webMenu/jqm/automenu', function(req, res){
		console.log("/webMenu/jqm/automenu post");
		//var menu_json = fs.readFileSync(path.dirname(require.main.filename) + '/public/json/menu.jqm.json', 'utf8');
		//menu_json = JSON.parse(menu_json);
		var options = 
			{
				userId:req.cookies.userId,
				deviceId:"815",//req.cookies.deviceId,
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				defaultUserImageUrl:configData.defaultUserImageUrl,
				defaultMemberImageUrl:configData.defaultMemberImageUrl,
				data:
					{
					},
				//menuData:{},
				isGet:false
			}
		//options = extend(options, req.body);
		//options = extend(options, menu_json);
		res.render('webmenu/automenu.jqm.jade', options);
	});

	app.get('/webMenu/jqm/contactsmenu_edit', function(req, res){
		console.log("/webMenu/jqm/contactsmenu_edit post");
		//var menu_json = fs.readFileSync(path.dirname(require.main.filename) + '/public/json/menu.jqm.json', 'utf8');
		//menu_json = JSON.parse(menu_json);
		var options = 
			{
				userId:req.cookies.userId,
				deviceId:"815",//req.cookies.deviceId,
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				defaultUserImageUrl:configData.defaultUserImageUrl,
				defaultMemberImageUrl:configData.defaultMemberImageUrl,
				data:
					{
					},
				//menuData:{},
				isGet:false
			}
		//options = extend(options, req.body);
		//options = extend(options, menu_json);
		res.render('webmenu/contactsmenu_edit.jqm.jade', options);
	});





}