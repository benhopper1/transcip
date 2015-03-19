//#################------> E X A M P L E <- #######################################################
/*
			$postAjax(
				{
					url:'testrest',
					send:
						{
							id:row,
							someData:'yes yes'
						},
					onAjaxSuccess:function(inResponseText){
						alert(inResponseText);
					}
				}
			);
*/
//################################################################################################
var clientUtilModule = new function(){
	console.log('LOADING ->: clientUtilModule');


	this.InputFileObject = function(inServerAddress, inFileFilter){

		//--STATIC---------------------------------------------
		if(typeof clientUtilModule.InputFileObject.indexCounter === 'undefined'){
			clientUtilModule.InputFileObject.indexCounter = 0;
		}else{
			clientUtilModule.InputFileObject.indexCounter += 1;
		}

		//----INSTANCE------------------------------------------
		var _this = this;
		var index = clientUtilModule.InputFileObject.indexCounter;
		var id = 'inputFileArea_' + index;

		var ajaxPostObject = new clientUtilModule.AjaxPostObject(inServerAddress);

		var filter = [];


		//build----------------------
		if(!(typeof inFileFilter === 'undefined')){
			filter = inFileFilter;
			for(index in filter){
				if(filter[index].indexOf('.') == -1){
					filter[index] = '.' + filter[index];
				}
			}
		}


		if (! $('#' + id).length){
			$( "body" ).append('<div id="' + id + '"><input type="file" id="' + id + '_file" style="display:none" accept="' + filter.toString() + '"><div>');
		}else{
			//cleanup prior stuff
			var control = $("#" + id + "_file");
			control.replaceWith( control = control.clone());
		}

		$("#" + id + "_file").trigger( "click" );
		// end of build----------------

		this.showBrowse = function(){
			$("#" + id + "_file").trigger( "click" );
		}

		this.send = function(inHashOfData, inOnResponse){
			ajaxPostObject.uploadFileAndData(id + '_file', inHashOfData, inOnResponse);
		}

		this.setOnFileChange = function(inFunction){
			if(inFunction){
				$("#" + id + "_file").change(function(e){
					inFunction(index, "#" + id + "_file", e);
				});
			}
		}



	}

	//##################################################################################################
	//--  A j a x P o s t O b j e c t ------------------------------------------------------------------
	//##################################################################################################

	this.AjaxPostObject = function(inServerAddress){
		var serverAddress = inServerAddress;
		this.uploadFileAndData = function(inFileElementId, inHashOfData, onResponse){
			var client = new XMLHttpRequest();

			client.onreadystatechange = function() {
				if (client.readyState == 4 && client.status == 200){
					if(onResponse){
						onResponse(client.responseText);
					}
				}
			}

			var file = document.getElementById(inFileElementId);
			var formData = new FormData();
			//console.log(JSON.stringify(file.files[0]));
			formData.append("uploadedFile", file.files[0]);

			for(key in inHashOfData){
			   formData.append(key, inHashOfData[key]);
			}

			client.open("post", serverAddress, true);
			client.send(formData);
		}
	}

	//##################################################################################################
	//--  A j a x J s o n P o s t O b j e c t ----------------------------------------------------------
	//##################################################################################################
	this.AjaxJsonPostObject = function(inData){
		var _this = this;
		var aSync = true;
		var method = 'post';
		var url;
		var function_onSuccess;
		var function_onFail;
		
		if(inData.url){url = inData.url;}
		if(inData.onAjaxSuccess){function_onSuccess = inData.onAjaxSuccess;}
		if(inData.onAjaxFail){function_onFail = inData.onAjaxFail;}

		var xhr = new XMLHttpRequest();


		this.send = function(inData, inOnAjaxSuccess, inOnAjaxFail){
			if(inOnAjaxSuccess){function_onSuccess = inOnAjaxSuccess;console.log('suc  yes man!!!');}
			if(inOnAjaxFail){function_onFail = inOnAjaxFail;}
			console.log('sending');
			xhr.open(method, url, aSync);

			xhr.onload = function(e){
				if (xhr.readyState === 4){
					if(xhr.status === 200){
						if(function_onSuccess){function_onSuccess(xhr.responseText);}
					}else{
						if(function_onFail){function_onFail(e, xhr.statusText);}
					}
				}
			};

			xhr.onerror = function(e){
				if(function_onFail){function_onFail(e, xhr.statusText);}
			};

			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.send(JSON.stringify(inData));
		}

		if(inData.send){
			_this.send(inData.send);
		}

	}



	//##################################################################################################
	//--  B A S I C ------------------------------------------------------------------------------------
	//##################################################################################################
	this.classToHash = function(inClass){
		if(inClass.indexOf('.') == -1){inClass = '.' + inClass;}
		var fieldsHash = {};
		$(inClass).each(function(){
			fieldsHash[this.name] = this.value;
		});
		return fieldsHash
	}


}

