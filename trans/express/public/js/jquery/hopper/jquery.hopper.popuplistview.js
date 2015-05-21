console.log('=============================================================');
console.log('--------------- POPUP LIST VIEW -----------------------------');
console.log('=============================================================');

var PopupListView = function(inJrefOfThis, inJsonStruct){
	var _this = this;
	var theDivRef;
	var itemHash = {};
	var closeTimer;

	var options = 
		{
			id:((inJrefOfThis).attr('id'))? (inJrefOfThis).attr('id') + '_popupLstVw' : new Date().getTime() + '_popupLstVw',
			timedClose:false,
			onClick:false,
			onClose:false,
			overlayTheme:'b',
			dataDismissible:true,
			closeButton:true,
			headingCaption:'',
			css:
				{
					width:'430px',
					'background-color':'#ffffff !important',
				},
		}
	options = $.extend(true, options, inJsonStruct);
	theDivRef = options.divRef;

	var guid  = new Date().getTime();
	if($(theDivRef).attr('id')){
		guid = $(theDivRef).attr('id');
	}


	//==================================================================
	//--  BUILD THE DOM  -----------------------------------------------
	//==================================================================
	//div(data-role="popup" id="popupAccord" style="background-color:#ffffff !important; width:425px;" data-position-to="window" data-overlay-theme="b" data-corners="true" data-theme="a" data-shadow="true" data-tolerance="0,0")
	$(theDivRef)
		.attr(
			{
				'data-role':'popup',
				'data-position-to':'window',
				'data-overlay-theme':options.overlayTheme, //'b',
				'data-corners':'true',
				'data-theme':'a',
				'data-shadow':'true',
				'data-tolerance':'0,0',
				'data-dismissible':(options.dataDismissible) ? 'true' : 'false',
			}
		)
		.css(options.css)
	;

	//EVENT
	$(theDivRef).bind({
		popupafterclose: function(event, ui){
			if(closeTimer){clearTimeout(closeTimer);}
			if(options.onClose){
				options.onClose();
			}
		}
	});



	//div(data-role="header" data-theme="b" class="pop-part-000")
	var $lvHeader = $('<div></div>')
		.attr(
			{
				'data-role':'header',
				'data-theme':'b',
			}
		)
	;

	//$$ DOM APPEND -----------------------
	$($lvHeader).appendTo($(theDivRef));

	//h1 Event Log
	var $headingCaption = $('<h1>' + options.headingCaption + '</h1>');

	//$$ DOM APPEND -----------------------
	$($headingCaption).appendTo($($lvHeader));

	//a(href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn ui-icon-delete ui-btn-icon-notext ui-btn-right")
	if(options.closeButton){
		var $closeButton = $('<a></a>')
			.attr(
				{
					'data-rel':'back',
				}
			)
			.addClass('ui-btn ui-corner-all ui-shadow ui-btn ui-icon-delete ui-btn-icon-notext ui-btn-right')
		;

		//$$ DOM APPEND -----------------------
		$($closeButton).appendTo($($lvHeader));
	}

	//div(class="ui-content" style="overflow-y: auto;")
	var $content = $('<div></div>')
		.css(
			{
				'overflow-y':'auto',
			}
		)
		.addClass('ui-content')
	;

	//$$ DOM APPEND -----------------------
	$($content).appendTo($(theDivRef));

	//ul(data-role="listview" class=""   data-inset="true" style="width:100%; ")
	var $ul = $('<ul></ul>')
		.attr(
			{
				'data-role':'listview',
				'data-inset':'true',
			}
		)
		.css(
			{
				'width':'100%',
			}
		)

	//$$ DOM APPEND -----------------------
	$($ul).appendTo($($content));


	$(theDivRef).trigger('create');
	$(theDivRef).popup();


	//@@@@@@@@ TEST @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	this.test = function(){
		var cOptions = $.extend(true, {}, options);
		cOptions.divRef = false;
		alert(JSON.stringify(cOptions));
	}

	//@@@@@@@@ INIT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	this.open = function(){
		$(theDivRef).popup('open');
		console.log('options.timedClose:' + options.timedClose);
		if(options.timedClose){
			if(closeTimer){clearTimeout(closeTimer);}
			closeTimer = setTimeout(function(){
				//if($(theDivRef).attr('data-role') == 'popup'){
					$(theDivRef).popup( "close" );
				//}
			}, options.timedClose);
		}
	}

	//@@@@@@@@ timedClosed @@@@@@@@@@@@@@@@@@@@@@@@@
	this.timedClosed = function(inExpireMs){
		if(closeTimer){clearTimeout(closeTimer);}
		closeTimer = setTimeout(function(){
				$(theDivRef).popup( "close" );
		}, inExpireMs);
	}

	//@@@@@@@@ ADD  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	this.addItem = function(inAddItemOptions){
		var result;
		var addItemOptions = 
			{
				id:new Date().getTime(),
				template:0,
				data:false,
			}
		addItemOptions = $.extend(true, addItemOptions, inAddItemOptions);


		itemHash[addItemOptions.id] = 
			{
				template:addItemOptions.template,
				data:addItemOptions.data,
			}


		_this.addItem.$clickableDiv = false;

		if(addItemOptions.template == 0){
			result =  template_000(addItemOptions);
		}
		console.log('clickableDiv');
		console.dir(_this.addItem.$clickableDiv);
		//---- events ----------------
		if(_this.addItem.$clickableDiv){
			$(_this.addItem.$clickableDiv).attr('refId', addItemOptions.id);
			$(_this.addItem.$clickableDiv).click(function(){
				if(options.onClick){
					options.onClick($(this).attr('refId'), itemHash[$(this).attr('refId')]);
				}
			});
		}



		$($ul).listview("refresh");

		setThePopupHeight(theDivRef)

		return result;

	}



	//==================================================================
	//--  TEMPLATES  ------------------------------------------------
	//==================================================================
	var template_000 = function(inTemplate_000Options){
		var template_000Options = 
			{
				useDataIcon:false,
				liCss:{},
				liClass:'',
				fontColor:'#000000',

				imageUrl:'',
				imageCss:
					{
						height:'64px',
					},
				imageClass:'magicSquare',

				caption:'',
				details:false,
				html:false,
				zOrder:false,

			}
		template_000Options = $.extend(true, template_000Options, inTemplate_000Options);

		//li(class="pop-part-000" data-icon="false")
		var $li = $('<li></li>')
			.attr(
				{
					'data-icon':(template_000Options.useDataIcon)? 'true' : 'false'
				}
			)
			.css(template_000Options.liCss)
			.addClass(template_000Options.liClass)
		;

		//$$ DOM APPEND -----------------------
		if(template_000Options.zOrder){
			$($ul).prepend($($li));
		}else{
			$($li).appendTo($($ul));
		}

		//a(style="color:#000000")
		var $a = $('<a></a>')
			.css(
				{
					color:template_000Options.fontColor
				}
			)
		;
		//$$ DOM APPEND -----------------------
		$($a).appendTo($($li));
		_this.addItem.$clickableDiv = $($a);

		//img(style="height:100%" class="magicSquare" src="/public/images/ui/speaker_on.png")
		if(template_000Options.imageUrl){
			var $img = $('<img></img>')
				.attr(
						{
							'src':template_000Options.imageUrl,
						}
					)
				.css(template_000Options.imageCss)
				.addClass(template_000Options.imageClass)
			;

			//$$ DOM APPEND -----------------------
			$($img).appendTo($($a));
		}

		//h2 Missed Call
		var $caption = $('<h2>' + template_000Options.caption + '</h2>');

		//$$ DOM APPEND -----------------------
		$($caption).appendTo($($a));

		if(template_000Options.html){
			var $html = $('<div></div>');
			$($html).html(template_000Options.html);
			$($html).appendTo($($a));
		}

		if(template_000Options.details){
			//p []
			for(var theIndex in template_000Options.details){
				var $p = $('<p>' + template_000Options.details[theIndex] + '</p>');
				//$$ DOM APPEND -----------------------
				$($p).appendTo($($a));
			}
		}

		return template_000Options.id;

	}

	var setThePopupHeight = function(inMainDiv){
		var $contentDiv = $(inMainDiv).find('.ui-content');
		var calculatedHeight = 0;
		var maxHeight = $.mobile.getScreenHeight() * .90;
		console.log('--------setThePopupHeight----------------');
		$(inMainDiv).find('ul').each(function(){
			console.log('ul');
			if($(this).attr('data-role') == 'listview'){
				console.log('data-role');
				$(this).children('li').each(function(){
					console.log('----------- li ----------------------------');
					console.log('height:' + $(this).height() );
					calculatedHeight += ($(this).outerHeight() + 20);
				});
			}
		});
		if(calculatedHeight > maxHeight){
			console.log('using max:' + maxHeight);
			$($contentDiv).height(maxHeight);
		}else{
			console.log('using calculatedHeight:' + calculatedHeight);
			$($contentDiv).height(calculatedHeight);
		}
	}

	this.deleteItem = function(inId){
		$(theDivRef).find("[refId='" + inId + "']").each(function(){
			$(this).closest("li").remove();
		});

		delete itemHash[inId];
		setThePopupHeight(theDivRef)
	}

	this.clear = function(){
		$(theDivRef).find('li').remove();
	}

	this.setHeading = function(inNewCaption){
		$headingCaption.html(inNewCaption);
	}

	this.close = function(inCloseOptions){
		var closeOptions = 
			{
				timedClose:false,
				onClose:false,
			}
		closeOptions = $.extend(true, closeOptions, inCloseOptions);
		if(closeOptions.onClose){
			var existingOnClose = false;
			if(options.onClose){
				existingOnClose = $.extend({}, options.onClose);
				console.dir(existingOnClose);
			}
			options.onClose = function(){
				closeOptions.onClose();
				if(existingOnClose){existingOnClose();}
				options.onClose = existingOnClose;
			}
		}
		if(closeOptions.timedClose){
			return _this.timedClosed(closeOptions.timedClose);
		}

		$(theDivRef).popup('close');
	}

	this.chainOpen = function($inDiv){
		setTimeout(function(){
			if(!!($inDiv && $inDiv.constructor && $inDiv.call && $inDiv.apply)){
				return $inDiv();
			}else{
				$($inDiv).PopupListView('open', {});
			}
		}, 100);
		//$(theDivRef).PopupListView('close', {});
		_this.close();
	}

	this.append = function(inAppendOptions){
		var appendOptions = 
			{
				id:false,
				html:false,
			}
		appendOptions = $.extend(true, appendOptions, inAppendOptions);

		$(theDivRef).find("[refId='" + appendOptions.id + "']").each(function(){
			var $html = $('<div></div>');
			$($html).html(appendOptions.html);
			$(this).append($($html));
		});
	}
}


