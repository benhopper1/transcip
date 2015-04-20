/*$.fn.formatPhoneNumber = function () { 
	if($(this).val().length == 10){
		$(this).val('1' + $(this).val().substring(1).replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1)$2-$3'));
	}

	if($(this).val().length == 11){

		$(this).val('1' + $(this).val().substring(1).replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1)$2-$3'));
	}
}*/


/*$.fn.cleanPhoneNumber = function (){
	var standardNo = $(this).val().replace(/[^\d]/g,'');
	if(standardNo.charAt(0) != '1'){
		standardNo = "1" + standardNo;
	}
	$(this).val(standardNo.slice(0,11));
	return $(this);
}*/

/*$.fn.getCleanPhoneNumber = function (){
	console.log('getCleanPhoneNumber' + $(this).val());
	var standardNo = $(this).val().replace(/[^\d]/g,'');
	if(standardNo.charAt(0) != '1'){
		standardNo = "1" + standardNo;
	}
	console.log('getCleanPhoneNumber' + standardNo.slice(0,11));
	return standardNo.slice(0,11);
}*/

var constructor = new function(){
	console.log('HOPPER JQUERY EXTENTION CONSTRUCTOR RUNNING');
	//set up varible data into dom
	$('body').append(  $(document.createElement('div')).attr('id', 'validationRulesDiv')  );
}();

$.fn.blink = function(inDuration, inPostFunction){
	var $_this = $(this).get( 0 );
	$($_this).addClass('blink');
	$($_this).data("blinkPostFunction", inPostFunction);

	var blink = function(selector){
		$(selector).fadeOut(250, function(){
			$(this).fadeIn(250, function(){
				if($(this).hasClass( "blink" )){
					blink(selector);
				}
			});
		});
	}

	if(inDuration && inDuration > 0){
		var expireTimer = setTimeout(function(){
			$($_this).removeClass('blink');
			var postFunction = $($_this).data("blinkPostFunction");
			if(postFunction){
				postFunction(true);
			}
		}, inDuration);
		$($_this).data("expireTimer", expireTimer);
	}

	blink($_this);
}

$.fn.unblink = function(){
	var $_this = $(this).get( 0 );
	var expireTimer = $($_this).data("expireTimer");
	if(expireTimer){
		clearTimeout(expireTimer);
	}
	$($_this).removeClass('blink');
	var postFunction = $($_this).data("blinkPostFunction");
	if(postFunction){
		postFunction(false);
	}
}




$.fn.getCss = function(inX){
	var _this = $(this).get( 0 );
	var getComputedStyle = function( dom ) {
        var style;
        var returns = {};
        // FireFox and Chrome way
        if(window.getComputedStyle){
            style = window.getComputedStyle(dom, null);
            for(var i = 0, l = style.length; i < l; i++){
                var prop = style[i];
                var val = style.getPropertyValue(prop);
                returns[prop] = val;
            }
            return returns;
        }
        // IE and Opera way
        if(dom.currentStyle){
            style = dom.currentStyle;
            for(var prop in style){
                returns[prop] = style[prop];
            }
            return returns;
        }
        // Style from style attribute
        if(style = dom.style){
            for(var prop in style){
                if(typeof style[prop] != 'function'){
                    returns[prop] = style[prop];
                }
            }
            return returns;
        }
        return returns;
    };
	return getComputedStyle(_this);
}


$.fn.validate = function(inValidationType){
	if(inValidationType == 'phoneNumber'){
		if($(this).val().length = 11){}
	}

	if(inValidationType == 'emailAddress'){}
}