/*============================================================================
*	optional callback, returns data synchronously, so this function blocks!!!
*
*============================================================================*/

var $postSyncJsonInJsonOut = function(inUrl, inData, inOptionalPostFunction){
	var def = $.Deferred();
			var theData;
			jQuery.ajax({
				url:inUrl,
				type: 'post',
				data:inData,
				DataType:'jsonp',
				success:function(result) {
					theData = result;
					if(inOptionalPostFunction){inOptionalPostFunction(result);}
					def.resolve(result);

				},
				error:function(){
					theData = false;
					if(inOptionalPostFunction){inOptionalPostFunction(theData);}
					def.resolve(theData);
				},
				async:false
			});
			return theData;
}

/*============================================================================
*	optional callback, returns data synchronously, so this function blocks!!!
*
*============================================================================*/

var $getSyncJsonOut = function(inUrl, inOptionalPostFunction){
	var def = $.Deferred();
			var theData;
			jQuery.ajax({
				url:inUrl,
				type: 'get',
				data:false,
				DataType:'jsonp',
				success:function(result) {
					theData = result;
					if(inOptionalPostFunction){inOptionalPostFunction(result);}
					def.resolve(result);

				},
				error:function(){
					theData = false;
					if(inOptionalPostFunction){inOptionalPostFunction(theData);}
					def.resolve(theData);
				},
				async:false
			});
			return theData;
}




$postAjax = function(inData){
	new clientUtilModule.AjaxJsonPostObject(inData);
}


var $getCookie = function(cname){
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
	}
	return "";
}

var $ajaxFilePost = function(inData){
	var _this = this;
	var client = new XMLHttpRequest();
	client.onreadystatechange = function() {
		if (client.readyState == 4 && client.status == 200){
			if(inData.onComplete){
				if(client.responseText){
					inData.onComplete(JSON.parse(client.responseText));
				}
			}
		}
	}

	var file = document.getElementById(inData.fileInputElement);
	var formData = new FormData();
	console.log(JSON.stringify(file.files[0]));
	formData.append("uploadedFile", file.files[0]);

	for(key in inData.options){
		formData.append(key, inData.options[key]);
	}

	client.open("post", "/upload", true);
	client.send(formData);
}


// VARIBLE ROUTE---------------------------------------------------------
var $ajaxFilePostVariableRoute = function(inData){
	var _this = this;
	var client = new XMLHttpRequest();
	client.onreadystatechange = function() {
		if (client.readyState == 4 && client.status == 200){
			if(inData.onComplete){
				if(client.responseText){
					inData.onComplete(JSON.parse(client.responseText));
				}
			}
		}
	}

	var file = document.getElementById(inData.fileInputElement);
	var formData = new FormData();
	console.log(JSON.stringify(file.files[0]));
	formData.append("uploadedFile", file.files[0]);

	for(key in inData.options){
		formData.append(key, inData.options[key]);
	}

	client.open("post", inData.uploadRoute, true);
	client.send(formData);
}

