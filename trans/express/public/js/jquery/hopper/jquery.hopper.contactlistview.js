//=======================================================================================================================================================
// Contact List View ------------------------------------------------------------------------------------------------------------------------------------
//=======================================================================================================================================================
var ContactListView = function(inJsonStruct){
	var _this = this;
	var theDivRef;
	var contactListViewHash = {};
	//var jRef_id;

	var options = 
		{
			test:'testVal',
			onLoadComplete:false,
			useCheckbox:false,
			autoScrollOnSelect:false,
			onLongClick:false,
			onClick:false,
			onAfterDataLoad:false,
			onAddTempContacts:false,
			onChange:false,

		}
	options = $.extend(options, inJsonStruct);
	theDivRef = options.divRef;
	var uid = $(theDivRef).attr('id');
	this.getTest = function(){
		return options.test;
	}

	this.remove = function(inId){
		if(!(contactListViewHash[inId])){return false;}
		$(contactListViewHash[inId].jRef).remove();
		delete contactListViewHash[inId];
		$(theDivRef).listview().listview('refresh');
		if(options.onChange){options.onChange('delete', {id:inId});}
		_this.setSelectedByIndex(0);
	}

	this.toggleState = function(inJref){
		contactListViewHash[$(inJref).attr('contactid')].state =! (contactListViewHash[$(inJref).attr('contactid')].state);
		if(contactListViewHash[$(inJref).attr('contactid')].state){
			$(inJref).buttonMarkup({ icon: "check",iconpos:'right' });
		}else{
			$(inJref).buttonMarkup({ icon: "",iconpos:'right' });
		}
	}

	//returns array of records
	this.getSelectedData = function(){
		var resultArray = [];
		for(var contactListViewHashIndex in contactListViewHash){
			if(contactListViewHash[contactListViewHashIndex].state){
				resultArray.push(contactListViewHash[contactListViewHashIndex]);
			}
		}
		return resultArray;
	}

	//returns array of contactIds 
	this.getSelected = function(){
		var resultArray = [];
		for(var contactListViewHashIndex in contactListViewHash){
			if(contactListViewHash[contactListViewHashIndex].state){
				resultArray.push(contactListViewHash[contactListViewHashIndex].id);
			}
		}
		return resultArray;
	}

	this.getLastSelected = function(){
		var theId = $('.trans-bkg-a-hv.lastSelected').parent().attr('contactid');
		if(theId){
			return contactListViewHash[theId];
		}else{
			return false;
		}
	}

	this.refresh = function(inOptions){
		var options = 
			{
				useUnionCache:false
			}
		options = $.extend(options, inOptions);
		ContactDataCache.forceRefresh(function(nothing){
			if(options.useUnionCache){
				ContactDataCache.getUnionCachedDataArray(function(inRecords){
					console.log('getUnionCachedDataArray ENETERED');
					console.dir(inRecords);
					_this._refresh(inRecords);
				});
				return;
			}else{
				ContactDataCache.getCachedDataArray(function(inRecords){
					console.log('getCachedDataArray ENETERED');
					_this._refresh(inRecords);
					console.dir(inRecords);
				});
				return;
			}
		});
	}

	this._refresh = function(inRecords){
		//console.clear();
		$.debug('_refresh', inRecords);
		///////////////////alert(JSON.stringify(ContactDataCache.getCachedDataArray()));
		//ContactDataCache.getCachedDataArray(function(inRecords){
		/////////////////contactDataObject.select({}, function(inRecords){
			for(contactIndex in inRecords){
				var theRecord = contactListViewHash[inRecords[contactIndex].id];
				if(!(theRecord)){
					console.log('_refresh  ( !(theRecord)  )');
					//need to add, it does not exist.....
					//alert('please add:');
					//console.dir(theRecord);
					//inRecords[contactIndex].md5Hash = $.getHash.md5(JSON.stringify(inRecords[contactIndex]));
					inRecords[contactIndex].md5Hash = $.createContactHashCode(inRecords[contactIndex]);
					console.log('_refresh  ( ' + inRecords[contactIndex].name + '  ) MD5:' + inRecords[contactIndex].md5Hash);
					var html = createHtml(
						{
							id:inRecords[contactIndex].id,
							class:'listViewClass',
							imageUrl:inRecords[contactIndex].imageUrl,
							name:inRecords[contactIndex].name,
							number:phoneDisplayFormat(inRecords[contactIndex].phoneNumber),
							type:inRecords[contactIndex].type,
						}
					);
					$(theDivRef).append(html);
					inRecords[contactIndex].jRef = $('#' + uid + '_' + inRecords[contactIndex].id);
					contactListViewHash[inRecords[contactIndex].id] = inRecords[contactIndex];
					$('#' + uid + '_' + inRecords[contactIndex].id).click(function(e){
						var id = 
						console.log('clcik list view AA3 :' + $(e.currentTarget).attr('contactid'));
						console.dir(e);
						if(options.onClick){
							if(options.useCheckbox){
								_this.toggleState($(e.currentTarget));
							}
							options.onClick($(e.currentTarget).attr('contactid'), contactListViewHash[$(e.currentTarget).attr('contactid')], uid + '_' + $(e.currentTarget).attr('contactid'));
						}
					});
					$('#' + uid + '_' + inRecords[contactIndex].id).bind( "taphold", function(e){
						if(options.onLongClick){
							options.onLongClick($(e.currentTarget).attr('contactid'), contactListViewHash[$(e.currentTarget).attr('contactid')], uid + '_' + $(e.currentTarget).attr('contactid'));
						}
					});
					_this.setSelectedByIndex(0);

					var passingRecord = $.extend({}, inRecords[contactIndex]);
					passingRecord.jRef = false;
					if(options.onChange){options.onChange('add', passingRecord);}


				}else{
					console.log('_refresh  ( FOUND RECORD IN HASH  )');
					//var copyOf = $.extend({}, inRecords[contactIndex]);
					//var copyOf = $.removeCircular($.copyObject(inRecords[contactIndex]));
					//$.debug('copyOf', copyOf);
					//var inComingHashCode = $.getHash.md5(JSON.stringify(copyOf));
					var inComingHashCode = $.createContactHashCode(inRecords[contactIndex]);
					console.log('HASHCODE(' + inRecords[contactIndex].name + ')(just created):' + inComingHashCode);
					console.log('HASHCODE(' + theRecord.name + ')(    old     ):' + theRecord.md5Hash);
					if(inComingHashCode != theRecord.md5Hash){
						console.log('_refresh  ( HASH DIFFERENT, EDITS THIS  )');
						//need to edit this record
						//alert('please edit:' );

						//inRecords[contactIndex].jRef = $('#' + uid + '_' + inRecords[contactIndex].id);

						console.dir(theRecord);
						editHtml(inRecords[contactIndex].id, inRecords[contactIndex]);
						contactListViewHash[inRecords[contactIndex].id] = inRecords[contactIndex];
						contactListViewHash[inRecords[contactIndex].id].md5Hash = inComingHashCode;
						$(theDivRef).listview().listview('refresh');
						//was edit
						if(options.onChange){options.onChange('edit', inRecords[contactIndex]);}
					}else{
						console.log('_refresh  ( HASH SAME, DO NOTHING  )');
					}
				}
			}


			/*var _contactListArray = [];
			for(var contactListViewHashIndex in _contactListArray){
				contactListArray.push(_contactListArray[contactListViewHashIndex].id);
			}
			var theDiff = arrayDiff(_contactListArray, inRecords);
			alert(JSON.stringify(theDiff));*/



			var dbArray = [];
			for(var inRecordsIndex in inRecords){
				dbArray.push(inRecords[inRecordsIndex].id);
			}
			console.log('dbArray');
			console.dir(dbArray);


			var contactListArray = [];
			for(var contactListViewHashIndex in contactListViewHash){
				contactListArray.push(contactListViewHash[contactListViewHashIndex].id);
			}
			console.log('contactListArray');
			console.dir(contactListArray);


			//var removeArray = diff(contactListArray, dbArray);
			//var removeArray = $(contactListArray).not(dbArray).get();
			var removeArray = arrayDiff(contactListArray, dbArray);
			console.log('removeArray');
			console.dir(removeArray);

			//var willDelete = removeArray.length > 0;
			for(var removeArrayIndex in removeArray){
				//$(contactListViewHash[removeArray[removeArrayIndex]].jRef).remove();
				console.log('DELETE $ID:' + '#' + uid + '_' + contactListViewHash[removeArray[removeArrayIndex]].id);
				$('#' + uid + '_' + contactListViewHash[removeArray[removeArrayIndex]].id).remove();

				/////$('#' + $(theDivRef).attr('id') + contactListViewHash[removeArray[removeArrayIndex]].id).remove();

				var deletionId = contactListViewHash[removeArray[removeArrayIndex]].id;
				var deletionName = contactListViewHash[removeArray[removeArrayIndex]].name;
				var deletionType = contactListViewHash[removeArray[removeArrayIndex]].type;
				var deletionPhoneNumber = contactListViewHash[removeArray[removeArrayIndex]].phoneNumber;
				delete contactListViewHash[removeArray[removeArrayIndex]];
				if(options.onChange){
					options.onChange('delete', 
						{
							id:deletionId,
							name:deletionName,
							type:deletionType,
							phoneNumber:deletionPhoneNumber,
						}
					);
				}
			}
			if(removeArray.length ){
				_this.setSelectedByIndex(0);
			}
			$(theDivRef).listview().listview('refresh');
			//if(willDelete){
				
			//}
			//$('table tbody').trigger('footable_redraw');
			if(options.onAfterDataLoad){options.onAfterDataLoad(contactListViewHash);}
		//});

	}//end refresh

	this.scrollToSelected = function(){
		console.log('scrollToSelected');
		var lastSelected = _this.getLastSelected();
		var theSelectedId;
		if(lastSelected){
			theSelectedId = lastSelected.id;
			console.log('lastSelected');
			console.dir(lastSelected);
			console.dir($(theDivRef).parent());
			/*$(theDivRef).parent().animate(
				{
					scrollTop: $('#' + uid + '_' + theSelectedId).offset().top
				},
				100
			);*/
			$('#' + uid + '_' + theSelectedId).ScrollTo({
				onlyIfOutside: true
			});
		}

	}

	this.addTempContacts = function(inRecords){
		var resultContacts = [];
		for(contactIndex in inRecords){
			//md5 hashing!!!!
			inRecords[contactIndex].md5Hash = $.createContactHashCode(inRecords[contactIndex]);
			//inRecords[contactIndex].md5Hash = $.getHash.md5(JSON.stringify(inRecords[contactIndex]));
			inRecords[contactIndex].id = inRecords[contactIndex].id ? inRecords[contactIndex].id : new Date().getTime();
			var html = createHtml(
				{
					id:inRecords[contactIndex].id ? inRecords[contactIndex].id : new Date().getTime(),
					class:'listViewClass',
					imageUrl:inRecords[contactIndex].imageUrl,
					name:inRecords[contactIndex].name,
					number:inRecords[contactIndex].phoneNumber,
					type:inRecords[contactIndex].type,
				}
			);
			$(theDivRef).append(html);
			inRecords[contactIndex].jRef = $('#' + uid + '_' + inRecords[contactIndex].id);
			contactListViewHash[inRecords[contactIndex].id] = inRecords[contactIndex];
			resultContacts.push(inRecords[contactIndex]);
			$('#' + uid + '_' + inRecords[contactIndex].id).click(function(e){
				var id = 
				console.log('clcik list view AA3 :' + $(e.currentTarget).attr('contactid'));
				console.dir(e);
				if(options.onClick){
					if(options.useCheckbox){
						_this.toggleState($(e.currentTarget));
					}
					options.onClick($(e.currentTarget).attr('contactid'), contactListViewHash[$(e.currentTarget).attr('contactid')], uid + '_' + $(e.currentTarget).attr('contactid'));
				}
			});
			$('#' + uid + '_' + inRecords[contactIndex].id).bind( "taphold", function(e){
				if(options.onLongClick){
						options.onLongClick($(e.currentTarget).attr('contactid'), contactListViewHash[$(e.currentTarget).attr('contactid')], uid + '_' + $(e.currentTarget).attr('contactid'));
					}
			});
			if(options.onChange){options.onChange('add', inRecords[contactIndex]);}
		}
		$(theDivRef).listview().listview('refresh');
		if(options.onAddTempContacts){options.onAddTempContacts(resultContacts);}
		return resultContacts;
	}

	this.loadData = function(inOptions){
		var options = 
			{
				useUnionCache:false,
				onFinish:false,
			}
		options = $.extend(options, inOptions);
		ContactDataCache.forceRefresh(function(nothing){
			if(options.useUnionCache){
				ContactDataCache.getUnionCachedDataArray(function(inRecords){
					console.log('getUnionCachedDataArray ENETERED');
					console.dir(inRecords);
					_this._loadData(inRecords, options.onFinish);
				});
				return;
			}else{
				ContactDataCache.getCachedDataArray(function(inRecords){
					console.log('getCachedDataArray ENETERED');
					_this._loadData(inRecords, options.onFinish);
					console.dir(inRecords);
				});
				return;
			}
		});
	}


	this._loadData = function(inRecords, inPostFunction){
		$.debug('_loadData', inRecords);
		//alert(JSON.stringify(ContactDataCache.getCachedDataArray()));
		////////////////contactDataObject.select({}, function(inRecords){
		//ContactDataCache.forceRefresh(function(nothing){
			//var inRecords = ContactDataCache.getCachedDataArray();
			console.log('TEST_0:');
			console.dir(inRecords);
			for(contactIndex in inRecords){
				//md5 hashing!!!!
				//inRecords[contactIndex].md5Hash = $.getHash.md5(JSON.stringify(inRecords[contactIndex]));
				inRecords[contactIndex].md5Hash = $.createContactHashCode(inRecords[contactIndex]);
				console.log('_loadData  ( ' + inRecords[contactIndex].name + '  ) create MD5:' + inRecords[contactIndex].md5Hash);
				var html = createHtml(
					{
						id:inRecords[contactIndex].id,
						class:'listViewClass',
						imageUrl:inRecords[contactIndex].imageUrl,
						name:inRecords[contactIndex].name,
						number:inRecords[contactIndex].phoneNumber,
						type:inRecords[contactIndex].type,
					}
				);
				$(theDivRef).append(html);
				inRecords[contactIndex].jRef = $('#' + uid + '_' + inRecords[contactIndex].id);
				contactListViewHash[inRecords[contactIndex].id] = inRecords[contactIndex];
				$('#' + uid + '_' + inRecords[contactIndex].id).click(function(e){
					var id = 
					console.log('clcik list view AA3 :' + $(e.currentTarget).attr('contactid'));
					console.dir(e);
					if(options.onClick){
						if(options.useCheckbox){
							_this.toggleState($(e.currentTarget));
						}
						options.onClick($(e.currentTarget).attr('contactid'), contactListViewHash[$(e.currentTarget).attr('contactid')], uid + '_' + $(e.currentTarget).attr('contactid'));
					}
				});
				$('#' + uid + '_' + inRecords[contactIndex].id).bind( "taphold", function(e){
					if(options.onLongClick){
							options.onLongClick($(e.currentTarget).attr('contactid'), contactListViewHash[$(e.currentTarget).attr('contactid')], uid + '_' + $(e.currentTarget).attr('contactid'));
						}
				});
			}
			$(theDivRef).listview().listview('refresh');
			if(inPostFunction){inPostFunction();}
			//$('table tbody').trigger('footable_redraw');
			if(options.onAfterDataLoad){options.onAfterDataLoad(contactListViewHash);}
		//});
	}

	this.getIdByNameAndType = function(inName, inType){
		for(var contactListViewHashIndex in contactListViewHash){
			if((inName == contactListViewHash[contactListViewHashIndex].name) && (inType == contactListViewHash[contactListViewHashIndex].type)){
				return contactListViewHash[contactListViewHashIndex].id;
			}
		}
		return false;
	}

	var editHtml = function(inId, inData){
		var html = createHtml(
			{
				id:inId,
				class:'listViewClass',
				imageUrl:inData.imageUrl,
				name:inData.name,
				number:phoneDisplayFormat(inData.phoneNumber),
				type:inData.type,
			}
		);
		$('#' + uid + '_' + inData.id).replaceWith(html);
		$('#' + uid + '_' + inData.id).click(function(e){
			if(options.onClick){
				if(options.useCheckbox){
					_this.toggleState($(e.currentTarget));
				}
				options.onClick($(e.currentTarget).attr('contactid'), contactListViewHash[$(e.currentTarget).attr('contactid')], uid + '_' + $(e.currentTarget).attr('contactid'));
			}
		});
		$('#' + uid + '_' + inData.id).bind( "taphold", function(e){
			if(options.onLongClick){
				options.onLongClick($(e.currentTarget).attr('contactid'), contactListViewHash[$(e.currentTarget).attr('contactid')], uid + '_' + $(e.currentTarget).attr('contactid'));
			}
		});
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
		//jRef_id = uid + '_' + options.id;
		//var style = ':hover {background-color:#feeebd ;}:active { background-color:#817865 ;}';
		//var style = 'background-color: transparent !important;';
		var style = '';
		var html = '' + 
			'<li id="' + uid + '_' + options.id + '" contactId="' + options.id + '" class="menu_li checkbox_click_' + uid + '_' + options.class + '"  data-icon="false" data-inset="true">' + ' ' +
				'<a "/hjhjhjh" class="trans-bkg-a-hv" style="' + style + '" > ' + options.name 													+ ' ' +
					'<img src="' + options.imageUrl + '" style="margin: 15px 15px; height:50px; width:50px;  object-fit: cover;" class="magicSquare" />'			+ ' ' +
					'<p>' + phoneDisplayFormat(options.number) + '</p>'													+ ' ' +
					'<p>' + options.type + '</p>'													+ ' ' +
				'</a>'																				+ ' ' +
			'</li>'
		;
		//options['html'] = html;
		return html;
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

	//============================
	//---EVENT
	//============================
	this.initEvent = function(){
	}

	this.setState = function(inBool){
		options.state = inBool;
	}

	this.setSelectedByNameAndType = function(inJstruct){
		var options2 = 
			{
				name:'',
				type:''
			}
		options2 = $.extend(options2, inJstruct);
		var inName = options2.name;
		var inType = options2.type;

		for(var contactListViewHashIndex in contactListViewHash){
			if((inName == contactListViewHash[contactListViewHashIndex].name) && (inType == contactListViewHash[contactListViewHashIndex].type)){
				$('#' + $(options.divRef).attr('id') + '_' + contactListViewHash[contactListViewHashIndex].id).find('.trans-bkg-a-hv').trigger('click');
				if(options.autoScrollOnSelect){ _this.scrollToSelected(); }
				return ;
			}
		}

	}
	//				$('#' + $(options.divRef).attr('id') + '_' + contactListViewHash[contactListViewHashIndex].id).find('.trans-bkg-a-hv').trigger('click');
	this.setSelectedById = function(inId){
		if(!(inId in contactListViewHash)){return false;}
		var contactId = contactListViewHash[inId].id;
		if(contactId){
			$('#' + $(options.divRef).attr('id') + '_' + contactId).find('.trans-bkg-a-hv').trigger('click');
			if(options.autoScrollOnSelect){ _this.scrollToSelected(); }
		}
	}

	this.setSelectedByIndex = function(inIndex){
		if(Object.keys(contactListViewHash).length){return false;}

		if(inIndex > Object.keys(contactListViewHash).length-1){return false;}
		$('#' + $(options.divRef).attr('id') + '_' + contactListViewHash[Object.keys(contactListViewHash)[0]].id  ).find('.trans-bkg-a-hv').trigger('click');
		if(options.autoScrollOnSelect){ _this.scrollToSelected(); }
		return ;
	}

	this.findFirstByPhoneNumber = function(inPhoneNumber){
		for(var contactListViewHashIndex in contactListViewHash){
			if(phoneNumberCompare(contactListViewHash[contactListViewHashIndex].phoneNumber, inPhoneNumber)){
				return contactListViewHash[contactListViewHashIndex];
			}
		}
		return false;
	}




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

	if(inAction == 'refresh'){
		contactListView = $(this).data("contactListViewInstance");
		contactListView.refresh(inJsonStruct);
	}

	if(inAction == 'loadData'){
		contactListView = $(this).data("contactListViewInstance");
		contactListView.loadData(inJsonStruct);
		contactListView.initEvent();
	}

	if(inAction == 'getSelectedData'){
		contactListView = $(this).data("contactListViewInstance");
		return contactListView.getSelectedData();
	}

	if(inAction == 'getSelected'){
		contactListView = $(this).data("contactListViewInstance");
		return contactListView.getSelected();
	}

	if(inAction == 'remove'){
		contactListView = $(this).data("contactListViewInstance");
		return contactListView.remove(inJsonStruct);
	}

	if(inAction == 'setSelectedByNameAndType'){
		return contactListView.setSelectedByNameAndType(inJsonStruct);
	}
	if(inAction == 'getIdByNameAndType'){
		return contactListView.getIdByNameAndType(inJsonStruct.name, inJsonStruct.type);
	}
	if(inAction == 'getLastSelected'){
		return contactListView.getLastSelected();
	}
	if(inAction == 'setSelectedByIndex'){
		return contactListView.setSelectedByIndex(inJsonStruct);
	}
	if(inAction == 'scrollToSelected'){
		return contactListView.scrollToSelected(inJsonStruct);
	}
	if(inAction == 'findFirstByPhoneNumber'){
		return contactListView.findFirstByPhoneNumber(inJsonStruct);
	}
	if(inAction == 'addTempContacts'){
		return contactListView.addTempContacts(inJsonStruct);
	}

	if(inAction == 'setSelectedById'){
		return contactListView.setSelectedById(inJsonStruct);
	}


}