//==================================================================
// LIST VIEW -------------------------------------------------------
//==================================================================
var listViewHash = {};
$.fn.listViewAppend = function(inData){
	var options = 
		{
			id:new Date().getTime(),
			class:'listViewClass',
			imageUrl:'BAD URL',
			name:'NO NAME',
			number:'NO NUMBER',
			type:'NO TYPE',
			state:false,
		}
	options = $.extend(options, inData);

	var html = '' + 
		'<li id="' + options.id + '" class="menu_li ' + options.class + '"  data-inset="true">' + ' ' +
			'<a "/hjhjhjh"> ' + options.name 													+ ' ' +
				'<img src="' + options.imageUrl + '" class="magicCirc" style"height:50px; width:50px; object-fit: cover;" />'			+ ' ' +
				'<p>' + options.number + '</p>'													+ ' ' +
				'<p>' + options.type + '</p>'													+ ' ' +
			'</a>'																				+ ' ' +
		'</li>'
	;
	options['html'] = html;
	listViewHash[options.id] = options;


	$(this).append(html);
	$(this).listview().listview('refresh');
	return options.id;
}

$.fn.getListViewArray = function(){
	return listViewHash;
}
$.fn.getListView = function(inId){
	return listViewHash[inId];
}

$.fn.listViewRemove = function(inId){
	var listViewOptions = listViewHash[inId];
	if(listViewOptions){
		delete listViewHash[inId];
		$('#' + inId).remove();
	}
}




//=======================================================================================================================================================
// CheckBoxControl ------------------------------------------------------------------------------------------------------------------------------------
//=======================================================================================================================================================
$.fn.form_checkbox_add = function(inJsonStruct){
	var options = 
			{
				caption:'noCaption',
				id:new Date().getTime(),
				isChecked:false,
			}
		options = $.extend(options, inJsonStruct);
	var createHtml = function(inJ){
		var html = '' + 
			'<label style="background-color: transparent !important;" for="' + inJ.id + '">' + inJ.caption + '</label>' + '' + 
			'<input type="checkbox" name="' + inJ.id + '" id="' + inJ.id + '"/>'
		;
		return html;

	}
	if(!($(this).data("elementArray"))){
		var theArray = [];
		$(this).data("elementArray", theArray);
	}
	$(this).data("elementArray").push(options);
	$(this).find('.ui-controlgroup-controls').append(createHtml(options));
	$(this).trigger('create');
	//set init value
	if(options.isChecked){
		$('#' + options.id).prop('checked',true).checkboxradio('refresh');
	}else{
		$('#' + options.id).removeAttr('checked').checkboxradio('refresh');
	}
	return options.id;
}

$.fn.form_checkbox_getValueById = function(inId){
	if(!($(this).data("elementArray"))){return false;}
	return $('#' + inId).prop("checked");
}
$.fn.form_checkbox_getValueByIndex = function(inIndex){
	var theData = $(this).data("elementArray");
	if(!(theData)){return false;}
	return $('#' + theData[inIndex].id).prop("checked");
}
$.fn.form_checkbox_getData = function(){
	var theData = $(this).data("elementArray");
	if(!($(this).data("elementArray"))){return false;}
	for(var theDataIndex in theData){
		theData[theDataIndex].isChecked = $('#' + theData[theDataIndex].id).prop("checked");
	}
	return theData;
}

$.fn.form_checkbox_getCheckedData = function(){
	var theData = $(this).form_checkbox_getData();
	resultArray = [];
	for(var theDataIndex in theData){
		if(theData[theDataIndex].isChecked){
			resultArray.push(theData[theDataIndex].data);
		}
	}
	return resultArray;
}


$.fn.form_checkbox_clear = function(){
	var theData = $(this).data("elementArray");
	if(!($(this).data("elementArray"))){return false;}
	$(this).find(' .ui-controlgroup-controls').empty();
	$(this).removeData("elementArray");
	$(this).trigger('create');
}

$.fn.form_checkbox_removeById = function(inId){
	var theData = $(this).data("elementArray");
	if(!($(this).data("elementArray"))){return false;}
	$('#' + inId).parent().children().remove();
	//$('#' + inId).remove();
	for(var theDataIndex in theData){
		if(theData[theDataIndex].id == inId){
			theData.splice(theDataIndex, 1); 
		}
	}
}
$.fn.form_checkbox_removeByIndex = function(inIndex){
	var theData = $(this).data("elementArray");
	if(!($(this).data("elementArray"))){return false;}
	$('#' + theData[inIndex].id).siblings().remove();
	$('#' + theData[inIndex].id).remove();
	theData.splice(inIndex, 1);
}

