var path = require('path');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
configData = JSON.parse(configData);
var UserModel = require('../models/usermodel');
var userModel = new UserModel();
var basePath = path.dirname(require.main.filename);
var url = require('url');

module.exports.controller = function(app){
	app.get('/angtestSession', function(req, res){
		console.dir(req.session);
		req.session.user = 
			{
				test0:'test0value',
				test1:'test1value',
			}
		res.end();
	});

	app.get('/angtest', function(req, res){
		console.log("/angtest");
		console.log('session');
		console.dir(req.session);
		/*req.session.user = 
			{
				test0:'test0value',
				test1:'test1value',
			}
		;*/
		//if(userModel.verifySession(req,res)){
			global.reportNotify('tt0', 
				{
					name:'nnnnn',
					//req:req,
					//res:res,
				}, 0
			);
			res.render('angtest/angtest.jade',
				{
					//body:req.body,
					products:req.session.products,
					test:'ben'
				}
			);
/*			
			//if(req.session.products.subscriptions['arfsync.v001.subscription.month'].active == true){
				global.reportNotify('tt1', 
					{
						name:'nnnnn',
					}, 0
				);

				res.locals.user = 'billy';
				res.render('angtest/angtest.jade',
					{
						body:req.body,
						//products:req.session.products,
						test:'ben'
					}
				);
			//}else{
				global.reportNotify('tt2', 
					{
						name:'nnnnn',
					}, 0
				);

				res.render('products/nosubscription.jqm.jade');
			//}*/
		//}//end if userModel
	});

	app.post('/angtest', function(req, res){
		console.log("/angtest POST");
		res.render('angtest/angtest.jade',{});
	});

	var counter = 0;
	app.post('/testrest', function(req, res){
		console.log("/testrest post");
		console.dir(req.body);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(
			{
				testKey:'testValue', 
				newName:req.body.contactName,
				body:req.body
			}
		));
	});


	app.get('/testrest', function(req, res){
		var ProductModel = require(basePath + '/models/productmodel');
		var productModel = new ProductModel();

		console.log("/testrest get");
		//productModel.getOwnedProductsInformationForUser({userId:389}, function(err, result){
		global.getUserOwnedProducts(389, function(inArray, inHash){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					array:inArray,
					hash:inHash,
				}
			));
		});
		/*res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(
			{
				testKey:'testValue',
				body:req.body
			}
		));*/
		//res.end(JSON.stringify({testKey:'testValue',}));
	});

	app.get('/getFiles', function(req, res){
		console.log("/getFiles get");
		console.log('req.query' + req.query);
		console.dir(req.query);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(

				[
					{
						type:'file',
						dir:'someDir2',
						file:'someFile0.txt',
						ext:'.txt'
					},
					{
						type:'dir',
						dir:'someDir2',
						file:'directoryName',
						ext:''
					}
				]

		));
	});


	app.get('/angtest2', function(req, res){
		console.log("/angtest2");
		console.log('session');
		console.dir(req.session);

		var url_parts = url.parse(req.url, false, false);

		var reloadUrl;
		if(req.protocol == 'http'){
			reloadUrl = global.cipServerData.domain.address + ':' + global.cipServerData.domain.port + url_parts.pathname;
		}
		if(req.protocol == 'https'){
			reloadUrl = global.cipServerData.secureDomain.address + ':' + global.cipServerData.secureDomain.port + url_parts.pathname;
		}

		global.reportNotify('tt0', 
			{
				name:'nnnnn',
				req:req.body,
				//res:res,
			}, 0
		);
		res.render('angtest/angtest2.jade',
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
					},
				useMini:configData.useMini,
			}
		);
	});

	app.get('/angtest3', function(req, res){
		console.log("/angtest2");
		console.log('session');
		console.dir(req.session);

		var url_parts = url.parse(req.url, false, false);

		var reloadUrl;
		if(req.protocol == 'http'){
			reloadUrl = global.cipServerData.domain.address + ':' + global.cipServerData.domain.port + url_parts.pathname;
		}
		if(req.protocol == 'https'){
			reloadUrl = global.cipServerData.secureDomain.address + ':' + global.cipServerData.secureDomain.port + url_parts.pathname;
		}

		global.reportNotify('tt0', 
			{
				name:'nnnnn',
				req:req.body,
				//res:res,
			}, 0
		);
		res.render('angtest/angtest3.jade',
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
					},
				useMini:configData.useMini,
			}
		);
	});

	app.post('/angtest3', function(req, res){
		console.log("/angtest2");
		console.log('session');
		console.dir(req.session);

		var url_parts = url.parse(req.url, false, false);

		var reloadUrl;
		if(req.protocol == 'http'){
			reloadUrl = global.cipServerData.domain.address + ':' + global.cipServerData.domain.port + url_parts.pathname;
		}
		if(req.protocol == 'https'){
			reloadUrl = global.cipServerData.secureDomain.address + ':' + global.cipServerData.secureDomain.port + url_parts.pathname;
		}

		global.reportNotify('tt0', 
			{
				name:'nnnnn',
				req:req.body,
				//res:res,
			}, 0
		);
		res.render('angtest/angtest3.jade',
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
					},
				useMini:configData.useMini,
			}
		);
	});

}