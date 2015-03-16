
script(src="/public/js/jquery/hopper/jquery.hopper.checkboxlines.js")


$('#testingDiv').CheckboxLines('create', 
{
		id:????
		formClass:????
		formStyle:????
		fieldsetClass:????
		fieldsetStyle:????
		onChange:function(lookupId, isChecked, dataWrapper, formJref, inputJref, labelJref){
			alert('onChangeCallBack:' + isChecked);
			console.dir(dataWrapper);
		}
	}
);
----------------------------------------------------------------------------
$('#testingDiv').CheckboxLines('addItem',
	{
		caption:'noCaption',
		isChecked:true,
		data:
			{
				testKey:'testValue'
			}
		//class:'',
	}
);
----------------------------------------------------------------------------
returningLookupId = $('#testingDiv').CheckboxLines('addItem',
	{
		lookupId:'ben5',
		caption:'noCaption2',
	}
);
----------------------------------------------------------------------------
$('#testingDiv').CheckboxLines('setCheckbox',
	{
		lookupId:'ben5',
		isChecked:true,
	}
);
----------------------------------------------------------------------------
getDataByLookupId
console.log('getDataByLookupId');
console.dir($('#testingDiv').CheckboxLines('getDataByLookupId', 'ben5'));

----------------------------------------------------------------------------
getUnCheckedData
console.log('getUnCheckedData');
console.dir($('#testingDiv').CheckboxLines('getUnCheckedData'));

----------------------------------------------------------------------------
getCheckedData
console.log('getCheckedData');
console.dir($('#testingDiv').CheckboxLines('getCheckedData'));


----------------------------------------------------------------------------
getData
console.log('getData');
console.dir($('#testingDiv').CheckboxLines('getData'));


----------------------------------------------------------------------------
setCheckForAll
console.log('setCheckForAll');
$('#testingDiv').CheckboxLines('setCheckForAll', false)
console.dir($('#testingDiv').CheckboxLines('getData'));

----------------------------------------------------------------------------
remove
$('#testingDiv').CheckboxLines('remove', 'ben5');

----------------------------------------------------------------------------
clear   
$('#testingDiv').CheckboxLines('clear');
----------------------------------------------------------------------------
var unWrappedDataArray = $('#testingDiv').CheckboxLines('getDataArrayFromWrapperArray', inWrappedArray);