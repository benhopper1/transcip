commManager.transactionToDeviceToken(
	{
		routing:
			{
				command:'webMenu',
				action:'openContactsMenu'
			},
		data:
			{
				url:"/webmenu/contactsmenu"
			},

		onComplete:function(inDataLayer, inTransportLayer){
			console.log('onComplete transactionToDeviceToken call back entered');
		}
	}
);