var cleanPhoneNumber = function(inNumber){
	if(!(inNumber)){return false;}
	return formatE164("US", inNumber).replace('+', '');
	//US ONLY-----
	/*var standardNo = inNumber.replace(/[^\d]/g,'');
	if(standardNo.charAt(0) != '1'){
		standardNo = "1" + standardNo;
	}
	return standardNo.slice(0,11);*/
}

var phoneNumberCompare = function(inNumberA, inNumberB){
	return cleanPhoneNumber(inNumberA) == cleanPhoneNumber(inNumberB);
}

var phoneDisplayFormat = function(inNumber){
	//inNumber = cleanPhoneNumber(inNumber);
	return formatLocal("US", inNumber);
	/*if(inNumber.length == 10){
		inNumber = '1' + inNumber;
		return inNumber.substring(1).replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '1($1)$2-$3');
	}

	if(inNumber.length == 11){

		return '1' + inNumber.substring(1).replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1)$2-$3');
	}

	return inNumber;*/
}
var mysqlEpochToLocalDateTime = function(inValue){
	var utcSeconds = inValue;
	var newDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
	newDate.setUTCSeconds(utcSeconds);
	return newDate.toLocaleString();
}

var copyObject = function(inObject){
	return $.extend(true, {},inObject);
	//return JSON.parse(JSON.stringify(inObject));
}



var array_unique = function(inArray){
	return $.grep(inArray, function(v, k){return $.inArray(v ,inArray) === k;})
}


//debugTool
console.d = function(inArray){
	var resultString = '';
	for(index in inArray){
		resultString += (inArray[index] + '\n');
	}

	alert(resultString);
}


var arrayDiff = function(inArray0, inArray1){
	return $(inArray0).not(inArray1).get();
}



//opposite of extend,  recursive difference...
// returns anything that is in obj1 that is not in obj2....
var diff = function(obj1, obj2){
	var delta = {};
	for (var x in obj1) {
		if (obj2.hasOwnProperty(x)) {
			if (typeof obj2[x] == "object") {
				//recurse nested objects/arrays
				delta[x] = diff(obj1[x], obj2[x]);
			}else{
				//if obj2 doesn't match then - modified attribute
				if (obj2[x] != obj1[x]) {
					delta[x] = obj1[x];
				}
			}
		}else{
			//obj2 doesn't have this - new attribute
			delta[x] = obj1[x];
		}
	}

	return delta;
}

//format strings
//sprintf('Latitude: %s, Longitude: %s', 41.847, -87.661)
var sprintf = function(format, etc){
	var arg = arguments;
	var i = 1;
	return format.replace(/%((%)|s)/g, function (m) { return m[2] || arg[i++] })
}

//###################################### JS UTILITY ###############################################
//--------------------- > Type Test < -------------------------------------------------------------
//#################################################################################################

