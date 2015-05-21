var path = require('path');
var basePath = path.dirname(require.main.filename);
//var fs = require('fs');
var extend = require(basePath + '/node_modules/node.extend');
var request = require(basePath + '/node_modules/request');

//model----------------
var Model = function(){
	var _this = this;

	this.verifyInformation = function(inVerifyInformationOptions, inPostFunction){
		var verifyInformationOptions = 
			{
				accessToken:false,
				email:false,
				id:false,
			}
		verifyInformationOptions = extend(true, verifyInformationOptions, inVerifyInformationOptions);
		//ss google stuff here---
		var googleURL = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + verifyInformationOptions.accessToken;

		request(googleURL, function (error, response, body){
			global.reportNotify('googleModel.verifyInformation()', 
				{
					error:error,
					accessToken:verifyInformationOptions.accessToken,
					//response:response,
					body:body,
				}, 0
			);

			if(!(error) && response.statusCode == 200){
				var theJstruct = JSON.parse(body);
				if(inPostFunction && !(theJstruct.error)){
					if(theJstruct.user_id == verifyInformationOptions.id && theJstruct.email == verifyInformationOptions.email){
						inPostFunction(true);
						return;
					}
				}
			}

			//--verify problem if you here!!!
			global.reportError('googleModel.verifyInformation()',
				{
					error:error,
					rspStatusCode:response.statusCode,
					body:body,
				}, 0
			);
			if(inPostFunction){inPostFunction(false);}

		});

	}
}
Model.getInstance = function(){
	return new Model();
}
module.exports = Model;