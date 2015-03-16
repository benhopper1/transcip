var path = require('path');
var basePath = path.dirname(require.main.filename);
var fs = require('fs'), gm = require(basePath + '/node_modules/gm');
var gulp = require(basePath + '/node_modules/gulp'); 
var imageResize = require(basePath + '/node_modules/gulp-image-resize');


var Model = function(){
	//todo set to dir direct-----in sigle unit testing, will not work until whole unit testing..
	var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
	configData = JSON.parse(configData).imageModel;
	console.dir(configData);



	this.getInformation = function(inFilePath, inPostFunction){
		gm(inFilePath).identify(function(err, data){
		  	if(inPostFunction){
		  		inPostFunction(err, data);
		  	} 
		});
	}

	//--theme settings are in the config file, settings for crop resize....
	this.resize = function(inOldFileNamePath, inNewFileNamePath, inTheme, inPostFunction){
		console.log("resize ENTERED!!!");
		gm(inOldFileNamePath)
			.resize(configData.themes[inTheme].resizeX, configData.themes[inTheme].resizeY)
		  	.gravity('Center')
		  	.crop(configData.themes[inTheme].cropX, configData.themes[inTheme].cropY)
			.write(inNewFileNamePath, function(err){
				if(inPostFunction){inPostFunction(err);}
			})
	}

	//--theme settings are in the config file, settings for crop resize....
	this.resizeStream = function(inStream, inFileNamePath, inTheme, inPostFunction){
		if(!(inTheme in configData.themes)){console.log('THEME NOT EXIST!!'); return false;}
		console.log("THEME:" + inTheme);
		gm(inStream, inFileNamePath)

			.resize(configData.themes[inTheme].resizeX, configData.themes[inTheme].resizeY)
		  	.gravity('Center')
		  	.quality(100)

		  	//TODO remove-------------------
		  	//----Testing purpose only------
		  	//.stroke("#ffffff")
			//.font("Helvetica.ttf", 9)
			//.drawText(5, 20, "arfSync by Ben Hopper")
			//-------------------------------

			.stroke(configData.themes[inTheme].imageWriteOver.stroke)
			.font(configData.themes[inTheme].imageWriteOver.font, configData.themes[inTheme].imageWriteOver.fontSize)
			.drawText(configData.themes[inTheme].imageWriteOver.drawTextX, configData.themes[inTheme].imageWriteOver.drawTextY, configData.themes[inTheme].imageWriteOver.drawTextText)


		  	.crop(configData.themes[inTheme].cropX, configData.themes[inTheme].cropY)
			.stream(function (err, stdout, stderr) {
				if(inPostFunction){inPostFunction(err, stdout, stderr);}
			});
	}



}

module.exports = Model;




