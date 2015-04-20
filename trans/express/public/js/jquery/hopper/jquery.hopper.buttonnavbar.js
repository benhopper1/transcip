console.log('=============================================================');
console.log('--------------- BUTTON NAV BAR ------------------------------');
console.log('=============================================================');

var ButtonNavBar = function(inJrefOfThis, inJsonStruct){
	var _this = this;
	var theDivRef;

	var liHash = {};

	var clickImageHash = {};

	var options = 
		{
			id:((inJrefOfThis).attr('id'))? (inJrefOfThis).attr('id') + '_buttonBar' : new Date().getTime() + '_buttonBar',
			barBackgroundImagePath:false,
			onClick:false,
			onStateChange:false,
		}
	options = $.extend(options, inJsonStruct);
	theDivRef = options.divRef;

	var guid  = new Date().getTime();
	if($(theDivRef).attr('id')){
		guid = $(theDivRef).attr('id');
	}

	this.test = function(){
		//alert('ButtonNavBar TEST');
		//_this.cssSetup();
		//$(theDivRef).css
		//$('#imgTest').attr('src', navBarBackground64);
	}

	this.cssSetup = function(){
		//$(theDivRef).html('HELLO PETER !')
		$(theDivRef).css(
			{
					width:'100%',
					height:'35px',
					'background-image':' url("/public/images/ui/button-bck_002.png")',
					'background-repeat':' no-repeat',
					'background-size':'100% 100%',
					'background-position': 'center',
					display:'block', 
					//margin:'0 auto';,
					position:'relative',
			}
		);
	}

	this.render = function(){
		//$(theDivRef).
		var $navWrapper = $('<div></div>')
				.attr({id:'navWrapper_' + guid})
				.css(
					{
						width:'100%',
						margin:'0 auto',
						//overflow: 'hidden',
						//padding:'20px 0',
						//background:'#3D3331',
					}
				)
		;
		var $ulWrapper =  $('<ul></ul>')
				.attr({id:'ulWrapper_' + guid})
				.css(
					{
						'font-family': 'Verdana',
						'font-size':'14px',
						'list-style':'none',
						margin:'0 auto',
						padding:'0',
						width:'100%',
						height:'100%',
						overflow: 'hidden',
					}
				)
		;

		for(var liKey in liHash){
			$(liHash[liKey]).appendTo($ulWrapper);
		}

		$($ulWrapper).appendTo($navWrapper);
		$($navWrapper).appendTo($(theDivRef));

		_this.cssSetup();
	}

	this.changeState = function(inChangeStateOptions){
		var changeStateOptions = 
			{
				id:false,
				state:false
			}
		changeStateOptions = $.extend(true, changeStateOptions, inChangeStateOptions);
		//_this.initClickImageAndShow(changeStateOptions.id, changeStateOptions.state);
		$('.click-bar-img').each(function(){
			if($(this).attr('refId') == changeStateOptions.id){
				theStateImageUrl = clickImageHash[changeStateOptions.id].imageUrls[changeStateOptions.state];
				$(this).css({'background-image':'url("' + theStateImageUrl + '")'});
				var oldState = $(this).attr('state');
				$(this).attr('state',changeStateOptions.state);
				if(oldState != changeStateOptions.state){
					if(options.onStateChange){
						options.onStateChange(changeStateOptions.id, $(this).attr('state'), oldState);
					}
				}
				
				if(clickImageHash[changeStateOptions.id].tooltip && clickImageHash[changeStateOptions.id].tooltip[changeStateOptions.state]){
					//$($a).addClass('tooltip');
					$(this).attr('title', clickImageHash[changeStateOptions.id].tooltip[changeStateOptions.state]);
				}else{
					$(this).attr('title', '');
				}
			}
		});
	}

	this.addClickImage = function(inAddClickImageOptions){
		var addClickImageOptions = 
			{
				imageUrls:{},
				state:false,
				id:new Date().getTime(),
			}
		addClickImageOptions = $.extend(true, addClickImageOptions, inAddClickImageOptions);

		var theStateImageUrl = addClickImageOptions.imageUrls[addClickImageOptions.state];
		if(!(theStateImageUrl) && Object.keys(addClickImageOptions.imageUrls)[0]){
			theStateImageUrl = addClickImageOptions.imageUrls[Object.keys(addClickImageOptions.imageUrls)[0]];
		}

		clickImageHash[addClickImageOptions.id] = addClickImageOptions;
		_this.initClickImageAndShow(addClickImageOptions.id, addClickImageOptions.state);

	}

	this.initClickImageAndShow = function(inRefId, state){
		var theStateImageUrl = clickImageHash[inRefId].imageUrls[state];
		console.dir(clickImageHash);
		var newLiId = new Date().getTime();
		var bckImage = ''
		var $li =  $('<li></li>')
			.attr(
				{
					id:'li_' + guid,
					//'background-image': 'url("' + addClickImageOptions.imageUrl + '")'
				}
			)
			.css(
				{
					display:'inline'
				}
			)
		;
		var $a =  $('<a class="click-bar-img"></a>')
			.attr(
				{
					id:'a_' + guid + inRefId,
					refId:inRefId,
					state:state,
					//'data-tip':'',
				}
			)
			.css(
				{
					'background-image': 'url("' + theStateImageUrl + '")',
					height:'34px',
					width:'68px',
					'text-decoration':'none',
					display: 'block',
					'background-repeat': 'no-repeat',
					'background-size':'25px 25px',
					'background-position': 'center',
					color:'#000',
					float:'left',
					'text-align':'center',
					cursor:'pointer',
				}
			)
		;

		$($a).click(function(){
			_this.unblink($(this).attr('refId'));
			if(options.onClick){
				options.onClick($(this).attr('refId'), $(this).attr('state'));
			}
		});

		$($a).bind("contextmenu", function(e){
			e.preventDefault();
			return false;
		});

/*		$($a).addClass('blink');
		var blink = function(selector){
			$(selector).fadeOut('slow', function(){
				(this).fadeIn('slow', function(){
					blink(this);
				});
			});
		}

		blink('.blink');*/



		var preCss;
		$($a).mousedown(function() {
			preCss = $(this).getCss(this);//$(this).css('style');
			$(this).css(
				{
					//background:'rgba(255,0,0,0.1)',
					//filter: alpha(opacity=60),
					color:'#000',
					'border-top':'2px solid #815444',
					'border-right':'2px solid #c59888',
					'border-bottom':'2px solid #c59888',
					'border-left':'2px solid #815444',
					//'background-repeat': 'no-repeat',
					//'background-size':'20px 20px',
					//'background-position': 'center',
				}
			);
		});

		$($a).mouseup(function() {
			$(this).css(preCss);
		});

		if(clickImageHash[inRefId].tooltip && clickImageHash[inRefId].tooltip[state]){
			//$($a).addClass('tooltip');
			$($a).attr('title', clickImageHash[inRefId].tooltip[state]);
		}else{
			$($a).attr('title', '');
		}




/*
		//hover events for li-----
		var preCss;
		$($a).hover(function(){

			preCss = $(this).getCss(this);//$(this).css('style');
			$(this).css(
				{
					//background:'rgba(255,0,0,0.1)',
					//filter: alpha(opacity=60),
					color:'#000',
					'border-top':'2px solid #815444',
					'border-right':'2px solid #c59888',
					'border-bottom':'2px solid #c59888',
					'border-left':'2px solid #815444',
					//'background-repeat': 'no-repeat',
					//'background-size':'20px 20px',
					//'background-position': 'center',
				}
			);
		}, function(){
			//$(this).css(preCss);
		});*/

		$($a).appendTo($li);
		liHash[newLiId] = $li;

		return inRefId;

	}

	this.unblink = function(inId){
		console.log('remove all blink!!!');
		$('.blink').removeClass('blink');
		/*$('.click-bar-img').each(function(){
			if($(this).attr('refId') == inId){
				$(this).unblink();
				$(this).removeClass('blink');
			}
		});*/
	}

	this.blink = function(inBlinkOptions){
		var blinkOptions = 
			{
				id:false, 
				duration:false,
			}
		blinkOptions = $.extend(true, blinkOptions, inBlinkOptions);

		$('.click-bar-img').each(function(){
			if($(this).attr('refId') == blinkOptions.id){
				$(this).blink(blinkOptions.duration, function(isExpired){
					//console.log('blink callback:' + isExpired);
				});
			}
		});

	}

	this.enable = function(inId){
		$('.click-bar-img').each(function(){
			if($(this).attr('refId') == inId){
				$(this).removeClass('ui-disabled');
			}
		});
	}

	this.disable = function(inId){
		$('.click-bar-img').each(function(){
			if($(this).attr('refId') == inId){
				$(this).addClass('ui-disabled');
			}
		});
	}

}



