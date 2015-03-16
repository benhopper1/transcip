//=======================================================================================================================================================
// CheckboxLines ------------------------------------------------------------------------------------------------------------------------------------
//=======================================================================================================================================================

var CheckboxLines = function(inJrefOfThis, inJsonStruct){
	var _this = this;
	var theDivRef;
	var options = 
		{
			id:((inJrefOfThis).attr('id'))? (inJrefOfThis).attr('id') + '_form' : new Date().getTime() + '_form',
			//id:'checkboxLines_' + new Date().getTime(),
			style:'',
			class:'',
		}
	options = $.extend(options, inJsonStruct);
	theDivRef = options.divRef;

	this.test = function(){
		alert('checkboxLines TEST');
	}

	var createHtmlContainer = function(){
		var formDiv =  $('<div></div>').attr(
			{
					'id': options.id,
					//'data-role': 'popup',
					//'data-theme': settings['data-theme'],
					//'data-position-to': settings['data-position-to'],
					//'data-dismissible': settings['data-dismissible'],
					//'data-transition': settings['data-transition'],
					//'data-arrow': settings['data-arrow']
			}
		).addClass('ui-content')
		 .addClass(options.class);

		var fieldSet = 7;






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

	if(inAction == 'load'){
		return checkboxLines.load(inJsonStruct);
	}

	if(inAction == 'save'){
		return checkboxLines.save(inJsonStruct);
	}

	if(inAction == 'clear'){
		return checkboxLines.clear();
	}
}