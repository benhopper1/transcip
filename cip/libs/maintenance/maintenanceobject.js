var path = require('path');
var basePath = path.dirname(require.main.filename);
var uuid = require(basePath + '/node_modules/node-uuid');
var schedule = require(basePath + '/node_modules/node-schedule');
var extend = require(basePath + '/node_modules/node.extend');
var Underscore = require(basePath + '/node_modules/underscore');


//####################################################################################
//maintenance object
//####################################################################################





var MaintenanceObject = function(inJstruct){
	console.log('MaintenanceObject CREATED');
	var _this = this;
	var toCallFunctionsHash = {};
	var job = false;
	var options = 
		{
			label:false,
			when:false,
			data:false,
			count:false,
		}
	options = extend(options, inJstruct);

	this.add = function(inFunction, inParams){
		var functionId = uuid.v1();
		if(inFunction){
			toCallFunctionsHash[functionId] = 
				{
					_function:inFunction,
					_data:
						{
							iterateIndex:0,
							params:inParams,
						}
				}

			return functionId;
		}
		return false;
	}

	this.remove = function(inFunctionId){
		if(inFunctionId in toCallFunctionsHash){
			delete toCallFunctionsHash[inFunctionId];
			return true;
		}
		return false;
	}

	this.start = function(){
		console.log('START:');
		console.dir(options.when);
		job = schedule.scheduleJob(options.when, function(){
			console.log('JOB RUNNING');
			for(var toCallKey in toCallFunctionsHash){
				var hashValue = toCallFunctionsHash[toCallKey];
				hashValue._function(options, hashValue._data);
				++hashValue._data.iterateIndex;
			}
		});
	}

	this.stop = function(){
		job.cancel();
	}



}

//  STATIC ------------------------------------------------------------
MaintenanceObject.range = function(inAVal, inBVal, inStepValue){
	return Underscore.range(inAVal, inBVal, inStepValue? inStepValue: 1);
}

module.exports = MaintenanceObject;