//=======================================================================================================================================================
// HorizontalRadioGroup ------------------------------------------------------------------------------------------------------------------------------------
//=======================================================================================================================================================
$.fn.HorizontalRadioGroup = function(inAction, inJsonStruct){
	var horizontalRadioGroup = $(this).data("horizontalRadioGroupInstance");


	if(!(horizontalRadioGroup) || inAction == 'create'){
		inJsonStruct['divRef'] = $(this);
		console.log('HorizontalRadioGroup CREATED');
		var horizontalRadioGroup = new HorizontalRadioGroup(inJsonStruct);
		$(this).data("horizontalRadioGroupInstance", horizontalRadioGroup);
		return ;
	}
	if(inAction == 'test'){
		horizontalRadioGroup.test();
	}

	if(inAction == 'load'){
		horizontalRadioGroup.load();
	}

	if(inAction == 'getSelected'){
		return horizontalRadioGroup.getSelected();
	}

	if(inAction == 'setSelected'){
		return horizontalRadioGroup.setSelected(inJsonStruct);
	}

	if(inAction == 'remove'){
		//contactListView = $(this).data("contactListViewInstance");
		/*//inJsonStruct as single string '???'
		return contactListView.remove(inJsonStruct);*/
	}
}

var HorizontalRadioGroup = function(inJsonStruct){
	var _this = this;
	var theDivRef;
	var options = 
		{
			id:new Date().getTime(),
			class:'',
			dataTheme:'a',
			dataType:'horizontal',
			legend:'',
			radioArray:[],
			onSelect:false,
		}
	options = $.extend(options, inJsonStruct);
	theDivRef = options.divRef;

	var createHtml = function(){
		var headerHtml = '' + 
			'<form id="' + options.id + '">'		+ '' +
				'<fieldset data-role="controlgroup" data-mini="true" data-theme="' + options.dataTheme + '" data-type="' + options.dataType + '" class="horizontalRadioGroupClass ' + options.class + '" >' + '' +
					'<legend>' + '' +
						options.legend + '' +
					'</legend>'
		;

		var midHtml = '';
		for(var radioArrayIndex in options.radioArray){
			var arrayOptions = 
				{
					id:options.id + '_' + radioArrayIndex,
					caption:'NO CAPTION',
					class:'HorizontalRadioControlClass',
					value:'off',
					checked:false

				}
			arrayOptions = $.extend(arrayOptions, options.radioArray[radioArrayIndex]);
			var checkedVal = '';
			if(arrayOptions.checked == true){
				checkedVal = 'checked="checked"';
			}

			var html = '' +
				'<input type="radio" name="' + options.id + '" id="' + arrayOptions.id + '" value="' + arrayOptions.value + '" ' + checkedVal + '>' + '' +
				'<label for="' + arrayOptions.id + '">' + '' +
					arrayOptions.caption + '' +
				'</label>'
			;

			midHtml+= html;

		}//endFor

		var footerHtml = '' + 
				'</fieldset>' + '' +
			'</form>'
		;

		return headerHtml + midHtml + footerHtml;
	}

	this.load = function(){
		$(theDivRef).html(createHtml());
		$(theDivRef).checkboxradio().trigger('create');
		$(theDivRef).change(function(){
			if(options.onSelect){
				options.onSelect(_this.getSelected());
			}
		});
	}

	this.test = function(){
		alert('HorizontalRadioGroup TEST!!!');
	}

	this.getSelected = function(){
		var result = $(theDivRef).find('input:checked');
		return $("label[for='"+$(result).attr('id')+"']").text();
	}

	this.setSelected = function(inIndexOrCaption){
		if($.isNumeric(inIndexOrCaption)){
			var theId = options.id + '_' + inIndexOrCaption;
			//??? got to go twice
			$('#' + theId).trigger('click');
			$('#' + theId).trigger('click');
		}else{
			$(theDivRef).find(' .ui-radio input').each(function(){
				if(inIndexOrCaption == $("label[for='"+$(this).attr('id')+"']").text()){
					$(this).trigger('click');
					$(this).trigger('click');
				}
			});
		}
	}

}