var $json = new function(){
	var _this = this;
	this.isArray = function(inObject){
		return inObject.constructor === Array;
	}

	this.isObject = function(inObject){
		return inObject.constructor === {}.constructor
	}

	this.fieldExist = function(inJsonStruct, field){
		return inJsonStruct.hasOwnProperty(field);
	}

	this.isString = function(inObject){
		return inObject.constructor === "xx".constructor
	}

	// return fields and values for anything NOT: object or array!!!
	this.getSingleLayer = function(inObject){
		var result = {};
		for(var inObjectIndex in inObject){
			if(!(_this.isArray(inObject[inObjectIndex])) && !(_this.isObject(inObject[inObjectIndex]))){
				result[inObjectIndex] = inObject[inObjectIndex];
			}
		}
		return result;
	}

	this.mapJson = function(inJsonStruct, inKeyOfInterest){
		//return JSON.stringify(inJsonStruct);
		var jsonAsString = JSON.stringify(inJsonStruct);
		return jsonAsString.split('"id":');
	}

	this.getAllKeys = function(inJsonStruct){
		var result = {};
		function recurse (cur, prop){
			if(Object(cur) !== cur){
				result[prop] = cur;
			}
			else if(Array.isArray(cur)){
				for(var i=0, l=cur.length; i<l; i++)
					//console.log('cur:' + cur);
					//console.dir(cur);
					recurse(cur[i], prop + "[" + i + "]");
					if(l == 0)
						result[prop] = [];
			}else{
				var isEmpty = true;
				for (var p in cur){
					isEmpty = false;
					recurse(cur[p], prop ? prop+"."+p : p);
				}
				if(isEmpty && prop)
					result[prop] = {};
			}
		}
		recurse(inJsonStruct, "");
		return Object.keys(result);
	}
	this.toFlatHash = function(inJsonStruct){
		var result = {};
		function recurse (cur, prop){
			if(Object(cur) !== cur){
				result[prop] = cur;
			}
			else if(Array.isArray(cur)){
				for(var i=0, l=cur.length; i<l; i++)
					//console.log('cur:' + cur);
					//console.dir(cur);
					recurse(cur[i], prop + "[" + i + "]");
					if(l == 0)
						result[prop] = [];
			}else{
				var isEmpty = true;
				for (var p in cur){
					isEmpty = false;
					recurse(cur[p], prop ? prop+"."+p : p);
				}
				if(isEmpty && prop)
					result[prop] = {};
			}
		}
		recurse(inJsonStruct, "");
		return result;
	}

	this.toArray = function(inJsonStruct){
		var resultArray = [];
		var tmpHash = _this.toFlatHash(inJsonStruct);
		for(var theIndex in tmpHash){
			resultArray.push(tmpHash[theIndex]);
		}

		return resultArray;
	}

	this.arrayToHash = function(inArray){
		var tmpHash = [];
		for(var inArrayIndex in inArray){
			tmpHash[inArray[inArrayIndex].id] = inArray[inArrayIndex];
		}
		return tmpHash;
	}



}();






//###################################### OBJECT ###############################################
//--------------------- > D e v i c e Q u e r y S y n c < -----------------------------------
//#############################################################################################
var DeviceQuerySync = function(inCommManagerInstance){
	var _this = this;
	var commManager = inCommManagerInstance;


	/*
	*	param0	String 		last sms id in the user database
	*	param1	function 	callback with device information array present(async)
	*/
	this.sms_getAllMessages = function(inLastSyncedId, inPostFunction){
		var chunkArray = [];
		commManager.sendTransactionSeries(
			{
				command:'getAllSmsAboveId',
				data:
					{
						lastId:inLastSyncedId

					},
				onAll:function(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next){
					console.log("CALBACK onAll");

					if(inDataLayer_json.dataArray){
						for(index in inDataLayer_json.dataArray){
							chunkArray.push(inDataLayer_json.dataArray[index]);
						}
					}

					next();
				},
				onComplete:function(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next){
					//chunkArray.sort(function(a,b) { return parseInt(b.id) - parseInt(a.id) } );
					console.log('-------completed sms_getAllMessages----------------------------------------------');
					//console.dir(chunkArray);
					if(inPostFunction){inPostFunction(chunkArray);}
				}
			}
		);//endTrans
	}

	this.phoneLog_getAll = function(inLastSyncedId, inPostFunction){
		var chunkArray = [];
		commManager.sendTransactionSeries(
			{
				command:'getAllPhoneLogs',
				data:
					{
						lastId:inLastSyncedId

					},
				onAll:function(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next){
					console.log("CALBACK onAll");

					if(inDataLayer_json.dataArray){
						for(index in inDataLayer_json.dataArray){
							chunkArray.push(inDataLayer_json.dataArray[index]);
						}
					}

					next();
				},
				onComplete:function(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next){
					console.log('-------completed phoneLog_getAll----------------------------------------------');
					if(inPostFunction){inPostFunction(chunkArray);}
				}
			}
		);//endTrans
	}
}






