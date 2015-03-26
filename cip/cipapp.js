
var express = require('./node_modules/express');
var http = require('http');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var app = express();
var fs = require('fs');
var net = require('net');
var HashArrayObject = require(basePath + '/libs/hashofarrayobject.js');
var DebugObject = require(basePath + '/libs/debug/debugobject.js');
var MaintenanceObject = require(basePath + '/libs/maintenance/maintenanceobject.js');
//var PortUtility = require(basePath + '/libs/portutility/portutility.js');
//var finish = require(basePath + '/node_modules/finish');
//var util = require('util');
//var NewServer = require(basePath + '/libs/newserver/newserver.js');
var ServerBuild = require(basePath + '/libs/serverbuild/serverbuild.js');
global.ServerBuild = ServerBuild;

var util = require('util');
var url = require('url');

global.DEBUG_ENABLED = true;
global.MEM_WATCH_ENABLED = false;


global.prepairingPorts = {};
//global.SERVER_IP = 
global.deviceTokenId_Hash = {};
global.userId_hashOfArray = new HashArrayObject();
//cip interface tcp connection store-----
global.serverConnectionId_hashOfArray = new HashArrayObject();

global.serverHashOfArray = new HashArrayObject();
global.activeServersHash = {};
global.serverCounter = 0;

global.qrHash = {};
global.qrCountHashByServer = {};

global.serverBuildsHash = {};



//==========================================================
// REPORT ERROR --------------------------------------------
//==========================================================
var genErrorLog = new DebugObject(
	{
		label:'general',
		filePath:basePath + '/generror.log'
	}
);
global.reportError = function(inCaption, inData, inClass){
	styleRedOpen = '\u001b[' + 31 + 'm';styleRedClose = '\u001b[' + 39 + 'm';styleWhiteBgOpen = '\u001b[' + 47 + 'm';styleWhiteBgClose = '\u001b[' + 49 + 'm';
	console.log(styleWhiteBgOpen + styleRedOpen + '===============  REPORT ERROR  =====================================');
	console.log(inCaption + '        CLASS:' + inClass);
	console.log('--------------------------------------------------------------------');
	console.log(util.inspect(inData, false, 7, true));
	console.log(styleRedOpen + '====================================================================' + styleRedClose + styleWhiteBgClose);
	genErrorLog.reportError(inCaption, inData);
}


//==========================================================
// REPORT NOTIFICATION -------------------------------------
//==========================================================
var genNotifyLog = new DebugObject(
	{
		label:'general',
		filePath:basePath + '/gennotify.log'
	}
);
global.reportNotify = function(inCaption, inData, inClass){
	console.log(util.inspect('===============  REPORT NOTIFY  =====================================', false, 2, true));
	console.log(util.inspect(inCaption + '        CLASS:' + inClass, false, 1, true));
	console.log('---------------------------------------------------------------------');
	console.log(util.inspect(inData, false, 7, true));
	console.log(util.inspect('=====================================================================', false, 2, true));
	genNotifyLog.reportError(inCaption, inData);
}

// COUNT UP ALGORYTHIM FOR BALANCE
global.getConnectionCount = function(inServerName){
	var finalCount = 0;
	var theArray = serverHashOfArray.getArrayFromHash(inServerName);
	if(theArray){
		finalCount+= theArray.length;
	}
	var qrCountForServer = global.qrCountHashByServer[inServerName];
	if(qrCountForServer){
		finalCount+= qrCountForServer;
	}
	return finalCount;
}


global.getBestRedirectionHttpUrl = function(){
	return ServerBuild.getBestVacantServer(true);
}

global.getBestRedirectionHttpsUrl = function(){
	return ServerBuild.getBestVacantServer();
}