//=======================================================================================================================================================
// DataBinderObject -------------------------------------------------------------------------------------------------------------------
//=======================================================================================================================================================
var DataBinderObject = function(inJsonStruct){
	var _this = this;
	var theDivRef;
	var dirtyMark = false;
	var mode = 'edit';
	var options = 
		{
			id:'dataBinder_' + new Date().getTime(),
			toJsonProcess:false, 							//function
			clearProcess:false, 								//function
			saveProcess:false, 									//function
			loadProcess:false,									//function
			whenDirtyTransition:false,								//function
			onSave:false,
			onCancel:false,

		}
	options = $.extend(options, inJsonStruct);
	theDivRef = options.divRef;

	/*if($(theDivRef).attr('id')){
		alert('has id:' + $(theDivRef).attr('id'));
	}else{
		alert('has no id, using')
	}*/
	this.test = function(){
		alert('DataBinderObject TEST');
	}

	this.toJson = function(){
		if(!(options.toJsonProcess)){console.log('toJsonProcess NOT INCLUDED IN CONSTRUCTOR!!!'); return false;}
		return options.toJsonProcess();
	}

	this.clear =function(){
		if(!(options.clearProcess)){console.log('clearProcess NOT INCLUDED IN CONSTRUCTOR!!!'); return false;}
		return options.clearProcess();
	}

	this.save =function(inSaveParams){
		if(!(options.saveProcess)){console.log('saveProcess NOT INCLUDED IN CONSTRUCTOR!!!'); return false;}
		if(!(inSaveParams)){
			inSaveParams = mode;
			console.log('======================================');
			console.log('MODE:' + inSaveParams);
		}
		if(_this.isDirty()){
			_this.setDirtyMark();
			var theNextFunction = function(inData){
				if(options.onSave){
					options.onSave(inData);
				}
			}
			var theCancelFunction = function(inData){
				if(options.onCancel){
					options.onCancel(inData);
				}
			}
			console.log('SAVE----------');
			console.dir(_this.toJson());
			return options.saveProcess(_this.toJson(), inSaveParams, theNextFunction, theCancelFunction);
		}else{
			return false;
		}
	}

	this.load =function(inData){
		if(!(options.loadProcess)){console.log('loadProcess NOT INCLUDED IN CONSTRUCTOR!!!'); return false;}
		if(_this.isDirty() && options.whenDirtyTransition){
			var next = function(){
				var result = options.loadProcess(inData);
				_this.setDirtyMark();
				return result;
			}
			//_this.setDirtyMark();
			return options.whenDirtyTransition(_this.toJson(), _this.save, next);
		}else{
			var result = options.loadProcess(inData);
			_this.setDirtyMark();
			return result;
		}

	}

	//resets dirty to false with current data hash value entered....like BOOKMARK THE SERIALIZE
	this.setDirtyMark = function(){
		dirtyMark = $.getHash.md5(JSON.stringify(_this.toJson()));
		console.log('dirtyMarkOut:' + dirtyMark);
	}

	this.isDirty = function(){
		return !(dirtyMark == $.getHash.md5(JSON.stringify(_this.toJson())));
	}

	this.setMode = function(inMode){
		mode = inMode;
		return true;
	}


	_this.setDirtyMark();
}

