var UserModel = require('../models/usermodel');
var userModel = new UserModel();
var path = require('path');
var basePath = path.dirname(require.main.filename);
var uuid = require(basePath + '/node_modules/node-uuid');
var url = require('url');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
configData = JSON.parse(configData);


var MaintenanceModel = require(basePath + '/models/maintenancemodel');
var UserModel = require(basePath + '/models/usermodel');




module.exports.controller = function(app) {
	var maintenanceModel = new MaintenanceModel();
	var userModel = new UserModel();


	//CLEANS ALL CACHED FILES FROM SYSTEM LEAVING ONLY DBASED LINKED FILES
	app.post('/cleanup/phoneCache', function(req, res){
		if(userModel.verifySession(req,res) && (req.session.userData.userGroup == 'admin')){

			req.body['userId'] = req.session.userData.userId;
			req.body['userGroup'] = req.session.userData.userGroup;
			req.body['status'] = req.session.userData.status;

			maintenanceModel.deleteOldPhoneCacheFiles(
				{

				}, function(err, inData){
					console.log('COMPLETED');
				}
			);
			res.end();
			//res.setHeader('Content-Type', 'application/json');
		}else{
			//============================================================
			//YOUR NOT LOGED IN ------------------------------------------
			//============================================================
			console.log("/cleanup/phoneCache    YOUR NOT LOGED IN????");
		}
	});





}