// DEBUG ========================================================
//DebugObject.debugify('wsapp.wss.waitDeviceTokenIdHash', wss.waitDeviceTokenIdHash);
global.maintenance_0_20_40 = new MaintenanceObject(
	{
		label:'maintenance_0_20_40',
		when:
			{
				second:[0, 20, 40],
			},
	}
);
global.maintenance_0_20_40.start();
global.maintenance_0_20_40.add(function(inOptions, inData){
	console.log('maintenance_0_20_40 DUMP');
	var theHash = global.activeServersHash;
	for(theKey in theHash){
		console.log('[' + theKey + '] count:' + global.getConnectionCount(theKey));
	}
/*
	console.log('serverHashOfArray.getHash()');
	console.dir(serverHashOfArray.getHash());
	console.log('-----------------------------------------');
*/

/*
	console.log('global.activeServersHash');
	console.log(util.inspect(global.activeServersHash, false, 1, true));
*/	

/*
	console.log('global.serverBuildsHash');
	console.dir(global.serverBuildsHash);
*/

	console.log('global.userId_hashOfArray');
	console.dir(userId_hashOfArray.getHash() );


	console.log('global.serverHashOfArray');
	console.dir(global.serverHashOfArray.getHash());

	console.log('global.qrHash');
	console.dir(global.qrHash);

	console.log('global.qrCountHashByServer');
	console.dir(global.qrCountHashByServer);

	for(var theKey in global.serverBuildsHash){
		console.log('--------- ' + theKey + '------------------');
		console.log(global.serverBuildsHash[theKey].getServerName());
		console.log(global.serverBuildsHash[theKey].getState());
	}

	//console.log('global.getBestRedirectionHttpUrl');
	//console.dir(global.getBestRedirectionHttpsUrl());



});




var addressToIp = function(inAddress){
	var resultIp;
	resultIp = inAddress.toLowerCase().replace('http://','');
	resultIp = resultIp.toLowerCase().replace('https://','');
	console.log('iplllll:' + resultIp);
	return resultIp;
}

//----readin my secrets /git ignored conf file-----
var configData = fs.readFileSync('cip.conf', 'utf8');
configData = JSON.parse(configData);

global.ip = configData.cipInterface.host;

var basePath = path.dirname(require.main.filename);
console.log('basePath:'+basePath);

var uuid = require(basePath + '/node_modules/node-uuid');
var TransportLayer = require(basePath + '/libs/transportlayer.js');



var phpExpress = require('./node_modules/php-express')({
		binPath: '/usr/bin/php'
});

var bodyParser = require('./node_modules/body-parser');

var logger = require('./node_modules/morgan');
var methodOverride = require('./node_modules/method-override');
var cookieParser = require('./node_modules/cookie-parser');
var expressSession = require('./node_modules/express-session');
var router = require('./node_modules/router')();

//TODO: --build db connection HERE--------
var Connection = require(__dirname + '/models/connection.js');
//---done statically here so connection will be prepared for future and share
var connection = Connection.getMaybeCreate(
	{
		instanceName:'arf',
		host:configData.mysqlServerConnection.host,
		user:configData.mysqlServerConnection.user,
		password:configData.mysqlServerConnection.password,
		database:configData.mysqlServerConnection.database

	}
);


// some environment variables
app.set('httpServerIp', addressToIp(configData.domain.address));
app.set('httpsServerIp', addressToIp(configData.secureDomain.address));
app.set('httpServerPort', process.env.PORT || configData.domain.port);
app.set('httpsServerPort', process.env.PORT || configData.secureDomain.port);
//app.set('port', process.env.PORT || 35001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//---------setup for PHP RENDERING---------------
app.engine('php', phpExpress.engine);
app.set('view engine', 'php');
app.all(/.+\.php$/, phpExpress.router);

app.use(logger('dev'));
app.use(bodyParser.json({limit:'50mb'}));
app.use(methodOverride());
app.use(cookieParser('server secret here'));

app.use(expressSession(
	{
		cookie:
			{
				secure:true
			},
		secret:'server secret here', 
		saveUninitialized: true, 
		resave: true
	}
));

app.use(router);

//---client side MVC made as static path-------------------------------
app.use(express.static(path.join(__dirname, 'cs_controllers')));
app.use('/cs_controllers', express.static(__dirname + '/cs_controllers'));