$.fn.DataBinderObject = function(inAction, inJsonStruct){
	var dataBinderObject = $(this).data("dataBinderObjectInstance");

	if(!(dataBinderObject) || inAction == 'create'){
		inJsonStruct['divRef'] = $(this);
		console.log('dataBinderObject CREATED');
		var dataBinderObject = new DataBinderObject(inJsonStruct);
		$(this).data("dataBinderObjectInstance", dataBinderObject);
		return ;
	}
	if(inAction == 'test'){
		dataBinderObject.test();
	}

	if(inAction == 'load'){
		return dataBinderObject.load(inJsonStruct);
	}

	if(inAction == 'save'){
		return dataBinderObject.save(inJsonStruct);
	}

	if(inAction == 'clear'){
		return dataBinderObject.clear();
	}

	if(inAction == 'setDirtyMark'){
		return dataBinderObject.setDirtyMark();
	}

	if(inAction == 'isDirty'){
		return dataBinderObject.isDirty();
	}

	if(inAction == 'setMode'){
		return dataBinderObject.setMode(inJsonStruct);
	}

	if(inAction == 'toJson'){
		return dataBinderObject.toJson();
	}
}


//=======================================================================================================================================================
// DynamicPopup -------------------------------------------------------------------------------------------------------------------
//=======================================================================================================================================================

/**
	Copyright (c) 2012-2014 Serban Ghita <serbanghita@gmail.com>
	jQuery Mobile dynamic popup. MIT Licensed
*/

var dynamicPopup = function(){
	var settings,
		$popup,
		$popupMain,
		$popupContent,
		$popupCloseBtn,
		$activePage = $.mobile.activePage;

	this.init = function( options ){

		// Extend the general settings.
		settings = $.extend({
								content: '',
								popupId: 'popup' + $activePage.attr('id'),
								'data-theme': 'a',
								'data-overlay-theme': 'none',
								'data-position-to': 'window',
								'data-rel': 'back',
								'data-dismissible': true,
								'data-transition': 'none',
								'data-arrow': false
							},
							options);

		// Sending a plain text or HTML message.
		if(typeof options === 'string'){
			settings.content = options;
		}

		this.createPopupElements();
		this.populatePopupContent();
		this.putPopupInDOM();
		this.openPopup();

		return $popup;

	}

	// Create the popup objects without the actual contents.
	// If the popup container exists return it's objects.
	this.createPopupElements = function(){

		$popup = $('#' + settings.popupId);

		// New popup, it doesn't exist.
		if( !$popup.length ){

			// Create the generic popup elements.
			$popupMain =  $('<div></div>').attr({
												'id': settings.popupId,
												'data-role': 'popup',
												'data-theme': settings['data-theme'],
												'data-position-to': settings['data-position-to'],
												'data-dismissible': settings['data-dismissible'],
												'data-transition': settings['data-transition'],
												'data-arrow': settings['data-arrow']
										})
										.addClass('ui-popup-main transparent');

			$popupContent = $('<div></div>').attr({
													'data-role': 'content'
												})
												.addClass('ui-content ui-popup-content transparent');

			$popupCloseBtn = $('<a></a>').attr({
											'href': '#',
											'data-role': 'button',
											'data-rel': settings['data-rel']
										})
										.addClass('transparent ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right ui-popup-close-btn');

		} else {

			// Find the existing HTML wrappers.
			$popupMain = $popup;
			$popupContent = $popup.find('.ui-popup-content');
			$popupCloseBtn = $popup.find('.ui-popup-close-btn');

		}


	}

	// Populate the popup's content.
	this.populatePopupContent = function(){

		// 1. Static HTML string.
		if(typeof settings.content === 'string'){
			$popupContent.html( settings.content );
		}

		// 2. jQuery object.
		if(settings.content instanceof jQuery){
			// Grab the content inside the wrapper.
			$popupContent.html( settings.content.html() );
		}

	}

	this.putPopupInDOM = function(){

		// Remove the existing popup from DOM.
		$popup.remove();

		// Tie together the HTML elements.
		$popupMain.append( $popupCloseBtn ).append( $popupContent );

		// Append the popup to the current page.
		$activePage.append( $popupMain );

	}

	this.openPopup = function(){

		// Init.
		$popup = $('#' + settings.popupId);
		$popup.popup( settings );

		// Open.
		$popup.popup('open');

	}

}

// Register the plugin.
$.DynamicPopup = function( options ){

	var popup = new dynamicPopup();
	return popup.init( options );

}

