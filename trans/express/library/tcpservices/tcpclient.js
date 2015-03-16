/*var TcpServer = require(basePath + '/libs/tcpservices/tcpserver.js');
var tcpServer = new TcpServer(
	{
		host:"192.168.0.16",
		port:30400,
		onInstall:function(){},
		onDisconnect:function(){},
		onConnect:function(){},
		onMessage:function(server, client, data){
			console.log('xxxxx:' + data.request);
			if(!(data)){return;}
			if(data.request){
				if(data.request == 'getUserIdAndDeviceId'){
					if(data.deviceTokenId){
						var userId = wss.userHashArrayOfDeviceTokenId.getFirstKeyByValue(data.deviceTokenId);
						console.log('userId for lookup:' + userId);
						if(userId){
							client.send(
								{
									userId:userId
								}
							);
						}
					}
				}
			}
		}
	}*/

/* -- example:




*/

var TcpClient = function(inData){
	var net = require('net');
	var _this = this;

	host = inData.host;
	port = inData.port;

	var reportMessageFunction;
	if(inData.onMessage){
		reportMessageFunction = inData.onMessage
	}

	var net = require('net');
	var client = new net.Socket();
	client.connect(port, host, function() {
		console.log('Connected');
		//client.write('Hello, server! Love, Client.');
	});

	client.on('data', function(data) {
		console.log('Received: ' + data);
		if(reportMessageFunction){
			reportMessageFunction(JSON.parse(data));
		}
		client.destroy(); // kill client after server's response
	});

	client.on('close', function() {
		console.log('Connection closed');
	});

	this.send = function(inMessage){
		if(typeof inMessage == 'string' || inMessage instanceof String){
			client.write(JSON.stringify(inMessage));
		}else{
			if(inMessage.onMessage){
				reportMessageFunction = inMessage.onMessage
				client.write(JSON.stringify(inMessage.message));
			}
		}

	}

}

module.exports = TcpClient;