var path = require('path');
var basePath = path.dirname(require.main.filename);
var fs = require('fs');
var Connection = require(__dirname + '/connection.js');
//var nodemailer = require(basePath + '/node_modules/nodemailer');
var uuid = require(basePath + '/node_modules/node-uuid');
var extend = require(basePath + '/node_modules/node.extend');
var finish = require(basePath + '/node_modules/finish');
var moment = require(basePath + '/node_modules/moment');

var Mail = require(basePath + '/library/mail/mail.js');

var querystring = require('querystring')

var Underscore = require(basePath + '/node_modules/underscore');

connection = Connection.getInstance('arf').getConnection();




//model----------------
var Model = function(){
	var _this = this;
	var configData = fs.readFileSync('main.conf', 'utf8');
	configData = JSON.parse(configData);

	var createTimeStamp = function(){
		return moment().format("YYYY-MM-DD HH:mm:ss"); 
	}

	this.getProducts = function(inParams, inPostFunction){
		console.log('getProducts:');
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
			"SELECT *"  		+ " " +
			"FROM tb_products"	+ " " +
			"WHERE userId = " 	+ connection.escape(parseInt(fieldData.userId))
		;
		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.addProductArray = function(inUserId, theArray, inPostFunction){
		finish.map(theArray, function(value, done){
			value.userId = inUserId;
			_this.addProduct(value, function(inErr, inResult){
				done(null, value);
			});
		},

		//completed Function--------------------------------
		function(err, results){
			console.log('--------------------------------------------------------');
			console.log('addProductArray complete err/result:');
			if(inPostFunction){
				inPostFunction();
			}
		});
	}

	this.addProduct = function(inParams, inPostFunction){
		console.log('-------------------------------------------');
		console.log('addProduct entered');
		var fieldData = 
			{
				price:false,
				title:false,
				description:false,
				productType:false,
				productId:false,
				microPrice:false,
				currencyCode:false,
				isOwned:false,
				purchase:false,
				appId:false,

				userId:false,

			}
		fieldData = extend(fieldData, inParams);

		if(fieldData.isOwned == 'true'){
			console.log('=============== HAS PURCHASE =====================================');
			console.log('isOwned:' + fieldData.isOwned);
			console.log('purchase:');
			console.dir(fieldData.purchase);
			console.log('==================================================================');
		}

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		var sqlString = 
			"INSERT INTO tb_products ( price, title, description, productType, productId, microPrice, currencyCode, isOwned, updateTimeStamp, appId, userId) VALUES " + 
				"(" 																				  +
					connection.escape(fieldData.price) 												+ "," +
					connection.escape(fieldData.title)												+ "," +
					connection.escape(fieldData.description) 										+ "," +
					connection.escape(fieldData.productType)										+ "," +
					connection.escape(fieldData.productId) 											+ "," +
					connection.escape(fieldData.microPrice) 										+ "," +
					connection.escape(fieldData.currencyCode) 										+ "," +
					connection.escape(fieldData.isOwned) 											+ "," +
					connection.escape(createTimeStamp())											+ "," +
					connection.escape(fieldData.appId)												+ "," +
					connection.escape(parseInt(fieldData.userId))										  +
				" );"
		;
		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){//cleanPhoneNumber(fieldData.phoneNumber)
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.updateProductArray = function(inUserId, theArray, inPostFunction){
		finish.map(theArray, function(value, done){
			value.userId = inUserId;
			_this.updateProduct(value, function(inErr, inResult){
				done(null, value);
			});
		},

		//completed Function--------------------------------
		function(err, results){
			console.log('--------------------------------------------------------');
			console.log('updateProductArray complete err/result:');
			if(inPostFunction){
				inPostFunction();
			}
		});
	}

	this.updateProduct = function(inParams, inPostFunction){
		console.log('-------------------------------------------');
		console.log('addSms entered');
		var fieldData = 
			{
				price:false,
				title:false,
				description:false,
				productType:false,
				productId:false,
				microPrice:false,
				currencyCode:false,
				isOwned:false,
				appId:false,

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
			"UPDATE tb_products SET " 		+ 
					"price = " 				+ connection.escape(fieldData.price) 											+ "," +
					"title = " 				+ connection.escape(fieldData.title)											+ "," +
					"description = " 		+ connection.escape(fieldData.description) 										+ "," +
					"productType = " 		+ connection.escape(fieldData.productType)										+ "," +
					"microPrice = " 		+ connection.escape(fieldData.microPrice) 										+ "," +
					"currencyCode = " 		+ connection.escape(fieldData.currencyCode) 									+ "," +
					"isOwned = " 			+ connection.escape(fieldData.isOwned) 											+ "," +
					"updateTimeStamp = " 	+ connection.escape(createTimeStamp())											+ "," +
					"appId = " 				+ connection.escape(fieldData.appId)											+ " " +
					"WHERE"																									+ " " +
						"userId = " 			+ connection.escape(parseInt(fieldData.userId))								+ " " +
					"AND"																									+ " " +
						"productId = " 			+ connection.escape(fieldData.productId)
		;
		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.updateOrAddProductsAndPurchases = function(inParams, inPostFunction){
		console.log('updateOrAddProductsAndPurchases:');
		console.dir(inParams);
		var fieldData = 
			{
				userId:false,
				dataArray:false,
			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not mutated';
				inPostFunction(err, false, false);
			}
		}

		//======= PURCHASES ========================================================
		var purchaseArray = [];
		for(dataArrayIndex in fieldData.dataArray){
			if(fieldData.dataArray[dataArrayIndex].purchase){
				purchaseArray.push(fieldData.dataArray[dataArrayIndex].purchase);
			}
		}

		_this.processPurchases(fieldData.userId, purchaseArray, function(err, result){


			//======= PRODUCTS ========================================================
			_this.getProducts({userId:fieldData.userId}, function(err, productResult){
				var existingProductsHash = {};
				for(var productResultIndex in productResult){
					existingProductsHash[productResult[productResultIndex].productId] = productResult[productResultIndex];
				}

				var fromGoogleHash = {};
				for(var dataArrayIndex in fieldData.dataArray){
					fromGoogleHash[fieldData.dataArray[dataArrayIndex].productId] = fieldData.dataArray[dataArrayIndex];
					if(existingProductsHash[fieldData.dataArray[dataArrayIndex].productId]){
						fromGoogleHash[fieldData.dataArray[dataArrayIndex].productId].exist = true;
					}else{
						fromGoogleHash[fieldData.dataArray[dataArrayIndex].productId].exist = false;
					}
				}


				console.log('ok returning crapt5555');
				//var resultX0 = fromGoogleHash;

				var theInsertArray = [];
				var theUpdateArray = [];
				for(var googleHashKey in fromGoogleHash){
						var googleRecord = fromGoogleHash[googleHashKey];
					if(googleRecord.exist){
						theUpdateArray.push(googleRecord);
					}else{
						theInsertArray.push(googleRecord);
					}
				}
				_this.addProductArray(fieldData.userId, theInsertArray, function(err_00, result_00){
					console.log('addProductArray callback!!');
					_this.updateProductArray(fieldData.userId, theUpdateArray, function(err_01, result_01){
						console.log('updateProductArray callback!!');
						if(inPostFunction){inPostFunction(err_01, result_01);}
					});
				});
			});//END PRODUCT




		});//END PURCHASES


	}

	this.getShowCaseProducts = function(inParams, inPostFunction){
		console.log('getShowCaseProducts:');
		console.dir(inParams);
		var fieldData = 
			{
				appId:false,
			}
		fieldData = extend(fieldData, inParams);

		var sqlString = 
			"SELECT *"  		+ " " +
			"FROM tb_showCaseProduct"	+ " " +
			"WHERE appId = " 	+ connection.escape(fieldData.appId)
		;
		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.getPurchasesForUser = function(inParams, inPostFunction){
		console.log('getShowCaseProducts:');
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
			"SELECT *"  		+ " " +
			"FROM tb_purchases"	+ " " +
			"WHERE userId = " 	+ connection.escape(parseInt(fieldData.userId))
		;
		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.addPurchase = function(inParams, inPostFunction){
		console.log('-------------------------------------------');
		console.log('addProduct entered');
		var fieldData = 
			{
				itemType:'',
				orderId:'',
				packageName:'',
				purchaseTime:'',
				purchaseState:'',
				developerPayLoad:'',
				token:'',
				originalJson:'',
				signature:'',
				userGuid:'',

				userId:false,

			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		// --  PURCHASE LOG ENTRY  -----------------------------------
		_this.purchaseLogAdd('insert', fieldData, function(){});

		var sqlString = 
			"INSERT INTO tb_purchases ( itemType, orderId, packageName, purchaseTime, purchaseState, developerPayLoad, token, originalJson, signature, userGuid, userId) VALUES " + 
				"(" 																				+
					connection.escape(fieldData.itemType) 											+ "," +
					connection.escape(fieldData.orderId)											+ "," +
					connection.escape(fieldData.packageName) 										+ "," +
					connection.escape(fieldData.purchaseTime) 										+ "," +
					connection.escape(fieldData.purchaseState) 										+ "," +
					connection.escape(fieldData.developerPayLoad) 									+ "," +
					connection.escape(fieldData.token) 												+ "," +
					connection.escape(fieldData.originalJson)										+ "," +
					connection.escape(fieldData.signature)											+ "," +
					connection.escape(fieldData.userGuid)											+ "," +


					connection.escape(parseInt(fieldData.userId))									+
				" );"
		;
		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){//cleanPhoneNumber(fieldData.phoneNumber)
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}


	this.updatePurchase = function(inParams, inPostFunction){
		console.log('-------------------------------------------');
		console.log('updatePurchase entered');
		var fieldData = 
			{
				itemType:false,
				orderId:false,
				packageName:false,
				purchaseTime:false,
				purchaseState:false,
				developerPayLoad:false,
				token:false,
				originalJson:false,
				signature:false,
				userGuid:false,
				//lastUpdateTime:createTimeStamp(),

				userId:false,

			}
		fieldData = extend(fieldData, inParams);

		if(!(fieldData.userId)){
			if(inPostFunction){
				var err = 'No User Id, records will not be added(contactModel.addContact)';
				inPostFunction(err, false, false);
			}
		}

		// --  PURCHASE LOG ENTRY  -----------------------------------
		_this.purchaseLogAdd('update', fieldData, function(){});

		var sqlString = 
			"UPDATE tb_purchases SET " 		+ 
					"itemType = " 				+ connection.escape(fieldData.itemType) 										+ "," +
					"orderId = " 				+ connection.escape(fieldData.orderId)											+ "," +
					"packageName = " 		+ connection.escape(fieldData.packageName) 											+ "," +
					"purchaseTime = " 		+ connection.escape(fieldData.purchaseTime) 										+ "," +
					"purchaseState = " 		+ connection.escape(fieldData.purchaseState) 										+ "," +
					"developerPayLoad = " 			+ connection.escape(fieldData.developerPayLoad) 							+ "," +
					"token = " 	+ connection.escape(fieldData.token)															+ "," +
					"originalJson = " 	+ connection.escape(fieldData.originalJson)												+ "," +
					"signature = " 	+ connection.escape(fieldData.signature)													+ "," +
					"lastUpdateTime = "			+ connection.escape(createTimeStamp())									+ "," +
					"userGuid = " 				+ connection.escape(fieldData.userGuid)											+ " " +
					"WHERE"																										+ " " +
						"userId = " 			+ connection.escape(parseInt(fieldData.userId))									+ " " +
					"AND"																										+ " " +
						"orderId = " 			+ connection.escape(fieldData.orderId)
		;
		console.log('sql:' + sqlString);
		connection.query(sqlString, function(err, result){
			console.log('error' + err);
			if(inPostFunction){inPostFunction(err, result);}
		});
	}

	this.addPurchaseArray = function(inUserId, theArray, inPostFunction){
		finish.map(theArray, function(value, done){
			value.userId = inUserId;
			_this.addPurchase(value, function(inErr, inResult){
				done(null, value);
			});
		},

		//completed Function--------------------------------
		function(err, results){
			console.log('--------------------------------------------------------');
			console.log('addPurchaseArray complete err/result:');
			if(inPostFunction){
				inPostFunction();
			}
		});
	}

	this.updatePurchaseArray = function(inUserId, theArray, inPostFunction){
		finish.map(theArray, function(value, done){
			value.userId = inUserId;
			_this.updatePurchase(value, function(inErr, inResult){
				done(null, value);
			});
		},

		//completed Function--------------------------------
		function(err, results){
			console.log('--------------------------------------------------------');
			console.log('updatePurchase complete err/result:');
			if(inPostFunction){
				inPostFunction();
			}
		});
	}

	this.processPurchases = function(inUserId, theArray, inPostFunction){
		console.log('processPurchases');
		console.dir(theArray);

		var storedPurchaseHash = {};
		_this.getPurchasesForUser({userId:inUserId}, function(inErr_0, storedUserPachaseArray){
			// build traversal hashes---------
			Underscore.each(storedUserPachaseArray, function(element, index, list){
				storedPurchaseHash[element.orderId] = element;
			});

			console.log('storedPurchaseHash:');
			console.dir(storedPurchaseHash);

			var incomingHash = {};
			Underscore.each(theArray, function(element, index, list){
				incomingHash[element.orderId] = element;
			});

			console.log('incomingHash:');
			console.dir(incomingHash);

			//-----start building decissional structs
			var existingKeys = [];
			var needUpdateHash = {};
			var missingPurchasesArray = [];

			for(var incomingHashKey in incomingHash){
				if(storedPurchaseHash[incomingHashKey]){
					existingKeys.push(incomingHashKey);
					var prepVar = 
						{ 
							id: storedPurchaseHash[incomingHashKey].id,
							entryTime: storedPurchaseHash[incomingHashKey].entryTime,
							lastUpdateTime: storedPurchaseHash[incomingHashKey].lastUpdateTime,
							itemType: '',
							orderId: '',
							packageName: '',
							purchaseTime: '',
							purchaseState: '',
							developerPayLoad: '',
							token: '',
							originalJson: '',
							signature: '',
							userId: inUserId,
							userGuid: '' 
						}
					prepVar = extend(prepVar, incomingHash[incomingHashKey]);

					console.log('incomingHash[incomingHashKey]');
					console.dir(incomingHash[incomingHashKey]);

					console.log('prepVar');
					console.dir(prepVar);

					console.log('storedPurchaseHash[incomingHashKey]');
					console.dir(storedPurchaseHash[incomingHashKey]);

					console.log('FOUND KEY:' + incomingHashKey);
					if(Underscore.isMatch(prepVar, storedPurchaseHash[incomingHashKey])){
						console.log('Underscore.isEqual !!!');
					}else{
						console.log('NOT Underscore.isEqual !!!');
						needUpdateHash[incomingHashKey] = prepVar;
					}


				}else{
					//does not exits in purchase storage, lets change that ....
					missingPurchasesArray.push(incomingHash[incomingHashKey]);
				}

			}//END FOR

			console.log('TO ARRAY');
			console.dir(Underscore.toArray(needUpdateHash));


			//update purchases.....
			_this.updatePurchaseArray(inUserId, Underscore.toArray(needUpdateHash), function(inErr, inResult){

				_this.addPurchaseArray(inUserId, missingPurchasesArray, function(inErr, inResult){
					if(inPostFunction){inPostFunction(inErr, inResult);}
				});
			});







			//if(inPostFunction){inPostFunction(false, false);}


		});


	}

	this.purchaseLogAdd = function(inAction, inEntry, inPostFunction){
		var wrapper = 
			{
				action:inAction,
				when:createTimeStamp(),
				entry:inEntry,

			}


		fs.appendFile(basePath + '/purchase.log', JSON.stringify(wrapper) + "\n", encoding='utf8', function (err) {
			if(inPostFunction){inPostFunction(err);}
		});

	}






}



module.exports = Model;