//=======================================================================================================================================================
// DynamicPopupYesNo -------------------------------------------------------------------------------------------------------------------
//=======================================================================================================================================================
$.DynamicPopupYesNo = function( inOptions ){

	var options = 
		{
			message:'NO MESSAGE',
			subMessage:'NO SUBMESSAGE',
			yesCaption:'YES',
			noCaption:'NO',
			onYes:false,
			onNo:false,
		}
	options = $.extend(options, inOptions);
	var html = '' +
		sprintf('<h3 class="ui-title">%s</h3>', options.message) + '' +
		sprintf('<p>%s</p>', options.subMessage) + '' +
		sprintf('<a id="popupDialog_yes" href="#" data-role="button" data-inline="true" data-rel="back" data-theme="c" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-inline ui-btn-up-c"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">%s</span></span></a>', options.yesCaption) + '' +
		sprintf('<a id="popupDialog_no" href="#" data-role="button" data-inline="true" data-rel="back" data-theme="c" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-inline ui-btn-up-c"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">%s</span></span></a>', options.noCaption)
	;

	$.DynamicPopup(
		{
			//content: '<p>' + $('#name').val() + ', you have successfully registered!' + '</p>',
			content:html,
			'data-transition': 'slideup',
			'data-position-to': '#Register'
		}
	).bind(
		{
			popupafteropen: function(e){
				console.log('Opened the popup!');
			},
			popupafterclose: function(e){
				//$.mobile.changePage('#thankyouPage');
			}
		}
	);

	$('#popupDialog_yes').click(function(){
		if(options.onYes){
			options.onYes();
		}
	});
	$('#popupDialog_no').click(function(){
		if(options.onNo){
			options.onNo();
		}
	});
}


$.getHash = new function(){
		!function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);
}();

//=======================================================================================================================================================
// ComboBox -------------------------------------------------------------------------------------------------------------------
//=======================================================================================================================================================

var ComboBox = function(inJsonStruct){
	var _this = this;
	var theDivRef;
	var dirtyMark = false;
	var mode = 'edit';
	var options = 
		{
			id:'comboBox_' + new Date().getTime(),
			optionArray:[],
			usePopup:false,
			class:'',
			onChange:false,
			onSelect:false,
		}
	options = $.extend(options, inJsonStruct);
	theDivRef = options.divRef;

	this.test = function(){
		alert('ComboBox TEST');
	}


	this.addItem = function(inData){
		var itemOptions = 
			{
				index:lastIndex,
				id:options.id + '_opt_' + lastIndex++,
				value:'noValue' + new Date().getTime(),
				caption:'NO CAPTION'
			}
		itemOptions = $.extend(itemOptions, inData);
		html = '' +
			sprintf('<option id="%s" value="%s"> %s</option>', itemOptions.id, itemOptions.value, itemOptions.caption)
		;
		$('#' + options.id).append(html);
		/*$('#' + itemOptions.id).change(function(){
			console.log('change Event');
			if(options.onChange){
				options.onChange(options.index, options.caption, $(this));
			}
		});*/
	}

	var lastIndex = 0;

	//create the select container---------
	var containerHtml = '' +
		'<div data-role="fieldcontain" class="">' + '' +
			sprintf('<select name="%s" class="%s" data-native-menu="%s" data-mini="true" id="%s"/>',options.id, options.class, !(options.usePopup), options.id) + '' +
		'</div>'
	;

	$(theDivRef).html(containerHtml);
	for(var optionArrayIndex in  options.optionArray){
		theOption = options.optionArray[optionArrayIndex];
		_this.addItem(theOption);
	}

	$('#' + options.id).change(function(){
		var selected = $(this).val();
		console.log('change Event');
		if(options.onChange){
			options.onChange($(this).prop("selectedIndex"), $(this).children('option:selected').text(), $(this).val(), $(this));
		}
	});

	$('#' + options.id).click(function(){
		if(options.onSelect){
			options.onSelect($(this).prop("selectedIndex"), $(this).children('option:selected').text(), $(this).val(), $(this));
		}
	});

	$('#' + options.id).selectmenu().selectmenu('refresh', true);


	this.changeCaption = function(inIndex, inCaption){
		var lookupId = options.id + '_opt_' + inIndex;
		$('#' + lookupId).text(inCaption);
		$('#' + options.id).selectmenu('refresh');
	}

	this.selectByIndex = function(inIndex){
		//alert('select6777');
		var lookupId = options.id + '_opt_' + inIndex;
		//var lookupId = options.id + '_' + inIndex;
		$('#' + lookupId).prop('selected', 'selected');
		$('#' + options.id).selectmenu('refresh');
		if(options.onSelect){
			options.onSelect($('#' + options.id).prop("selectedIndex"), $('#' + options.id).children('option:selected').text(), $('#' + options.id).val(), $('#' + options.id));
		}
	}

	this.getSelected = function(){
		var result = 
			{
				index:$('#' + options.id).prop("selectedIndex"),
				caption:$('#' + options.id).children('option:selected').text(),
				value:$('#' + options.id).val(),
				jRef:$('#' + options.id),
			}
		return result;
	}


}
$.fn.ComboBox = function(inAction, inJsonStruct){
	var comboBox = $(this).data("comboBoxInstance");

	if(!(comboBox) || inAction == 'create'){
		inJsonStruct['divRef'] = $(this);
		console.log('comboBox CREATED');
		var comboBox = new ComboBox(inJsonStruct);
		$(this).data("comboBoxInstance", comboBox);
		return ;
	}
	if(inAction == 'test'){
		comboBox.test();
	}

	if(inAction == 'changeCaption'){
		return comboBox.changeCaption(inJsonStruct.index, inJsonStruct.caption);
	}

	if(inAction == 'selectByIndex'){
		return comboBox.selectByIndex(inJsonStruct);
	}

	if(inAction == 'getSelected'){
		return comboBox.getSelected();
	}
}

