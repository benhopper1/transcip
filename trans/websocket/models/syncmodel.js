console.log('security model loading....');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var extend = require(basePath + '/node_modules/node.extend');
var Connection = require(__dirname + '/connection.js');
var connection = false;

//instance:NO
var Model = function(){
	if(!(connection)){connection = Connection.getInstance('arf').getConnection();}

	if(!(connection)){
		console.log('error on db connection in static SecurityModel.verify !!!!');
	}
	this.addDeviceContactToDb = function(inParams, inPostFunction){
		var insertableParams = 
			{
				accountType:'',
				accountName:'',
				contactId:0,
				deviceId:0,
				emailAddress:'',
				id:0,
				imageUrl:'',
				name:'',
				phoneLabel:'',
				phoneNumber:'',
				phonePhotoUri:'',
				phoneThumbnailPhotoUri:'',
				phoneType:'',
				rawId:0,
				ringTone:'',
				sourceId:'',
				starred:0,
				syncTimeStamp:'',
				timesContacted:0,
				userId:0
			}

		var params = extend(insertableParams, inParams);
		var sqlString = "INSERT INTO tb_deviceContacts (accountName, accountType, contactId, deviceId, emailAddress, id, imageUrl, name, phoneLabel, phoneNumber, phonePhotoUri, phoneThumbnailPhotoUri, phoneType, rawId, ringTone, sourceId, starred, syncTimeStamp, timesContacted, userId) " +
			"VALUES (" + connection.escape(params.accountName) + ", " + connection.escape(params.accountType) + ", " + connection.escape(params.contactId) + ", " + connection.escape(params.deviceId) + ", " + connection.escape(params.emailAddress) + ", " + connection.escape(params.id) + ", " + connection.escape(params.imageUrl) + ", " + connection.escape(params.name) + ", " + connection.escape(params.phoneLabel) + ",	" + connection.escape(params.phoneNumber) + ", " + connection.escape(params.phonePhotoUri) + ", " + connection.escape(params.phoneThumbnailPhotoUri) + ", " + connection.escape(params.phoneType) + ", " + connection.escape(params.rawId) + ",	" + connection.escape(params.ringTone) + ",	" + connection.escape(params.sourceId) + ",	" + connection.escape(params.starred) + ", " + connection.escape(params.syncTimeStamp) + ", " + connection.escape(params.timesContacted) + "," + connection.escape(params.userId) + ");";

		connection.query(sqlString, function(err, rows, fields){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, rows, fields);}
		});

	}

	this.deleteAllDeviceContactsFromDb = function(inParams, inPostFunction){
		console.log('deleteing !!!!!!!!!!:');
		console.dir(inParams);
		var sqlString = "DELETE FROM tb_deviceContacts WHERE userId =" + connection.escape(parseInt("0" + inParams.userId)) + " AND deviceId = " + connection.escape(parseInt("0" + inParams.deviceId)) + " ;";
		connection.query(sqlString, function(err, rows, fields){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, rows, fields);}
			return;
		});
	}

}

module.exports = Model;