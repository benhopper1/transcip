console.log('=======================================================================');
console.log('-------------  SecurityTokenObject  -----------------------------------');
console.log('=======================================================================');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var moment = require(basePath + '/node_modules/moment');

var SecurityTokenObject = function(){
	var _this = this;
	var tokenHash = {};

	this.isValid = function(inToken){
		var theJstruct = tokenHash[inToken];
		if(!(theJstruct)){return false;}

		if(moment().isAfter(theJstruct.expireMoment)){
			//expired
			return false;
		}else{
			return true
		}
	}

	this.add = function(inSecurityTokenJstruct){
		tokenHash[inSecurityTokenJstruct.securityToken] = inSecurityTokenJstruct;
	}

	this.getSecurityTokenJstruct = function(inToken){
		if(_this.isValid(inToken)){
			return tokenHash[inToken];
		}else{
			return false;
		}
	}

	this.dropExpired = function(){
		for(var theKey in tokenHash){
			var theItem = tokenHash[theKey];
			if(moment().isAfter(theJstruct.expireMoment)){
				//expired
				delete tokenHash[theKey];
			}
		}
	}

}
module.exports = SecurityTokenObject;