//=======================================================================================================================================================
// COMPARE -------------------------------------------------------------------------------------------------------------------
//=======================================================================================================================================================


jQuery.extend({
	compare : function (a,b) {
		var obj_str = '[object Object]',
			arr_str = '[object Array]',
			a_type  = Object.prototype.toString.apply(a),
			b_type  = Object.prototype.toString.apply(b);

			if ( a_type !== b_type) { return false; }
			else if (a_type === obj_str) {
				return $.compareObject(a,b);
			}
			else if (a_type === arr_str) {
				return $.compareArray(a,b);
			}
			return (a === b);
		}
});

jQuery.extend({
	compareArray: function (arrayA, arrayB) {
		var a,b,i,a_type,b_type;
		// References to each other?
		if (arrayA === arrayB) { return true;}

		if (arrayA.length != arrayB.length) { return false; }
		// sort modifies original array
		// (which are passed by reference to our method!)
		// so clone the arrays before sorting
		a = jQuery.extend(true, [], arrayA);
		b = jQuery.extend(true, [], arrayB);
		a.sort(); 
		b.sort();
		for (i = 0, l = a.length; i < l; i+=1) {
			a_type = Object.prototype.toString.apply(a[i]);
			b_type = Object.prototype.toString.apply(b[i]);

			if (a_type !== b_type) {
				return false;
			}

			if ($.compare(a[i],b[i]) === false) {
				return false;
			}
		}
		return true;
	}
});

jQuery.extend({
	compareObject : function(objA, objB) {
		if(typeof objA !== 'object' || typeof objB !== 'object'){ return false;}
		console.log('compareObject ENTERED');
		//if (objA == {} || objB == {}) { return false;}
		var i,a_type,b_type;

		// Compare if they are references to each other 
		if (objA === objB) { return true;}

		if (Object.keys(objA).length !== Object.keys(objB).length) { return false;}
		for (i in objA) {
			if (objA.hasOwnProperty(i)) {
				if (typeof objB[i] === 'undefined') {
					return false;
				}
				else {
					a_type = Object.prototype.toString.apply(objA[i]);
					b_type = Object.prototype.toString.apply(objB[i]);

					if (a_type !== b_type) {
						return false; 
					}
				}
			}
			if ($.compare(objA[i],objB[i]) === false){
				return false;
			}
		}
		return true;
	}
});

