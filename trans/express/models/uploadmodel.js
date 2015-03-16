var path = require('path');
var fs = require('fs');


var Connection = require(__dirname + '/connection.js');
connection = Connection.getInstance('arf').getConnection();

var ModelMedia = require(path.dirname(require.main.filename) + '/models/mediastoragemodel');
var mediaStorageModel = new ModelMedia();


//model----------------
var Model = function(){
	var _this = this;

	this.test = function(){
		return "model test from upload!!!!";
	}

	this.processUploadedFile = function(inData){
		var onCompleteFunction = inData.onComplete;

		inData.onProcessUploadedFileComplete = function(inData, err){
			if(onCompleteFunction){
				//added for in-process handle here...
				onCompleteFunction(inData, err);
			}
		}


		mediaStorageModel.storeFile(inData);
		

	}
}

module.exports = Model;
