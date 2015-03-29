var path = require('path');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
configData = JSON.parse(configData);
var basePath = path.dirname(require.main.filename);
var extend = require(basePath + '/node_modules/node.extend');



module.exports.controller = function(app){

	var UserModel = require(basePath + '/models/usermodel');
	var userModel = new UserModel();

	app.get('/widget_contactscollection', function(req, res){
		console.log("/widget_contactscollection get");
		res.render('contacts/widget_contactscollection.jade',
			{

			}
		);
	});

	app.post('/widget_contactscollection', function(req, res){
		console.log("/widget_contactscollection post");
		res.render('contacts/widget_contactscollection.jade',req.body);
	});

// replacing 03/25/15 with app product stuff
/*
	app.get('/jqm/contactmanager', function(req, res){
		if(userModel.verifySession(req,res)){
			console.log("/jqm/contactmangaer");
			res.render('contacts/contactmanager.jqm.jade',
				{
					userId:req.session.userData.userId,
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
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactmangaer    YOUR NOT LOGED IN????");
			/*res.render('contacts/widget_contactscollection.jade',
				{

				}
			);
		}
	});
*/

	app.get('/jqm/contactmanager', function(req, res){
		if(userModel.verifySession(req,res)){

			global.getUserOwnedProducts(req.session.userData.userId, function(inOwnedProductIdArray, inHash){
				global.reportNotify('/jqm/contactmanager A0', 
					{
						inOwnedProductIdArray:inOwnedProductIdArray,
						userId:req.session.userData.userId,
					}, 0
				);

				if(!(global.PRODUCT_BLOCK_ENABLED) || global.isProductsAuthForRoute('/jqm/contactmanager', inOwnedProductIdArray)){
					global.reportNotify('/jqm/contactmanager A1', 
						{
							if_:true,
						}, 0
					);
					console.log("/jqm/contactmangaer");
					res.render('contacts/contactmanager.jqm.jade',
						{
							userId:req.session.userData.userId,
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
					//you do not own the proper products
					var uuid = require(basePath + '/node_modules/node-uuid');
					global.getSpecificProductInformation(
						{
							productIds:global.productHashOfArray.getArrayFromHash('/jqm/contactmanager'),
						}, 

						function(inRequiredProductsInfoHash){
							res.render('products/nosubscription.jqm.jade',
								{
									resetPageName:'contactManager',
									myProducts:inOwnedProductIdArray,
									requiredProducts:inRequiredProductsInfoHash,
									uuid:uuid.v1(),
								}
							);
						}
					);
				}
			});//end getUserOwnedProducts

		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactmangaer    YOUR NOT LOGED IN????");
			/*res.render('contacts/widget_contactscollection.jade',
				{

				}
			);*/
		}
	});

	app.get('/jqm/contactexport', function(req, res){
		if(userModel.verifySession(req,res)){
			console.log("/jqm/contactexport");
			res.render('contacts/contactexport.jqm.jade',
				{
					userId:req.session.userData.userId,
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
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactmangaer    YOUR NOT LOGED IN????");
			/*res.render('contacts/widget_contactscollection.jade',
				{

				}
			);*/
		}
	});

	app.get('/jqm/contactimport', function(req, res){

		//if(req.session.userData.userId){
		if(userModel.verifySession(req,res)){
			console.log("/jqm/contactimport");
			res.render('contacts/contactimport.jqm.jade',
				{//userId:req.cookies.userId,
					userId:req.session.userData.userId,
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
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactimport    YOUR NOT LOGED IN????");
		}
	});

	app.get('/jqm/contactedit', function(req, res){
		if(userModel.verifySession(req,res)){
			console.log("/jqm/contactedit");
			res.render('contacts/contactedit.jqm.jade',
				{
					userId:req.session.userData.userId,
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
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactedit    YOUR NOT LOGED IN????");
			/*res.render('contacts/widget_contactscollection.jade',
				{

				}
			);*/
		}
	});



	app.get('/widget_contactsform', function(req, res){
		console.log("/widget_contactsform post");
		res.render('contacts/widget_contactsform.jade',{});
	});

	app.post('/widget_contactsform', function(req, res){
		console.log("/widget_contactsform post");
		res.render('contacts/widget_contactsform.jade',req.body);
	});


	app.post('/contacts/jqm/widget_contacts_slider', function(req, res){
		console.log('----------------------POST--------------------');
		console.log('/slider post');
		var options =
			{
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				defaultUserImageUrl:configData.defaultUserImageUrl,
				defaultMemberImageUrl:configData.defaultMemberImageUrl,
				startPlay:false,
				data:
					{
					},
				sliderSize:
					{
						width:600
					},
				sliderDivs:
					[
						'<div><a u=image href="#"><img src="/public/images/ads/main_000.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/images/ads/main_002.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/01.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/images/ads/main_002.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/02.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/03.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/04.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/05.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/images/ads/main_000.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/06.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/07.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/08.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/10.jpg"></img></a></div>'
					]
			}
		options = extend(options, req.body);
		res.render('contacts/widget_contacts_slider.jqm.jade', options);
	});



	//mobile version----------
	app.post('/contacts/mobile/widget_contacts_slider', function(req, res){
		console.log('----------------------POST--------------------');
		console.log('/slider post');
		var options =
			{
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				defaultUserImageUrl:configData.defaultUserImageUrl,
				defaultMemberImageUrl:configData.defaultMemberImageUrl,
				startPlay:false,
				data:
					{
					},
				sliderSize:
					{
						width:600
					},
				sliderDivs:
					[
						'<div><a u=image href="#"><img src="/public/images/ads/main_000.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/images/ads/main_002.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/01.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/images/ads/main_002.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/02.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/03.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/04.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/05.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/images/ads/main_000.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/06.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/07.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/08.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/10.jpg"></img></a></div>'
					]
			}
		options = extend(options, req.body);
		res.render('contacts/mobile_slider_version.jade', options);
	});

	app.post('/contacts/widget_contacts_slider', function(req, res){
		console.log('----------------------POST--------------------');
		console.log('/slider post');
		var options =
			{
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				defaultUserImageUrl:configData.defaultUserImageUrl,
				defaultMemberImageUrl:configData.defaultMemberImageUrl,
				startPlay:false,
				data:
					{
					},
				sliderSize:
					{
						width:600
					},
				sliderDivs:
					[
						'<div><a u=image href="#"><img src="/public/images/ads/main_000.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/images/ads/main_002.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/01.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/images/ads/main_002.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/02.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/03.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/04.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/05.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/images/ads/main_000.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/06.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/07.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/08.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/10.jpg"></img></a></div>'
					]
			}
		options = extend(options, req.body);
		res.render('contacts/widget_contacts_slider.jade', options);
	});

	app.get('/contacts/widget_contacts_slider', function(req, res){
		console.log('----------------------GET--------------------');
		console.log('/slider GET');
		var options =
			{
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				defaultUserImageUrl:configData.defaultUserImageUrl,
				defaultMemberImageUrl:configData.defaultMemberImageUrl,
				data:
					{
					},
				sliderSize:
					{
						width:600
					},
				sliderDivs:
					[
						'<div><a u=image href="#"><img src="/public/images/ads/main_000.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/images/ads/main_002.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/01.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/images/ads/main_002.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/02.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/03.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/04.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/05.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/images/ads/main_000.png"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/06.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/07.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/08.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/10.jpg"></img></a></div>'
					]
			}
		options = extend(options, req.body);
		res.render('contacts/widget_contacts_slider.jade', options);
	});


//###########################################################################
//----------------- > D a t a b a s e   I n t e r f a c e < -----------------
//###########################################################################
	var ContactModel = require('../models/contactmodel.js');
	var contactModel = new ContactModel();
	app.post('/database/addContact', function(req, res){
		console.log("/database/addContact post");
		//res.render('contacts/addcontact.jade',req.body);
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId;
		contactModel.addContact(req.body, function(err, result){
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
	});

	app.post('/database/getContacts', function(req, res){
		console.log("/database/getContacts post");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId;
		contactModel.getContacts(req.body, function(err, rows, fields){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					hadError:((err)? true : false),
					rows:rows,
					fields:fields
				}
			));
		});
		res.setHeader('Content-Type', 'application/json');
	});

	app.post('/database/editContact', function(req, res){
		console.log("/database/editContact post");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId;
		contactModel.editContact(req.body, function(err, rows, fields){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					hadError:((err)? true : false)
				}
			));
		});
		res.setHeader('Content-Type', 'application/json');
	});

	app.post('/database/deleteContact', function(req, res){
		console.log("/database/deleteContact post");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId;

		contactModel.deleteContact(req.body, function(err, rows, fields){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					hadError:((err)? true : false),
					err:err
				}
			));
		});
	});





	/*app.get('/getContactsRecords', function(req, res){
		console.log("/getContactsRecords get");
		console.log('queryString:');
		console.dir(req.query);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(
			{
				rows:
					[
						{
							imagePath:"public/images/characters/face1.jpg",
							contactName:"Ben Hopper0",
							contactNumber:"1-256-111-1110",
							emailAddress:"hopperdevelopment@gmail.com"
						},

						{
							imagePath:"public/images/characters/face2.jpg",
							contactName:"Ben Hopper1",
							contactNumber:"12564662496"
						},

						{
							imagePath:"public/images/characters/face3.jpg",
							contactName:"Ben Hopper2",
							contactNumber:"1-256-111-1112"
						}

					]
			}
		));
	});
*/

	app.post('/database/getContactsForCombo', function(req, res){
		console.log("/database/getContacts post");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId;
		contactModel.getContacts(req.body, function(err, rows, fields){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(rows));
		});
		res.setHeader('Content-Type', 'application/json');
	});

	app.post('/database/getUserData', function(req, res){
		console.log("/database/getUserData post");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId;
		contactModel.getUserData(req.body, function(err, rows, fields){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					hadError:((err)? true : false),
					rows:rows,
					fields:fields
				}
			));
		});
		res.setHeader('Content-Type', 'application/json');
	});







	app.post('/contacts/v002/widget_contacts_slider', function(req, res){
		console.log('----------------------POST--------------------');
		console.log('/slider post  v002');
		var options =
			{
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				defaultUserImageUrl:configData.defaultUserImageUrl,
				defaultMemberImageUrl:configData.defaultMemberImageUrl,
				startPlay:false,
				autoPlaySlides:false,
				data:
					{
					},
				sliderSize:
					{
						width:600
					},
				sliderDivs:
					[
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/01.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/02.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/03.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/04.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/05.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/06.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/07.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/08.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/10.jpg"></img></a></div>'
					]
			}
		options = extend(options, req.body);
		res.render('contacts/v002/widget_contacts_slider.jade', options);
	});

	app.get('/contacts/v002/widget_contacts_slider', function(req, res){
		console.log('----------------------POST--------------------');
		console.log('/slider post  v002');
		var options =
			{
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				defaultUserImageUrl:configData.defaultUserImageUrl,
				defaultMemberImageUrl:configData.defaultMemberImageUrl,
				startPlay:false,
				autoPlaySlides:false,
				data:
					{
					},
				sliderSize:
					{
						width:600
					},
				sliderDivs:
					[
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/01.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/02.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/03.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/04.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/05.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/06.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/07.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/08.jpg"></img></a></div>',
						'<div><a u=image href="#"><img src="/public/js/slider/img/landscape/10.jpg"></img></a></div>'
					]
			}
		options = extend(options, req.body);
		res.render('contacts/v002/widget_contacts_slider.jade', options);
	});







}