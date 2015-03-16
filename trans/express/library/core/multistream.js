var PassStream = require('stream').PassThrough;

var MultiStream = function(){

	this.multify = function(inStream, inCount){
		if(!(inCount)){inCount = 2;}

		var resultArrayOfStreams = [];

		for(var i = 0; i < inCount; i++){
			var newStream = new PassStream();
			inStream.pipe(newStream);
			resultArrayOfStreams.push(newStream);
		}

		return resultArrayOfStreams;
	}
}
module.exports = MultiStream;
