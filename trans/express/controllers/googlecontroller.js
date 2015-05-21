var path = require('path');
//var fs = require('fs');
//var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
//configData = JSON.parse(configData);
//var UserModel = require('../models/usermodel');
//var userModel = new UserModel();
var basePath = path.dirname(require.main.filename);
var url = require('url');
var http = require('http');

module.exports.controller = function(app){
	app.get('/google/logout', function(req, res){
		var req = http.get(
			{
				host: 'https://accounts.google.com?z=l',
				path: '/logout'
			}, function(inRes) {
				//console.log('STATUS: ' + inRes.statusCode);
				//console.log('HEADERS: ' + JSON.stringify(res.headers));
				res.end(inRes);
		});
	});
}