jQuery.extend({
	hashToArray : function(inHash){
		var resultArray = [];
		for(var hashKey in inHash){
			resultArray.push(inHash[hashKey]);
		}

		return resultArray;
	}

});

jQuery.extend({
	isCircular : function(node, parents){
		parents = parents || [];

		if(!node || typeof node != "object"){
			return false;
		}

		var keys = Object.keys(node), i, value;

		parents.push(node); // add self to current path      
		for(i = keys.length-1; i>=0; i--){
			value = node[keys[i]];
			if(value && typeof value == "object"){
				if(parents.indexOf(value)>=0){
					// circularity detected!
					//node[keys[i]] = false;
					return true;
				}
				// check child nodes
				if(arguments.callee(value, parents)){
					return true;
				}

			}
		}
		parents.pop(node);
		return false;
	}
});

jQuery.extend({
	removeCircular : function(obj){
		obj = $.extend({}, obj);
		if(obj.jRef){
			obj.jRef = false;
		}
		var seenObjects = [];

		function detect (obj) {
			if (obj && typeof obj === 'object'){
				if (seenObjects.indexOf(obj) !== -1){
					return obj;
				}
				seenObjects.push(obj);
				for (var key in obj) {
					if(obj.hasOwnProperty(key) && detect(obj[key])){
						obj[key] = false;
						console.log(obj, 'cycle at ' + key);
						return obj;
					}
				}
			}
			return obj;
		}
		return detect(obj);
	}


});

jQuery.extend({
	copyObject:function(inObject){
		return $.extend(true, {}, inObject);
	}
});

/*
console.log('ddddlog', myvar);
console.info('===================================================================================');
console.info( myvar, "Logged! info");
console.warn( myvar, "Logged! warn");
console.debug(myvar, "Logged! debug");
console.error(myvar, "Logged! error");
*/

jQuery.extend({
	debug:function(inHeading, myvar){
		console.info('====================================== %s ============================================', inHeading);
		console.info( myvar);
	}
});

jQuery.extend({
	createContactHashCode:function(inObject){
		var nObject = 
			{
				companyName:inObject.companyName,
				department:inObject.department,
				emailAddress:inObject.emailAddress,
				id:inObject.id,
				imageUrl:inObject.imageUrl,
				name:inObject.name,
				phoneNumber:inObject.phoneNumber,
				refNumber:inObject.refNumber,
				title:inObject.title,
				type:inObject.type,
				userId:inObject.userId,
			}
		return $.getHash.md5(JSON.stringify(nObject));
		//return $.extend(true, {}, inObject);
	}
});

jQuery.extend({
	copyAsOne:function(inObjectA, inObjectB){
		return $.extend(true, {}, inObjectA, inObjectB);
	}
});


jQuery.extend({
	getDuplicates:function(arr){
		var i, out=[], obj={};
		for (i=0; i < arr.length; i++)
		obj[arr[i]] == undefined ? obj[arr[i]] ++ : out.push(arr[i]);
		return $.getUnique(out);
	}

});

jQuery.extend({
	getUnique:function(arr){
		return $.grep(arr, function(elem, index) {
			return index == $.inArray(elem, arr);
		});
	}
});

//always returns string ,, not working right
jQuery.extend({
	getKeys:function(inObj){
		var resultArray = [];
		for(var theKey in inObj){
			resultArray.push(theKey);
		}
		return resultArray;
	}
});

jQuery.extend({
	getCurrentPageId:function(inObj){
		if($(':mobile-pagecontainer').pagecontainer('getActivePage')[0].id ){
			return $(':mobile-pagecontainer').pagecontainer('getActivePage')[0].id;
		}else{
			return false;
		}
	}
});