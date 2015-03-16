

var WebMenuObject = new function(){
	var _this = this;

	this.loadMenu = function(inJsonStruct){
		//@url
		//@menuDataArray
		//@updateElementId

		$postAjax(
			{
				url:inJsonStruct.url,
				send:
					{
						menuData:inJsonStruct.menuDataArray,
						isSubMenu:inJsonStruct.isSubMenu
					},
				onAjaxSuccess:function(inHtml){
					$('#' + inJsonStruct.updateElementId).replaceWith(inHtml);
					$('#' + inJsonStruct.updateElementId).trigger('click');
					if(inJsonStruct.postFunction){inJsonStruct.postFunction(inHtml);}
				}
			}
		);
	}
}();