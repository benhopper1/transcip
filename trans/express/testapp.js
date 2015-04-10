
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

var FileStorageClient = require(basePath + '/node_modules/filestorageclient/filestorageclient.js');
var FileMutator = require(basePath + '/node_modules/filemutator/filemutator.js');
//==================================================================
//--  FILE STORAG CLIENT  ------------------------------------------
//==================================================================


var fileMutator = new FileMutator();
var fileStorageClient = new FileStorageClient(
	{
		datFilePath:basePath + '/filestoragedat.json',
		onSave:function(inStream, inType, inFileStruct, inWriteStream, inTargetFileInfo){
			console.log('onSave:' + inType);

			if(inType == 'png' || inType == 'jpg'){
				var theResult = fileMutator.mutate('saveNormalUserImage',
					{
						stream:inStream,
						type:inType,
						fileStruct:inFileStruct,
						writeStreamFunction:inWriteStream,
						targetFileInfo:inTargetFileInfo,
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


function again(inCount){
	if(inCount <= 0){return;}
	fileStorageClient.storeFile('contactImage', '/home/ben/git_project/transcip/trans/express/public/images/characters/face2.jpg', function(inData){
		console.log('file stored:');
		console.dir(inData);
		//again(inCount-1);
		setTimeout(function(){ again(inCount-1); }, 250);
	});
}

again(1);
