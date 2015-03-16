var path = require('path');
var basePath = path.dirname(require.main.filename);
var uuid = require(basePath + '/node_modules/node-uuid');
var schedule = require(basePath + '/node_modules/node-schedule');
var extend = require(basePath + '/node_modules/node.extend');
var Underscore = require(basePath + '/node_modules/underscore');
var fs = require('fs');
var moment = require(basePath + '/node_modules/moment');
var util = require('util');

//####################################################################################
//DebugObject object
//####################################################################################





var DebugObject = function(inJstruct, inPostFunction){
	console.log('DebugObject CREATED');
	var _this = this;
	var options = 
		{
			label:false,
			filePath:basePath + '/error.log'
		}
	options = extend(options, inJstruct);



	this.reportError = function(inLabel, inData){
		var wrapper = 
			{
				debugObject:options.label,
				label:inLabel,
				when:createTimeStamp(),
				data:inData,

			}
		try{
			var data = util.inspect(wrapper, false, 10, true)
			fs.appendFile(options.filePath, data + "\n", encoding='utf8', function (err) {
				if(inPostFunction){inPostFunction(err);}
			});
		}catch(e){
			console.log('ERROR in WRITE LOG FILE');
			if(inPostFunction){inPostFunction(err);}
		}
	}

	this.clearLog = function(inPostFunction){
		fs.writeFile(options.filePath, '', 'utf8', function(err){
			if(inPostFunction){inPostFunction(err);}
		});
	}

	this.getLogData = function(inPostFunction){
		fs.readFile(options.filePath, 'utf8', function(err, data){
			if(inPostFunction){inPostFunction(err, data);}
		});
	}

	this.dumpLog = function(inPostFunction){
		_this.getLogData(function(err, data){
			console.log('DebugObject.dumpLog:');
			console.dir(data);
		});
	}

	var createTimeStamp = function(){
		return moment().format("YYYY-MM-DD HH:mm:ss"); 
	}




}

//=== STATIC ================================================
DebugObject.debugifyHash = {};
DebugObject.debugify = function(inLookupId, inObject){
	console.log('AddingKEY:' + inLookupId);
	console.dir(inObject);
	DebugObject.debugifyHash[inLookupId] = inObject;
}

DebugObject.unDebugify = function(inLookupId){
	var theDebugifiedObject = DebugObject.debugifyHash[inLookupId];
	if(theDebugifiedObject){
		DebugObject.debugifyHash[inLookupId] = null;
	}

}

DebugObject.getDebugified = function(inLookupId){
	return DebugObject.debugifyHash[inLookupId];
}

DebugObject.dumpSizeReport = function(){
	console.dir(DebugObject.debugifyHash);
	console.log('===== dumpSizeReport ===============================================');
	var i = 0;
	for(var theKey in DebugObject.debugifyHash){
		console.log('[' + i + ']' + theKey + '       ' + Object.keys(DebugObject.debugifyHash[theKey]).length);
		i++;
	}
	console.log('--------------------------------------------------------------------');
	console.log('');
}







module.exports = DebugObject;
