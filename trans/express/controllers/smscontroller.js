var path = require('path');
var fs = require('fs');
var basePath = path.dirname(require.main.filename);
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
configData = JSON.parse(configData);

module.exports.controller = function(app){
	var UserModel = require(basePath + '/models/usermodel');
	var userModel = new UserModel();
// REPLACE WITH PRODUCT THINGY 3/25/15
/*
	app.get('/jqm/smsManager', function(req, res){
		if(userModel.verifySession(req,res)){
			res.render('sms/smsmanager.jqm.jade',
				{
					userId:req.session.userData.userId,
					deviceId:"815",
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
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/smsManager    YOUR NOT LOGED IN????");
		}
	});
*/

	app.get('/jqm/smsManager', function(req, res){
		if(userModel.verifySession(req,res)){
			global.getUserOwnedProducts(req.session.userData.userId, function(inOwnedProductIdArray, inHash){
				global.reportNotify('/jqm/smsManager A0', 
					{
						inOwnedProductIdArray:inOwnedProductIdArray,
						userId:req.session.userData.userId,
					}, 0
				);

				if(!(global.PRODUCT_BLOCK_ENABLED) || global.isProductsAuthForRoute('/jqm/smsManager', inOwnedProductIdArray)){
					global.reportNotify('/jqm/smsManager A1', 
						{
							if_:true,
						}, 0
					);
					res.render('sms/smsmanager.jqm.jade',
						{
							userId:req.session.userData.userId,
							deviceId:"815",
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
					//you do not own the proper products
					res.render('products/nosubscription.jqm.jade',
						{
							resetPageName:'smsManager',
						}
					);
				}
			});//end getUserOwnedProducts

		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/smsManager    YOUR NOT LOGED IN????");
		}
	});


	app.get('/jqm/contactselectpopup', function(req, res){
		if(userModel.verifySession(req,res)){
			res.render('sms/contactselectpopup.jqm.jade',
				{
					userId:req.session.userData.userId,
					deviceId:"815",
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
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactselectpopup    YOUR NOT LOGED IN????");
		}
	});

	app.get('/entity_smsmessage', function(req, res){
		if(userModel.verifySession(req,res)){
			res.render('sms/entity_smsmessage.jade',
				{
					sms:
						{
							imagePath:"public/images/characters/face1.jpg",
							threadId:"37",
							name:"Ben hopp22",
							dateStamp:"1415849143563",
							phoneNumber:"12564662496",
							messageBody:"the msg body how is life because this is just a test boy!!!"
						}
				}
			);
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactselectpopup    YOUR NOT LOGED IN????");
		}
	});

	app.post('/entity_smsmessage', function(req, res){
		if(userModel.verifySession(req,res)){
			res.render('sms/entity_smsmessage.jade',req.body);
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactselectpopup    YOUR NOT LOGED IN????");
		}
	});






//------------------------------------------------------------
	app.get('/widget_smsMessageWindow', function(req, res){
		res.render('sms/widget_smsmessagewindow.jade',req.body);
	});




	//###########################################################################
	//----------------- > D a t a b a s e   I n t e r f a c e < -----------------
	//###########################################################################
	var SmsModel = require('../models/smsmodel.js');
	var smsModel = new SmsModel();

	app.post('/database/sms/addManySms', function(req, res){
		if(userModel.verifySession(req,res)){
			req.body['userId'] = req.session.userData.userId;
			smsModel.addManySms(req.body, function(err, result){
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(
					{
					}
				));
			});
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactselectpopup    YOUR NOT LOGED IN????");
		}
	});

	app.post('/database/sms/getSmsLastId', function(req, res){
		if(userModel.verifySession(req,res)){
			req.body['userId'] = req.session.userData.userId;
			smsModel.getSmsLastId(req.body, function(err, result){
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(
					{
						hadError:((err)? true : false),
						err:err,
						result:result
					}
				));
			});
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactselectpopup    YOUR NOT LOGED IN????");
		}
	});

	app.post('/database/sms/getAllSmsByPhone', function(req, res){
		if(userModel.verifySession(req,res)){
			req.body['userId'] = req.session.userData.userId;
			smsModel.getAllSmsByPhone(req.body, function(err, result){
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(
					{
						hadError:((err)? true : false),
						err:err,
						result:result
					}
				));
			});
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactselectpopup    YOUR NOT LOGED IN????");
		}
	});

	app.post('/database/sms/getMissingSmsByPhone', function(req, res){
		if(userModel.verifySession(req,res)){
			req.body['userId'] = req.session.userData.userId;
			smsModel.getMissingSmsByPhone(req.body, function(err, result){
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(
					{
						hadError:((err)? true : false),
						err:err,
						result:result
					}
				));
			});
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactselectpopup    YOUR NOT LOGED IN????");
		}
	});

}