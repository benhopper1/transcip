var path = require('path');
var basePath = path.dirname(require.main.filename);
//var fs = require('fs');
var Connection = require(__dirname + '/connection.js');
//var nodemailer = require(basePath + '/node_modules/nodemailer');
//var uuid = require(basePath + '/node_modules/node-uuid');
var extend = require(basePath + '/node_modules/node.extend');
//var finish = require(basePath + '/node_modules/finish');

//var Mail = require(basePath + '/library/mail/mail.js');

//var querystring = require('querystring')

connection = Connection.getInstance('arf').getConnection();



//model----------------
var Model = function(){
	//connection = Connection.getInstance('arf').getConnection();
	var _this = this;
	//var configData = fs.readFileSync('main.conf', 'utf8');
	//configData = JSON.parse(configData);

	this.getConnection = function(){
		return Connection.getInstance('arf').getConnection();
	}

	this.clearFileDataFromDb = function(inPostFunction){
		global.reportNotify('Model.clearFileDataFromDb', {}, 0);
		var connection = _this.getConnection();
		var sqlString = "DELETE FROM tb_fileStorage";
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.insertFileDataToDatabase = function(inParams, inPostFunction){
		global.reportNotify('Model.insertFileDataToDatabase', {inParams:inParams}, 0);
		var connection = _this.getConnection();

		var dataArray = inParams.dataArray;
		var insertSQL = "";

		if(dataArray.length < 1){
			if(inPostFunction){inPostFunction(false, false);}
			return;
		}

		var isInit = true;
		for(var theIndex in dataArray){
			var fieldData = 
				{
					storageKey:'',
					groupKey:'',
					serverPath:'',
					domainPath:'',
					fileNameAndExt:'',
					ext:'', 
					modifyTime:'',
					accessTime:'', 
					createTime:'', 
					sizeBytes:0, 
					specialAttrib:'',
				}
			fieldData = extend(fieldData, dataArray[theIndex]);

			if(!(isInit)){
				insertSQL += ",";
			}else{
				isInit = false;
			}

			insertSQL +=
				"(" 																		  +
					connection.escape(fieldData.storageKey) 							+ "," +
					connection.escape(fieldData.groupKey)								+ "," +
					connection.escape(fieldData.serverPath) 							+ "," +
					connection.escape(fieldData.domainPath)								+ "," +
					connection.escape(fieldData.fileNameAndExt) 						+ "," +
					connection.escape(fieldData.ext) 									+ "," +
					connection.escape(fieldData.modifyTime) 							+ "," +
					connection.escape(fieldData.accessTime) 							+ "," +
					connection.escape(fieldData.createTime) 							+ "," +
					connection.escape(parseInt(fieldData.sizeBytes))					+ "," +
					connection.escape(fieldData.specialAttrib) 								  +
				" )"
			;

		}//end for

		var sqlString = 
			"INSERT INTO tb_fileStorage ( `storageKey`, `groupKey`, `serverPath`, `domainPath`, `fileNameAndExt`, `ext`, `modifyTime`, `accessTime`, `createTime`, `sizeBytes`, `specialAttrib`) VALUES " + 
				insertSQL + 
			";"
		//console.log('sql:' + sqlString);
		global.reportNotify('SQL (Model.insertFileDataToDatabase)', {sqlString:sqlString}, 0);
		connection.query(sqlString, function(err, result){
			global.reportNotify('queryRESULT (Model.insertFileDataToDatabase)', {err:err,result:result}, 0);
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});

	}

	this.getDeletables = function(inParams, inPostFunction){
		var connection = _this.getConnection();
		var fieldData = 
			{
				storageKey:'%',
				groupKey:'%',
				ageMinutes:0,
				limit:1000000
			}
		fieldData = extend(fieldData, inParams);
		var sqlString = 
			"SELECT t1.groupKey, t1.storageKey, t1.domainPath, t1.serverPath, IF(t2.id IS NOT NULL, TRUE, FALSE) AS userImage, IF(t3.id IS NOT NULL, TRUE, FALSE) AS contactImage, IF(t4.id IS NOT NULL, TRUE, FALSE) AS fileCacheFile, TIMESTAMPDIFF(MINUTE, STR_TO_DATE(t1.createTime, '%Y-%m-%d %H:%i:%s'), now()) AS fileAgeMinutes,t1.sizeBytes, t1.createTime FROM tb_fileStorage AS t1" + " " +
				"LEFT JOIN tb_user AS t2 ON" 																											+ " " +
				"t1.domainPath = t2.screenImage" 																										+ " " +
				"LEFT JOIN tb_storedContacts AS t3 ON" 																									+ " " +
				"t1.domainPath = t3.imageUrl" 																											+ " " +
				"LEFT JOIN tb_fileCache AS t4 ON" 																										+ " " +
				"t1.domainPath = t4.path" 																												+ " " +
				"WHERE" 																																+ " " +
					"(" 																																+ " " +
						"t2.id IS NULL" 																											+ " " +
						"AND" 																															+ " " +
						"t3.id IS NULL" 																											+ " " +
						"AND" 																															+ " " +
						"t4.id IS NULL" 																											+ " " +
					")" 																																+ " " +
				"AND"																																	+ " " +
				"t1.groupKey LIKE " + connection.escape(fieldData.groupKey) 																			+ " " +
				"AND" 																																	+ " " +
				"TIMESTAMPDIFF(MINUTE, STR_TO_DATE(t1.createTime, '%Y-%m-%d %H:%i:%s'), now()) > "+ connection.escape(parseInt(fieldData.ageMinutes)) 	+ " " +
				"and" 																																	+ " " +
				"t1.storageKey like " + connection.escape(fieldData.storageKey) 																		+ " " +
				"limit " + connection.escape(fieldData.limit)
		;

		global.reportNotify('SQL (Model.getDeletables)', {sqlString:sqlString}, 0);
		connection.query(sqlString, function(err, result){
			global.reportNotify('queryRESULT (Model.getDeletables)', {err:err,result:result}, 0);
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}




}

module.exports = Model;