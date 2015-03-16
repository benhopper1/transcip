var WebSocketClient = function(inHost, inPort, inProtocal, isSecure){
	var connectionString;
	if(isSecure){
		//connectionString = "wss://192.168.0.16:30300"
		connectionString = "wss://" + inHost + ":" + inPort;
	}else{
		connectionString = "ws://" + inHost + ":" + inPort;
	}
	console.log('WEBSOCKET:' + connectionString);
	//var connectionString = "ws://" + inHost + ":" + inPort	
	//var connectionString = "wss://192.168.0.16:30300"
	var _this = this;

	var webSocket;
	var deviceCaption;

	var function_onMessage;
	var function_onOpen;
	var function_onClose;
	var function_onError;
	var function_onLoginSucces;
	var function_onLoginFailure;
	var function_onTransactionSeries;

	var isConnected = false;

	this.open = function(inDeviceCaption){
		deviceCaption = inDeviceCaption;
		webSocket = new WebSocket(connectionString, "protocolOne");



		webSocket.onmessage = function(event){
			console.log('onMessage:');
			console.dir(event);
			var transportLayer = new TransportLayer();
			var fromServer_json = transportLayer.fromServerBuild(event.data);
			if(!(isConnected)){
				if(fromServer_json.routingLayer.type == 'commandForClient' && fromServer_json.routingLayer.command == 'connectedToServer'){
					isConnected = true;
					if(function_onLoginSucces){function_onLoginSucces(event.data);}
				}
				//only allow syncMResponse and syncMLogin, after thoughts, please fix
				if(fromServer_json.routingLayer.type == 'transactionToClient'){
					if(fromServer_json.dataLayer.cmd == 'syncMResponse' || fromServer_json.dataLayer.cmd == 'syncMlogin'){
						if(function_onMessage){function_onMessage(event.data);}
					}
				}



			}else{
				if(fromServer_json.routingLayer.type == 'transactionSeriesToToken'){
					if(function_onTransactionSeries){
						// sending a transLayer as json
						function_onTransactionSeries(fromServer_json, fromServer_json.routingLayer.command, fromServer_json.routingLayer.transactionSeriesId, fromServer_json.routingLayer.frame, fromServer_json.dataLayer);
					}
					return;
				}
				if(function_onMessage){function_onMessage(event.data);}
			}
		}

		webSocket.onopen = function(event){
			console.log("webSocket OPEN")
			if(function_onOpen){function_onOpen({});}
		};

		webSocket.onclose = function(event){
			isConnected = false;
			if(function_onClose){function_onClose(event);}    	
		};

		webSocket.onerror = function(event){
			if(function_onError){function_onError(event);}    	
		};

	}

	

	

	this.setOnMessage = function(inFunction){function_onMessage = inFunction;}
	this.setOnOpen = function(inFunction){function_onOpen = inFunction;}
	this.setOnClose = function(inFunction){function_onClose = inFunction;}
	this.setOnError = function(inFunction){function_onError = inFunction;}
	this.setOnLoginSuccess = function(inFunction){function_onLoginSucces = inFunction;}
	this.setOnLoginFailure = function(inFunction){function_onLoginFailure = inFunction;}
	this.setOnTransactionSeries = function(inFunction){function_onTransactionSeries = inFunction;}


	this.sendString = function(inString){
		//if(!(isConnected)){return false;}
		console.log("(sendString)SENDING full package->:"+inString);
		webSocket.send(inString);
	}


	this.send = function(inData){
		if(!(isConnected)){return false;}
		console.log("SENDING full package->:"+JSON.stringify(inData));
		webSocket.send(JSON.stringify(inData));

	}
}