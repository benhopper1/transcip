//=======================================================================================================================================================
// Contact List View ------------------------------------------------------------------------------------------------------------------------------------
//=======================================================================================================================================================
var ContactListView = function(inJsonStruct){
	var _this = this;
	var theDivRef;
	var contactListViewHash = {};
	var options = 
		{
			test:'testVal',
			onLoadComplete:false,

		}
	options = $.extend(options, inJsonStruct);
	theDivRef = options.divRef;
	var uid = $(theDivRef).attr('id');
	this.getTest = function(){
		return options.test;
	}

	this.loadData = function(){
		$postAjax(
			{
				url:'/database/getContacts',
				send:
					{

					},
				onAjaxSuccess:function(inResponseText){
					inResponseText = JSON.parse(inResponseText).rows;
					//alert(JSON.stringify(inResponseText));
					var centerHtml = '';
					for(contactIndex in inResponseText){
						var html = createHtml(
							{
								id:inResponseText[contactIndex].id,
								class:'listViewClass',
								imageUrl:inResponseText[contactIndex].imageUrl,
								name:inResponseText[contactIndex].name,
								number:phoneDisplayFormat(inResponseText[contactIndex].phoneNumber),
								type:inResponseText[contactIndex].type,
							}
						);
						//$(theDivRef).append(html);
						contactListViewHash[inResponseText[contactIndex].id] = inResponseText[contactIndex];
						centerHtml+= html;
					}
					console.log('html:');

					var finalHtml = createWrapedHtml(centerHtml);
					$(theDivRef).html(finalHtml);
					console.dir(finalHtml);
					//$(theDivRef).listview().listview('refresh'); //@@ui id==contactsMenu
					$('#contactsMenu').listview().listview('refresh');
					//$(theDivRef).collapsible();
				}
			}
		);
	}

	var createHtml = function(inData){
		var options = 
			{
				id:new Date().getTime(),
				class:'listViewClass',
				imageUrl:'BAD URL',
				name:'NO NAME',
				number:'NO NUMBER',
				type:'NO TYPE',
			}
		options = $.extend(options, inData);

		var html = '' + 
			'<li id="' + uid + '_' + options.id + '" contactId="' + options.id + '" class="menu_li ' + options.class + '"  data-inset="true">' 				+ ' ' +
				'<a "/hjhjhjh" style="background-color: transparent !important;" > ' + options.name 														+ ' ' +
					'<img src="' + options.imageUrl + '" style="margin: 15px 15px;" class="magicSquare" height="50px"/>'									+ ' ' +
					'<p>' + options.number + '</p>'																											+ ' ' +
					'<p>' + options.type + '</p>'																											+ ' ' +
				'</a>'																																		+ ' ' +
			'</li>'																																			

		;
		//options['html'] = html;
		return html;
	}

	var createWrapedHtml = function(inCenterHtml){
		var wrapper = 
			//'<div id="' + uid + '_' + 'collapsible" data-role="collapsible" class="" data-content-theme="d" data-inset="false" data-collapsed="false" data-mini="true" data-iconpos="right" style="padding: 0px 0px 0.5em 12px !important;width:100%; height:100%;border: 0px">' + ' ' +
				'<h3 style="margin-top: 0px !important;margin-bottom: 0px !important;"/> my heading'																+ ' ' +
				'<div class="ui-content" data-position-to="window" style="width:90%; ">'																				+ ' ' +
					'<a href="#contactPanel_0" data-ajax="false" style=""/>'																							+ ' ' +
					'<ul data-role="listview" id="contactsMenu" class=""   data-inset="false" style="width:100%; ">'										+ ' ' +

						inCenterHtml + 

					'</ul>'																																				+ ' ' +
				'</div>'	
			//'</div>'
		;
		return wrapper;
	}

	/*var formatPhoneNumber = function(inNumber){
		if(inNumber.length == 10){
			return '1' + inNumber.substring(1).replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1)$2-$3');
		}
		if(inNumber.length == 11){
			return '1' + inNumber.substring(1).replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1)$2-$3');
		}
		return inNumber;
	}*/



}


$.fn.ContactListView = function(inAction, inJsonStruct){
	var contactListView = $(this).data("contactListViewInstance");
	if(!(contactListView) || inAction == 'create'){
		inJsonStruct['divRef'] = $(this);
		console.log('ContactListView CREATED');
		var contactListView = new ContactListView(inJsonStruct);
		$(this).data("contactListViewInstance", contactListView);
		return ;
	}
	if(inAction == 'test'){
		contactListView = $(this).data("contactListViewInstance");
		//alert('test:' + contactListView.getTest());
	}

	if(inAction == 'loadData'){
		contactListView = $(this).data("contactListViewInstance");
		contactListView.loadData();
	}
}