$.fn.ButtonNavBar = function(inAction, inJsonStruct){
	var buttonNavBar = $(this).data("checkboxLinesInstance");
	if(!(buttonNavBar) || inAction == 'create'){
		inJsonStruct['divRef'] = $(this);
		console.log('buttonNavBar CREATED');
		var buttonNavBar = new ButtonNavBar($(this), inJsonStruct);
		$(this).data("checkboxLinesInstance", buttonNavBar);
		return ;
	}

	if(inAction == 'test'){
		console.log('testing123');
		buttonNavBar.test();
	}
	if(inAction == 'render'){
		console.log('render');
		buttonNavBar.render();
	}
	if(inAction == 'addClickImage'){
		console.log('addClickImage');
		return buttonNavBar.addClickImage(inJsonStruct);
	}
	if(inAction == 'changeState'){
		console.log('changeState');
		return buttonNavBar.changeState(inJsonStruct);
	}

	if(inAction == 'blink'){
		console.log('blink');
		return buttonNavBar.blink(inJsonStruct);
	}

	if(inAction == 'enable'){
		console.log('enable');
		return buttonNavBar.enable(inJsonStruct);
	}

	if(inAction == 'disable'){
		console.log('disable');
		return buttonNavBar.disable(inJsonStruct);
	}

}