var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var configData = fs.readFileSync(basePath + '/main.conf', 'utf8');
configData = JSON.parse(configData);

var extend = require(basePath + '/node_modules/node.extend');


var Connection = require(__dirname + '/connection.js');
var nodemailer = require(basePath + '/node_modules/nodemailer');
var uuid = require(basePath + '/node_modules/node-uuid');

connection = Connection.getInstance('arf').getConnection();

var Model = function(){


	this.addContact = function(inParams, inPostFunction){
		var fieldData = 
			{
				companyName:'',
				department:'',
				emailAddress:'',
				imageUrl:configData.contacts.defaultImageUrl,
				name:'unknown',
				phoneNumber:'',
				refNumber:'',
				title:'',
				userId:false,
				type:'[MOBILE]'
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		var sqlString = 
			"INSERT INTO tb_storedContacts ( companyName, department, emailAddress, imageUrl, name, phoneNumber, refNumber, type, userId, title) VALUES " + 
				"(" 												  +
					connection.escape(fieldData.companyName) 	+ "," +
					connection.escape(fieldData.department) 	+ "," +
					connection.escape(fieldData.emailAddress) 	+ "," +
					connection.escape(fieldData.imageUrl) 		+ "," +
					connection.escape(fieldData.name) 			+ "," +
					connection.escape(fieldData.phoneNumber) 	+ "," +
					connection.escape(fieldData.refNumber) 		+ "," +
					connection.escape(fieldData.type) 			+ "," +
					connection.escape(fieldData.userId) 		+ "," +
					connection.escape(fieldData.title) 				  +
				" );"
		;
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.editContact = function(inParams, inPostFunction){
		var fieldData = 
			{
				id:-1,
				companyName:'',
				department:'',
				emailAddress:'',
				imageUrl:configData.contacts.defaultImageUrl,
				name:'unknown',
				phoneNumber:'',
				refNumber:'',
				title:'',
				userId:false,
				type:'[MOBILE]',
				ext:''
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		var sqlString = "UPDATE tb_storedContacts SET " +
			"companyName = " + connection.escape(fieldData.companyName) 		+ ", " +
			"department = " + connection.escape(fieldData.department) 			+ ", " +
			"emailAddress = " + connection.escape(fieldData.emailAddress) 		+ ", " +
			"imageUrl = " + connection.escape(fieldData.imageUrl) 				+ ", " +
			"name = " + connection.escape(fieldData.name) 						+ ", " +
			"phoneNumber = " + connection.escape(fieldData.phoneNumber) 		+ ", " +
			"refNumber = " + connection.escape(fieldData.refNumber) 			+ ", " +
			"type = " + connection.escape(fieldData.type) 						+ ", " +
			"title = " + connection.escape(fieldData.title) 					+ "," +
			"ext = " + connection.escape(fieldData.ext) 						+ " " +
			"WHERE userId = " + connection.escape(parseInt(fieldData.userId))	+ " " + 
			"AND"																+ " " + 
			"id = " + connection.escape(fieldData.id)
		;console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, rows, fields){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, rows, fields);}
		});

	}

	this.deleteContact = function(inParams, inPostFunction){
		var sqlString = "DELETE FROM tb_storedContacts WHERE " +
			"userId = " + connection.escape(parseInt(inParams.userId))	+ " " +
			"AND"														+ " " + 
			"id = " + connection.escape(inParams.id)
		;

		connection.query(sqlString, function(err, rows, fields){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, rows, fields);}
		});
	}


	this.getContacts = function(inParams, inPostFunction){
		if(!(inParams.userId)){if(inPostFunction){inPostFunction(true, false, false);} return;}
		var sqlString = "SELECT id, companyName, department, emailAddress, imageUrl, name, phoneNumber, refNumber,type, userId, title FROM tb_storedContacts WHERE userId = " +
			connection.escape(inParams.userId);

		connection.query(sqlString, function(err, rows, fields){
			if(inPostFunction){inPostFunction(err, rows, fields);}
		});
	}

	this.getContactById = function(inParams, inPostFunction){
		var sqlString =
			"SELECT * from tb_storedContacts WHERE id = "
				connection.escape(fieldData.companyName) 	+ "," + "";

		connection.query('SELECT * from tb_storedContacts WHERE id = ', function(err, rows, fields){
			if(inPostFunction){inPostFunction(err, rows, fields);}
		});
	}

		/*this.getAllPhoneAndImageUrl = function(inParams, inPostFunction){
			if(!(inParams.userId)){if(inPostFunction){inPostFunction(true, false, false);} return;}
			var sqlString = "SELECT id, companyName, department, emailAddress, imageUrl, name, phoneNumber, refNumber, userId, title FROM tb_storedContacts WHERE userId = " +
				connection.escape(inParams.userId);

			connection.query(sqlString, function(err, rows, fields){
				if(inPostFunction){inPostFunction(err, rows, fields);}
			});
		}
	*/
	this.getContactsByName = function(inParams, inPostFunction){

	}

	this.getContactsByEmailAddress = function(inParams, inPostFunction){

	}

	this.getContactsByCompanyName = function(inParams, inPostFunction){

	}

	this.getUserData = function(inParams, inPostFunction){
		if(!(inParams.userId)){if(inPostFunction){inPostFunction(true, false, false);} return;}
		var sqlString = "SELECT	* FROM vw_activeUser WHERE id = " +
			connection.escape(inParams.userId);

		connection.query(sqlString, function(err, rows, fields){
			if(inPostFunction){inPostFunction(err, rows, fields);}
		});
	}

}
module.exports = Model;