$.fn.PopupListView = function(inAction, inJsonStruct){
	var popupListView = $(this).data(" popupListViewInstance");
	if(!(popupListView) || inAction == 'create'){
		inJsonStruct['divRef'] = $(this);
		console.log('popupListView CREATED');
		var popupListView = new PopupListView($(this), inJsonStruct);
		$(this).data(" popupListViewInstance", popupListView);
		return ;
	}

	if(inAction == 'test'){
		console.log('testing123');
		popupListView.test();
	}

	if(inAction == 'open'){
		console.log('open');
		popupListView.open();
	}

	if(inAction == 'addItem'){
		console.log('addItem');
		return popupListView.addItem(inJsonStruct);
	}

	if(inAction == 'deleteItem'){
		console.log('deleteItem');
		return popupListView.deleteItem(inJsonStruct);
	}

	if(inAction == 'clear'){
		console.log('clear');
		return popupListView.clear(inJsonStruct);
	}

	if(inAction == 'setHeading'){
		console.log('setHeading');
		return popupListView.setHeading(inJsonStruct);
	}

	if(inAction == 'close'){
		console.log('close');
		return popupListView.close(inJsonStruct);
	}

	if(inAction == 'chainOpen'){
		console.log('chainOpen');
		return popupListView.chainOpen(inJsonStruct);
	}

	if(inAction == 'append'){
		console.log('append');
		return popupListView.append(inJsonStruct);
	}

}