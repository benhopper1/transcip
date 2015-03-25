var UserModel = require('../models/usermodel');
var userModel = new UserModel();
var path = require('path');
var basePath = path.dirname(require.main.filename);
var uuid = require(basePath + '/node_modules/node-uuid');
var url = require('url');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
configData = JSON.parse(configData);






module.exports.controller = function(app) {

	app.get('/user/widget_userForm', function(req, res){
		//if(userModel.verifySession(req,res)){
			res.render('users/widget_userform.jade',
				{
					//userId:req.session.userData.userId,
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
		/*}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactimport    YOUR NOT LOGED IN????");
		}*/
	});


	app.post('/user/widget_userForm', function(req, res){
		if(userModel.verifySession(req,res)){
			res.render('users/widget_userform.jade',req.body);
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactimport    YOUR NOT LOGED IN????");
		}
	});

	

	app.get('/user/mobileLogin', function(req, res){
		res.render('users/mobilelogin.jade',req.body);
	});

	app.post('/user/mobileLogin', function(req, res){
		userModel.verifyAndGetUserData(
			{
				userName:req.body.userName,
				password:req.body.password,
				onSuccess:function(inRecord){
					req.body.userId = inRecord.id;
					userModel.useOrCreateDeviceId(req.body, function(err, inJsonStruct){
						inRecord.validDeviceId = inJsonStruct.valid;
						inRecord.useDeviceId = inJsonStruct.useDeviceId;
						//=================================================
						//Security Setup 
						//=================================================
						userModel.createSession(req, 
							{
								userId:inRecord.id,
								userGuid:inRecord.userGuid,
								deviceId:inJsonStruct.useDeviceId,
								userGroup:inRecord.userGroup,
								status:inRecord.status,
							}
						);


						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify(
							{
								hadError:((err)? true : false),
								err:err,
								result:inRecord
							}
						));
					});

				},
				onFail:function(inErr){
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(
						{
							hadError:true,
							err:inErr,
							result:false
						}
					));
				}
			}
		);

	});


	app.get('/users/checkemail', function(req, res){
		res.render('users/checkemail.jade',req.body);
	});

	app.post('/users/checkemail', function(req, res){
		res.render('users/checkemail.jade',req.body);
	});

	app.post('/user/database/addUser', function(req, res){
		//if(userModel.verifySession(req,res)){
		//set activate code
			req.body.activateCode = uuid.v1();
			userModel.dbAddUserAccountDataToUserTable(req.body, function(err, result){
				//send activate email------
				if(!(err)){
					if(result){
						if(result.insertId){
							if(req.body.emailAddress && req.body.activateCode){
								console.log('sending email');
								userModel.sendMailActivateCode(req.body.emailAddress, req.body.activateCode, result.insertId);
								res.setHeader('Content-Type', 'application/json');
								res.end(JSON.stringify(
									{
										hadError:((err)? true : false),
										err:err,
										result:
											{
												newUserId:result.insertId
											}
									}
								));
								return;
							}
						}
					}
				}
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(
					{
						hadError:((err)? true : false),
						err:err,
						result:result
					}
				));
			});
		/*}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactimport    YOUR NOT LOGED IN????");
		}*/
	});

	app.get('/user/activateAccount', function(req, res){
		var queryObject = url.parse(req.url,true).query;
		//if(userModel.verifySession(req,res)){
			userModel.activateUserAccount(queryObject, function(err, result){
				if(!(err)){
					res.render('users/checkaccount.jade',
						{
							data:
								{
									activated:true
								}
						}
					);
				}else{
					res.render('users/checkaccount.jade',
						{
							activated:false
						}
					);
				}
			});
		//}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
		//	console.log("/jqm/contactimport    YOUR NOT LOGED IN????");
		//}

	});

	app.get('/user/checkemail', function(req, res){
		var queryObject = url.parse(req.url,true).query;
		console.dir(queryObject);
		console.log("enableAccount");
		res.render('users/checkemail.jade',
			{
				data:
					{
						activated:true
					}
			}
		);
	});


	app.get('/user/userNameExist', function(req, res){
		var queryObject = url.parse(req.url,true).query;
		if(queryObject){
			if(queryObject.userName){
				userModel.userNameExist(queryObject.userName,function(err, result){
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(
						{
							hadError:((err)? true : false),
							err:err,
							result:result
						}
					));
				});
				return;
			}
		}

		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(
				{
					hadError:true,
					err:"ERROR BAD QUERY STRING",
					result:{}
				}
		));
	});

	app.post('/user/userNameExist', function(req, res){
		if(req.body){
			if(req.body.userName){
				userModel.userNameExist(req.body.userName,function(err, result){
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(
						{
							hadError:((err)? true : false),
							err:err,
							result:result
						}
					));
				});
				return;
			}
		}

		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(
			{
				hadError:true,
				err:"ERROR no User Name or BAD body in header!!",
				result:{}
			}
		));
	});

