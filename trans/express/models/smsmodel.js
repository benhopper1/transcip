var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var configData = fs.readFileSync(basePath + '/main.conf', 'utf8');
configData = JSON.parse(configData);

var extend = require(basePath + '/node_modules/node.extend');
var Connection = require(__dirname + '/connection.js');
var uuid = require(basePath + '/node_modules/node-uuid');
var finish = require(basePath + '/node_modules/finish');


connection = Connection.getInstance('arf').getConnection();




var Model = function(){
	connection = Connection.getInstance('arf').getConnection();
	var _this = this;

	this.addManySms = function(inParams, inPostFunction){
		console.log('---------------addManySms starting------------------------------------------');
		console.dir(inParams);
		//validate input
		/*for(index in inParams.dataArray){
			inParams.dataArray[index].userId = inParams.userId;
		}*/
		if(!(inParams.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
				return;
			}
		}

		var smsArray = inParams.dataArray;
		var insertSQL = "";

		if(smsArray.length < 1){
			if(inPostFunction){inPostFunction(false, false);}
			return;
		}

		var isInit = true;
		for(var theIndex in smsArray){
			var fieldData = 
				{
					body:"",
					cleanContactPhoneNumber:"",
					contactName:"",
					contactPhoneNumber:"",
					date:"",
					dateSent:"",
					smsId: smsArray[theIndex].id,
					read: "0",
					smsContext: "",
					thread: "",
					userId:inParams.userId
				}
			fieldData = extend(fieldData, smsArray[theIndex]);
			if(!(isInit)){
				insertSQL += ",";
			}else{
				isInit = false;
			}

			insertSQL +=
				"(" 																			  +
					connection.escape(fieldData.body) 										+ "," +
					connection.escape(cleanPhoneNumber(fieldData.cleanContactPhoneNumber))	+ "," +
					connection.escape(fieldData.contactName) 								+ "," +
					connection.escape(cleanPhoneNumber(fieldData.contactPhoneNumber))		+ "," +
					connection.escape(fieldData.date) 										+ "," +
					connection.escape(fieldData.dateSent) 									+ "," +
					connection.escape(fieldData.read) 										+ "," +
					connection.escape(fieldData.smsContext) 								+ "," +
					connection.escape(fieldData.smsId) 										+ "," +
					connection.escape(fieldData.thread) 									+ "," +
					connection.escape(fieldData.userId) 										  +
				" )"
			;

		}//end for

		var sqlString = 
			"INSERT INTO `tb_smsStore` ( `body`, `cleanContactPhoneNumber`, `contactName`, `contactPhoneNumber`, `date`, `dateSent`, `read`, `smsContext`, `smsId`, `thread`, `userId`) VALUES " + 
				insertSQL + 
			";"
		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});

		/*finish.map(smsArray, function(value, done){
			_this.addSms(value, function(inErr, inResult){
				done(null, value);
			});
		},

		//completed Function--------------------------------
		function(err, results){
			console.log('--------------------------------------------------------');
			console.log('addManySms complete err/result:');
			if(inPostFunction){
				inPostFunction();
			}
		});*/

	}

	this.addManySmsOLD = function(inParams, inPostFunction){
		console.log('---------------addManySms starting------------------------------------------');
		//validate input
		for(index in inParams.dataArray){
			inParams.dataArray[index].userId = inParams.userId;
		}
		var smsArray = inParams.dataArray;

		finish.map(smsArray, function(value, done){
			_this.addSms(value, function(inErr, inResult){
				done(null, value);
			});
		},

		//completed Function--------------------------------
		function(err, results){
			console.log('--------------------------------------------------------');
			console.log('addManySms complete err/result:');
			if(inPostFunction){
				inPostFunction();
			}
		});

	}


	this.addSms = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		console.log('-------------------------------------------');
		console.log('addSms entered');
		var fieldData = 
			{
				body:"",
				cleanContactPhoneNumber:"",
				contactName:"",
				contactPhoneNumber:"",
				date:"",
				dateSent:"",
				smsId: inParams.id,
				read: "0",
				smsContext: "",
				thread: "",
				userId:false
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		var sqlString = 
			"INSERT INTO `tb_smsStore` ( `body`, `cleanContactPhoneNumber`, `contactName`, `contactPhoneNumber`, `date`, `dateSent`, `read`, `smsContext`, `smsId`, `thread`, `userId`) VALUES " + 
				"(" 																			  +
					connection.escape(fieldData.body) 										+ "," +
					connection.escape(cleanPhoneNumber(fieldData.cleanContactPhoneNumber))	+ "," +
					connection.escape(fieldData.contactName) 								+ "," +
					connection.escape(cleanPhoneNumber(fieldData.contactPhoneNumber))		+ "," +
					connection.escape(fieldData.date) 										+ "," +
					connection.escape(fieldData.dateSent) 									+ "," +
					connection.escape(fieldData.read) 										+ "," +
					connection.escape(fieldData.smsContext) 								+ "," +
					connection.escape(fieldData.smsId) 										+ "," +
					connection.escape(fieldData.thread) 									+ "," +
					connection.escape(fieldData.userId) 										  +
				" );"
		;
		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.getSmsLastId = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		console.log('-----getSmsLastId ENETERED-----------------------------------------------------');
		var fieldData = 
			{
				userId:false
			}
		fieldData = extend(fieldData, inParams);
		if(!(fieldData.userId)){
			console.log('ERROR _> no USERID!!!!');
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		var sqlString = 
			"SELECT smsId, CONVERT(smsId, UNSIGNED INTEGER) AS sortOrder FROM tb_smsStore WHERE " +
				"userId = " + connection.escape(fieldData.userId) 	+ " " +
			"ORDER BY sortOrder DESC LIMIT 1"
		;
		console.log('SQL:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(!(err)){
				var smsId = 0;
				if(result[0]){
					smsId = result[0].smsId
				}
				result = 
					{
						lastId:smsId
					}
				if(inPostFunction){inPostFunction(err, result);}
				return;
			}
			result = 
					{
						lastId:0
					}
			if(inPostFunction){inPostFunction(err, result);}
		});


	}

	this.getAllSmsByPhone = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		console.log('-----getAllSmsByPhone ENETERED-----------------------------------------------------');
		var fieldData = 
			{
				userId:false,
				phoneNumber:''
			}
		fieldData = extend(fieldData, inParams);
		if(!(fieldData.userId)){
			console.log('ERROR _> no USERID!!!!');
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		var sqlString;
		if(fieldData.limit){

			sqlString = 
				"SELECT DISTINCT t1.smsId,t1.contactName,t1.contactPhoneNumber AS smsPhoneNumber, t1.date, t1.dateSent ,t1.thread,t1.read,t1.smsContext,t1.userId,t1.body, t2.imageUrl, t2.name AS smsName, concat(t3.fName, ' ', t3.lName) AS userName, t3.screenImage, CONVERT(smsId, UNSIGNED INTEGER) AS sortOrder FROM tb_smsStore AS t1 LEFT JOIN tb_storedContacts AS t2 ON t1.userId = t2.userId AND t1.contactphonenumber=t2.phoneNumber LEFT JOIN tb_user AS t3 ON t1.userId = t3.id" + " " +
					"WHERE" 																+ " " +
						"t1.userId = " + connection.escape(parseInt(fieldData.userId)) 		+ " " +
					"AND"  																	+ " " +
						"t1.contactPhoneNumber="+ connection.escape(fieldData.phoneNumber) 	+ " " +
					"ORDER BY sortOrder DESC LIMIT "+ connection.escape(fieldData.limit)
			;

		}else{

			sqlString = 
				"SELECT DISTINCT t1.smsId,t1.contactName,t1.contactPhoneNumber AS smsPhoneNumber, t1.date, t1.dateSent ,t1.thread,t1.read,t1.smsContext,t1.userId,t1.body, t2.imageUrl, t2.name AS smsName, concat(t3.fName, ' ', t3.lName) AS userName, t3.screenImage, CONVERT(smsId, UNSIGNED INTEGER) AS sortOrder FROM tb_smsStore AS t1 LEFT JOIN tb_storedContacts AS t2 ON t1.userId = t2.userId AND t1.contactphonenumber=t2.phoneNumber LEFT JOIN tb_user AS t3 ON t1.userId = t3.id" + " " +
					"WHERE" 																+ " " +
						"t1.userId = " + connection.escape(parseInt(fieldData.userId)) 		+ " " +
					"AND"  																	+ " " +
						"t1.contactPhoneNumber="+ connection.escape(fieldData.phoneNumber) 	+ " " +
					"ORDER BY sortOrder DESC"
			;

		}

		//console.log('sql:' + sqlString);
		global.reportNotify('THeCaption', 
			{
				sql:sqlString,
			}, 0
		);

		connection.query(sqlString, function(err, rows, fields){
			if(inPostFunction){inPostFunction(err, rows, fields);}
		});

	}
	//TODO: reomove
	this.getAllSmsByPhoneOLD = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		console.log('-----getAllSmsByPhone ENETERED-----------------------------------------------------');
		var fieldData = 
			{
				userId:false,
				phoneNumber:''
			}
		fieldData = extend(fieldData, inParams);
		if(!(fieldData.userId)){
			console.log('ERROR _> no USERID!!!!');
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		var sqlString;
		if(fieldData.limit){
			sqlString = 
				"SELECT DISTINCT CONVERT(t3.smsId, UNSIGNED INTEGER) as sortOrder, vw_activeUser.fullName as userName, vw_activeUser.screenImage, t3.name as contactName, t3.imageUrl,t3.smsId,t3.contactName as smsName,t3.contactPhoneNumber as smsPhoneNumber,t3.date,t3.dateSent,t3.thread,t3.read,  t3.smsContext,t3.userId,t3.body from (select t2.name, t2.imageUrl, tb_smsStore.* from tb_smsStore LEFT JOIN ( SELECT userId, phoneNumber, max(tb_storedContacts.name) as 'name', max(tb_storedContacts.imageUrl) AS imageUrl 	FROM tb_storedContacts GROUP BY phoneNumber ) as t2 ON tb_smsStore.cleanContactPhoneNumber = t2.phoneNumber and tb_smsStore.userId = t2.userId WHERE tb_smsStore.smsContext = 'inbox' UNION ALL SELECT t2.name, t2.imageUrl, tb_smsStore.* FROM tb_smsStore LEFT JOIN ( SELECT userId, phoneNumber, max(tb_storedContacts.name) as 'name' , max(tb_storedContacts.imageUrl) as imageUrl 	FROM tb_storedContacts GROUP BY phoneNumber ) AS t2 ON tb_smsStore.cleanContactPhoneNumber = t2.phoneNumber AND tb_smsStore.userId = t2.userId WHERE tb_smsStore.smsContext = 'sent' ) t3 left join vw_activeUser ON t3.userId = vw_activeUser.id " +
					"WHERE " 																  +
					"userId = " + connection.escape(fieldData.userId) 					+ " " +
					"AND " +
					"contactPhoneNumber = " + connection.escape(fieldData.phoneNumber) 	+ " " +
				"ORDER BY sortOrder desc LIMIT "+ connection.escape(fieldData.limit)
			;
		}else{
			sqlString = 
				"SELECT DISTINCT CONVERT(t3.smsId, UNSIGNED INTEGER) as sortOrder, vw_activeUser.fullName as userName, vw_activeUser.screenImage, t3.name as contactName, t3.imageUrl,t3.smsId,t3.contactName as smsName,t3.contactPhoneNumber as smsPhoneNumber,t3.date,t3.dateSent,t3.thread,t3.read,  t3.smsContext,t3.userId,t3.body from (select t2.name, t2.imageUrl, tb_smsStore.* from tb_smsStore LEFT JOIN ( SELECT userId, phoneNumber, max(tb_storedContacts.name) as 'name', max(tb_storedContacts.imageUrl) AS imageUrl 	FROM tb_storedContacts GROUP BY phoneNumber ) as t2 ON tb_smsStore.cleanContactPhoneNumber = t2.phoneNumber and tb_smsStore.userId = t2.userId WHERE tb_smsStore.smsContext = 'inbox' UNION ALL SELECT t2.name, t2.imageUrl, tb_smsStore.* FROM tb_smsStore LEFT JOIN ( SELECT userId, phoneNumber, max(tb_storedContacts.name) as 'name' , max(tb_storedContacts.imageUrl) as imageUrl 	FROM tb_storedContacts GROUP BY phoneNumber ) AS t2 ON tb_smsStore.cleanContactPhoneNumber = t2.phoneNumber AND tb_smsStore.userId = t2.userId WHERE tb_smsStore.smsContext = 'sent' ) t3 left join vw_activeUser ON t3.userId = vw_activeUser.id " +
					"WHERE " 																  +
					"userId = " + connection.escape(fieldData.userId) 					+ " " +
					"AND " +
					"contactPhoneNumber = " + connection.escape(fieldData.phoneNumber) 	+ " " +
				"ORDER BY sortOrder desc"
			;
		}

		//console.log('sql:' + sqlString);
		global.reportNotify('THeCaption', 
			{
				sql:sqlString,
			}, 0
		);

		connection.query(sqlString, function(err, rows, fields){
			if(inPostFunction){inPostFunction(err, rows, fields);}
		});

	}

	//send array in and do process of elimination---
	this.getMissingSmsByPhone = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var resultArray = [];
		if(inParams.arrayOfSmsId){
			_this.getAllSmsByPhone(inParams, function(err, rows, fields){
				var dbHash = {};
				for(index in rows){
					var dbSmsId = rows[index].smsId;
					dbHash[dbSmsId] = rows[index];
				}
				for(index in inParams.arrayOfSmsId){
					if(dbHash[inParams.arrayOfSmsId[index]]){
						delete dbHash[inParams.arrayOfSmsId[index]];
					}
				}

				for(key in dbHash){
					resultArray.push(dbHash[key]);
				}

				if(inPostFunction){inPostFunction(err, resultArray, fields);}
			});
		}
	}

	var cleanPhoneNumber =function(inNumber){
		//US ONLY-----
		var standardNo = inNumber.replace(/[^\d]/g,'');
		if(standardNo.charAt(0) != '1'){
			standardNo = "1" + standardNo;
		}
		return standardNo.slice(0,11);
	}



}
module.exports = Model;