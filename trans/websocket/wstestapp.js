var path = require('path');
var basePath = path.dirname(require.main.filename);
var ConnectionsObject = require(basePath + '/models/connectionsmodel.js');
var connectionsObject = new ConnectionsObject();
var TransportLayer = require(basePath + '/libs/transportlayer.js');

var DebugObject = require(basePath + '/libs/debug/debugobject.js');
var MaintenanceObject = require(basePath + '/libs/maintenance/maintenanceobject.js');

var moment = require(basePath + '/node_modules/moment');
var RedClient = require(basePath + '/libs/redclient/redclient.js');
var fs = require('fs');
var domain = require('domain');

var redClient = new RedClient();
redClient.sendTransaction('testChannel',
		{
			type:'toCipInformation44',
			isWsPassThrough:false,
			command:'addWaitingQr',
			serverName:'global.SEVER_NAME',
			data:{key1:'val1'},

		},function(inReturnData){
			console.log('redClient.sendTransaction');
			console.dir(inReturnData);
		}
	);