//REPLACE 3/24/2015 with product checking routing
/*
	app.get('/jqm/userprofile', function(req, res){
		if(userModel.verifySession(req,res)){
			userModel.getUserById({userId:req.session.userData.userId}, function(err, result){
				res.render('users/userprofile.jqm.jade',
					{
						userId:req.session.userData.userId,
						deviceId:"815",
						URL:configData.domain.address + ":" + configData.domain.port,
						androidAppRoute:configData.androidAppRoute,
						webSocketClient:configData.webSocketClient,
						defaultUserImageUrl:configData.defaultUserImageUrl,
						defaultMemberImageUrl:configData.defaultMemberImageUrl,
						data:result[0],
					}
				);
			});

		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactmangaer    YOUR NOT LOGED IN????");
		}
	});

*/
	//3/24/15 REPLACMENT
	app.get('/jqm/userprofile', function(req, res){
		if(userModel.verifySession(req,res)){
			req.body['userId'] = req.session.userData.userId;
			global.getUserOwnedProducts(req.session.userData.userId, function(inOwnedProductIdArray, inHash){
				global.reportNotify('/jqm/userprofile A0', 
					{
						inOwnedProductIdArray:inOwnedProductIdArray,
						userId:req.session.userData.userId,
					}, 0
				);

				if(!(global.PRODUCT_BLOCK_ENABLED) || global.isProductsAuthForRoute('/jqm/userprofile', inOwnedProductIdArray)){
					global.reportNotify('/jqm/userprofile A1', 
						{
							if_:true,
						}, 0
					);
					userModel.getUserById({userId:req.session.userData.userId}, function(err, result){
						res.render('users/userprofile.jqm.jade',
							{
								userId:req.session.userData.userId,
								deviceId:"815",
								URL:configData.domain.address + ":" + configData.domain.port,
								androidAppRoute:configData.androidAppRoute,
								webSocketClient:configData.webSocketClient,
								defaultUserImageUrl:configData.defaultUserImageUrl,
								defaultMemberImageUrl:configData.defaultMemberImageUrl,
								data:result[0],
							}
						);
					});
				}else{
					//you do not own the proper products
					res.render('products/nosubscription.jqm.jade',
						{
							resetPageName:'userProfile',
						}
					);
				}
			});//end getUserOwnedProducts

		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactmangaer    YOUR NOT LOGED IN????");
		}
	});







	app.post('/database/updateUser', function(req, res){
		if(userModel.verifySession(req,res)){
			req.body['userId'] = req.session.userData.userId;
			userModel.updateUser(req.body, function(err, result){
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(
					{
						hadError:((err)? true : false),
						err:err,
						result:result
					}
				));
			});
			res.setHeader('Content-Type', 'application/json');
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactmangaer    YOUR NOT LOGED IN????");
		}
	});

	app.post('/database/deleteAllForUser', function(req, res){
		if(userModel.verifySession(req,res)){
			req.body['userId'] = req.session.userData.userId;
			userModel.deleteAllForUser(req.body, function(err, result){
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(
					{
						hadError:((err)? true : false),
						err:err,
						result:result
					}
				));
			});
			res.setHeader('Content-Type', 'application/json');
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactmangaer    YOUR NOT LOGED IN????");
		}
	});


	app.post('/user/userStartUp', function(req, res){
		//var queryObject = url.parse(req.url,true).query;
		//console.dir(queryObject);
		//console.log("enableAccount");
		userModel.userStartUp(888, function(err, inResult){
			console.log('userModel.userStartUp COMPLETE');
		});
		res.end();
	});


}