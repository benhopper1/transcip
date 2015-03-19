/*
*USE LIKE:
*var commManager = commManagerNameSpace.getCommManagerInstance();
*put this in file that this inclusion exist...
*
*/

console.log('CommManagerNameSpace loading');


var CommManagerNameSpace = function(){

	var commManagerInstance;
	this.getCommManagerInstance = function(inData){
		if(!(commManagerInstance)){
			commManagerInstance = new CommManager(inData);
			globalFilters = new GlobalFilters(commManagerInstance, inData);
		}
		return commManagerInstance;
	}


	var GlobalFilters = function(inCommManagerInstance, inInstanceData){
		var filterObj = new inCommManagerInstance.FilterObject();
		filterObj.add('advise', function(inMsg, inLocal, inData, inRefObj){
			console.log('advise');
			if(inData){
					if(inData.dataLayer.action == 'login'){
						commManagerInstance.familyDeviceConnect(inMsg, inLocal, inData, inRefObj);
						if(inInstanceData.onFamilyDeviceConnect){
							inInstanceData.onFamilyDeviceConnect(inMsg, inLocal, inData, inRefObj);
						}
					}

					if(inData.dataLayer.action == 'logout'){
						if(inInstanceData.onFamilyDeviceDisconnect){
							inInstanceData.onFamilyDeviceDisconnect(inMsg, inLocal, inData, inRefObj);
						}
						commManagerInstance.familyDeviceDisconnect(inMsg, inLocal, inData, inRefObj);
					}
			}
		});
	}


	//##########################################################################
	//C o m m M a n g e r
	//##########################################################################
	var CommManager = function(inData){
		var _this = this;
		var filterSets = [];
		var filterIndex = 0;

		var filterSetHashOfArray;

		var connectedDevices = {};
		var connectedDeviceId = getDeviceId();

		var webSocketClient;

		//##--CALLBACK FUNCTIONS--
		var function_onMessageReceive;
		var function_onConnect;

		var connectToDeviceTypes = [];
		if(inData.connectToDeviceTypes){
			connectToDeviceTypes = inData.connectToDeviceTypes;
		}
		var connectToDeviceTypesWhen = 
			[
				'isFamilyDevice',
				'isGroupDevice'
			];

		if(inData.connectToDeviceTypesWhen){
			connectToDeviceTypesWhen = inData.connectToDeviceTypesWhen;
		}

		this.getFamilyDevicesCredentials = function(inPostFunction){
			var transportLayer = new TransportLayer();
				transportLayer
					.userId(getUserId())
					.deviceId(getDeviceId())
					.securityToken('$ecurity4')
				;
				transportLayer.routingLayer()
					.type('transactionToServer')
					.add('command', 'returnAllCredentialsForUser')
				;
				transportLayer.dataLayer()
					.add('dataTest55key', '55Value')

			_this.sendTransaction(transportLayer, function(inTransportLayer){
				if(inPostFunction){
					inPostFunction(inTransportLayer.toJson().dataLayer.credentialsPackage);
				}
			});
		}

		this.familyDeviceConnect = function(inMsg, inLocal, inData, inRefObj){
			console.log('--------------new familyDeviceConnect-----------------');
			console.dir(inData);
			_this.deviceConnections.add(inData);
		}

		this.familyDeviceDisconnect = function(inMsg, inLocal, inData, inRefObj){
			console.log('--------------new familyDeviceDisconnect-----------------');
			console.dir(inData);
			_this.deviceConnections.remove(inData);
		}

		this.loginByScan = function(inData){
			var transportLayer = new TransportLayer();
			transportLayer
				.userId('')
				.deviceId('')
				.securityToken('$ecurity4')
				.transactionId(false)
			;
			transportLayer.routingLayer()
				.type('transactionToServer')
				.add('command', 'waitForQr')
			;
			transportLayer.dataLayer()
				.add('userName', 'na')
				.add('password', 'na')
				.add('deviceNumber', 'devNumber$rr')
				.add('userAgent', navigator.userAgent)
				.add('deviceType', 'desktopBrowser')
			;

			_this.sendTransaction(transportLayer, function(inTransportLayer){
				if(inData.onScan){
					inData.onScan(inTransportLayer.toJson().dataLayer, inTransportLayer);
				}
			});
		}


		this.login = function(inData){
			var transportLayer = new TransportLayer();
			transportLayer
				.userId(getUserId())
				.deviceId(getDeviceId())
				.securityToken('$ecurity4')
				.transactionId(false)
			;
			transportLayer.routingLayer()
				.type('setupToServer')
			;
			transportLayer.dataLayer()
				.add('userName', inData.userName)
				.add('password', inData.password)
				.add('deviceNumber', 'devNumber$rr')
				.add('userAgent', navigator.userAgent)
				.add('deviceType', 'desktopBrowser')
			;

			webSocketClient.sendString(transportLayer.toString());
		}


		this.transactionToDeviceToken = function(inData){

			var transportLayer = new TransportLayer();
			transportLayer
				.userId('')
				.deviceId('')
				.securityToken('$ecurity4')
				.transactionId(false)
			;
			transportLayer.routingLayer()
				.type('transactionToToken')
				.add('stage', 'sourceOut')
				//.add('command', 'getDeviceType')
				.add('targetTokenId', commManager.getConnectedDeviceTokenId())
			;
			if(inData.routing){
				transportLayer.routingLayer().merge(inData.routing);
			}

			transportLayer.dataLayer()
				.buildFromJson({dataTest:'dataValue'})
			;
			if(inData.data){
				transportLayer.dataLayer().buildFromJson(inData.data);
			}

			if(inData.onBeforeSend){
				inData.onBeforeSend(transportLayer);
			}

			_this.sendTransaction(transportLayer, function(inTransportLayer){
				if(inData.onComplete){
					inData.onComplete(inTransportLayer.toJson().dataLayer, inTransportLayer);
				}
			});

			if(inData.onAfterSend){
				inData.onAfterSend(transportLayer);
			}
		}




		$.getScript("/js/commmanager/transportlayer.js", function(ignored, inStatusText){
			console.log('Loading ---------> transportlayer');
			console.log('transportlayer :' + inStatusText);

			//#######################################################################################
			//
			//----WebSocketClient  ---------------A R E A
			//
			//#######################################################################################

			$.getScript("/js/commmanager/websocketclient.js", function(ignored, inStatusText){
				console.log('Loading ---------> webSocketClient');
				console.log('webSocketClient :' + inStatusText);
				var isSecure = true; // use wss
				webSocketClient = new WebSocketClient(inData.webSocketClient.address, inData.webSocketClient.port, inData.webSocketClient.connectString, isSecure);

				//#################################################
				//EVENT -> onError                  WebSocketClient
				//#################################################
				webSocketClient.setOnError(function(data){
					console.log("onError:"+JSON.stringify(data));
					console.log('####################--WebSocketClient--##############################################');
					console.log('------> C O N N E C T I O N   F A I L E D , check host(ip, is launched etc...)<------');
					console.log('#####################################################################################');
				});


				//#################################################
				//EVENT -> onOpen                   WebSocketClient
				//#################################################
				webSocketClient.setOnOpen(function(data){
					console.log("onOpen:"+JSON.stringify(data));
					if(inData.onReady){inData.onReady();}
					if(inData.login){
						commManagerInstance.login(inData.login);
					}
					if(inData.loginByScan){
						commManagerInstance.loginByScan(inData.loginByScan);
					}

					if(function_onConnect){function_onConnect(data);}

				});

				//#################################################
				//EVENT -> onClose                   WebSocketClient
				//#################################################
				webSocketClient.setOnClose(function(data){
					console.log("webSocketClient onclose");
					
				});

				//#################################################
				//EVENT -> onMessage                WebSocketClient
				//#################################################
				webSocketClient.setOnMessage(function(data){
					console.log('webSocketClient.setOnMessage!!');
					console.dir(data);
					processMessages(data);
					if(inData.onMessage){inData.onMessage(data);}
				});



				//#################################################
				//EVENT -> onTransactionSeries      WebSocketClient
				//#################################################
				webSocketClient.setOnTransactionSeries(function(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json){
					console.log('webSocketClient.setOnTransactionSeries!!');
					console.dir(inTransportLayer_json);
					//processMessages(data);
					if(commManagerInstance.onReceive_transactionSeries){commManagerInstance.onReceive_transactionSeries(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json);}
				});



				//#################################################
				//EVENT -> OnLoginSuccess           WebSocketClient
				//#################################################
				webSocketClient.setOnLoginSuccess(function(data){
					if(inData.onLoginSuccess){

						commManagerInstance.getFamilyDevicesCredentials(function(inCredentialsArray){
							var filteredCredentialsArray = [];
							for(index in inCredentialsArray){
								if(connectToDeviceTypes.length){
									for(dTypesIndex in connectToDeviceTypes){
										if(inCredentialsArray[index].deviceType == connectToDeviceTypes[dTypesIndex]){
											inCredentialsArray[index].caption = inCredentialsArray[index].deviceTokenId;
											filteredCredentialsArray.push(inCredentialsArray[index]);
											commManagerInstance.setConnectedDeviceTokenId(inCredentialsArray[index].deviceTokenId);
										}
									}
								}else{
									inCredentialsArray[index].caption = inCredentialsArray[index].deviceTokenId;
									filteredCredentialsArray.push(inCredentialsArray[index]);
									commManagerInstance.setConnectedDeviceTokenId(inCredentialsArray[index].deviceTokenId);
								}
							}
							console.log('getConnectedDeviceTokenId:' + commManagerInstance.getConnectedDeviceTokenId());
							inData.onLoginSuccess(data, inCredentialsArray, filteredCredentialsArray);
						});
					}
				});


				//#################################################
				//EVENT -> OnLoginFailure          WebSocketClient
				//#################################################
				webSocketClient.setOnLoginFailure(inData.onLoginFailure);

				webSocketClient.open('Browser Device');

			});//websocketclient end--
		});//transportlayer end--


		this.getFilterSets = function(){
			return filterSets;
		}

		this.removeFilterSet = function(inFilterSetId){	
			var theBigHash = filterSetHashOfArray.getHash();
			for(key in theBigHash){
				var arrayForThatKey = filterSetHashOfArray.getArrayFromHash(key);
				for(index in arrayForThatKey){
					if(arrayForThatKey[index].id == inFilterSetId){
						console.log('removeing filter:' + arrayForThatKey[index].id);
						filterSetHashOfArray.removeItemFromSpecificHash(key, arrayForThatKey[index]);
					}
				}
			}
		}

		this.addFilterSet = function(inFilterSet){
			if(!(filterSetHashOfArray)){
				filterSetHashOfArray = new HashOfArrayObject(true);
			}
			console.log('FilterSet.addFilterSet:'+JSON.stringify(inFilterSet));
			inFilterSet.id = filterIndex++;
			filterSetHashOfArray.add(inFilterSet.filter[0].filterKey, inFilterSet);

			return inFilterSet.id;
		} 

		var processMessages = function(inMsg){
			var TL_fromServer = new TransportLayer();
			TL_fromServer.fromServerBuild(inMsg);

			if(TL_fromServer.toJson().routingLayer){
				if(TL_fromServer.toJson().routingLayer.type == 'tokenToTokenUseFilter'){
					if(TL_fromServer.toJson().routingLayer.filterKey == 'filter' && TL_fromServer.toJson().routingLayer.filterValue){
						var arrayForThatKey = filterSetHashOfArray.getArrayFromHash(TL_fromServer.toJson().routingLayer.filterValue);
						for(filterEntry in arrayForThatKey){
							arrayForThatKey[filterEntry].execute(_this, arrayForThatKey[filterEntry].filter[0], TL_fromServer.toJson(), '');
						}
					}
					return;
				}

				if(TL_fromServer.toJson().routingLayer.type == 'transactionToClient' || (TL_fromServer.toJson().routingLayer.type == 'transactionToToken' && TL_fromServer.toJson().routingLayer.stage == 'serverOut2')){
					var transactionId = TL_fromServer.toJson().transactionId;
					var postFunction = transactionHash[TL_fromServer.toJson().transactionId];
					if(postFunction){
						postFunction(TL_fromServer);
						delete transactionHash[TL_fromServer.toJson().transactionId];
					}
					return;
				}

				if(TL_fromServer.toJson().routingLayer.type == 'transactionToToken' && TL_fromServer.toJson().routingLayer.stage == 'serverOut'){
					commManagerInstance.TransactionResponseObject.process(TL_fromServer.toJson().routingLayer.command, TL_fromServer);
					return;
				}
			}
		}

		this.set_callback_onConnect = function(inFunction){
			function_onConnect = inFunction;
		}

		this.set_callback_onMessageReceive = function(inFunction){
			function_onMessageReceive = inFunction;
		}

		this.send = function(inMessage){
			webSocketClient.send(inMessage);
		}

		this.sendString = function(inString){
			webSocketClient.sendString(inString);
		}

		this.deviceConnections = new function(){
			var _this = this;
			var deviceTokenIdHash = {};
			this.add = function(inData){
				deviceTokenIdHash[inData.routingLayer.fromDeviceTokenId] = 
					{
						userId:inData.userId,
						devicetokenId:inData.routingLayer.fromDeviceTokenId,
						deviceType:inData.routingLayer.deviceType,
						userAgent:inData.routingLayer.userAgent
					};
			}

			this.reset = function(){
				deviceTokenIdHash = {};
			}

			this.remove = function(inData){
				delete deviceTokenIdHash[inData.routingLayer.fromDeviceTokenId];
				if(commManagerInstance.getConnectedDeviceTokenId() == inData.routingLayer.fromDeviceTokenId){
					commManagerInstance.setConnectedDeviceTokenId(_this.getDeviceTokenIdFromBackstack());
				}
			}

			this.getDeviceTokenIdFromBackstack = function(){
				var backstack = Object.keys(deviceTokenIdHash);
				if(backstack.length > 0){
					return backstack[backstack.length - 1].devicetokenId;
				}else{
					return false;
				}
			}
		}();

		var transactionHash = {};
		this.sendTransaction = function(inTransportLayer, inPostFunction){
			var uuid = new Date().getTime();
			inTransportLayer.transactionId(uuid);
			console.log('sending transaction' + uuid);
			transactionHash[uuid] = inPostFunction;
			_this.sendString(inTransportLayer.toString());
		}
//############################################################################
//-------->  t r a n s a c t i o n   S e r i e s  <---------------------------
//############################################################################
		var transactionSeriesHash = {};
		this.sendTransactionSeries = function(inJsonStruct){
			var uuid = new Date().getTime() + "z";
			var currentHasNext = "?"
			var transportLayer = new TransportLayer();
			transportLayer
				.userId('')
				.deviceId('')
				.securityToken('$ecurity4')
				.transactionId(false)
			;
			transportLayer.routingLayer()
				.add('transactionSeriesId', uuid)
				.type('transactionSeriesToToken')
				.add('stage', 'firstSourceOut')
				.add('targetTokenId',commManager.getConnectedDeviceTokenId())
				.add('frame', '0')
				.add('command', inJsonStruct.command)
			;
			if(inJsonStruct.data){
				transportLayer.dataLayer().buildFromJson(inJsonStruct.data);
			}else{

				transportLayer.dataLayer()
					.add('notUsed', 'na')
				;

			}
			commManager.sendString(transportLayer.toString());
			//------data stored per transactionSeries-----
			var startupData = 
				{
					uuid:uuid,
					command:inJsonStruct.command,
					onFirst:inJsonStruct.onFirst,
					onLast:inJsonStruct.onLast,
					onAll:inJsonStruct.onAll,
					onComplete:inJsonStruct.onComplete
				}
			//----
			transactionSeriesHash[uuid] = new function(inData){
				var _this = this;
				var uuid = inData.uuid;
				var frame = 0;
				var command = inData.command;

				this.reportOnFirst = function(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next){
					if(inData.onFirst){
						inData.onFirst(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next);
					}
				}
				this.reportOnLast = function(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next){
					if(inData.onLast){
						inData.onLast(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next);
					}
				}

				this.reportOnAll = function(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next){
					currentHasNext = inTransportLayer_json.routingLayer.hasNext;
					if(inData.onAll){
						inData.onAll(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next);
					}
				}
				this.reportOnComplete = function(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next){
					if(inData.onComplete){
						inData.onComplete(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next);
					}
				}
				this.next = function(){
					if(currentHasNext == '0'){return;}//
					frame++;
					var transportLayer = new TransportLayer();
					transportLayer
						.userId('')
						.deviceId('')
						.securityToken('$ecurity4')
						.transactionId(false)
					;
					transportLayer.routingLayer()
						.add('transactionSeriesId', uuid)
						.type('transactionSeriesToToken')
						.add('stage', 'nextSourceOut')
						.add('targetTokenId', commManager.getConnectedDeviceTokenId())
						.add('frame', frame.toString())
						.add('command', inJsonStruct.command)
					commManager.sendString(transportLayer.toString());
				}
				this.getFrame = function(){
					return frame;
				}
			}(startupData);
				
		}

		//NEXT----
		this.sendTransactionSeriesNext = function(){

		}
		//--best not to use next() within onFirst, because onAll will be called after onfirst..lol
		this.onReceive_transactionSeries = function(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json){
			console.log('onReceive_transactionSeries------------------------------');
			console.dir(inTransportLayer_json);
			console.log('inTransactionSeriesId' + inTransactionSeriesId);
			var storedObject = transactionSeriesHash[inTransactionSeriesId];
			console.log('storedObject frame:' + storedObject.getFrame());
			console.dir(storedObject);
			if(!(storedObject)){console.log('stored object missing');}
			if(parseInt(inFrame) == 0){
				if(storedObject.reportOnFirst){storedObject.reportOnFirst(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, storedObject.next);}
				
				if(inTransportLayer_json.routingLayer.hasNext == "0"){
					console.log('hasNext == 0 Frame == 0');
					if(storedObject.reportOnAll){storedObject.reportOnAll(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, storedObject.next);}
					if(storedObject.reportOnLast){storedObject.reportOnLast(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, storedObject.next);}
					if(storedObject.reportOnComplete){storedObject.reportOnComplete(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, storedObject.next);}
				}else{
					if(storedObject.reportOnAll){storedObject.reportOnAll(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, storedObject.next);}
				}
			}
			if(parseInt(inFrame) != 0){
				console.log('HOPPER -> FRAME != 0');
				if(inTransportLayer_json.routingLayer.hasNext  == "0"){
					console.log("HOPPER -> FRAME != 0 && hasNext == 0");
					console.log('hasNext == 0 Frame != 0');
					//testing onall???? next will not run on reportall last iteration.. see empty function param
					if(storedObject.reportOnAll){storedObject.reportOnAll(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, function(){});}
					if(storedObject.reportOnLast){storedObject.reportOnLast(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, storedObject.next);}
					if(storedObject.reportOnComplete){storedObject.reportOnComplete(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, storedObject.next);}
				
				}else{
					if(storedObject.reportOnAll){storedObject.reportOnAll(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, storedObject.next);}
					
				}
			}

			//storedObject.next();
		}


//------------ T R A N S A C T I O N    R E S P O N S E   O B  J E C T  -------------------------------------------------------------
		var TransactionResponseObjectHash = [];
		this.TransactionResponseObject = new function(){
			var _this = this;
			this.add = function(inData){
				console.log('adding command :');
				console.dir(inData);
				if(inData.command && inData.onMatch){
					TransactionResponseObjectHash[inData.command] = inData.onMatch;
				}
			}

			this.remove = function(inCommand){
				if(TransactionResponseObjectHash[inCommand]){
					delete TransactionResponseObjectHash[inCommand];
				}
			}

			this.process = function(inCommand, inTransportLayer){
				var functionToRun = TransactionResponseObjectHash[inCommand];
				if(functionToRun){
					var returnTransaction = function(inDataLayer_json){
						inTransportLayer.routingLayer()
							.clean()
							.add("type", "transactionToToken")
							.add("stage", "targetOut")
						;
						inTransportLayer.dataLayer().buildFromJson(inDataLayer_json);
						//inTransportLayer.addDataLayer(new DataLayer().buildFromJson(inDataLayer_json).toJson());
						commManagerInstance.sendString(inTransportLayer.toString());
					}
					functionToRun(inTransportLayer, returnTransaction);
				}
			}



		}();

//------------ F I L T E R   O B  J E C T  -------------------------------------------------------------

		this.FilterObject = function(inData){
			var _this = this;
			var commManager = commManagerNameSpace.getCommManagerInstance();
			var filterIdHash = {};

			// store filters passed in constructor...instance only, allows cleanup 
			if(inData){
				for(index in inData){
					var thisFilterId = commManager.addFilterSet(inData[index]);
					filterIdHash[thisFilterId] = thisFilterId;
				}
			}

			this.addFilter = function(inFilter){
				var thisFilterId = commManager.addFilterSet(inFilter);
				filterIdHash[thisFilterId] = thisFilterId;
				return thisFilterId;
			}

			this.removeFilter = function(inFilterId){
				delete filterIdHash[inFilterId];
			}

			//remove all filters for this instance
			this.destroy = function(){
				for(index in filterIdHash){
					commManager.removeFilterSet(filterIdHash[index]);
				}
			}

			this.test = function(){
				console.log('testtttt1111112222233333');
			}

			this.add = function(inFilterKey, inFunction){
				var filterId = _this.addFilter(
					{
						'filter':
							[
								{
									'filterKey' : inFilterKey
								}
							],

						'execute' : inFunction
					}
				);
				return filterId;
			}
		}

		var connectedDeviceTokenId;
		this.setConnectedDeviceTokenId = function(inDeviceTokenId){
			connectedDeviceTokenId = inDeviceTokenId;
		}
		this.getConnectedDeviceTokenId = function(){return connectedDeviceTokenId;}

		this.sendCommand = function(toDeviceTokenId, inCommand, inCommandData){
			var transportLayer = new TransportLayer();
			transportLayer
				.userId(getUserId())
				.deviceId(getDeviceId())
				.securityToken('$ecurity4')
				.transactionId(false)
			;
			transportLayer.routingLayer()
				.type('tokenToTokenUseFilter')
				.add('toDeviceTokenId', toDeviceTokenId)
				.add('filterKey', 'filter')
				.add('filterValue', inCommand)
			;
			transportLayer.dataLayer()
				.buildFromJson(inCommandData)
			;

			webSocketClient.sendString(transportLayer.toString());
		}



	}


	var HashOfArrayObject = function(inAllowDuplicates){
		var _this = this;
		var hash = {};
		var allowDuplicates = inAllowDuplicates;



		this.add = function(inKey, inValue){
			inKey = inKey.toString();
			if(!(hash[inKey])){
				hash[inKey] = [];
			}
			if(allowDuplicates){
				hash[inKey].push(inValue);
			}else{
				if(hash[inKey].indexOf(inValue) == -1){
					hash[inKey].push(inValue);
				}
			}
			
		}

		this.removeItemFromSpecificHash = function(inKey, inValue){
			inKey = inKey.toString();
			var attemptValue = hash[inKey];
			if(!(attemptValue)){
				return false;
			}
			var arrayOfValues = attemptValue;
			for(var i = 0; i < arrayOfValues.length; i++){
				if(arrayOfValues[i] == inValue){
				   delete arrayOfValues[i];
				   hash[inKey] = arrayOfValues.filter(function(e){return e});
				   return true;
				}
			}
			return false;        
		}

		this.removeItemFromAnyHash = function(inValue){
			var retBool = false;        
			for(hashKey in hash){        
				var arrayOfValues = hash[hashKey];
				for(var i = 0; i < arrayOfValues.length; i++){
					if(arrayOfValues[i] == inValue){
					   delete arrayOfValues[i];
					   hash[hashKey] = arrayOfValues.filter(function(e){return e});
					   retBool = true;
					}
				}
			}
			return retBool;
		};

		this.removeArrayFromHash = function(inKey){
			inKey = inKey.toString();
			var attemptValue = hash[inKey];
			if(!(attemptValue)){
				return false;
			}
			delete hash[inKey];
		}

		this.copy = function(inSourceKey, inTargetKey){
			var inSourceKey = inSourceKey.toString();
			var inTargetKey = inTargetKey.toString();

			if(!(inSourceKey in hash)){
				return false;
			}

			if(!(inTargetKey in hash)){
				hash[inTargetKey] = [];
			}

			//copy
			var arrayFromSource = hash[inSourceKey];
			var arrayFromTarget = hash[inTargetKey];
			for(var i = 0; i < arrayFromSource.length; i++){
				arrayFromTarget.push(arrayFromSource[i]);
			}
		}

		this.dump = function(inHead){
			for(hashKey in hash){        
				var arrayOfValues = hash[hashKey];
				for(var i = 0; i < arrayOfValues.length; i++){
					if(inHead){                    
						console.log(inHead+"->"+hashKey+"[" + i + "]:"+JSON.stringify(hash[hashKey][i]));
					}else{
						console.log(hashKey+"[" + i + "]:"+JSON.stringify(hash[hashKey][i]));
					}
					
				}
			}
		}



		this.getArrayFromHash = function(inKey){
			inKey = inKey.toString();
			var attemptValue = hash[inKey];
			if(!(attemptValue)){
				return false;
			}

			return attemptValue;
		}

		this.getItemFromArray = function(inKey, inIndex){
			if(!(inKey in hash)){
				return false;
			}

			var arrayOfItems = hash[inKey];
			if(inIndex < arrayOfItems.length){
				return arrayOfItems[inIndex];
			}
			return false;  

		}

		this.getLengthOfArray = function(inKey){
			if(!(inKey in hash)){
				return false;
			}
			return hash[inKey].length;
		}

		this.getHash = function(){
			return hash;
		}


	}

};



if(typeof commManagerNameSpace == 'undefined' || !(commManagerNameSpace)){
	commManagerNameSpace = new CommManagerNameSpace();
}


