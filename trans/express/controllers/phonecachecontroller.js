var path = require('path');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
configData = JSON.parse(configData);
var basePath = path.dirname(require.main.filename);
var extend = require(basePath + '/node_modules/node.extend');


module.exports.controller = function(app){


	//###########################################################################
	//----------------- > D a t a b a s e   I n t e r f a c e < -----------------
	//###########################################################################
	var PhoneCacheModel = require('../models/phonecachecontactmodel.js');
	var phoneCacheModel = new PhoneCacheModel();




	app.post('/database/phonecache/cachecontacts', function(req, res){
		console.log("/database/phonecache/cachecontacts");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId; 
		phoneCacheModel.cacheContacts(req.body, function(err, result){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					hadError:((err)? true : false),
					err:err,
					result:result
				}
			));
		});
	});

	app.post('/database/phonecache/getImportableData', function(req, res){
		console.log("/database/phonecache/getImportableData");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId; 
		phoneCacheModel.getImportableData(req.body, function(err, result){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					hadError:((err)? true : false),
					err:err,
					result:result
				}
			));
		});
	});

	app.post('/database/phonecache/getExportableData', function(req, res){
		console.log("/database/phonecache/getExportableData");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId; 
		phoneCacheModel.getExportableData(req.body, function(err, result){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					hadError:((err)? true : false),
					err:err,
					result:result
				}
			));
		});
	});

	app.post('/database/phonecache/moveCachedContact', function(req, res){
		console.log("/database/phonecache/moveCachedContact");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId; 
		phoneCacheModel.moveCachedContact(req.body, function(err, result){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					hadError:((err)? true : false),
					err:err,
					result:result
				}
			));
		});
	});

	app.post('/database/phonecache/checkCacheNeeds', function(req, res){
		console.log("/database/phonecache/checkCacheNeeds");
		console.log('---------userId---------------------------------:' +  req.session.userData.userId);
		req.body['userId'] = req.session.userData.userId; 
		phoneCacheModel.checkCacheNeeds(req.body, function(err, result){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(
				{
					hadError:((err)? true : false),
					err:err,
					result:result
				}
			));
		});
	});











}