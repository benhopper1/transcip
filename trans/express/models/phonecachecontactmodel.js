var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var configData = fs.readFileSync(basePath + '/main.conf', 'utf8');
configData = JSON.parse(configData);
var finish = require(basePath + '/node_modules/finish');

var extend = require(basePath + '/node_modules/node.extend');


var Connection = require(__dirname + '/connection.js');
var nodemailer = require(basePath + '/node_modules/nodemailer');
var uuid = require(basePath + '/node_modules/node-uuid');

connection = Connection.getInstance('arf').getConnection();

var Model = function(){
	connection = Connection.getInstance('arf').getConnection();
	var _this = this;

	this.cacheContacts= function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var fieldData = 
			{
				userId:false,
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		// TRANSACTION ------------------------------
		connection.beginTransaction(function(err){

			var theArray = inParams.dataArray;

			finish.map(theArray, function(value, done){
				value.userId = fieldData.userId;
				_this.cacheContact(value, function(inErr, inResult){
					done(null, value);
				});
			},

			//completed Function--------------------------------
			function(err, results){
				console.log('--------------------------------------------------------');
				console.log('cacheContacts complete err/result:');
				connection.commit(function(err) {
					if(err){ 
						connection.rollback(function() {
							if(inPostFunction){
								inPostFunction();
							}
						});
					}
					console.log('success!');
					if(inPostFunction){
						inPostFunction();
					}
				});

			});




		});//->end Transaction



		
	}

	this.cacheContact = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var fieldData = 
			{
				
				name:'',
				phoneNumber:'',
				emailAddress:'',
				companyName:'',
				department:'',
				title:'',
				imageUrl:'',
				ext:'',
				type:'',
				photoUriString:'',
				rawContactId:'',
				contactId:'',
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
			"DELETE FROM tb_cachePhoneContacts WHERE" 							+ " " + 
				"userId = " + connection.escape(parseInt(fieldData.userId)) 	+ " " + 
				"AND"															+ " " + 
				"name = " + connection.escape(fieldData.name) 					+ " " + 
				"AND"															+ " " + 
				"type = " + connection.escape(fieldData.type)
		;
		connection.query(sqlString, function(err, result){

			var sqlString2 = 
				"INSERT INTO tb_cachePhoneContacts ( name,phoneNumber, emailAddress, companyName, department, title, imageUrl, ext, 	type, photoUriString, rawContactId, contactId, userId) VALUES " + 
					"(" 												  +
						connection.escape(fieldData.name) 			+ "," +
						connection.escape(fieldData.phoneNumber) 	+ "," +
						connection.escape(fieldData.emailAddress) 	+ "," +
						connection.escape(fieldData.companyName) 	+ "," +
						connection.escape(fieldData.department) 	+ "," +
						connection.escape(fieldData.title) 			+ "," +
						connection.escape(fieldData.imageUrl) 		+ "," +
						connection.escape(fieldData.ext) 			+ "," +
						connection.escape(fieldData.type) 			+ "," +
						connection.escape(fieldData.photoUriString) + "," +
						connection.escape(fieldData.rawContactId) 	+ "," +
						connection.escape(fieldData.contactId) 		+ "," +
						connection.escape(fieldData.userId) 			  +
					" );"
			;

			console.log('sql2:' + sqlString2);
			connection.query(sqlString2, function(err, result){
				console.log('error' + err);
				if(inPostFunction){inPostFunction(err, result);}
			});
		});
	}

	this.getImportableData = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var fieldData = 
			{
				userId:false,
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		/*var sqlString = 
			"SELECT t1.*, CONCAT(t1.name, t1.type) AS compKey FROM"																+ " " +
				"("																												+ " " +
					"SELECT max(fc.path) AS imageUrl, cpc.id, cpc.name, cpc.phoneNumber,cpc.emailAddress, cpc.companyName, cpc.department, cpc.title, cpc.userId, cpc.ext, cpc.type, cpc.photoUriString, cpc.rawContactId, cpc.contactId, cpc.entryDate"	+ " " +
					"FROM tb_cachePhoneContacts AS cpc"																			+ " " +
					"LEFT JOIN tb_fileCache AS fc ON"																			+ " " +
					"cpc.photoUriString = fc.hashCode_2"																		+ " " +
					"AND"																										+ " " +
					"cpc.userId = fc.userId"																					+ " " +
					"WHERE cpc.userId = "+ connection.escape(parseInt(fieldData.userId)) 										+ " " +
					"GROUP BY cpc.id"																							+ " " +
				") AS t1"																										+ " " +
			"WHERE CONCAT(t1.name, t1.type) NOT IN (SELECT cONCAT(t2.name, t2.type) AS compKey FROM tb_storedContacts AS t2)"
		;*/
		var sqlString = 
			"SELECT * FROM  vw_actionable"									+ " " +
				"WHERE isImportable = 1" 									+ " " +
				"AND"														+ " " +
				"userId = " + connection.escape(parseInt(fieldData.userId)) 
		;

		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.getExportableData = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var fieldData = 
			{
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
			"SELECT *,CONCAT(t1.name, t1.type) AS compKey"									+ " " +
			"FROM tb_storedContacts AS t1"													+ " " +
			"WHERE CONCAT(t1.name, t1.type) NOT IN "										+ " " +
				"("																			+ " " +
					"SELECT CONCAT(t2.name, t2.type)"										+ " " +
					"FROM tb_cachePhoneContacts AS t2"										+ " " +
					"WHERE t2.userId = " + connection.escape(parseInt(fieldData.userId))	+ " " +
				")"																			+ " " +
			"AND t1.userId = " + connection.escape(parseInt(fieldData.userId))
		;

		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.moveCachedContact = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var fieldData = 
			{
				userId:false,
				refId:false,
				filePathToCopy:false,
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
				return;
			}
		}

		if(fieldData.filePathToCopy){
			var secureSourceFilePath = basePath + configData.phoneCacheStorageFolder + '/' + path.basename(fieldData.filePathToCopy);
			var targetFilePath = basePath + configData.contactImageFolder + '/' + path.basename(fieldData.filePathToCopy);
		
			if(path.basename(targetFilePath).indexOf(path.basename(configData.defaultMemberImageUrl)) != -1){
				targetFilePath = basePath + configData.contactImageFolder + '/' + path.basename(uuid.v1() + path.extname(targetFilePath));
			}
		}




		var source = fs.createReadStream(secureSourceFilePath);
		var dest = fs.createWriteStream(targetFilePath);



		//configData.defaultMemberImageUrl

		//uuid.v1()

		console.log('COPY-------------------------');
		console.log('SOURCE:' + secureSourceFilePath);
		console.log('TARGET:' + targetFilePath);
		console.dir('-----------------------------');

		source.pipe(dest);
		source.on('end', function() {
			var err = false;
			if(inPostFunction){
				inPostFunction(err, 
					{	
						message:'file copied',
						refId:fieldData.refId,
						newFilePath:configData.contactImageFolder + '/' + path.basename(targetFilePath),
						//newFilePath:targetFilePath,
					}
				);
			}
		});
		source.on('error', function(err) {
			var err = false;
			if(inPostFunction){inPostFunction(err, {message:'ERROR'});}
		});
	}

	this.checkCacheNeeds = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		//console.log('checkCacheNeeds enter--');
		//console.dir(inParams);
		var fieldData = 
			{
				userId:false,
				dataArray:[],
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		var dataArray = fieldData.dataArray;
		console.log('dataArray');
		console.dir(dataArray);
		var sqlString = 
			"SELECT max(fc.path) AS cachePath, cpc.* FROM tb_cachePhoneContacts AS cpc LEFT JOIN tb_fileCache AS fc ON cpc.photoUriString = fc.hashCode_2 AND cpc.userId = fc.userId" + " " +
				"WHERE cpc.userId = " + connection.escape(parseInt(fieldData.userId)) + " " +
				"GROUP BY cpc.id"
		;
		console.log('sql(0):' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			console.log('reslut of  sql(0)--');
			console.dir(result);
			var recordsHash = {};
			var tmpForDeleteHash = {};
			for(resultIndex in result){
				tmpForDeleteHash[result[resultIndex].name + result[resultIndex].type] = result[resultIndex];
				if(result[resultIndex].photoUriString){
					recordsHash[result[resultIndex].name + result[resultIndex].type] = result[resultIndex];
				}
			}
			//console.log('dataArray');
			//console.dir(dataArray);

			var resultDataArray = [];
			//var needToDeleteArray = [];
			for(var dataArrayIndex in dataArray){
				console.log('dataArrayIndex:' + dataArrayIndex);
				var dbRecord = recordsHash[dataArray[dataArrayIndex].name + dataArray[dataArrayIndex].type];
				if(dbRecord){
					console.log('cachePath:' + dbRecord.cachePath);
					console.log('dbRecord.cachePath "" ' + dbRecord.cachePath == 'null');
					console.log('dbRecord.cachePath ' + dbRecord.cachePath == null);
					console.log('TEST_0');
					console.log(dataArray[dataArrayIndex].photoUriString);
					console.log(dbRecord.cachePath);
					if( (dbRecord.photoUriString != dataArray[dataArrayIndex].photoUriString) || (dbRecord.cachePath == null) ){
						//need to cache!!!
						resultDataArray.push(
							{
								name:dataArray[dataArrayIndex].name,
								type:dataArray[dataArrayIndex].type,
							}
						);
					}
					//remove, because whats left will be deleted!!!!!
					delete tmpForDeleteHash[dataArray[dataArrayIndex].name + dataArray[dataArrayIndex].type];
				}else{
					/*resultDataArray.push(
						{
							name:dataArray[dataArrayIndex].name,
							type:dataArray[dataArrayIndex].type,
						}
					);*/
				}
			}

			console.log('--------------------------------------------------------');
			console.log('pre check---:');
			console.log('resultDataArray');
			console.dir(resultDataArray);

			// convert Hash to Array----
			var needToDeleteArray = [];
			for(var tmpForDeleteHashIndex in tmpForDeleteHash){
				needToDeleteArray.push(tmpForDeleteHash[tmpForDeleteHashIndex]);
			}
			console.log('needToDeleteArray');
			console.dir(needToDeleteArray);

			console.log('--------------------------------------------------------');
			console.log('cacheContacts complete err/result:');
			console.log('resultDataArray');
			console.dir(resultDataArray);
			if(inPostFunction){inPostFunction(err, resultDataArray);}


			/*finish.map(needToDeleteArray, function(value, done){
				value.userId = fieldData.userId;
				_this.deleteCacheEntry(value, function(inErr, inResult){
					done(null, value);
				});
			},
			//completed Function--------------------------------
			function(err, results){
				console.log('--------------------------------------------------------');
				console.log('cacheContacts complete err/result:');
				console.log('resultDataArray');
				console.dir(resultDataArray);
				if(inPostFunction){inPostFunction(err, resultDataArray);}


			});*/




			//if(inPostFunction){inPostFunction(err, resultDataArray);}
		});



	}

	this.deleteCacheEntry = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		console.log('deleteCacheEntry:');
		console.dir(inParams);
		var fieldData = 
			{
				
				name:'',
				phoneNumber:'',
				emailAddress:'',
				companyName:'',
				department:'',
				title:'',
				imageUrl:'',
				ext:'',
				type:'',
				photoUriString:'',
				rawContactId:'',
				contactId:'',
				userId:false,
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}
		var sqlString = "'' as x;";

		/*var sqlString = 
			"DELETE FROM tb_cachePhoneContacts WHERE" 							+ " " + 
				"userId = " + connection.escape(parseInt(fieldData.userId)) 	+ " " + 
				"AND"															+ " " + 
				"name = " + connection.escape(fieldData.name) 					+ " " + 
				"AND"															+ " " + 
				"type = " + connection.escape(fieldData.type)
		;*/
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.getCacheFilePaths = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var fieldData = 
			{

			}
		fieldData = extend(fieldData, inParams);

		var sqlString = 
			"SELECT * FROM tb_fileCache"
		;
		console.log('SQL:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.addPhysicalPathsToWorkerTableArray = function(inOptions, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var options = 
			{
				code:'',
				dataArray:[],
			}
		options = extend(options, inOptions);

		finish.map(options.dataArray, function(value, done){
			_this.addPhysicalPathsToWorkerTable(
				{
					code:options.code,
					f0:value.f0,
					f1:value.f1,
				}, function(err, result){
					done();
				}
			);
		},
		//completed Function--------------------------------
		function(err, results){
			if(inPostFunction){
				inPostFunction(err, results);
			}
		});
	}

	this.addPhysicalPathsToWorkerTable = function(inParams, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var fieldData = 
			{
				code:'',
				f0:'',
				f1:'',
				f2:'',
				f3:'',
				f4:'',
			}
		fieldData = extend(fieldData, inParams);
		var sqlString = 
			"INSERT INTO tb_worker ( code, f0, f1, f2, f3, f4)" 		+ " " +
				"VALUES (" 												+ " " +
					connection.escape(fieldData.code) + "," 			+ " " +
					connection.escape(fieldData.f0) + 	"," 			+ " " +
					connection.escape(fieldData.f1) + 	"," 			+ " " +
					connection.escape(fieldData.f2) + 	"," 			+ " " +
					connection.escape(fieldData.f3) + 	"," 			+ " " +
					connection.escape(fieldData.f4) + 	");"
		;
		console.log('SQL:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});

	}

	this.getDeletablePhoneCacheFiles = function(inCode, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var sqlString = 
			"SELECT t1.code, t1.f0 AS domainPath, t1.f1 AS fullPath, t2.route  FROM tb_worker AS t1"+ " " +
				"LEFT JOIN tb_fileCache AS t2 ON t1.f0 = t2.path"									+ " " +
				"WHERE t2.route IS NULL"															+ " " +
					"AND"																			+ " " +
					"CODE = " + connection.escape(inCode)
		;
		console.log('SQL:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.deleteFromWorkerTable = function(inCode, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var sqlString = 
			"DELETE FROM tb_worker"+ " " +
				"WHERE CODE = " + connection.escape(inCode)
		;
		console.log('SQL:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}





}
module.exports = Model;