//###################################### OBJECT ###############################################
//--------------------- > StorageObject < -----------------------------------
//#############################################################################################
var StorageObject = function(){
	var _this = this;
	var smsLimit = false;

	this.setSmsLimit = function(inLimit){
		smsLimit = inLimit;
	}

	this.addManySms = function(inSmsArray, inPostFunction){
		$postAjax(
			{
				url:'/database/sms/addManySms',
				send:
					{
						dataArray:inSmsArray
					},
				onAjaxSuccess:function(inResponseText){
					inResponseText = JSON.parse(inResponseText);
					if(inPostFunction){inPostFunction(inResponseText);}
				}
			}
		);
	}

	this.getSmsLastId = function(inPostFunction){
		console.log('-------------getSmsLastId-----------------------------------------');
		$postAjax(
			{
				url:'/database/sms/getSmsLastId',
				send:
					{

					},
				onAjaxSuccess:function(inResponseText){
					inResponseText = JSON.parse(inResponseText);
					var lastId = 0;
					if(inResponseText.result.lastId){
						lastId = inResponseText.result.lastId.toString();
					}
					if(inPostFunction){inPostFunction(lastId);}
				}
			}
		);
	}

	this.getAllSmsByPhone = function(inPhoneNumber, inPostFunction){
		console.log('-------------getAllSmsByPhone-----------------------------------------');
		$postAjax(
			{
				url:'/database/sms/getAllSmsByPhone',
				send:
					{
						phoneNumber:inPhoneNumber,
						limit:smsLimit
					},
				onAjaxSuccess:function(inResponseText){
					inResponseText = JSON.parse(inResponseText);
					if(inPostFunction){inPostFunction(inResponseText.result);}
				}
			}
		);
	}

	this.getUserImageUrl = function(){

	}

	this.getMissingSmsByPhone = function(inPhoneNumber, inArrayOfSmsId, inPostFunction){
		console.log('-------------getMissingSmsByPhone-----------------------------------------');
		$postAjax(
			{
				url:'/database/sms/getMissingSmsByPhone',
				send:
					{
						phoneNumber:inPhoneNumber,
						arrayOfSmsId:inArrayOfSmsId
					},
				onAjaxSuccess:function(inResponseText){
					inResponseText = JSON.parse(inResponseText);
					if(inPostFunction){inPostFunction(inResponseText.result);}
				}
			}
		);
	}

	this.getPhoneLogLastId = function(inPostFunction){
		$postAjax(
			{
				url:'/database/phonelog/getPhoneLogLastId',
				send:
					{

					},
				onAjaxSuccess:function(inResponseText){
					inResponseText = JSON.parse(inResponseText);
					var lastId = 0;
					if(inResponseText.result.lastId){
						lastId = inResponseText.result.lastId.toString();
					}
					if(inPostFunction){inPostFunction(lastId);}
				}
			}
		);
	}

	this.addManyPhoneLog = function(inTheArray, inPostFunction){
		/*$.messager.progress(
			{
					title:"<img style='float: left; height:40px' src='public/images/ui/email.png'/>" + "Loading Device Call log into database",
					msg:'Name:',
					showType:'slide',
					height:'300px',
					style:
						{
							right:'',
							top:document.body.scrollTop+document.documentElement.scrollTop,
							bottom:''
						},
					interval:600

			}
		); */

		$postAjax(//addManyPhoneLog
			{
				url:'/database/phonelog/addManyPhoneLog',
				send:
					{
						dataArray:inTheArray
					},
				onAjaxSuccess:function(inResponseText){
					inResponseText = JSON.parse(inResponseText);
					//$.messager.progress('close');
					if(inPostFunction){inPostFunction(inResponseText);}
				}
			}
		);
	}

}

//###################################### OBJECT ###############################################
//--------------------- > Backstack < -----------------------------------
//#############################################################################################


