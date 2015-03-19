var MemberFinder = function(inData){
	var _this = this;
	var uId = 'NS_' + new Date().getTime();
	MemberFinder.addInstance(uId, _this);
	var buildWithElement = inData.buildWithElement;
	var buttonEventsHash = {};
	var resetDivId;

	var buttons = inData.buttons;
	this.getButtons = function(){return buttons;}

	if(inData.buttons){
		for(index in inData.buttons){
			if(inData.buttons[index].onClick){
				buttonEventsHash[inData.buttons[index].id] = inData.buttons[index].onClick;
			}
		}
	}



	this.getButtonEventsHash = function(){
		return buttonEventsHash;
	}

	var ajaxFuzzyFind = new clientUtilModule.AjaxJsonPostObject(
		{
			url:'/members/service/fuzzyFind',
			onAjaxSuccess:function(inResponseText){

				if(!(inResponseText.error)){
					inResponseText = JSON.parse(inResponseText);
					if(!(initState)){
						$('#' + buildWithElement).html(inResponseText.html);
						initState = true;
						$('#tb_needle_' + uId).on('keyup', function(){
							ajaxFuzzyFind.send(
								{
									needle:this.value.trim(),
									populationStart:0,
									populationCount:20,
									command:(initState) ? 'na' : 'init',
									uuid:uId
								}
							);
						});

					}else{
						//--build the data section
						resetDivId = inResponseText.uuid;
						$('#' + inResponseText.uuid).html(inResponseText.html);
						$(document).ready(function(){
							$('#' + inResponseText.uuid).html(inResponseText.html);
						});
					}
				}
			}
		}
	);


	var initState = false;

	//()AUTO--setup/init jade file-------------
	var init = function(){
		ajaxFuzzyFind.send(
			{
				command:(initState) ? 'na' : 'init',
				uuid:uId,
				buttons:inData.buttons,
				title:inData.title,
				titleSize:inData.titleSize,
				titleClass:inData.titleClass
			}
		);
	}();


	this.hide = function(){
		$('#' + buildWithElement).css({"display":"none"});
	}

	this.show = function(){
		$('#' + buildWithElement).css({"display":""});
	}

	this.reset = function(){
		$('#' + resetDivId).html('');
		$('#tb_needle_' + uId).val('');
		_this.clearData();
	}

	this.robotEntry = function(inText){
		$('#tb_needle_' + uId).val(inText);
		$('#tb_needle_' + uId).trigger('keyup');
	}

	this.getMemberHtml = function(inIndex){
		return $('#components_' + uId + '_' + inIndex).html();
	}

	this.getMemberData = function(inIndex){
		return _this.getData().members[inIndex];
	}

	this.close = function(){
		$('#' + buildWithElement).html('');
	}

};



//---STATIC------------------------------------------------------
MemberFinder.instanceHash = {};

MemberFinder.getInstance = function(inKey){
	return MemberFinder.instanceHash[inKey];
}

MemberFinder.addInstance = function(inKey, inInstance){
	MemberFinder.instanceHash[inKey] = inInstance;
}