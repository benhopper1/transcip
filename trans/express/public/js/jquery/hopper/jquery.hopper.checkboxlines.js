//=======================================================================================================================================================
// CheckboxLines ------------------------------------------------------------------------------------------------------------------------------------
//=======================================================================================================================================================
var CheckboxLines = function(inJrefOfThis, inJsonStruct){
	var _this = this;
	var theDivRef;
	var divForm;
	var divFieldset;

	//var itemArray = [];
	$(inJrefOfThis).data("itemHash", {});
	var options = 
		{
			id:((inJrefOfThis).attr('id'))? (inJrefOfThis).attr('id') + '_form' : new Date().getTime() + '_form',
			//id:'checkboxLines_' + new Date().getTime(),
			formClass:'',
			formStyle:'background-color: transparent !important', //remove later!!
			fieldsetClass:'',
			fieldsetStyle:'background-color: transparent !important', //remove later!!
			onChange:false,
		}
	options = $.extend(options, inJsonStruct);
	theDivRef = options.divRef;
	//heDivRef = $.extend({}, options.divRef); //worked but changed back

	this.test = function(){
		alert('checkboxLines TEST');
	}

	var createContainer = function(){
		var formDiv =  $('<form></form>').attr(
			{
					'id': options.id,
					'style':options.formStyle,
					'data-mini':'true',
			}
		).addClass('') //ui-content
		 .addClass(options.formClass);

		var fieldset =  $('<fieldset></fieldset>').attr(
			{
					'id': options.id + '_fieldset',
					'data-role':'controlgroup',
					'data-mini':'true',
					'style':options.fieldsetStyle
			}
		).addClass('') //ui-content
		 .addClass(options.fieldsetClass);

		$(inJrefOfThis).append(formDiv);
		$(formDiv).html(fieldset);
		divForm = $(formDiv)
		divFieldset = $(divForm);
		return divFieldset;
	}

	//create the container here
	createContainer();

	this.editItem = function(inJ){
		var itemOptions = 
			{
				caption:'noCaption',
				lookupId:false,
				data:false,
			}
		itemOptions = $.extend(itemOptions, inJ);
		var storedData = $(inJrefOfThis).data("itemHash")[itemOptions.lookupId];
		if(storedData){
			storedData.data = itemOptions.data;
		}
		$('.sms-pop-' + itemOptions.lookupId).html(itemOptions.caption);
	}



	this.addItem = function(inJ){
		var tmpGuid = new Date().getTime() + '';
		var itemOptions = 
			{
				caption:'noCaption',
				id:(inJ.id)? $(divFieldset).attr('id') + '_field_' + inJ.id : $(divFieldset).attr('id') + '_field_' + tmpGuid,
				lookupId:(inJ.lookupId)? inJ.lookupId : tmpGuid,
				isChecked:false,
				class:'',
				data:false,
			}
		itemOptions = $.extend(itemOptions, inJ);
		var html = '' + 
			'<label class="sms-pop-' + itemOptions.lookupId + '" style="background-color: transparent !important;" for="' + itemOptions.id + '">' + itemOptions.caption + '</label>' + '' + 
			'<input type="checkbox" name="' + itemOptions.id + '" id="' + itemOptions.id + '" lookupId="' + itemOptions.lookupId + '"/>'
		;

		$(divFieldset).append(html);
		itemOptions['divLabelRef'] = $("label[for='" + itemOptions.id + "']");
		itemOptions['divInputRef'] = $('#' + itemOptions.id);
		$(inJrefOfThis).data('itemHash')[itemOptions.lookupId] = itemOptions;
		
		$(divFieldset).trigger('create');
		//$(itemOptions['divInputRef']).checkboxradio().trigger('create');//works not needed...		

		console.log('----- itemHash --------');
		console.dir($(inJrefOfThis).data('itemHash'));
		_this.setCheckbox(itemOptions.lookupId, itemOptions.isChecked);


		//--EVENT SETUP(CHANGE)-->
		$(itemOptions['divInputRef']).change(function(){
			var storedData = $(inJrefOfThis).data("itemHash")[$(this).attr('lookupId')];
			//updateHash
			storedData.isChecked = _this.isChecked($(this).attr('lookupId'));
			if(options.onChange){
				options.onChange($(this).attr('lookupId'), storedData.isChecked, storedData, divForm, storedData['divInputRef'], storedData['divLabelRef']);
			}
		});


		return itemOptions.lookupId;

	}

	this.setCheckbox = function(inLookupId, inCheckValue){
		var theRef = $(inJrefOfThis).data('itemHash')[inLookupId].divInputRef;
		$(inJrefOfThis).data('itemHash')[inLookupId].isChecked = inCheckValue;
		var oldVal = _this.isChecked(inLookupId);
		if(inCheckValue){
			$(theRef).prop('checked',true).checkboxradio('refresh');
			if(!(oldVal)){
				if(options.onChange){
					options.onChange(inLookupId, inCheckValue, _this.getDataByLookupId(inLookupId), divForm, _this.getDataByLookupId(inLookupId)['divInputRef'], _this.getDataByLookupId(inLookupId)['divLabelRef']);
				}
			}
		}else{
			$(theRef).removeAttr('checked').checkboxradio('refresh');
			if(oldVal){
				if(options.onChange){
					options.onChange(inLookupId, inCheckValue, _this.getDataByLookupId(inLookupId), divForm, _this.getDataByLookupId(inLookupId)['divInputRef'], _this.getDataByLookupId(inLookupId)['divLabelRef']);
				}
			}
		}
	}

	this.isChecked = function(inLookupId){
		var theRef = $(inJrefOfThis).data('itemHash')[inLookupId].divInputRef;
		return $(theRef).prop("checked");
	}

	this.getCheckedData = function(){
		var allData = $(inJrefOfThis).data('itemHash');
		var resultArray = [];
		for(var allDataIndex in allData){
			if(allData[allDataIndex].isChecked){
				resultArray.push(allData[allDataIndex]);
			}
		}
		return resultArray;
	}

	this.getUnCheckedData = function(){
		var allData = $(inJrefOfThis).data('itemHash');
		var resultArray = [];
		for(var allDataIndex in allData){
			if(!(allData[allDataIndex].isChecked)){
				resultArray.push(allData[allDataIndex]);
			}
		}
		return resultArray;
	}

	this.getDataByLookupId = function(inLookupId){
		return $(inJrefOfThis).data('itemHash')[inLookupId];
	}

	this.getData = function(){
		var allData = $(inJrefOfThis).data('itemHash');
		var resultArray = [];
		for(var allDataIndex in allData){
				resultArray.push(allData[allDataIndex]);
		}
		return resultArray;
	}

	this.setCheckForAll = function(inValue){
		if(typeof inValue === 'undefined'){
			inValue = true;
		}
		var allData = $(inJrefOfThis).data('itemHash');
		for(var allDataIndex in allData){
			_this.setCheckbox(allData[allDataIndex].lookupId, inValue);
		}
	}

	this.remove = function(inLookupId){
		var dataWrapper = $(inJrefOfThis).data('itemHash')[inLookupId];
		if(!(dataWrapper)){return false;}
		$(dataWrapper.divInputRef).parent().remove();
		delete $(inJrefOfThis).data('itemHash')[inLookupId];
		//$(divForm).checkboxradio('refresh');
	}

	this.clear = function(){
		$(inJrefOfThis).data('itemHash',{});

		$(divFieldset).children().each(function(){
			$(this).remove();
		});
	}

	this.getDataArrayFromWrapperArray = function(inWrapperData){
		var resultArray = [];
		for(var inWrapperDataIndex in inWrapperData){
			if(inWrapperData[inWrapperDataIndex].data){
				resultArray.push(inWrapperData[inWrapperDataIndex].data);
			}
		}
		return resultArray;
	}



}