var Backstack = function(inJsonStruct){
	var _this = this;
	if(typeof inJsonStruct.limit === 'undefined'){inJsonStruct.limit = 1000000;}
	var limit = inJsonStruct.limit;
	var stack = [];

	var options = 
		{
			//- @@ overWriteOnPush:true same element moves to new position OR :false stays stored various positions for every push..
			overWriteOnPush:true
		}
	inJsonStruct = $.extend(options, inJsonStruct);

	this.push = function(inData){
		if(!(inData)){return false;}

		var existVal = exist(inData);
		console.log('existVal' + existVal);
		console.log('!(inJsonStruct.overWriteOnPush)' + inJsonStruct.overWriteOnPush);
		console.log('inData:');
		console.dir(inData);
		if(existVal == -1 || !(inJsonStruct.overWriteOnPush)){
			stack.push(inData);
			if(inJsonStruct.onPush){
				inJsonStruct.onPush(inData);
			}

			if(stack.length > limit){
				var tmpItem = stack.pop();
				if(inJsonStruct.onPop){
					inJsonStruct.onPop(tmpItem);
				}
			}
		}else{
			remove(existVal);
			stack.push(inData);
			if(inJsonStruct.onPush){
				inJsonStruct.onPush(inData);
			}
		}
		console.log('Backstack dump-----');
		console.dir(stack);
	}

	this.isEmpty = function(){
		return (stack.length > 0) ? true : false;
	}

	this.top = function(){
		if(!(stack.length > 0)){ return false;}
		return stack[stack.length - 1];
	}

	this.peek = function(index){
		if(!(stack.length > (0 + index))){ return false;}
		return stack[stack.length - (1 + index)];
	}

	this.pop = function(){
		if(!(stack.length > 0)){ return false;}
		if(stack.length == 1){
			return _this.top();
		}else{
			remove(stack.length - 1);
			return _this.top();
		}
	}

	var exist = function(inItem){
		console.log('stack exist:');
		console.dir(stack);
		for(index in stack){
			//if(JSON.stringify(stack[index]) == JSON.stringify(inItem)){
			console.log('text_0:' + stack[index].toString());
			console.log('text_1' + inItem.toString());
			//if(stack[index].toString() == inItem.toString()){
			//if($(stack[index]).not(inItem).length === 0 && $(inItem).not(stack[index]).length === 0){
			if($.compareObject(stack[index], inItem)){
				console.log('exist true');
				return index;
			}
		}
		console.log('exist false');
		return -1;
	}

	var remove = function(inIndex){
		var tmpArray = [];
		for(index in stack){
			if(!(index == inIndex)){
				tmpArray.push(stack[index]);
			}else{
				var tmpItem = stack[index];
				if(inJsonStruct.onPop){
					inJsonStruct.onPop(tmpItem);
				}
			}
		}

		stack = tmpArray;
	}

}

//###################################### OBJECT ###############################################
//--------------------- > E v e n t   O b j e c t < -----------------------------------
//#############################################################################################
var EventObject = function(){
	var _this = this;

	var hashOfArray = new HashOfArrayObject(false);

	this.setOn = function(inEventKey, inPostFunction){
		hashOfArray.add(inEventKey, inPostFunction);
	}

	this.reportOn = function(inEventKey, inData){
		var theArray = hashOfArray.getArrayFromHash(inEventKey);
		for(index in theArray){
			if(theArray[index]){
				theArray[index](inData);
			}
		}
	}

}


//###################################### OBJECT ###############################################
//--------------------- > Wait Panel < --------------------------------------------------------
//#############################################################################################

