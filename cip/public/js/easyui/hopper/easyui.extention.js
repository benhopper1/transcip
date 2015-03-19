
var EasyUiExtention = new function(){
	var varHash = {};
	this.getVar = function(inJq, inVarName){
		console.log('jq getVar dumping----');
		console.dir(inJq.selector);
		if(varHash[inJq.selector]){
			console.log('val:' + varHash[inJq.selector][inVarName])
			return varHash[inJq.selector][inVarName];
		}
	}

	this.putVar = function(inJq, inVarName, invalue){
		console.log('jq dumping----');
		console.dir(inJq.selector);
		if(!(varHash[inJq.selector])){
			varHash[inJq.selector] = {};
		}
		varHash[inJq.selector][inVarName] = invalue;
	}

	this.dump = function(){
		console.log('------------- -- EasyUiExtention   D U M P -- ----------------------');
		console.dir(varHash);
	}
}();
$(function(){
    /**
     * Extend the datagrid functionality
     */
    $.extend($.fn.combobox.defaults, {
          hopper: 'hoppervalue'
    });
});

//=================================================================================================================
// ----- > C O M B O B O X < --------------------------------------------------------------------------------------
//=================================================================================================================
$.extend($.fn.combobox.methods, {
	//==========================================================
	// G L O B A L S
	//==========================================================
	//hasHeader:false,


/*
================================================================
---- EXAMPLE ------------
=========================
	$('#cb_phoneDocumentView_relation').combobox('selectFirst');

*/

	selectFirst:function(jq, ignored){
		return jq.each(function(){
			var optionsValueField = $(this).combobox('options').valueField;
			if(optionsValueField){
				if(!(EasyUiExtention.getVar(jq, 'hasHeader'))){
					// no header
					console.log('NO HEADER');
					if($(this).combobox('getData')[0]){
						if($(this).combobox('getData')[0][optionsValueField]){
							$(this).combobox('select', $(this).combobox('getData')[0][optionsValueField]);
						}
					}
				}else{
					// got header
					console.dir('GOT HEADER');
					if($(this).combobox('getData')[1]){
						if($(this).combobox('getData')[1][optionsValueField]){
							$(this).combobox('select', $(this).combobox('getData')[1][optionsValueField]);
						}
					}else{
						if($(this).combobox('getData')[0]){
							if($(this).combobox('getData')[0][optionsValueField]){
								$(this).combobox('select', $(this).combobox('getData')[0][optionsValueField]);
							}
						}
					}
				}
			}
		});
	},

/*
================================================================
---- EXAMPLE ------------
=========================
		$('#cb_phoneDocumentView_relation').combobox('add',
			{
				id:'myId',
				text:'myText'
			}
		);
*/
	add:function(jq, inData){
		return jq.each(function(){
			var existingData = $(this).combobox('getData');
			existingData.push(inData);
			$(this).combobox('loadData',existingData);
		});
	},
/*
================================================================
---- EXAMPLE ------------
=========================
		$('#cb_phoneDocumentView_relation').combobox('add',
			[
				{
					id:'myId',
					text:'myText'
				}
			]
		);
*/
	addArray:function(jq, inData){
		return jq.each(function(){
			var existingData = $(this).combobox('getData');
			for(var inDataIndex in inData){
				existingData.push(inData[inDataIndex]);
			}
			$(this).combobox('loadData',existingData);
		});
	},

/*
================================================================
---- EXAMPLE ------------
=========================
console.dir(  $('#cb_phoneDocumentView_relation').combobox('getDataByText', 'Java')   );
	param0 string 	the text field 
*/
	getDataByText:function(jq, inTextField){
		var result;
		jq.each(function(){
			var existingData = $(this).combobox('getData');
			for(var existingDataIndex in existingData){
				var record = existingData[existingDataIndex];
				var theTextField = $(this).combobox('options').textField;
				if(record[theTextField]){
					if(record[theTextField] == inTextField){
						result = record;
					}
				}
			}
		});
		return result;
	},


/*
================================================================
---- EXAMPLE ------------
=========================
console.dir($('#cb_phoneDocumentView_date').combobox('getSelected'));

*/
	getSelected:function(jq, ignored){
		var result = false;
		jq.each(function(){
			var comboArray = $(this).combobox('getData');
			var selectedId = $(this).combobox('getValue');
			for(var index in comboArray){
				if(comboArray[index].id == selectedId){
					result = comboArray[index];
				}
			}
		});
		return result;
	},





	/*
================================================================
---- EXAMPLE ------------
=========================
$('#cb_phoneDocumentView_catagory').combobox('setHeader',
	{
		id:'all',
		text:'--- > - ALL - < ---'
	}
);

*/
	setHeader:function(jq, inHeader){
		jq.each(function(){
			if(!(EasyUiExtention.getVar(jq, 'hasHeader'))){
				EasyUiExtention.putVar(jq, 'hasHeader', true);
				EasyUiExtention.dump();
				var comboArray = $(this).combobox('getData');
				comboArray.unshift(inHeader);
				$(this).combobox('loadData',comboArray);
			}
		});
	},

	selectHeader:function(jq, inHeader){
		jq.each(function(){
			if(EasyUiExtention.getVar(jq, 'hasHeader')){
				if($(this).combobox('getData').length > 0){
					var optionsValueField = $(this).combobox('options').valueField;
					if(optionsValueField){
						$(this).combobox('select', $(this).combobox('getData')[0][optionsValueField]);
					}
				}
			}
		});
	},

	// keeps header intact-----------------------------------
	loadDataH:function(jq, inData){
		jq.each(function(){
			if(!(EasyUiExtention.getVar(jq, 'hasHeader'))){
				return $(this).combobox('loadData', inData);
			}else{
				 inData.unshift($(this).combobox('getData')[0]);
				 return $(this).combobox('loadData', inData);
			}
			
		});
	},

/*
================================================================
---- EXAMPLE ------------
=========================
		$('#cb_phoneDocumentView_relation').combobox('add',
			[
				{
					id:'myId',
					text:'myText'
				}
			]
		);
*/
	selectByText:function(jq, inText){
		jq.each(function(){
			return $(this).combobox('select', inText);
			//$(this).combobox('loadData',existingData);
			
		});
	},








});






//=================================================================================================================
// ----- > M E S S A G E R < --------------------------------------------------------------------------------------
//=================================================================================================================
$.messager.close = function(){
	$('.messager-window .panel-header .panel-tool-close').trigger('click');
	//$.messager.reportOnClose();
}

$('.messager-window .panel-header .panel-tool-close').click(function(){
	console.log('click---------------------------------');
	$.messager.reportOnClose();
});

var messagerOnCloseCallbacks = [];
$.messager.onClose = function(inPostFunction){
	messagerOnCloseCallbacks.push(inPostFunction);
}

$.messager.reportOnClose = function(inData){
	for(var index in messagerOnCloseCallbacks){
		messagerOnCloseCallbacks[index](inData);
	}
	messagerOnCloseCallbacks = [];
}