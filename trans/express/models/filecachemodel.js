var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var configData = fs.readFileSync(basePath + '/main.conf', 'utf8');
configData = JSON.parse(configData);

var extend = require(basePath + '/node_modules/node.extend');
var Connection = require(__dirname + '/connection.js');
var uuid = require(basePath + '/node_modules/node-uuid');
var finish = require(basePath + '/node_modules/finish');

var Model = function(){
	var _this = this;
	connection = Connection.getInstance('arf').getConnection();

	this.add = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		console.log('-------------------------------------------');
		console.log('addSms entered');
		var fieldData = 
			{
				path:'',
				type:'',
				route:'',
				hashCode_0:'',
				hashCode_1:'',
				hashCode_2:'',
				hashCode_3:'',

				userId:false,
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		var sqlString = 
			"INSERT INTO tb_fileCache ( path, type, route, hashCode_0, hashCode_1, hashCode_2, hashCode_3, userId) VALUES " + 
				"(" 																				  +
					connection.escape(fieldData.path) 										+ "," +
					connection.escape(fieldData.type)									+ "," +
					connection.escape(fieldData.route) 									+ "," +
					connection.escape(fieldData.hashCode_0)										+ "," +
					connection.escape(fieldData.hashCode_1) 											+ "," +
					connection.escape(fieldData.hashCode_2) 					+ "," +
					connection.escape(fieldData.hashCode_3) 										+ "," +
					connection.escape(fieldData.userId) 											  +
				" );"
		;
		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){//cleanPhoneNumber(fieldData.phoneNumber)
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.getByHashCodes = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		console.log('-------------------------------------------');
		console.log('addSms entered');
		var fieldData = 
			{
				hashCode_0:'%',
				hashCode_1:'%',
				hashCode_2:'%',
				hashCode_3:'%',

				userId:false,
				limit:100000,
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		var sqlString = 
			"SELECT * FROM tb_fileCache WHERE "											+ " " +
				"hashCode_0 LIKE " + connection.escape(fieldData.hashCode_0)					+ " " +
				"AND"																	+ " " +
				"hashCode_1 LIKE " + connection.escape(fieldData.hashCode_1)					+ " " +
				"AND" 																	+ " " +
				"hashCode_2 LIKE  "+ connection.escape(fieldData.hashCode_2)					+ " " +
				"AND"																	+ " " +
				"hashCode_3 LIKE  "+ connection.escape(fieldData.hashCode_3)					+ " " +
				"AND"																	+ " " +
				"userId = " + connection.escape(parseInt(fieldData.userId))				+ " " +
			"LIMIT " + connection.escape(parseInt(fieldData.limit))
		;


		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){//cleanPhoneNumber(fieldData.phoneNumber)
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}










}

module.exports = Model;