var WaitPanel = function(inJsonStruct){
	var _this = this;
	var options = 
		{
			imageUrl:'/public/images/ui/wait.gif',
			height:'120px',
			width:'120px',
			display:'none',
			message:'Please Wait',
			top:'50px',
			left:'550px',
			center:true
		}
	options = $.extend(options, inJsonStruct);
	var elementId = 'waitPanelDiv';

	//$('body').append('<div id="' + elementId + '" style="display:' + options.display + '"/>');
	if(options.center){
		$('body').append('<center><div id="' + elementId + '" style="z-index:99999999;"/></center>');
	}else{
		$('body').append('<div id="' + elementId + '" style="z-index:99999999;top:' + options.top + '; left:' + options.left +';"/>');
	}
	$('#' + elementId).window({
		minimizable:false,
		collapsible:false,
		maximizable:false,
		closable:false,
		modal:true,

		width:options.height,
		height:options.width,
		title:options.message,
		top:options.top,
		left:options.left,
		doSize:true,
		content:'<center><img src="'+ options.imageUrl +'" style="height:90%; "/></center>',
		closed:true

	});

	//$('#' + elementId).panel('move',{top:40,left:300});

	this.show = function(){
		//$('#' + elementId).css('display', 'block');
		$('#' + elementId).window('open');
	}

	this.hide = function(){
		//$('#' + elementId).css('display', 'none');
		$('#' + elementId).window('close');
	}

	this.destroy = function(){
		$('#' + elementId).window('destroy');
		$('#' + elementId).remove();
		delete _this;
	}

	var loadImage = function(path, width, height, target) {
		$('<img src="'+ path +'">').load(function() {
			$(this).width(width).height(height).appendTo(target);
		});
	}

	//loadImage(options.imageUrl, '50%', '','#' + elementId);
}

//###################################### OBJECT ###############################################
//--------------------- > JSON Pathify Object< ------------------------------------------------
//#############################################################################################
var JsonPathifyObject = function(inJson, inKeyOfInterest){
	var _this = this;
	var originalJson = inJson;
	var theJsonKeys = [];
	$json.getAllKeys(inJson).forEach(function(entry){
		if(entry.indexOf(inKeyOfInterest) != -1){
			theJsonKeys.push(entry);
		}
	});

	var pathHashByKeyOfInterest = {};
	var pathHashByPath = {};
	var tmpData = $json.toFlatHash(originalJson);
	for(var theJsonKeysIndex in theJsonKeys){
		pathHashByKeyOfInterest[tmpData[theJsonKeys[theJsonKeysIndex]]] = theJsonKeys[theJsonKeysIndex];
		pathHashByPath[theJsonKeys[theJsonKeysIndex]] = tmpData[theJsonKeys[theJsonKeysIndex]];
	}

	this.getArrayOfInterestKeys = function(){
		return theJsonKeys;
	}

	var pathalizeArray = function(inArray){
		var newArray = [];
		var tmp = '';
		for(inArrayIndex in inArray){
			if(inArrayIndex == 0){
				tmp = inArray[inArrayIndex];
				newArray.push(inArray[inArrayIndex]);
			}else{
				tmp = tmp + '.' + inArray[inArrayIndex];
				newArray.push(tmp);
			}
		}
		return newArray;
	}

	this.getParentPath = function(inKey){
		var currentPathArray = pathHashByKeyOfInterest[inKey].split('.');
		var pathArray = pathalizeArray(currentPathArray);
		if((pathArray.length -3) > -1){
			return pathArray[pathArray.length -3];
		}else{
			return pathArray[0];
		}
	}

	this.getParentJsonById = function(inKey){
		var execString = sprintf('originalJson.%s', pathHashByKeyOfInterest[_this.getParrentId(inKey)].replace("." + inKeyOfInterest,"") );
		var theVal = eval(execString);
		return theVal;
	}

	this.getParrentId = function(inKey){
		return pathHashByPath[_this.getParentPath(inKey) + '.' + inKeyOfInterest];
	}


}

//==============================================================================================================================
//  DATE LIBRARY ---------------------------------------------------------------------------------------------------------------
//==============================================================================================================================
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.

 example:

	today = new Date();
	var dateString = today.format("dd-m-yy");
	alert(dateString);


 */
var now = function(){
	today = new Date();
	var dateString = today.format("mm-dd-yyyy hh:mm:ss TT");
	return dateString;
}

var dateFormat = function () {
	var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

