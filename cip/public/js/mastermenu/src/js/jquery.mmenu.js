/*	
 * jQuery mmenu v4.0.3
 * @requires jQuery 1.7.0 or later
 *
 * mmenu.frebsite.nl
 *	
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * Dual licensed under the MIT and GPL licenses.
 * http://en.wikipedia.org/wiki/MIT_License
 * http://en.wikipedia.org/wiki/GNU_General_Public_License
 */


(function( $ ) {

	var _PLUGIN_	= 'mmenu',
		_VERSION_	= '4.0.3';


	//	Plugin already excists
	if ( $[ _PLUGIN_ ] )
	{
		return;
	}

	//	Global variables
	var glbl = {
		$wndw: null,
		$html: null,
		$body: null,
		$page: null,
		$blck: null,

		$allMenus: null,
		$scrollTopNode: null
	};

	var _c = {}, _e = {}, _d = {},
		_serialnr = 0;


	$[ _PLUGIN_ ] = function( $menu, opts, conf )
	{
		glbl.$allMenus = glbl.$allMenus.add( $menu );

		this.$menu = $menu;
		this.opts  = opts
		this.conf  = conf;

		this.serialnr = _serialnr++;

		this._init();

		return this;
	};

	$[ _PLUGIN_ ].prototype = {

		open: function()
		{
			this._openSetup();
			this._openFinish();
			return 'open';
		},
		_openSetup: function()
		{
			//	Find scrolltop
			var _scrollTop = findScrollTop();

			//	Set opened
			this.$menu.addClass( _c.current );

			//	Close others
			glbl.$allMenus.not( this.$menu ).trigger( _e.close );

			//	Store style and position
			glbl.$page
				.data( _d.style, glbl.$page.attr( 'style' ) || '' )
				.data( _d.scrollTop, _scrollTop )
				.data( _d.offetLeft, glbl.$page.offset().left );

			//	Resize page to window width
			var _w = 0;
			glbl.$wndw.off( _e.resize )
				.on( _e.resize,
					function( e, force )
					{
						if ( glbl.$html.hasClass( _c.opened ) || force )
						{
							var nw = glbl.$wndw.width();
							if ( nw != _w )
							{
								_w = nw;
								glbl.$page.width( nw - glbl.$page.data( _d.offetLeft ) );
							}
						}
					}
				)
				.trigger( _e.resize, [ true ] );

			//	Prevent tabbing out of the menu
			if ( this.conf.preventTabbing )
			{
				glbl.$wndw.off( _e.keydown )
					.on( _e.keydown,
						function( e )
						{
							if ( e.keyCode == 9 )
							{
								e.preventDefault();
								return false;
							}
						}
					);
			}

			//	Add options
			if ( this.opts.modal )
			{
				glbl.$html.addClass( _c.modal );
			}
			if ( this.opts.moveBackground )
			{
				glbl.$html.addClass( _c.background );
			}
			if ( this.opts.position != 'left' )
			{
				glbl.$html.addClass( _c.mm( this.opts.position ) );
			}
			if ( this.opts.zposition != 'back' )
			{
				glbl.$html.addClass( _c.mm( this.opts.zposition ) );
			}
			if ( this.opts.classes )
			{
				glbl.$html.addClass( this.opts.classes );
			}

			//	Open
			glbl.$html.addClass( _c.opened );
			this.$menu.addClass( _c.opened );

			//	Scroll page to scrolltop
			glbl.$page.scrollTop( _scrollTop );

			//	Scroll menu to top
			this.$menu.scrollTop( 0 );
		},
		_openFinish: function()
		{
			var that = this;
			//alert('tetstHere');
			//	Callback
			transitionend( glbl.$page,
				function()
				{
					that.$menu.trigger( _e.opened );
				}, this.conf.transitionDuration
			);

			//	Opening
			glbl.$html.addClass( _c.opening );
			this.$menu.trigger( _e.opening );

			//	Scroll window to top
			window.scrollTo( 0, 1 );
		},
		close: function()
		{
			var that = this;
			//alert('tetstHere');

			//	Callback
			transitionend( glbl.$page,
				function()
				{
					that.$menu
						.removeClass( _c.current )
						.removeClass( _c.opened );

					glbl.$html
						.removeClass( _c.opened )
						.removeClass( _c.modal )
						.removeClass( _c.background )
						.removeClass( _c.mm( that.opts.position ) )
						.removeClass( _c.mm( that.opts.zposition ) );

					if ( that.opts.classes )
					{
						glbl.$html.removeClass( that.opts.classes );
					}

					glbl.$wndw
						.off( _e.resize )
						.off( _e.scroll );

					//	Restore style and position
					glbl.$page.attr( 'style', glbl.$page.data( _d.style ) );

					if ( glbl.$scrollTopNode )
					{
						glbl.$scrollTopNode.scrollTop( glbl.$page.data( _d.scrollTop ) );
					}

					//	Closed
					that.$menu.trigger( _e.closed );
	
				}, this.conf.transitionDuration
			);

			//	Closing
			glbl.$html.removeClass( _c.opening );
			glbl.$wndw.off( _e.keydown );
			this.$menu.trigger( _e.closing );
			//alert('tetstHere');
			return 'close';
		},
		hopper:function(){
			//alert('from hopper44');
		},
	
		_init: function()
		{
			this.opts = extendOptions( this.opts, this.conf, this.$menu );
			this.direction = ( this.opts.slidingSubmenus ) ? 'horizontal' : 'vertical';
	
			//	INIT PAGE & MENU
			this._initPage( glbl.$page );
			this._initMenu();
			this._initBlocker();
			this._initPanles();
			this._initLinks();
			this._initOpenClose();
			this._bindCustomEvents();

			if ( $[ _PLUGIN_ ].addons )
			{
				for ( var a = 0; a < $[ _PLUGIN_ ].addons.length; a++ )
				{
					if ( typeof this[ '_addon_' + $[ _PLUGIN_ ].addons[ a ] ] == 'function' )
					{
						this[ '_addon_' + $[ _PLUGIN_ ].addons[ a ] ]();
					}
				}
			}
		},

		_bindCustomEvents: function()
		{
			var that = this;

			this.$menu
				.off( _e.open + ' ' + _e.close + ' ' + _e.setPage )
				.on( _e.open + ' ' + _e.close + ' ' + _e.setPage,
					function( e )
					{
						e.stopPropagation();
					}
				);

			//	Menu-events
			this.$menu
				.on( _e.open,
					function( e )
					{
						if ( $(this).hasClass( _c.current ) )
						{
							e.stopImmediatePropagation();
							return false;
						}
						//alert('tetstHere');
						return that.open( $(this), that.opts, that.conf );
					}
				)
				.on( _e.close,
					function( e )
					{
						//alert('tetstHere');
						if ( !$(this).hasClass( _c.current ) )
						{
							e.stopImmediatePropagation();
							return false;
						}
						return that.close( $(this), that.opts, that.conf );
					}
				)
				.on( _e.setPage,
					function( e, $p )
					{
						//alert('tetstHere');
						that._initPage( $p );
						that._initOpenClose();
					}
				);

			//	Panel-events
			var $panels = this.$menu.find( this.opts.isMenu && this.direction != 'horizontal' ? 'ul' : '.' + _c.panel );
			$panels
				.off( _e.toggle + ' ' + _e.open + ' ' + _e.close )
				.on( _e.toggle + ' ' + _e.open + ' ' + _e.close,
					function( e )
					{
						e.stopPropagation();
					}
				);

			if ( this.direction == 'horizontal' )
			{
				$panels
					.on( _e.open,
						function( e )
						{
							return openSubmenuHorizontal( $(this), that.$menu );
						}
					);
			}
			else
			{
				$panels
					.on( _e.toggle,
						function( e )
						{
							var $t = $(this);
							//alert('tetstHere');
							return $t.triggerHandler( $t.parent().hasClass( _c.opened ) ? _e.close : _e.open );
						}
					)
					.on( _e.open,
						function( e )
						{
							$(this).parent().addClass( _c.opened );
							return 'open';
						}
					)
					.on( _e.close,
						function( e )
						{
							$(this).parent().removeClass( _c.opened );
							//alert('tetstHere');
							return 'close';
						}
					);
			}
		},
		
		_initBlocker: function()
		{
			var that = this;

			if ( !glbl.$blck )
			{
				glbl.$blck = $( '<div id="' + _c.blocker + '" />' ).appendTo( glbl.$body );
			}

			click( glbl.$blck,
				function()
				{
					if ( !glbl.$html.hasClass( _c.modal ) )
					{
						that.$menu.trigger( _e.close );
					}
				}, true, true
			);
		},
		_initPage: function( $p )
		{
			if ( !$p )
			{
				$p = $(this.conf.pageSelector, glbl.$body);
				if ( $p.length > 1 )
				{
					$[ _PLUGIN_ ].debug( 'Multiple nodes found for the page-node, all nodes are wrapped in one <' + this.conf.pageNodetype + '>.' );
					$p = $p.wrapAll( '<' + this.conf.pageNodetype + ' />' ).parent();
				}
			}
	
			$p.addClass( _c.page );
			glbl.$page = $p;
		},
		_initMenu: function()
		{
			var that = this;

			//	Clone if needed
			if ( this.conf.clone )
			{
				this.$menu = this.$menu.clone( true );
				this.$menu.add( this.$menu.find( '*' ) ).filter( '[id]' ).each(
					function()
					{
						$(this).attr( 'id', _c.mm( $(this).attr( 'id' ) ) );
					}
				);
			}

			//	Strip whitespace
			this.$menu.contents().each(
				function()
				{
					if ( $(this)[ 0 ].nodeType == 3 )
					{
						$(this).remove();
					}
				}
			);

			//	Prepend to body
			this.$menu
				.prependTo( 'body' )
				.addClass( _c.menu );

			//	Add direction class
			this.$menu.addClass( _c.mm( this.direction ) );

			//	Add options classes
			if ( this.opts.classes )
			{
				this.$menu.addClass( this.opts.classes );
			}
			if ( this.opts.isMenu )
			{
				this.$menu.addClass( _c.ismenu );
			}
			if ( this.opts.position != 'left' )
			{
				this.$menu.addClass( _c.mm( this.opts.position ) );
			}
			if ( this.opts.zposition != 'back' )
			{
				this.$menu.addClass( _c.mm( this.opts.zposition ) );
			}
		},
		_initPanles: function(){
			console.log('_initPanles ENTERED');
			var that = this;


			//	Refactor List class
			this.__refactorClass( $('ul.' + this.conf.listClass, this.$menu), 'list' );

			//	Add List class
			if ( this.opts.isMenu )
			{
				$('ul', this.$menu)
					.not( '.mm-nolist' )
					.addClass( _c.list );
			}

			var $lis = $('ul.' + _c.list + ' > li', this.$menu);

			//	Refactor Selected class
			this.__refactorClass( $lis.filter( '.' + this.conf.selectedClass ), 'selected' );

			//	Refactor Label class
			this.__refactorClass( $lis.filter( '.' + this.conf.labelClass ), 'label' );

			//	setSelected-event
			$lis
				.off( _e.setSelected )
				.on( _e.setSelected,
					function( e, selected )
					{
						e.stopPropagation();
	
						$lis.removeClass( _c.selected );
						if ( typeof selected != 'boolean' )
						{
							selected = true;
						}
						if ( selected )
						{
							$(this).addClass( _c.selected );
						}
					}
				);

			//	Refactor Panel class
			this.__refactorClass( $('.' + this.conf.panelClass, this.$menu), 'panel' );

			//	Add Panel class
			this.$menu
				.children()
				.filter( this.conf.panelNodetype )
				.add( this.$menu.find( 'ul.' + _c.list ).children().children().filter( this.conf.panelNodetype ) )
				.addClass( _c.panel );

			var $panels = $('.' + _c.panel, this.$menu);

			//	Add an ID to all panels
			//===============================================================
			// LOADING PANELS AND ADDING ID's
			//===============================================================
			$panels
				.each(
					function( i )
					{
						var $t = $(this),
							id = $t.attr( 'id' ) || _c.mm( 'm' + that.serialnr + '-p' + i );
							//console.log('ID NAMEING :' + id);
						$t.attr( 'id', id );
						MasterMenu.reportOnLoadPanel(id, $t);
					}
			);

			//	Add open and close links to menu items
			var test;
			$panels
				.find( '.' + _c.panel )
				.each(
					function( i )
					{
						var $t = $(this),
							$u = $t.is( 'ul' ) ? $t : $t.find( 'ul' ).first(),
							$l = $t.parent(),
							$a = $l.find( '> a, > span' ),
							$p = $l.closest( '.' + _c.panel );

							//test = $a;

						$t.data( _d.parent, $l );

						if ( $l.parent().is( 'ul.' + _c.list ) )
						{
							var $btn = $( '<a class="' + _c.subopen + '" href="#' + $t.attr( 'id' ) + '" />' ).insertBefore( $a );
							if ( !$a.is( 'a' ) )
							{
								$btn.addClass( _c.fullsubopen );
							}
							if ( that.direction == 'horizontal' )
							{
								$u.prepend( '<li class="' + _c.subtitle + '"><a class="' + _c.subclose + '" href="#' + $p.attr( 'id' ) + '">' + $a.text() + '</a></li>' );
							}
						}
					}
				);

			//	Link anchors to panels

			var evt = this.direction == 'horizontal' ? _e.open : _e.toggle;
			$panels
				.each(
					function( i )
					{
						var $opening = $(this),
							id = $opening.attr( 'id' );
							//bh
							panelHash[id] = 
								{
									panelThis:$(this),
									trigger:function(){
										$opening.trigger( evt );
									}
								}
							;

				//=========================================================
				// ---- SILENT EVENT --------------------------------------
				//=========================================================
						
						click( $('a[href="#' + id + '"]', that.$menu),
							function( e ){
								
								var targetPanelId = id;
								var currentPanelId = MasterMenu.getCurrentPanelId();
								var direction = MasterMenu.getDirectionById(id);
								var dataOptions = MasterMenu.getDataOptionById(currentPanelId);

								if(MasterMenu.mode.type != 'slave'){
									console.log('isNotSilent');
									$opening.trigger( evt );
								}else{
									console.log('isSilent');
									/*console.d(
										[
											'-------SILENT-------------------',
											//'$(id) id:' + $( '#' + id).attr( "id" ),
											//'$(id) class:' + $( '#' + id).attr( "class" ),
											//'$(id) closeParentEvent:' + $('#' + id).attr("closeParentEvent"),
											//'$(id).closest:ul:'+ $( '#' + id ).closest( "ul" ).attr('id'),
											//'-------------------------------------------------------------',
											//'$(id) class:' + $( '#' + id).attr('data-options'),
											//'MasterMenu.getCurrentPanelId:' + MasterMenu.getCurrentPanelId(),
											//'MasterMenu.getDirectionById:' + MasterMenu.getDirectionById(id),
											'=================================================================',
											'currentPanelId:' + currentPanelId,
											'targetPanelId:' + targetPanelId,
											'direction:' + direction,
											'dataOptions:>' + JSON.stringify(dataOptions),
											
										]
									);*/
									if(direction == 'forward'){
										MasterMenu.reportOnSilentPanelForward(
											{
												id:currentPanelId,
												closingPanelId:currentPanelId,
												openingPanelId:targetPanelId,
												direction:direction,
												dataOptions:dataOptions,
											}
										);
									}

									if(direction == 'backward'){
										MasterMenu.reportOnSilentPanelBackward(
											{
												id:currentPanelId,
												closingPanelId:currentPanelId,
												openingPanelId:targetPanelId,
												direction:direction,
												dataOptions:dataOptions,
											}
										);
									}





											/*if($( '#' + id).hasClass( "mm-subopened" )){
												//MasterMenu.reportOnSilentPanelClose(MasterMenu.lastOpenedPanel);
												//going back
												MasterMenu.reportOnSilentPanelClose($( '#' + id ).closest( "ul" ).attr('id'));
											}

											alert(id + ':' + $( '#' + id).attr('href'));
											if($( '#' + id).hasClass( "mm-subclose" ) && ($( '#' + id).attr('href') == '#mm-m0-p0')){
												MasterMenu.reportOnSilentPanelClose($( '#' + id ).closest( "ul" ).attr('id'));
												alert('going to base panel');
											}

											MasterMenu.reportOnSilentPanelOpen(id);*/
									
									
								}
							}
						);
					}
			);

			if ( this.direction == 'horizontal' )
			{
				//	Add opened-classes
				var $selected = $('ul.' + _c.list + ' > li.' + _c.selected, this.$menu);
				$selected
					.add( $selected.parents( 'li' ) )
					.parents( 'li' ).removeClass( _c.selected )
					.end().each(
						function()
						{
							var $t = $(this),
								$u = $t.find( '> .' + _c.panel );

							if ( $u.length )
							{
								$t.parents( '.' + _c.panel ).addClass( _c.subopened );
								$u.addClass( _c.opened );
							}
						}
					)
					.closest( '.' + _c.panel ).addClass( _c.opened )
					.parents( '.' + _c.panel ).addClass( _c.subopened );
			}
			else
			{
				//	Replace Selected-class with opened-class in parents from .Selected
				$('li.' + _c.selected, this.$menu)
					.addClass( _c.opened )
					.parents( '.' + _c.selected ).removeClass( _c.selected );
			}

			//	Set current opened
			var $current = $panels.filter( '.' + _c.opened );
			if ( !$current.length )
			{
				$current = $panels.first();
			}
			$current
				.addClass( _c.opened )
				.last()
				.addClass( _c.current );

			//	Rearrange markup
			if ( this.direction == 'horizontal' )
			{
				$panels.find( '.' + _c.panel ).appendTo( this.$menu );
			}
		},
		_initLinks: function(){
			var that = this;
	
			var $a = $('ul.' + _c.list + ' > li > a', this.$menu)
				.not( '.' + _c.subopen )
				.not( '.' + _c.subclose )
//				.not( '[href^="#"]' )
				.not( '[rel="external"]' )
				.not( '[target="_blank"]' );

			$a.off( _e.click )
				.on( _e.click,
					function( e )
					{
						var $t = $(this),
							href = $t.attr( 'href' );
	

						//	Set selected item
						if ( that.__valueOrFn( that.opts.onClick.setSelected, $t ) )
						{
							$t.parent().trigger( _e.setSelected );
						}

						//	Prevent default / don't follow link. Default: false
						var preventDefault = that.__valueOrFn( that.opts.onClick.preventDefault, $t, href.slice( 0, 1 ) == '#' );
						if ( preventDefault )
						{
							e.preventDefault();
							e.stopPropagation();
						}

						//	Block UI. Default: false if preventDefault, true otherwise
						if ( that.__valueOrFn( that.opts.onClick.blockUI, $t, !preventDefault ) )
						{
							glbl.$html.addClass( _c.blocking );
						}

						//	Close menu. Default: true if preventDefault, false otherwise
						if ( that.__valueOrFn( that.opts.onClick.close, $t, preventDefault ) )
						{
							that.$menu.triggerHandler( _e.close );
						}
					}
				);
		},
		_initOpenClose: function(){
			//BH
			console.log('_initOpenClose from source code');
			var that = this;

			//	Toggle menu
			var id = this.$menu.attr( 'id' );
			if ( id && id.length )
			{
				if ( this.conf.clone )
				{
					id = _c.umm( id );
				}

				click( $('a[href="#' + id + '"]'),
					function()
					{
						that.$menu.trigger( _e.open );
					}
				);
			}

			//	Close menu
			var id = glbl.$page.attr( 'id' );
			//alert(id);
			if ( id && id.length )
			{
				click( $('a[href="#' + id + '"]'),
					function()
					{
						that.$menu.trigger( _e.close );
					}, false, true
				);
			}
		},
		
		__valueOrFn: function( o, $e, d )
		{
			if ( typeof o == 'function' )
			{
				return o.call( $e[ 0 ] );
			}
			if ( typeof o == 'undefined' && typeof d != 'undefined' )
			{
				return d;
			}
			return o;
		},
		
		__refactorClass: function( $e, c )
		{
			$e.removeClass( this.conf[ c + 'Class' ] ).addClass( _c[ c ] );
		}
	};


	$.fn[ _PLUGIN_ ] = function( opts, conf )
	{
		//	First time plugin is fired
		if ( !glbl.$wndw )
		{
			_initPlugin();
		}

		//	Extend options
		opts = extendOptions( opts, conf );
		conf = extendConfiguration( conf );

		return this.each(
			function()
			{
				var $menu = $(this);
				if ( $menu.data( _PLUGIN_ ) )
				{
					return;
				}
				$menu.data( _PLUGIN_, new $[ _PLUGIN_ ]( $menu, opts, conf ) );
			}
		);
	};

	$[ _PLUGIN_ ].version = _VERSION_;
	
	$[ _PLUGIN_ ].defaults = {
		position		: 'left',
		zposition		: 'back',
		moveBackground	: true,
		slidingSubmenus	: true,
		modal			: false,
		classes			: '',
		onClick			: {
//			close				: true,
//			blockUI				: null,
//			preventDefault		: null,
			setSelected			: true
		}
	};
	$[ _PLUGIN_ ].configuration = {
		preventTabbing		: true,
		panelClass			: 'Panel',
		listClass			: 'List',
		selectedClass		: 'Selected',
		labelClass			: 'Label',
		pageNodetype		: 'div',
		panelNodetype		: 'ul, div',
		transitionDuration	: 400
	};



	/*
		SUPPORT
	*/
	(function() {

		var wd = window.document,
			ua = window.navigator.userAgent;

		var _touch 				= 'ontouchstart' in wd,
			_overflowscrolling	= 'WebkitOverflowScrolling' in wd.documentElement.style,
			_transition			= (function() {
				var s = document.createElement( 'div' ).style;
			    if ( 'webkitTransition' in s )
			    {
			        return 'webkitTransition';  
			    }
			    return 'transition' in s;
			})(),
			_oldAndroidBrowser	= (function() {
				if ( ua.indexOf( 'Android' ) >= 0 )
				{
					return 2.4 > parseFloat( ua.slice( ua.indexOf( 'Android' ) +8 ) );
				}
				return false;
			})();

		$[ _PLUGIN_ ].support = {

			touch: _touch,
			transition: _transition,
			oldAndroidBrowser: _oldAndroidBrowser,

			overflowscrolling: (function() {
				if ( !_touch )
				{
					return true;
				}
				if ( _overflowscrolling )
				{
					return true;
				}
				if ( _oldAndroidBrowser )
				{
					return false;
				}
				return true;
			})()
		};
	})();


	/*
		BROWSER SPECIFIC FIXES
	*/
	$[ _PLUGIN_ ].useOverflowScrollingFallback = function( use )
	{
		if ( glbl.$html )
		{
			if ( typeof use == 'boolean' )
			{
				glbl.$html[ use ? 'addClass' : 'removeClass' ]( _c.nooverflowscrolling );
			}
			return glbl.$html.hasClass( _c.nooverflowscrolling );
		}
		else
		{
			_useOverflowScrollingFallback = use;
			return use;
		}
	};


	/*
		DEBUG
	*/
	$[ _PLUGIN_ ].debug = function( msg ) {};
	$[ _PLUGIN_ ].deprecated = function( depr, repl )
	{
		if ( typeof console != 'undefined' && typeof console.warn != 'undefined' )
		{
			console.warn( 'MMENU: ' + depr + ' is deprecated, use ' + repl + ' instead.' );
		}
	};


	//	Global vars
	var _useOverflowScrollingFallback = !$[ _PLUGIN_ ].support.overflowscrolling;


	function extendOptions( o, c, $m )
	{
		if ( typeof o != 'object' )
		{
			o = {};
		}

		if ( $m )
		{
			if ( typeof o.isMenu != 'boolean' )
			{
				var $c = $m.children();
				o.isMenu = ( $c.length == 1 && $c.is( c.panelNodetype ) );
			}
			return o;
		}


		//	Extend onClick
		if ( typeof o.onClick != 'object' )
		{
			o.onClick = {};
		}


		//	DEPRECATED
		if ( typeof o.onClick.setLocationHref != 'undefined' )
		{
			$[ _PLUGIN_ ].deprecated( 'onClick.setLocationHref option', '!onClick.preventDefault' );
			if ( typeof o.onClick.setLocationHref == 'boolean' )
			{
				o.onClick.preventDefault = !o.onClick.setLocationHref;
			}
		}
		//	/DEPRECATED


		//	Extend from defaults
		o = $.extend( true, {}, $[ _PLUGIN_ ].defaults, o );


		//	Degration
		if ( $[ _PLUGIN_ ].useOverflowScrollingFallback() )
		{
			switch( o.position )
			{
				case 'top':
				case 'right':
				case 'bottom':
					$[ _PLUGIN_ ].debug( 'position: "' + o.position + '" not supported when using the overflowScrolling-fallback.' );
					o.position = 'left';
					break;
			}
			switch( o.zposition )
			{
				case 'front':
				case 'next':
					$[ _PLUGIN_ ].debug( 'z-position: "' + o.zposition + '" not supported when using the overflowScrolling-fallback.' );
					o.zposition = 'back';
					break;
			}
		}

		return o;
	}
	function extendConfiguration( c )
	{
		if ( typeof c != 'object' )
		{
			c = {};
		}


		//	DEPRECATED
		if ( typeof c.panelNodeType != 'undefined' )
		{
			$[ _PLUGIN_ ].deprecated( 'panelNodeType configuration option', 'panelNodetype' );
			c.panelNodetype = c.panelNodeType;
		}
		//	/DEPRECATED


		c = $.extend( true, {}, $[ _PLUGIN_ ].configuration, c )

		//	Set pageSelector
		if ( typeof c.pageSelector != 'string' )
		{
			c.pageSelector = '> ' + c.pageNodetype;
		}

		return c;
	}

	function _initPlugin()
	{
		glbl.$wndw = $(window);
		glbl.$html = $('html');
		glbl.$body = $('body');
		
		glbl.$allMenus = $();


		//	Classnames, Datanames, Eventnames
		$.each( [ _c, _d, _e ],
			function( i, o )
			{
				o.add = function( c )
				{
					c = c.split( ' ' );
					for ( var d in c )
					{
						o[ c[ d ] ] = o.mm( c[ d ] );
					}
				};
			}
		);

		//	Classnames
		_c.mm = function( c ) { return 'mm-' + c; };
		_c.add( 'menu ismenu panel list current highest hidden page blocker modal background opened opening subopen fullsubopen subclose subopened subtitle selected label nooverflowscrolling' );
		_c.umm = function( c )
		{
			if ( c.slice( 0, 3 ) == 'mm-' )
			{
				c = c.slice( 3 );
			}
			return c;
		};

		//	Datanames
		_d.mm = function( d ) { return 'mm-' + d; };
		_d.add( 'parent style scrollTop offetLeft' );

		//	Eventnames
		_e.mm = function( e ) { return e + '.mm'; };
		_e.add( 'toggle open opening opened close closing closed keydown resize setPage setSelected transitionend touchstart touchend click scroll' );
		if ( !$[ _PLUGIN_ ].support.touch )
		{
			_e.touchstart	= _e.mm( 'mousedown' );
			_e.touchend 	= _e.mm( 'mouseup' );
		}

		$[ _PLUGIN_ ]._c = _c;
		$[ _PLUGIN_ ]._d = _d;
		$[ _PLUGIN_ ]._e = _e;

		$[ _PLUGIN_ ].glbl = glbl;

		$[ _PLUGIN_ ].useOverflowScrollingFallback( _useOverflowScrollingFallback );
	}

	function openSubmenuHorizontal( $opening, $m ){
		console.log('openSubmenuHorizontal');
		if ( $opening.hasClass( _c.current ) )
		{
			return false;
		} 

		var $panels = $('.' + _c.panel, $m),
			$current = $panels.filter( '.' + _c.current );

		//BH
		lastOpenedPanel = $panels
		//alert('tetstHere' + lastOpenedPanel);
		$panels
			.removeClass( _c.highest )
			.removeClass( _c.current )
			.not( $opening )
			.not( $current )
			.addClass( _c.hidden );
		MasterMenu.oldLastOpenedPanel = $current.attr('id');
		MasterMenu.lastOpenedPanel = $opening.attr('id');
		if ( $opening.hasClass( _c.opened ) )
		{
			$current
				.addClass( _c.highest )
				.removeClass( _c.opened )
				.removeClass( _c.subopened );
		}
		else
		{
			$opening
				.addClass( _c.highest );

			$current
				.addClass( _c.subopened );
		}

		$opening
			.removeClass( _c.hidden )
			.removeClass( _c.subopened )
			.addClass( _c.current )
			.addClass( _c.opened );
		//MasterMenu.panelBackStack.push($current.attr('id'));
		MasterMenu.panelBackStack.push($opening.attr('id'));

		//BH----EVENT
		MasterMenu.reportOnPanelClose($current.attr('id'))
		MasterMenu.reportOnPanelOpen($opening.attr('id'))
		return 'open';
	}

	function findScrollTop()
	{
		if ( !glbl.$scrollTopNode )
		{
			if ( glbl.$html.scrollTop() != 0 )
			{
				glbl.$scrollTopNode = glbl.$html;
			}
			else if ( glbl.$body.scrollTop() != 0 )
			{
				glbl.$scrollTopNode = glbl.$body;
			}
		}
		return ( glbl.$scrollTopNode ) ? glbl.$scrollTopNode.scrollTop() : 0;
	}

	function transitionend( $e, fn, duration ){
		//BH
		console.log('transitionend from source code');
		var s = $[ _PLUGIN_ ].support.transition;
	    if ( s == 'webkitTransition' )
	    {
	        $e.one( 'webkitTransitionEnd', fn );
	    }
		else if ( s )
		{
			$e.one( _e.transitionend, fn );
		}
		else
		{
			setTimeout( fn, duration );
		}
	}
	function click( $b, fn, onTouchStart, add ){
		//BH
		console.log('click from source code');
		if ( typeof $b == 'string' )
		{
			$b = $( $b );
		}

		var event = ( onTouchStart )
			? _e.touchstart
			: _e.click;

		if ( !add )
		{
			$b.off( event );
		}
		$b.on( event,
			function( e )
			{
				e.preventDefault();
				e.stopPropagation();

				fn.call( this, e );
			}
		);
	}

})( jQuery );