$.fn.CheckboxLines = function(inAction, inJsonStruct){
	var checkboxLines = $(this).data("checkboxLinesInstance");

	if(!(checkboxLines) || inAction == 'create'){
		inJsonStruct['divRef'] = $(this);
		console.log('checkboxLines CREATED');
		var checkboxLines = new CheckboxLines($(this), inJsonStruct);
		$(this).data("checkboxLinesInstance", checkboxLines);
		return ;
	}
	if(inAction == 'test'){
		checkboxLines.test();
	}

	if(inAction == 'addItem'){
		return checkboxLines.addItem(inJsonStruct);
	}

	if(inAction == 'getCheckedData'){
		return checkboxLines.getCheckedData();
	}

	if(inAction == 'getUnCheckedData'){
		return checkboxLines.getUnCheckedData();
	}

	if(inAction == 'setCheckbox'){
		return checkboxLines.setCheckbox(inJsonStruct.lookupId, inJsonStruct.isChecked);
	}

	if(inAction == 'getDataByLookupId'){
		return checkboxLines.getDataByLookupId(inJsonStruct);
	}

	if(inAction == 'getData'){
		return checkboxLines.getData(inJsonStruct);
	}

	if(inAction == 'setCheckForAll'){
		return checkboxLines.setCheckForAll(inJsonStruct);
	}

	if(inAction == 'remove'){
		return checkboxLines.remove(inJsonStruct);
	}

	if(inAction == 'clear'){
		return checkboxLines.clear(inJsonStruct);
	}

	if(inAction == 'getDataArrayFromWrapperArray'){
		return checkboxLines.getDataArrayFromWrapperArray(inJsonStruct);
	}

	if(inAction == 'editItem'){
		return checkboxLines.editItem(inJsonStruct);
	}

}