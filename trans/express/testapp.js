
var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var configData = fs.readFileSync(basePath + '/main.conf', 'utf8');
configData = JSON.parse(configData);
var finish = require(basePath + '/node_modules/finish');

var extend = require(basePath + '/node_modules/node.extend');
var Underscore = require(basePath + '/node_modules/underscore');

var Connection = require(basePath + '/models/connection.js');
//var nodemailer = require(basePath + '/node_modules/nodemailer');

var configData = fs.readFileSync('main.conf', 'utf8');
configData = JSON.parse(configData);

var basePath = path.dirname(require.main.filename);


console.log('test App running');
/*
http://192.168.0.16
port35001

https://192.168.0.16
8000

192.168.0.16
30300,
connectString": "hkjhkjh"


*/
//child_process.fork(modulePath[, args][, options])#
var childProcess = require('child_process');

var modulePath = basePath + '/app.js'
var args = 
	[
		'http://192.168.0.16',
		'35001',
		'https://192.168.0.16',
		'8000',
		'192.168.0.16',
		'30300'
	]
;

var options = 
	{

	}

var ls = childProcess.fork(modulePath, args, {});