app.use(express.static(path.join(__dirname, 'cs_models')));
app.use('/cs_models', express.static(__dirname + '/cs_models'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(__dirname + '/public'));


var busboy = require('./node_modules/connect-busboy');
app.use(busboy());


var RequestModel = require(__dirname + '/models/requestmodel.js');
var requestModel = new RequestModel();

var userData = {};
app.all('*', function(req, res, next){
	userData.requestUrl = req.url;
	userData.agent = req.headers['user-agent'];
	userData.referrer = req.headers['referrer'];
	userData.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log('userData:');
	console.dir(userData);

	requestModel.logData(userData);
	next();
});


//----------dynamically include routes (Controller)
fs.readdirSync('./webcontrollers').forEach(function (file){
	if(file.substr(-3) == '.js'){
		console.log(file);
		route = require('./webcontrollers/' + file);
		route.controller(app);
	}
});


var controllerFile = require(basePath + '/controllers/redirection/httpredirectioncontroller');
controllerFile.controller(app);







//----H T T P   S E R V E R -----------------------
http.createServer(app).listen(app.get('httpServerPort'),app.get('httpServerIp'), function(){
	console.log('Express server listening on ip:port ' + app.get('httpServerIp') + ':' + app.get('httpServerPort'));
});



//-------S E C U R E   H T T P S   S E R V E R---------------------------------
var https = require('https');
var fs = require('fs');

var options = {
	key: fs.readFileSync('./node_modules/key.pem'),
	cert: fs.readFileSync('./node_modules/cert.pem')
};

console.log('https server ip:port  ' + app.get('httpsServerPort') + '/' + app.get('httpsServerIp'));
https.createServer(options, app).listen(app.get('httpsServerPort'),app.get('httpsServerIp'));




var CommunicationRouter = require(basePath + '/node_modules/communicationrouter/communicationrouter.js');
var communicationRouter = new CommunicationRouter();
console.log('path:' + __dirname + '/controllers');
communicationRouter.loadAllFilesInFolderAsControllers(__dirname + '/controllers');










//===============================================================
// -- > isMobile Method < ---------------------------------------
//===============================================================
app.isMobile = function(inAgent){
	console.log('Detecting Mobile');
	var ua = inAgent.toLowerCase();
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4))) {
		console.log('MOBILE DEVICE');
		return true;
	}else{
		console.log('NON-MOBILE DEVICE');
		return false;
	}
}

//===============================================================
// -- > CIP INTERFACE < -----------------------------------------
//===============================================================
var server = net.createServer();
server.listen(configData.cipInterface.port, configData.cipInterface.host);

