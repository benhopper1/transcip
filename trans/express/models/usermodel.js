var path = require('path');
var basePath = path.dirname(require.main.filename);
var fs = require('fs');
var Connection = require(__dirname + '/connection.js');
//var nodemailer = require(basePath + '/node_modules/nodemailer');
var uuid = require(basePath + '/node_modules/node-uuid');
var extend = require(basePath + '/node_modules/node.extend');
var finish = require(basePath + '/node_modules/finish');

var Mail = require(basePath + '/library/mail/mail.js');

var querystring = require('querystring')

connection = Connection.getInstance('arf').getConnection();



//model----------------
var Model = function(){
	connection = Connection.getInstance('arf').getConnection();
	var _this = this;
	var configData = fs.readFileSync('main.conf', 'utf8');
	configData = JSON.parse(configData);

	var mail = new Mail(
		{
			user:configData.mail.user,
			password:configData.mail.password,
			host:configData.mail.host,
			ssl:configData.mail.ssl,
		}
	);

	//===========================================================
	//CONTACT MODEL
	//===========================================================
	var ContactModel = require('../models/contactmodel.js');
	var contactModel = new ContactModel();


	//===========================================================
	//SMS MODEL
	//===========================================================
	var SmsModel = require('../models/smsmodel.js');
	var smsModel = new SmsModel();




	var userHash = {};



	var domainAddress = configData.domain.address;
	var domainPort = configData.domain.port;
	this.getHost = function(){
		var result;
		if(domainPort && domainPort != 80){
			return domainAddress + ':' + domainPort;
		}
		return domainAddress;
	}


	/*this.sessionSecurity = function(req, res){
		if(req.session.userData && req.session.userData.userGuid){
			return true;
		}else{
			userHash[]
		}
	}*/

	this.verifyUserPassword = function(inUserName, inPassword, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var sqlString = "SELECT * from tb_user WHERE userName = "+ connection.escape(inUserName) + " AND password = " + connection.escape(inPassword) + " ";
		connection.query(sqlString, function(err, rows, fields){
			if(inPostFunction){inPostFunction(err, rows, fields);}
		});
	}

	//safe Return of view, passwordless!!!
	this.verifyAndGetUserData = function(inData){
		connection = Connection.getInstance('arf').getConnection();
		_this.verifyUserPassword(inData.userName, inData.password, function(inErr, inRows, inFields){
			if(inRows.length > 0){
				//---user && password == good
				var sqlString = "SELECT * from vw_activeUser WHERE id=" + connection.escape(inRows[0].id);
				connection.query(sqlString, function(inErr, inRows, inFields){
					if(!(inErr)){
						if(inRows.length < 1){
							if(inData.onFail){inData.onFail(new Error('user not found'));}
						}else{
							if(inData.onSuccess){inData.onSuccess(inRows[0], inFields);}
						}
					}else{
						if(inData.onFail){inData.onFail(inErr);}
					}
				});
			}else{
				if(inData.onFail){inData.onFail(inErr);}
			}
		});		
	}

	this.userNameExist = function(inUserName, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		if(!(inUserName)){
			if(inPostFunction){
				inPostFunction("Error no userName", 
					{
						userName:'',
						exist:true
					}
				);
			}
			return;
		}
		var sqlString = 
			"SELECT userName, active FROM tb_user WHERE userName = " + connection.escape(inUserName) + ";"
		;
		connection.query(sqlString, function(err, result){
			if(inPostFunction){
				inPostFunction(err, 
					{
						userName:inUserName,
						isActive:(result[0]) ? ((result[0].active == 1) ? true : false)  : false,
						exist:(result.length > 0)
					}
				);
			}
			
		});
	}

	this.useOrCreateDeviceId = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		console.log('useOrCreateDeviceId entered');
		var fieldData = 
			{
				deviceId:0,
				userId:false,
				agent:'',
				deviceNumber:'',
				deviceType:''
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		var sqlString = 
			"SELECT id FROM tb_userDeviceList WHERE userId = " + connection.escape(fieldData.userId);
		console.log('sqlString:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);

			if(!err && !(result.length > 0)){
				_this.createNewDeviceId(fieldData.userId, fieldData.agent, fieldData.deviceNumber, fieldData.deviceType,function(err, result, newDeviceId){
					if(!(err)){
						if(inPostFunction){
							inPostFunction(err, 
								{
									valid:true,
									useDeviceId:newDeviceId
								}
							);
						}
					}else{
						if(inPostFunction){
							inPostFunction(err, 
								{
									valid:false,
									useDeviceId:false
								}
							);
						}
					}
				});

				return;
			}



			if(!err && result.length > 0){
				var hadMatch = false;
				for(index in result){
					if(result[index].id == fieldData.deviceId){
						hadMatch = true;
						break;
					}
				}
				if(hadMatch){
					if(inPostFunction){
						inPostFunction(err, 
							{
								valid:true,
								useDeviceId:fieldData.deviceId
							}
						);
					}
				}else{
					//create new id here then return
					_this.createNewDeviceId(fieldData.userId, fieldData.agent, fieldData.deviceNumber, fieldData.deviceType,function(err, result, newDeviceId){
						if(!(err)){
							if(inPostFunction){
								inPostFunction(err, 
									{
										valid:true,
										useDeviceId:newDeviceId
									}
								);
							}
						}else{
							if(inPostFunction){
								inPostFunction(err, 
									{
										valid:false,
										useDeviceId:false
									}
								);
							}
						}
					});
				}
			}else{
				err = "no records or error"
				if(inPostFunction){
					inPostFunction(err, 
						{
							valid:false,
							useDeviceId:false
						}
					);
				}
			}


			
		});








	}



	this.getUserDataById = function(inUserId, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		console.log('getUserDataById');
		var sqlString = "SELECT * from vw_userData WHERE id=" + connection.escape(parseInt(inUserId));
		console.log('sql:' + sqlString);
		connection.query(sqlString, function(inErr, inRows, inFields){
			if(inPostFunction){inPostFunction(inErr, inRows[0], inFields);}
		});
	}

	this.verifyDeviceId = function(inUserId, inDeviceId, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var sqlString = "SELECT * from tb_userDeviceList WHERE userId = " + connection.escape(inUserId) + " AND id = " + connection.escape(inDeviceId);
		connection.query(sqlString, function(err, rows, fields){
			console.dir(rows);
			if(inPostFunction){inPostFunction((rows.length > 0));}
		});
	}

	this.createNewDeviceId = function(inUserId, inAgent, inDeviceNumber, inDeviceType, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var sqlString = "INSERT INTO tb_userDeviceList (userId, userAgent, deviceNumber, deviceType) VALUES(" + connection.escape(inUserId) + ", " + connection.escape(inAgent) + "," + connection.escape(inDeviceNumber) + ", " + connection.escape(inDeviceType) + " )";
		connection.query(sqlString, function(err, result){
			if(inPostFunction){inPostFunction(err, result, result.insertId);}
		});
	}

	this.getUserId = function(inRequestRef){
		inRequestRef.cookies.userId;
	}

	this.dbAddUserAccountDataToUserTable = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var fieldData = 
			{
				firstName:"",
				lastName:"",
				emailAddress:"",
				userName:"",
				password:"",
				address:"",
				city:"",
				state:"",
				zipcode:"",
				country:"",
				userGroup:"",
				screenImage:"",
				activateCode:"",
			}
		fieldData = extend(fieldData, inParams);

		var sqlString = 
			"INSERT INTO tb_user (fName,lName ,emailAddress, userName, password, address, city, state, zipcode, country, userGroup, screenImage, activateCode) "   + 
				"VALUES("																																		   + 
					connection.escape(fieldData.firstName) 																									+ ", " + 
					connection.escape(fieldData.lastName)																									+ ", " + 
					connection.escape(fieldData.emailAddress)																								+ ", " + 
					connection.escape(fieldData.userName)																									+ ", " + 
					connection.escape(fieldData.password)																									+ ", " + 
					connection.escape(fieldData.address)																									+ ", " + 
					connection.escape(fieldData.city)																										+ ", " + 
					connection.escape(fieldData.state)																										+ ", " + 
					connection.escape(fieldData.zipcode)																									+ ", " + 
					connection.escape(fieldData.country)																									+ ", " + 
					connection.escape('arfUser')																											+ ", " + 
					connection.escape(fieldData.screenImage)																								+ ", " + 
					connection.escape(fieldData.activateCode)																									   + 
				" )"
		;

		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});

	}












	this.dbStoreUserImage = function(inData){
		connection = Connection.getInstance('arf').getConnection();
		//verify file first----
		if(fs.existsSync(path)){console.log('fileExist!!');}
		var sqlString = "INSERT INTO tb_image (userId, file, stat) VALUES(" + connection.escape(inData.userId) + ", " + connection.escape(configData.mediaStorageModel.imageFolderPath + '/'+ path.basename(inData.userImagePath)) + "," + connection.escape('ScreenImage') + " )";
		connection.query(sqlString, function(err, result){			
			if(inData.onFinish){inData.onFinish(err, result, result.insertId);}
		});
	}

	this.createSession = function(req, inJstruct){
		var securityData = 
			{
				userId:false,
				userGuid:false,
				deviceId:false,
				userGroup:false,
				status:false,
			}
		securityData = extend(securityData, inJstruct);
		console.log('createSession:');
		console.dir(securityData);
		req.session.userData = securityData;

		console.log('Actual req.session');
		console.dir(req.session);

	}

	this.verifySession = function(req, res){
		if(req.session && req.session.userData){
			return true;
		}else{
			return false;
		}
	}


	//TODO remove this method not used.....
	this.processCookie = function(inData){
		if(typeof inData.userRecord === 'undefined'){console.log('fail no id?? / cookie but no query result');return;}
		if(inData.userRecord.id){
			inData.responseRef.cookie('userId', inData.userRecord.id.toString(), { maxAge: 86400000*365, httpOnly: true });
			if(inData.userRecord.userName){
				inData.responseRef.cookie('userName', inData.userRecord.userName, { maxAge: 86400000*365, httpOnly: true });
			}
			console.log("cookieT6t:"+JSON.stringify(inData.requestRef.cookies));
			if(inData.requestRef.cookies.deviceId){
				console.log("deviceId cookie exist");
				//verify id
				_this.verifyDeviceId(inData.userRecord.id, inData.requestRef.cookies.deviceId, function(inExist){
					// check count
					if(inExist){
						//store in cookie
						inData.responseRef.cookie('deviceId', inData.requestRef.cookies.deviceId, { maxAge: 86400000*365, httpOnly: true }).send('').end();
						if(inData.onSuccess){inData.onSuccess();}
					}else{
						// create
						_this.createNewDeviceId(inData.userRecord.id, 'fakeAgentString', 'fakeDeviceNumber', 2, function(inErr, inResult, inNewDeviceId){
							inData.responseRef.cookie('deviceId', inNewDeviceId, { maxAge: 86400000*365, httpOnly: true }).send('').end();
							if(inData.onSuccess){inData.onSuccess();}
						});
					}
				});

			}else{
				// create new dev id for user
				_this.createNewDeviceId(inData.userRecord.id, 'fakeAgentString2', 'fakeDeviceNumber', 2, function(inErr, inResult, inNewDeviceId){
					inData.responseRef.cookie('deviceId', inNewDeviceId, { maxAge: 86400000*365, httpOnly: true }).send('').end();
					if(inData.onSuccess){inData.onSuccess();}
				});
			}
		}	
	}

	this.sendMailActivateCode = function(inDestinationAddess, inCode, inUserId){
		console.dir('sendMailActivateCode:' + inDestinationAddess+ inCode+inUserId);
		var activateLink = _this.getHost() + '/' + 'user/activateAccount?code=' + inCode + '&userId=' + inUserId;
		console.log('activateLink:' + activateLink);


		//querystring = require('querystring')

		/*var dict_0 = 
			{ 
				code:inCode,
			}

		var dict_1 = 
			{
				userId:inUserId
			}


		var url = _this.getHost() + '/' + 'user/activateAccount/code=' + querystring.stringify(dict_0) + '?userId' + querystring.stringify(dict_1);   //'http://google.com/?q=' + querystring.stringify(dict);
		url = encodeURIComponent(url);
		url = url.replace(/'/g,"%27");
*/

		/*var html = 
			'<div>' 					+
				'<h1>Welcome to 22 ArfSync</h1>' 	+
				'<a href="' + activateLink + '"></a>' 			+ 
			'</div>'
		;*/
		//<a href="' + activateLink + '"></a>
		var html = '<html>'					+
					'<head></head>'					+
						'<body>'					+
							'<h1>You are ArfSync\'s newest valued customer</h1>' + 
							'<br><br>' + 
							'<a href="' + activateLink + '" >Click to Activate Your ArfSync Account</a>'					+
							//'<img src="http://192.168.0.16:35001/jqm/arfsync/public/images/ui/android_sms.png" />'					+
						'</body>'					+
					'</html>'
		;


		mail.send(
			{

				text:'Welcome to ArfSync 33  ' + activateLink,
				fromCaption:configData.mail.fromCaption,
				to:inDestinationAddess,
				//cc:'else <else@your-email.com>',
				subject:'ArfComm Activation',
				//html:'<div>Welcome to <h1>ArfSync</h1>  Click link to activate your account \n ' + activateLink + '</div>',
				html:html,

			}, function(err, message){
				console.log('MAIL SENT');
				console.dir(err);
				console.dir(message);
			}
		);


		//var transporter = nodemailer.createTransport(configData.mail.accountSetup.transporter);
		/*transporter.sendMail(
			{
			    from: 'arfcomm@gmail.com',
			    to: inDestinationAddess,
			    subject: 'ArfComm Activation Code',
			    text: 'Click link to activate your account \n ' + activateLink
			}
		);*/
	}

	this.activateUserAccount = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var fieldData = 
			{
				inCode:'', 
				inUserId:''
			}
		fieldData = extend(fieldData, inParams);

		var sqlString = 
			"SELECT * from tb_user WHERE " 										+
				"id = "+ connection.escape(parseInt(fieldData.userId)) 			+
				" AND " 														+
				"activateCode = " + connection.escape(fieldData.code)
		;
		console.log('sql(I):' + sqlString);
		// PART I
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			//if(inPostFunction){inPostFunction(err, result);}
			if(result.length > 0){
				var sqlString = 
					"UPDATE tb_user" 													+ " " +
						"SET active = "+ connection.escape(1) 							+ " " +
					"WHERE " 															+ " " +
						"id = "+ connection.escape(parseInt(fieldData.userId))			+ " " +
						"AND"	 														+ " " +
						"activateCode = " + connection.escape(fieldData.code)
			;
			console.log('sql(II):' + sqlString);
			// PART II
			connection.query(sqlString, function(err, result){
				if(!(err)){
					//add newbi stuff to database for new user account.....
					_this.userStartUp(fieldData.userId, inPostFunction);
				}

				//if(inPostFunction){inPostFunction(err, result);}
			});

			}else{
				var err = "AccivateCode or UserId NOT EXIST!!!!";
				if(inPostFunction){inPostFunction(err, result);}
			}
		});


	}

	this.getUserById = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		console.log('deleteCacheEntry:');
		console.dir(inParams);
		var fieldData = 
			{
				userId:false,
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not mutated';
				inPostFunction(err, false, false);
			}
		}
		var sqlString = 
			"SELECT fName, lName, emailAddress, userName, status, city, state, country, userGroup, entryDate, address, zipcode, screenImage"  + " " +
			"FROM tb_user"																													+ " " +
			"WHERE id = " + connection.escape(parseInt(fieldData.userId))
		;
		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.updateUser = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var fieldData = 
			{
				fName:'',
				lName:'',
				emailAddress:'',
				//userName:'',
				status:'',
				city:'',
				state:'',
				country:'',
				userGroup:'',
				entryDate:'',
				address:'',
				zipcode:'',
				screenImage:'',
				userId:false,
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not mutated';
				inPostFunction(err, false, false);
			}
		}
		var sqlString = "UPDATE tb_user SET " +
			"fName = " + connection.escape(fieldData.fName) 				+ ", " +
			"lName = " + connection.escape(fieldData.lName) 				+ ", " +
			"emailAddress = " + connection.escape(fieldData.emailAddress) 		+ ", " +
			//"userName = " + connection.escape(fieldData.companyName) 			+ ", " +
			//"status = " + connection.escape(fieldData.status) 				+ ", " +
			"city = " + connection.escape(fieldData.city) 				+ ", " +
			"state = " + connection.escape(fieldData.state) 				+ ", " +
			"country = " + connection.escape(fieldData.country) 			+ ", " +
			//"userGroup = " + connection.escape(fieldData.companyName) 		+ ", " +
			//"entryDate = " + connection.escape(fieldData.companyName) 			+ ", " +
			"address = " + connection.escape(fieldData.address) 			+ ", " +
			"zipcode = " + connection.escape(fieldData.zipcode) 			+ ", " +
			"screenImage = " + connection.escape(fieldData.screenImage) 		+ " " +
			"WHERE id = " + connection.escape(parseInt(fieldData.userId))
		;
		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.deleteAllForUser = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var fieldData = 
			{
				userId:false,
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not mutated';
				inPostFunction(err, false, false);
			}
		}
		var sqlString = "CALL sp_deleteAllForUserId(" + connection.escape(parseInt(fieldData.userId)) + ");";
		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.userStartUp = function(inUserId, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		console.log('userStartUp ENTERED');
		var jData = fs.readFileSync(basePath + '/public/json/userstartup.json', 'utf8');
		jData = JSON.parse(jData);

		console.dir(jData);

		finish.map(jData.characters, function(value, done){
			value.userId = inUserId;
			console.log('finish.map, adding contact');
			contactModel.addContact(value, function(err, result){
				done(null, value);
			});
		},
		//completed Function(PART:0)---------------------------
		function(err, results){
					finish.map(jData.sms, function(value_1, done){
						value_1.userId = inUserId;
						console.log('finish.map, adding addSms');
						smsModel.addSms(value_1, function(err, result){
							done(null, value_1);
						});
				},

				//completed Function(PART:1)--------------------------------
				function(err, results){
					if(inPostFunction){
						inPostFunction(err, results);
					}
				});//finsh_1

		});//finsh_0

	}

}



module.exports = Model;
