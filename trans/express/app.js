
//TODO: create rel-paths for libs
var express = require('./node_modules/express');
var http = require('http');
var path = require('path');
var app = express();
var fs = require('fs');
var basePath = path.dirname(require.main.filename);
var moment = require(basePath + '/node_modules/moment');
var CipClient = require(basePath + '/library/cip/client.js');
var CipRequestHandler = require(basePath + '/library/cip/ciprequesthandler.js');

global.CIP_ENABLED = false;
console.dir(process.argv);
if(process.argv[9]){
	if(process.argv[9] && parseInt(process.argv[9]) == 1){
		console.log('Express is  Cip Enabled');
		global.CIP_ENABLED = true;
	}
}
global.DEBUG_MODE = true;
global.SERVER_START_TIME = moment().format("YYYY-MM-DD HH:mm:ss");
global.SERVER_TYPE = 'express';

console.log('process.argv-------------------');
console.dir(process.argv);

var SecretFile = require('./library/secretfile/secretfile.js');
var secretFile = new SecretFile('main.conf');
secretFile.processCommandLineArgs();



var addressToIp = function(inAddress){
	var resultIp;
	resultIp = inAddress.toLowerCase().replace('http://','');
	resultIp = resultIp.toLowerCase().replace('https://','');
	console.log('iplllll:' + resultIp);
	return resultIp;
}

//----readin my secrets /git ignored conf file-----
var configData = fs.readFileSync('main.conf', 'utf8');
configData = JSON.parse(configData);


global.SEVER_NAME = 'Server_ex_' + configData.webSocketClient.port;


var basePath = path.dirname(require.main.filename);
console.log('basePath:'+basePath);


var phpExpress = require('./node_modules/php-express')({
		binPath: '/usr/bin/php'
});

var bodyParser = require('./node_modules/body-parser');

var logger = require('./node_modules/morgan');
var methodOverride = require('./node_modules/method-override');
var cookieParser = require('./node_modules/cookie-parser');
//var expressSession = require('./node_modules/express-session');

//============================================================
//  Sesion Library
//============================================================
var session = require('./node_modules/client-sessions');




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


//============================================================
//  Session Config
//============================================================
app.use(session({
	cookieName: 'session',
	secure:false,
	secret: 'random_string_goes_here',
	duration: 24 *(60 * 60 * 1000),
	activeDuration: 5 * 60 * 1000,
}));

/*app.use(expressSession(
	{
		cookie:
			{
				secure:true
			},
		secret:'server secret here', 
		saveUninitialized: true, 
		resave: true
	}
));*/

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


//---CUSTOM DATA FOR ROUTES AND JADE-------------------------
app.use(function (req, res, next){
	req.custom = 
		{
			tester:function(){
				console.log('tester worked!!');
				return 77;
			},
			tester2:function(){
				console.log('tester worked!!');
				return 77;
			},
			basePath:path.dirname(require.main.filename),
			imageFolderPath:path.dirname(require.main.filename) + '/public/images',
			audioFolderPath:path.dirname(require.main.filename) + '/public/audio'

		}
	next();
});



var RequestModel = require(__dirname + '/models/requestmodel.js');
var requestModel = new RequestModel();

var userData = {};
app.all('*', function(req, res, next){
	userData.requestUrl = req.url;
	userData.agent = (req.headers['user-agent']) ? req.headers['user-agent'] : 'NO AGENT';
	userData.referrer = req.headers['referrer'];
	userData.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log('userData:');
	console.dir(userData);

	requestModel.logData(userData);
	next();
});


//----------dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file){
	if(file.substr(-3) == '.js'){
		console.log(file);
		route = require('./controllers/' + file);
		route.controller(app);
	}
});

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




//===============================================================
// -- > isMobile Method < ---------------------------------------
//===============================================================
/*
	? = app.isMobile(req.headers['user-agent']);
*/
app.isMobile = function(inAgent){
	console.log('Detecting Mobile');
	//var ua = req.headers['user-agent'].toLowerCase();
	var ua = inAgent.toLowerCase();
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4))) {
		//res.writeHead(302, {Location: 'http://detectmobilebrowser.com/mobile'});
		//res.end()
		console.log('MOBILE DEVICE');
		return true;
	}else{
		console.log('NON-MOBILE DEVICE');
		return false;
	}
}

//==============================================================================
//> -- CIP ---------------------------------------------------------------------
//==============================================================================
var cipClient;
var cipRequestHandler;
if(global.CIP_ENABLED){
	cipClient = new CipClient(
		{
			host:configData.cip.host,
			port:configData.cip.port,
			serverName:global.SEVER_NAME,
			onData:function(inTransportLayer_json){
				console.log('cipClient onData');
				console.dir(inTransportLayer_json);
				//communicationRouter.reportOnRoute(wss, ws, inTransportLayer_json);
				/*if(inTransportLayer_json.cipLayer && inTransportLayer_json.cipLayer.isWsPassThrough){
					console.log('YOU HAVE A PASSTHRUE!!!!!');
				}*/
				cipRequestHandler.handleRequest(inTransportLayer_json.cipLayer, inTransportLayer_json);

			},
			onCipData:function(inCipLayer_json, inTransportLayer_json){
				console.log('cipClient onCipData');

			},
			onWsData:function(inCipLayer_json, inTransportLayer_json){
				console.log('cipClient onWsData');
			},
		}
	);

	cipRequestHandler = new CipRequestHandler(cipClient);
}



//communicationRouter.setCipClient(cipClient);

// END OF CIP