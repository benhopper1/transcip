var UserModel = require('../models/usermodel');
var userModel = new UserModel();
var path = require('path');
var basePath = path.dirname(require.main.filename);
var uuid = require(basePath + '/node_modules/node-uuid');
var url = require('url');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
configData = JSON.parse(configData);






module.exports.controller = function(app){
	//updateProducts
	var ProductModel = require('../models/productmodel');
	var productModel = new ProductModel();



	//======================================================================
	// SESSION -------------------------------------------------------------
	//======================================================================
	app.post('/products/updateProductsSession', function(req, res){
		if(userModel.verifySession(req,res)){
			productModel.updateProductsSession(req,res,{zz:'xxx'});
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					data:req.session,
				}
			));
		}
	});

	app.get('/products/nosubscription', function(req, res){
		res.render('products/nosubscription.jqm.jade');
	});

	app.get('/products/needToOwnProduct', function(req, res){
		res.render('products/nosubscription.jqm.jade');
	});

	app.post('/products/updateProducts', function(req, res){
		console.log('PRODUCTS updateProducts POST');

		if(userModel.verifySession(req,res)){
			global.reportNotify('POST /products/updateProducts', 
				{
					inputData:req.body,
				}, 0
			);
			req.body['userId'] = req.session.userData.userId;
			//console.log('updateProducts ----------------------------------------------');
			//console.dir(req.body);

			productModel.updateOrAddProductsAndPurchases(req.body, function(err, result){
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(
					{
						hadError:((err)? true : false),
						err:err,
						result:result
					}
				));
			});

			/*var err = false;
			var result = {result:'good'}

			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					hadError:((err)? true : false),
					err:err,
					result:result
				}

			));*/
			

		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/products/updateProducts    YOUR NOT LOGED IN????");
		}
	});

	app.post('/products/getShowCaseProducts', function(req, res){
		productModel.getShowCaseProducts(req.body, function(err, result){
			var filteredRecords = [];
			for(var resultIndex in result){
				filteredRecords.push(
					{
						productId:result[resultIndex].productId,
						productType:result[resultIndex].productType,
					}
				);
			}
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					hadError:((err)? true : false),
					err:err,
					result:filteredRecords
				}
			));
		});
	});

	app.post('/products/products', function(req, res){
		console.log('req.body');
		console.dir(req.body);
		console.log('PRODUCTS POST');
		//if(userModel.verifySession(req,res)){
		req.body['userId'] = -1 //req.session.userData.userId;
		req.body['zzw'] = 776;
		productModel.getShowCaseProducts(req.body, function(err, result){
			console.log('RESULT');
			console.dir(result);
			console.log('---check---');
			console.dir(req.body);
			res.render('products/products.jqm.jade',
				{
					userId:-1, //req.session.userData.userId,
					deviceId:"815",
					URL:configData.domain.address + ":" + configData.domain.port,
					androidAppRoute:configData.androidAppRoute,
					webSocketClient:configData.webSocketClient,
					defaultUserImageUrl:configData.defaultUserImageUrl,
					defaultMemberImageUrl:configData.defaultMemberImageUrl,
					//take this out later for testing now
					fromAndroid:req.body,
					XXA:'test3',
					showCaseProducts:result,
					//body:req.body,
					//test:req.body['test'],
				}
			);
		});
		/*}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactmangaer    YOUR NOT LOGED IN????");
		}*/
	});

	app.get('/products/products', function(req, res){
		console.log('req.body');
		console.dir(req.body);
		console.log('PRODUCTS POST');
		//if(userModel.verifySession(req,res)){
		req.body['userId'] = -1;
		req.body['zzw'] = 776;
		productModel.getShowCaseProducts(req.body, function(err, result){
			console.log('RESULT');
			console.dir(result);
			console.log('---check---');
			console.dir(req.body);
			res.render('products/products.jqm.jade',
				{
					userId:-1,//req.session.userData.userId,
					deviceId:"815",
					URL:configData.domain.address + ":" + configData.domain.port,
					androidAppRoute:configData.androidAppRoute,
					webSocketClient:configData.webSocketClient,
					defaultUserImageUrl:configData.defaultUserImageUrl,
					defaultMemberImageUrl:configData.defaultMemberImageUrl,
					//take this out later for testing now
					fromAndroid:req.body,
					XXA:'test3',
					showCaseProducts:result,
					//body:req.body,
					//test:req.body['test'],
				}
			);
		});
		/*}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactmangaer    YOUR NOT LOGED IN????");
		}*/
	});













}