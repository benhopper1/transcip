var path = require('path');
var fs = require('fs');
var basePath = path.dirname(require.main.filename);
var FileStorageClient = require(basePath + '/node_modules/filestorageclient/filestorageclient.js');
var FileMutator = require(basePath + '/node_modules/filemutator/filemutator.js');

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

	//this.
}



//==================================================================
//--  FILE STORAG CLIENT  ------------------------------------------
//==================================================================
var fileMutator = new FileMutator();
var fileStorageClient = new FileStorageClient(
	{
		datFilePath:basePath + '/filestoragedat.json',
		onSave:function(inStream, inType, inFileStruct, inWriteStream, inTargetFileInfo){
			var storageKey = inTargetFileInfo.storageKey;

			if(inType.toLowerCase() == 'png' || inType.toLowerCase() == 'jpg'){
				var mutatorFunctionalKey;
				var overWriteMessage = '';
				if(storageKey == 'userImage'){
					mutatorFunctionalKey = 'saveNormalUserImage';
					overWriteMessage = 'U S E R   I M A G E';
				}
				if(storageKey == 'contactImage'){
					mutatorFunctionalKey = 'saveNormalContactImage';
					overWriteMessage = 'C O N T A C T   I M A G E';
				}
				if(storageKey == 'errorFileSize'){
					mutatorFunctionalKey = 'saveNormalContactImage';
					overWriteMessage = 'FILE SIZE TOO BIG';
				}
				if(storageKey == 'phoneCache'){
					mutatorFunctionalKey = 'phoneCacheImage';
					overWriteMessage = '';
				}
				var theResult = fileMutator.mutate(mutatorFunctionalKey,
					{
						stream:inStream,
						type:inType,
						fileStruct:inFileStruct,
						writeStreamFunction:inWriteStream,
						targetFileInfo:inTargetFileInfo,
						writeOver:overWriteMessage,
					}
				);
				console.log('--- the result of call ----');
				console.dir(theResult);

			}else{
				inWriteStream(inStream);
			}

		},
	}
);

Model.fileStorageClient = fileStorageClient;

module.exports = Model;