//=======================================================================================================================================================
//--> JS HOPPER SECTION  ----------------------------------------------------------------------------------------------------------------------------
//========================================================================================================================================================


//BH
var lastOpenedPanel;
var panelHash = {};
/*
	elementId
	options
	config

*/
var MasterMenu = function(inJsonStruct){
	var _this = this;
	//==========================================================
	//--> SETUP -------------------------------
	//===========================================================
	var options = 
		{
			offCanvas:false,
			classes: "mm-fullscreen mm-light",
		}
	options = $.extend(options, inJsonStruct.options);

	var config = 
		{
		}
	config = $.extend(config, inJsonStruct.config);
	MasterMenu.mode =
		{
			type:'master'
		}
	MasterMenu.mode = $.extend(MasterMenu.mode, inJsonStruct.mode);

	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	//			PANEL BACK STACK 
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	MasterMenu.panelBackStack = new Backstack(
		{
			limit:20,
			overWriteOnPush:true,

			onPush:function(inItem){
				console.log('onPush callback' + inItem);
				console.dir(inItem);
				//alert(inItem);
				
			},

			onPop:function(inItem){
				console.log('onPop onCallback' + inItem);
				console.dir(inItem);
				if(!(inItem)){}
				
			}
		}
	);

	//==========================================================
	//--> INIT -------------------------------
	//===========================================================



	//==========================================================
	//--> EVENT -------------------------------
	//===========================================================
	$('.mm-subclose').click(function(e){
		_this.reportOnClick('closeSubMenu', -1, $(this)[0].innerText);
		//console.dir($(this)[0].innerText);
		//console.dir('a .mm-subclose:' );
	});

	$('a').click(function(e){
		$($(this).context.nextSibling).trigger('click');
	});

	//==========================================================
	//--> METHOD -------------------------------
	//===========================================================

	var eventCallBackList = {};
	this.setOnClick = function(inCallbackFunction){
		var functionId = new Date().getTime()+'z';
		eventCallBackList[functionId] = inCallbackFunction;
		return functionId;
	}

	this.unsetOnClick = function(inFunctionId){
		delete eventCallBackList[inFunctionId];
	}

	this.reportOnActionRequestClick = function(inId, inAction, inData){
		//alert('action:'  + inAction + 'data:' + inData);
		MasterMenu.reportOnMenuActionRequestClick(inId, inAction, inData);
	}

	this.reportOnClick = function(inId, inIndex, inCaption){
		MasterMenu.reportOnMenuClick(inId, inIndex, inCaption);
		for(var eventCallBackListIndex in eventCallBackList){
			if(eventCallBackList[eventCallBackListIndex]){
				var event = 'clickToOpen';
				if(inIndex == -1){
					event = 'clickToClose'
				}
				eventCallBackList[eventCallBackListIndex](event, inId, inIndex, inCaption);
			}
		}
	}


//'subMenu_contacts_add'
	this.openPanel = function(inPanelId){
		panelHash[inPanelId].trigger();
	}

	this.goBack = function(){
		var lastId = MasterMenu.panelBackStack.pop();
		//alert(lastId);
		_this.openPanel(lastId);
	}

	this.setMode = function(inMode){
		MasterMenu.mode = inMode;

	}

	this.getMode = function(){
		return MasterMenu.mode;
	}

	this.reinitialize = function(){
		$("#" + inJsonStruct.elementId).data('mmenu')._initPanles();
	}

	this.addHtml = function(inJsonStruct){
		//inPanelId, inNewId, inHtml
		//alert(JSON.stringify(inJsonStruct));
		if(inJsonStruct.actionRequest){
			var html = sprintf('<li id="%s" onclick="masterMenu.reportOnActionRequestClick(  \'' + inJsonStruct.newElementId + '\',   \'' + inJsonStruct.actionRequest.request + '\' , \'' + inJsonStruct.actionRequest.data + '\'    )">%s</li>', inJsonStruct.newElementId, inJsonStruct.html);
			$('#' + inJsonStruct.panelId).append(html);
		}else{//actionRequestClick
			var html = sprintf('<li id="%s" onclick="masterMenu.reportOnClick(\'' + inJsonStruct.newElementId + '\')">%s</li>', inJsonStruct.newElementId, inJsonStruct.html);
			$('#' + inJsonStruct.panelId).append(html);
		}
	}

	this.remove = function(inEleId){
		$('#' + inEleId).remove();
	}

	this.getHomePanelId = function(){
		//TODO:
		return false;
	}

	//===================================================
	//---- STATIC SECTION -------------------------------
	//===================================================
	MasterMenu.loadedPanelHash = {};
	MasterMenu.lastOpenedPanel;
	MasterMenu.oldLastOpenedPanel;
	MasterMenu.reportOnHomeOpen = function(){

	}
	MasterMenu.reportOnPanelOpen = function(inId){
		if(inJsonStruct.onPanelOpen){
			inJsonStruct.onPanelOpen(inId);
		}
	}
	MasterMenu.reportOnPanelClose = function(inId){
		if(inJsonStruct.onPanelClose){
			inJsonStruct.onPanelClose(inId);
		}
	}



	//=================================================
	//------ S I L E N T ------------------------------
	//=================================================
	MasterMenu.reportOnSilentPanelOpen = function(inId){
		if(inJsonStruct.onSilentPanelOpen){
			inJsonStruct.onSilentPanelOpen(inId);
		}
	}
	MasterMenu.reportOnSilentPanelClose = function(inId){
		if(inJsonStruct.onSilentPanelClose){
			inJsonStruct.onSilentPanelClose(inId);
		}
	}

	MasterMenu.reportOnSilentPanelForward = function(inJsonStructData){
		console.log('FROM onSilentPanelForwar');
		if(inJsonStruct.onSilentPanelForward){
			inJsonStruct.onSilentPanelForward(inJsonStructData);
		}
	}

	MasterMenu.reportOnSilentPanelBackward = function(inJsonStructData){
		console.log('FROM reportOnSilentPanelBackward');
		if(inJsonStruct.onSilentPanelBackward){
			inJsonStruct.onSilentPanelBackward(inJsonStructData);
		}
	}

	MasterMenu.reportOnMenuActionRequestClick = function(inId, inAction, inData){
		//onMenuClick
		if(inJsonStruct.onActionRequestClick){
			inJsonStruct.onActionRequestClick(inId, inAction, inData);
		}
	}

	MasterMenu.reportOnMenuClick = function(inId, inIndex, inCaption){
		//onMenuClick
		if(inJsonStruct.onMenuClick){
			inJsonStruct.onMenuClick(inId, inIndex, inCaption);
		}
	}

	MasterMenu.backstackPrimed = false;
	MasterMenu.reportOnLoadPanel = function(inId, inRef){
		MasterMenu.loadedPanelHash[inId] = inRef;

		//PRIME BACK STACK----add main menu to backstatck
		if(!(MasterMenu.backstackPrimed)){
			MasterMenu.panelBackStack.push(inId);
			MasterMenu.backstackPrimed = true;
		}

	}


	MasterMenu.getCurrentPanelId = function(){
		return $('ul.mm-current').attr('id');
	}

	MasterMenu.getDirectionById = function(inId){
		return $('#' + inId).hasClass('mm-subopened')? 'backward' : 'forward';
	}

	MasterMenu.getDataOptionById = function(inId){
		var optsString = '' + $('#' + inId).attr('data-options');
		result =
			{
				onBackCloseWindow:true,
				onForwardOpenWindow:true,
				onBackMenuAdvance:true
			}
		;
		//if(typeof optsString === undefined){return result;}
		//if(optsString.trim() == ''){return result;}
		try{
			return eval ('({' + optsString + '})');
		}catch(e){
			return result;
		}
	}


	//===================================================
	//---- HTML TEMPLATES--------------------------------
	//===================================================
	this.getHtmlTemplate = function(inJsonStruct){
		if(inJsonStruct.template == 'imageAndText'){
			var options = 
				{
					imageSource:'',
					imageClass:'',
					imageWidth:'30px',
					imageStyle:'vertical-align:middle;',
					caption:'????'
				}
			options = $.extend(options, inJsonStruct.options);
			var html = '' +
			'<a href="#" class="imageAndText">'																																	+ '' +
				'<img src="' + options.imageSource + '" style="'+ options.imageStyle +' overflow: hidden; height:' + options.imageWidth + '; width:' + options.imageWidth + '; object-fit: cover;" class="magicSquare ' + options.imageClass + '" >'	+ '' +
				'</img>' + '&nbsp;&nbsp;&nbsp;&nbsp;' + options.caption 																							+ '' +
			'</a>'
			;
			return html;
		}
	}

	//TODO:remove slider section, not used any more!!!!!!!!!!!!!!!
	//===================================================
	//---- S L I D E R-----------------------------------
	//===================================================
	this.slider = function(inJsonStruct){
		var options = 
			{
				sliderDivId:'',
				startPlay:false,
				sliderUrl:'',
				imageUrlArray:[],
				informationArray:[],
				divHeight:'25px',
				class:'magicCirc contactImage',
				sliderSize:
					{
						width:200
					}
			}
		options = $.extend(options, inJsonStruct);
		//console.log('a-a-a-a-a-a-a-a-a-a');
		//console.dir(options.informationArray);
		var imageUrlArrayOfHtml = [];
		for(imageUrlIndex in options.imageUrlArray){
			var theHtml = 
				'<div id="sliderId_' + options.informationArray[imageUrlIndex].id + '" style="height:' + options.divHeight + ';" >' 																								+ '' +
					'<a u=image href="#">' 																														+ '' +
						'<img style="height:' + options.divHeight + ';" class="' + options.class + '" src="' + options.imageUrlArray[imageUrlIndex] + '">'	+ '' +
					'</img>'																																	+ '' +
					'</a>'																																		+ '' +
				'</div>';
			imageUrlArrayOfHtml.push(theHtml)
		}
		$postAjax(
			{
				url:options.sliderUrl,
				send:
					{
						sliderDivs:imageUrlArrayOfHtml,
						information:options.informationArray,
						sliderSize:options.sliderSize,
						autoPlaySlides:false
					},
				onAjaxSuccess:function(inResponseText){
					$('#' + options.sliderDivId).html(inResponseText);
				}
			}
		);



	}




	//===================================================
	//---- CREATE MENU  ---------------------------------
	//===================================================
	var header = {}
	$("#" + inJsonStruct.elementId).mmenu(options,config);
	/*$("#" + inJsonStruct.elementId).mmenu(
		{
			header:true
		}
	);*/
	//$("#" + inJsonStruct.elementId).mmenu();


	//$("#" + inJsonStruct.elementId).data('mmenu')._initPanles();
	/*$(function() {
				$("#" + inJsonStruct.elementId)
					.mmenu({
		header: true
					}).on(
						'click',
						'a[href^="#/"]',
						function()
						{
							alert( "Thank you for clicking, but that's a demo link." );
							return false;
						}
					);
			});*/
	

	

}









