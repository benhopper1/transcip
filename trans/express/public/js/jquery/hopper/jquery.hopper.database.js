console.log('=======================================================================');
console.log('--------------------------JQUERY HOPPER DATABASE-----------------------');
console.log('=======================================================================');


var DatabaseObject = function( inOptions ){
	var _this = this;
	var eventObject = new EventOrigin();

	var options = 
		{
			insertProcess:false,
			editProcess:false,
			deleteProcess:false,
			selectProcess:false,
			deleteProcess:false,
			onChange:false,
		}
	options = $.extend(options, inOptions);

	this.insert = function(inData, inPostFunction){
		eventObject.reportOn('onBeforeInsert', inData);
		var next = function(inData){
			if(inPostFunction){
				inPostFunction(inData);
			}
			if(options.onChange){options.onChange();}
			eventObject.reportOn('onAfterInsert', inData);
			eventObject.reportOn('onAfterChange', inData);
		}
		if(options.insertProcess){
			options.insertProcess(inData, next);
		}
	}
	this.edit = function(inData, inPostFunction){
		eventObject.reportOn('onBeforeEdit', inData);
		var next = function(inNextData){
			if(inPostFunction){
				inPostFunction(inNextData);
			}
			if(options.onChange){options.onChange();}
			eventObject.reportOn('onAfterEdit', inNextData);
			eventObject.reportOn('onAfterChange', inNextData);
		}
		if(options.editProcess){
			options.editProcess(inData, next);
		}
	}
	this.select = function(inData, inPostFunction){
		eventObject.reportOn('onBeforeSelect', $.extend(true, {}, inData));
		var next = function(inNextData){
			if(inPostFunction){
				inPostFunction($.extend(true, {}, inNextData));
			}
			eventObject.reportOn('onAfterSelect', $.extend(true, {}, inNextData));
		}
		if(options.selectProcess){
			options.selectProcess($.extend(true, {},inData), next);
		}
	}
	this.delete = function(inData, inPostFunction){
		eventObject.reportOn('onBeforeDelete', inData);
		var next = function(inNextData){
			if(inPostFunction){
				inPostFunction(inNextData);
			}
			if(options.onChange){options.onChange();}
			eventObject.reportOn('onAfterDelete', inNextData);
			eventObject.reportOn('onAfterChange', inNextData);
		}
		if(options.deleteProcess){
			options.deleteProcess(inData, next);
		}
	}

	//select data is copied not referenced to subscribers!!!!!!!!

	//this.edit = function(inData, inPostFunction){}
	//this.delete = function(inData, inPostFunction){}
	//this.select = function(inData, inPostFunction){}

	//REPORTS AVALIABLE-------------
	//onBeforeInsert
	//onBeforeEdit
	//onBeforeDelete
	//onBeforeSelect
	//onBeforeChange
	//onAfterInsert
	//onAfterEdit
	//onAfterDelete
	//onAfterSelect
	//onAfterChange


	this.getEventObject = function(){
		return eventObject;
	}
}




