var path = require('path');
var basePath = path.dirname(require.main.filename);
var fs = require('fs');
var lame = require(basePath + '/node_modules/lame');
var wav = require(basePath + '/node_modules/wav');


var Model = function(){
	var _this =this;

	this.isMp3 = function(){}
	this.isWav = function(){}

	this.mp3FileToWavFile = function(inFilePath, inNewFile, onFinish){
		var readStream = fs.createReadStream(inFilePath);
		_this.mp3StreamToWavStream(readStream, function(inDecodedStream){
			var writeStream = fs.createWriteStream(inNewFile);
			inDecodedStream.pipe(writeStream);
			if(onFinish){onFinish(writeStream);}
		});
	}


	this.wavFileToMp3File = function(inFilePath, inNewFile, onFinish){
		var readStream = fs.createReadStream(inFilePath);
		_this.wavStreamToMp3Stream(readStream, function(inEncodedStream){
			console.log('called back 100');
			var writeStream = fs.createWriteStream(inNewFile);
			inEncodedStream.pipe(writeStream);
			if(onFinish){onFinish(writeStream);}
		});

	}

	this.mp3StreamToWavStream = function(inStream, onFinish){
		var decoder = new lame.Decoder();
		decoder.on('format', function(format){
			console.log('MP3 format: %j', format);
			var writer = new wav.Writer(format);
			var decodedStream = decoder.pipe(writer);
			if(onFinish){onFinish(decodedStream);}
		});

		inStream.pipe(decoder);

	}

	this.wavStreamToMp3Stream = function(inStream, onFinish){
		var reader = new wav.Reader();

		reader.on('format', function(format){
			console.log('WAV format: %j', format);
			console.dir(inStream);

			var encoder;
			var encodedStream;
			try{
				encoder = new lame.Encoder(format);
				encodedStream = reader.pipe(encoder);
				if(onFinish){onFinish(encodedStream, false);}

			}
			catch(e){
				if(onFinish){onFinish(encodedStream, e);}
			}
			
		});

		inStream.pipe(reader);
	}


}
module.exports = Model;

