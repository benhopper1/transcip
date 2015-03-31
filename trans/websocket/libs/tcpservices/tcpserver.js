//####################################################################################
//TCP Server for sync and scalability
//####################################################################################

var TcpServer = function(inData){
	var net = require('net');
	var _this = this;
	var theServer;
	var clientHash = {};
	var handle;

	var server = net.createServer(function(c){
		handle = c._handle.fd;
		console.log('server connected');
		clientHash[c._handle.fd] = 
			{
				socket:c,
				createTime:new Date().getTime(),
				isConnected:false
			}

		c.send = function(inData){
			try{
				c.write(JSON.stringify(inData));
				c.pipe(c);
			}catch(e){
				global.reportError('TcpServer.send()',
					{
							dataSending:inData,
							error:e,
					}, 0
				);
			}
		}

		c.on('end', function(){
			try{
				delete clientHash[handle];
				if(inData.onDisconnect()){inData.onDisconnect(theServer, c);}
			}catch(e){
				global.reportError('TcpServer.end()',{error:e,}, 0);
			}
		});
		c.on('data', function(data){
			if(inData.onMessage){
				var theData = "";
				try{
					theData = JSON.parse(data);
				}catch(e){
					global.reportError('TcpServer.on data()',{error:e,}, 0);
					return;
				}
				inData.onMessage(theServer, c, theData);
			}
			c.destroy();
		});
		
	});

	theServer = server;
	server.listen(inData.port, inData.host, function() {
		console.log('TcpServer server bound');
		if(inData.onInstall){
			inData.onInstall();
		}
	});

}

module.exports = TcpServer;