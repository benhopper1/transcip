var path = require('path');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/cip.conf', 'utf8');
configData = JSON.parse(configData);
var basePath = path.dirname(require.main.filename);
var url = require('url');


//var request = require(basePath + '/node_modules/request');
var http = require('http');





module.exports.controller = function(app){

	/*var redirectJstruct = 
		{
			protocol:'http',
			ip:'192.168.0.16',
			port:35001
		}*/

/*	var redirectJstruct = 
		{
			protocol:'http',
			ip:'192.168.0.16',
			port:30000
		}*/


	// GET REDIRECTS --------------------------
	var unsecureRedirect = 
		{
			protocol:'http',
			//ip:'192.168.0.16',
			ip:configData.domain.address.replace('http://',''),
			port:30000,
			//port:configData.domain.port,
		}
	;

	var secureRedirect = 
		{
			protocol:'https',
			//ip:'192.168.0.16',
			ip:configData.secureDomain.address.replace('https://',''),
			port:30200,
			//port:configData.secureDomain.port,

		}
	;



	app.get('*', function(req, res){
		//req.url
		getRedirection(req, res);
		/*if(req.path == '/information/trans'){return;}
		console.log('REDIECTING:' + req.path);
		var url_parts = url.parse(req.url,false, false);
		var route = url_parts.path;
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		//var port = 
		console.log('url_parts');
		console.dir(url_parts);
		console.log('ip @ route' + ip + route);
		//res.redirect(ip + route);

		var redirectUrl = false;
		if(req.protocol == 'http'){
			var targetUrlParts = global.getBestRedirectionHttpUrl();
			redirectUrl = targetUrlParts.protocol + '//' + targetUrlParts.ip + ':' + targetUrlParts.port + url_parts.pathname;
		}
		if(req.protocol == 'https'){
			var targetUrlParts = global.getBestRedirectionHttpsUrl();
			redirectUrl = targetUrlParts.protocol + '//' + targetUrlParts.ip + ':' + targetUrlParts.port + url_parts.pathname;
		}

		if(redirectUrl){
			global.reportNotify('CLIENT GET REDIRECTION', 
				{
					source:req.path,
					target:redirectUrl,
				}, 0
			);
			res.redirect(redirectUrl);
		}*/
	});



	app.post('*', function(req, res){

		var url_parts = url.parse(req.url,true, true);
		var route = url_parts.path;
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;


		var data = req.body;
		var targetUrlParts = global.getBestRedirectionHttpUrl();



		var req = http.request(
			{
				//host: unsecureRedirect.ip,
				//port: unsecureRedirect.port,
				host: targetUrlParts.ip,
				port: targetUrlParts.port,
				path: route,
				method: 'POST',
				headers: 
					{
						'Content-Type': 'application/json',
						'Content-Length': Buffer.byteLength(JSON.stringify(data))
					}
			},
			function(response) {
				var str = ''
				response.on('data', function (chunk) {
					str += chunk;
				});
				response.on('end', function () {
					console.log(str);
					res.setHeader('Content-Type', 'application/json');
					res.end(str);
				});
			}
		);


		req.write(JSON.stringify(data));
		req.end();


	});




	var getRedirection = function(req, res, inJstruct){

		//if(req.path == '/information/trans'){return;}
		console.log('REDIECTING:' + req.path);
		var url_parts = url.parse(req.url,false, false);
		var route = url_parts.path;
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		console.log('url_parts');
		console.dir(url_parts);
		console.log('ip @ route' + ip + route);

		var redirectUrl = false;
		if(req.protocol == 'http'){
			var targetUrlParts = global.getBestRedirectionHttpUrl();
			redirectUrl = targetUrlParts.protocol + '//' + targetUrlParts.ip + ':' + targetUrlParts.port + url_parts.pathname;
		}
		if(req.protocol == 'https'){
			var targetUrlParts = global.getBestRedirectionHttpsUrl();
			redirectUrl = targetUrlParts.protocol + '//' + targetUrlParts.ip + ':' + targetUrlParts.port + url_parts.pathname;
		}

		if(redirectUrl){
			global.reportNotify('CLIENT GET REDIRECTION', 
				{
					source:req.path,
					target:redirectUrl,
				}, 0
			);
			res.redirect(redirectUrl);
		}
	}





}