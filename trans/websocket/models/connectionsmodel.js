var path = require('path');
var basePath = path.dirname(require.main.filename);
var HashArrayObject = require(basePath + '/libs/hashofarrayobject.js');

//model----------------
var Model = function(){
	var connectionsArrayHash = new HashArrayObject(false);


	this.addConnection = function(inUserId, inDeviceId){
		connectionsArrayHash.add(inUserId, inDeviceId);
		connectionsArrayHash.dump();
	}

	this.removeConnection = function(inUserId, inDeviceId){
		connectionsArrayHash.removeItemFromSpecificHash(inUserId, inDeviceId);
	}
}

module.exports = Model;