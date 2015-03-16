//maintenancemodel

var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var configData = fs.readFileSync(basePath + '/main.conf', 'utf8');
configData = JSON.parse(configData);
var finish = require(basePath + '/node_modules/finish');

var extend = require(basePath + '/node_modules/node.extend');


var Connection = require(__dirname + '/connection.js');
var nodemailer = require(basePath + '/node_modules/nodemailer');
var uuid = require(basePath + '/node_modules/node-uuid');

var PhonecacheContactModel = require(basePath + '/models/phonecachecontactmodel');

connection = Connection.getInstance('arf').getConnection();

var Model = function(){
	var _this = this;

	var getMinuteFromMs = function(inMs){
		return Math.floor(inMs / (1000 * 60));
	}

	var getDayFromMs = function(inMs){
		return Math.floor(inMs / (1000 * 60 * 1440));
	}

	var getHourFromMs = function(inMs){
		return Math.floor(inMs / (1000 * 60 * 60));
	}

	this.deleteOldPhoneCacheFiles = function(inOptions, inPostFunction){
		var phonecacheContactModel = new PhonecacheContactModel();
		var options = 
			{
				minutesOld:5,
			}
		options = extend(options, inOptions);

		var PHONE_CACHE_FOLDER = basePath + configData.phoneCacheStorageFolder;
		var NOW = new Date().getTime();
		var CODE = 'CODE_' + NOW;
		var files = fs.readdirSync(PHONE_CACHE_FOLDER);

		var dbPassArray = [];
		for(var filesIndex in files){
			var fileTime =  fs.statSync(path.join(PHONE_CACHE_FOLDER, files[filesIndex])).ctime;
			var fileTimeMs = new Date(fileTime).getTime();

			if(getMinuteFromMs(NOW - fileTimeMs) > options.minutesOld){
				dbPassArray.push(
					{
						f0:configData.phoneCacheStorageFolder + '/' + files[filesIndex],
						f1:path.join(PHONE_CACHE_FOLDER, files[filesIndex]),
					}
				);
			}
		}

		phonecacheContactModel.addPhysicalPathsToWorkerTableArray(
			{
				code:CODE,
				dataArray:dbPassArray,
			}, function(err, result){
				phonecacheContactModel.getDeletablePhoneCacheFiles(CODE, function(err, result){
					console.log('getDeletablePhoneCacheFiles DONE:');
					console.dir(result);

					for(var resultIndex in result){
						console.log('DELETE ->:' + result[resultIndex].fullPath);
						fs.unlinkSync(result[resultIndex].fullPath);
					}
					phonecacheContactModel.deleteFromWorkerTable(CODE, function(err, result){
						console.log('WORKER RECORDs DELETED');
					});

				});
			}
		);

	}





}

module.exports = Model;