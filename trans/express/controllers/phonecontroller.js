var path = require('path');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
configData = JSON.parse(configData);
var basePath = path.dirname(require.main.filename);

module.exports.controller = function(app){

	var UserModel = require(basePath + '/models/usermodel');
	var userModel = new UserModel();

	app.post('/widget_phoneContacts', function(req, res){
		console.log("/widget_phoneContacts post");
		console.dir(req.body);
		if(userModel.verifySession(req,res)){
			res.render('phone/widget_phoneContacts.jade',req.body);
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactimport    YOUR NOT LOGED IN????");
		}
	});

	app.get('/widget_phoneContacts', function(req, res){
		console.log("/widget_phoneContacts get ");
		//console.dir(req.body);
		res.render('phone/widget_phoneContacts.jade',{data:'dataValue'});
	});

	app.get('/widget_keypad', function(req, res){
		console.log("/widget_keypad get ");
		if(userModel.verifySession(req,res)){
			res.render('phone/widget_keypad.jade',{data:'dataValue'});
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactimport    YOUR NOT LOGED IN????");
		}
	});





	app.get('/phone/widget_phoneWindow', function(req, res){
		console.log("/phone/widget_phoneWindow get ");
		if(userModel.verifySession(req,res)){
			res.render('phone/widget_phonewindow.jade',
				{
					userId:req.session.userData.userId,
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
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactimport    YOUR NOT LOGED IN????");
		}
	});


	app.get('/phone/widget_phonePropertyGrid', function(req, res){
		console.log("/phone/widget_phonePropertyGrid get ");
		if(userModel.verifySession(req,res)){
			res.render('phone/widget_phonepropertygrid.jade',
				{
					userId:req.session.userData.userId,
					deviceId:"815",//req.cookies.deviceId,
					URL:configData.domain.address + ":" + configData.domain.port,
					webSocketClient:configData.webSocketClient,
					defaultUserImageUrl:configData.defaultUserImageUrl,
					defaultMemberImageUrl:configData.defaultMemberImageUrl,
					data:req.query
				}
			);
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactimport    YOUR NOT LOGED IN????");
		}
	});

	app.post('/phone/json/controllgrid', function(req, res){
		console.log("/widget_phoneWindow post");
		console.dir(req.query);


		//res.setHeader('Content-Type', 'application/json');
		res.json(
			[{
					"id":1,
					"text":"hopper1"
				},{
					"id":2,
					"text":"text2"
				},{
					"id":3,
					"text":"text3",
					"selected":true
				},{
					"id":4,
					"text":"text4"
				},{
					"id":5,
					"text":"text5"
			}]
		);
	});




	app.post('/phone/widget_phoneWindow', function(req, res){
		console.log("/widget_phoneWindow post");
		/*
		console.dir(req.body);
		res.render('phone/widget_phoneContacts.jade',req.body);*/
	});

	app.get('/phone/widget_documentReport', function(req, res){
		console.log("/phone/widget_documentReport get ");
		if(userModel.verifySession(req,res)){
			res.render('document/widget_document.jade',
				{
					userId:req.session.userData.userId,
					deviceId:"815",//req.cookies.deviceId,
					URL:configData.domain.address + ":" + configData.domain.port,
					webSocketClient:configData.webSocketClient,
					defaultUserImageUrl:configData.defaultUserImageUrl,
					defaultMemberImageUrl:configData.defaultMemberImageUrl,
					data:req.query
				}
			);
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactimport    YOUR NOT LOGED IN????");
		}
	});

	app.post('/phone/widget_documentReport', function(req, res){
		console.log("/phone/widget_documentReport get ");
		if(userModel.verifySession(req,res)){
			res.render('document/widget_document.jade',
				{
					userId:req.session.userData.userId,
					deviceId:"815",//req.cookies.deviceId,
					URL:configData.domain.address + ":" + configData.domain.port,
					webSocketClient:configData.webSocketClient,
					defaultUserImageUrl:configData.defaultUserImageUrl,
					defaultMemberImageUrl:configData.defaultMemberImageUrl,
					data:req.body
				}
			);
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/jqm/contactimport    YOUR NOT LOGED IN????");
		}
	});


	//###########################################################################
	//----------------- > D a t a b a s e   I n t e r f a c e < -----------------
	//###########################################################################
	var PhoneLogModel = require('../models/phonelogmodel.js');
	var phoneLogModel = new PhoneLogModel();

	app.post('/database/phonelog/addManyPhoneLog', function(req, res){
		console.log("/database/phonelog/addManyPhoneLog post");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId; //parseInt(req.session.userData.userId);
		phoneLogModel.addManyPhoneLog(req.body, function(err, result){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					/*hadError:((err)? true : false),
					err:err,
					result:result*/
				}
			));
		});
		//res.setHeader('Content-Type', 'application/json');
	});

	app.post('/database/phonelog/getUPhoneNumbers', function(req, res){
		console.log("/database/phonelog/getUPhoneNumbers");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId;
		phoneLogModel.getUPhoneNumbers(req.body, function(err, result){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					hadError:((err)? true : false),
					err:err,
					result:result
				}
			));
		});

	});
	
	app.post('/database/phonelog/getPhoneLogLastId', function(req, res){
		console.log("/database/phonelog/getPhoneLogLastId");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId;
		phoneLogModel.getPhoneLogLastId(req.body, function(err, result){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					hadError:((err)? true : false),
					err:err,
					result:result
				}
			));
		});

	});

	// optional phoneNumber, if none then returns any phoneNumber's data
	app.post('/database/phonelog/getLast', function(req, res){
		console.log("/database/phonelog/getLast");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId; 
		phoneLogModel.getLast(req.body, function(err, result){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					hadError:((err)? true : false),
					err:err,
					result:result
				}
			));
		});

	});

	app.post('/database/phonelog/getLastForDataGrid', function(req, res){
		console.log("/database/phonelog/getLast");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		console.log('body:');
		console.dir(req.body);
		req.body['userId'] = req.session.userData.userId; 
		phoneLogModel.getLast(req.body, function(err, result){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result));
		});

	});

	app.post('/database/phonelog/addNote', function(req, res){
		console.log("/database/phonelog/addNote");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		console.log('body:');
		console.dir(req.body);
		req.body['userId'] = req.session.userData.userId; 
		phoneLogModel.phoneNotesAddNote(req.body, function(err, result){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result));
		});
	});

	app.get('/phone/widget_phoneDocumentView', function(req, res){
		console.log("/phone/widget_phoneDocumentView get");
		res.render('phone/widget_phonedocumentview.jade',
			{
				userId:req.session.userData.userId,
				deviceId:"815",//req.cookies.deviceId,
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				defaultUserImageUrl:configData.defaultUserImageUrl,
				defaultMemberImageUrl:configData.defaultMemberImageUrl,
				data:req.query
			}
		);
	});

	app.post('/database/phoneNotes/getUDates', function(req, res){
		console.log("/database/phoneNotes/getUDates");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		console.log('body:');
		console.dir(req.body);
		req.body['userId'] = req.session.userData.userId; 
		phoneLogModel.phonesNotesGetUDates(req.body, function(err, result){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result));
		});
	});

	app.post('/database/phoneNotes/phonesDocumentsAndNotesGet', function(req, res){
		console.log("/database/phoneNotes/phonesDocumentsAndNotesGet");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		console.log('body:');
		console.dir(req.body);
		req.body['userId'] = req.session.userData.userId; 
		phoneLogModel.phonesDocumentsAndNotesGet(req.body, function(err, result){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result));
		});
	});



}