var interfaceConnectionsHash = {};
server.on('connection', function(sock){
	var newConnectionId;
	var theConP;
	try{
		console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
		newConnectionId = sock.remoteAddress + sock.remotePort;

		global.reportNotify('NEW CONNECTION ON CIP INTERFACE', 
			{
				host:sock.remoteAddress,
				port:sock.remotePort,
				connectionId:newConnectionId,
			}, 0
		);

		interfaceConnectionsHash[newConnectionId] = 
			{
				host:sock.remoteAddress,
				port:sock.remotePort,
				connectionId:newConnectionId,
				socket:sock,
				send:function(inTransportLayer_json){
					//console.log('WRITING:' + JSON.stringify(inTransportLayer_json));
					sock.write(
						JSON.stringify(inTransportLayer_json)
					);
				}
			};

		communicationRouter.reportOnConnect(
			{
				host:sock.remoteAddress,
				port:sock.remotePort,
				connectionId:newConnectionId,
				socket:sock
			}
		);
		theConP = newConnectionId;
	}catch(e){
		global.reportError('cipapp.sock.on connection', 
			{
				error:e,
				param:data,
			}, 0
		);
		return;
	}


	sock.on('data', function(inTransportLayer_str) {
		try{
			console.log('DATA: ' + inTransportLayer_str + "<><><><" +  sock.remoteAddress +' '+ sock.remotePort);
			var connectId = sock.remoteAddress + sock.remotePort;
			
			var transportLayer_json = JSON.parse(inTransportLayer_str);
			console.dir(transportLayer_json.cipLayer);

			communicationRouter.reportOnRoute(interfaceConnectionsHash[connectId], transportLayer_json);

		}catch(e){
			global.reportError('cipapp.sock.on data', 
				{
					error:e,
					transportStr:inTransportLayer_str
				}, 0
			);
		}
	});

	sock.on('close', function(data) {
		try{
			console.log('closed');
			console.log('DATA: ' + data + "<><><><" +  sock.remoteAddress +' '+ sock.remotePort);
			console.dir(data);
		}catch(e){
			global.reportError('cipapp.sock.close', 
				{
					error:e,
					param:data,
				}, 0
			);
		}
	})

	sock.on('end', function() {
		try{
			console.log('end');
			console.log('end key:' + theConP);
			communicationRouter.reportOnDisconnect(interfaceConnectionsHash[theConP]);
		}catch(e){
			global.reportError('cipapp.sock.close', 
				{
					error:e,
					param:data,
				}, 0
			);
		}
	})

	sock.on('error', function(e) {
		try{
			console.log('CIPAPP SOCK ON ERROR ');
			global.reportError('CIP SERVER INTERFACE', e, 0);
		}catch(e){
			global.reportError('cipapp.sock.close', 
				{
					error:e,
					param:data,
				}, 0
			);
		}
	})


});

/*ServerBuild.init(
	{
		serverIp:'192.168.0.16',
	}, 
		function(err, servers){
			console.log('ServerBuild.init callback:');
			console.dir(servers);
			servers.forEach(function(server){
				console.log(server.getServerName());
				console.log(server.getState());
			});
		}
);*/
/*ServerBuild.launchAllServers(
	{
		severIp:'192.168.0.16'
	}
);*/




/*ServerBuild.launchServersByNumberArray(
	{
		severIp:'192.168.0.16',
		serverNumberArray:[1],
	}
);*/
ServerBuild.getMaybeCreate(
	{
		serverNumber:1,
		createFileSystem:true,
	},
	function(inServerInstance){
		console.log('SERVER LOADED:' + inServerInstance.getServerBuildName());
	}
);
/*ServerBuild.getMaybeCreate(
	{
		serverNumber:2,
		createFileSystem:true,
	},
	function(inServerInstance){
		console.log('SERVER LOADED:' + inServerInstance.getServerBuildName());
	}
);*/

ServerBuild.createFileSystemOnly(
	{
		serverNumber:0,
		deleteOld:true,
	}, 
	function(){
		console.log('ServerBuild.createFileSystemOnly callback');
	}
);



if(global.MEM_WATCH_ENABLED){
	var memwatch = require(basePath + '/node_modules/memwatch');
	var moment = require(basePath + '/node_modules/moment');
	memwatch.on('leak', function(info) {
		global.reportError('MEM-LEAK',
			{
					error:'mem-leak',
					info:info,
			}, 0
		);
	});

	memwatch.on('stats', function(stats) {
		global.reportNotify('MEM WATCH STATS', 
			{
				stats:stats,
			}, 0
		);
	});
}





/*ServerBuild.createNextFileSystem(global.ip, function(){
});*/





//ServerBuild.createNextFileSystem();




/*
//for(theServerIndex in [0,1,2]){
for(var theServerIndex = 0; theServerIndex < 3; theServerIndex++){
	var serverBuild = new ServerBuild(
		{
			serverNumber:theServerIndex,
			serverIp:'192.168.0.16',
		}
	);

	serverBuild.create(
		{
			copyEnabled:false,
			setPermissions:false,
			foreverEnabled:false,
		},
		function(){
			console.log('Server Created index:' + theServerIndex);
		}
	);

	//global.serverBuildsHash['server_' + theServerIndex] = serverBuild;
}

*/

