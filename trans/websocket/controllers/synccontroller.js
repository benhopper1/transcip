console.log('loading-->----------------------->--  S y n c   C o n t r o l l e r  --<-----------------------');
var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var HashArrayObject = require(basePath + '/libs/hashofarrayobject.js');
var SyncModel = require(basePath + '/models/syncmodel.js');
var syncModel = new SyncModel();


//TODO, think this is unused, try removing all relative parts...

//------------------>--COMMUNICATION--<-------------
var Controller = function(router){
	var currentArrayIndex = 0;

	router.type('transactionToServer', function(inWss, inWs, inTransportLayer){

		if(inTransportLayer.toJson().routingLayer.command == 'contactDataFromSourceForSync'){
			console.log('----------contactDataFromSourceForSync--------------------------------');
			updateModel(0, inWs, inTransportLayer);
		}

		if(inTransportLayer.toJson().routingLayer.command == 'deleteAllDeviceContactsFromDb'){
			console.log('----------deleteAllDeviceContactsFromDb--------------------------------');
			syncModel.deleteAllDeviceContactsFromDb(
				{
					userId:inWs.userId,
					deviceId:inWs.deviceId
				},
					//---when deleted finished transback;
					function(err, rows, fields){
						var TL_replyForClient = inTransportLayer.getTransportLayerOnly();
						TL_replyForClient.addRoutingLayer(
							{
								type:'transactionToClient',
								command:''
							}
						);

						TL_replyForClient.addDataLayer(
							{
								data:{}
							}
						);
						inWs.send(TL_replyForClient.toString());
					}
			);
		}

	});

	var updateModel = function(inIndex, inWs, inTransportLayer){
		if(!(inTransportLayer.toJson().dataLayer.data[inIndex])){
			console.log('Error in updateModel syncController, index' + inIndex + " is null");
		}
		var params = {
			accountType:inTransportLayer.toJson().dataLayer.data[inIndex].accountType, //) ? inTransportLayer.toJson().dataLayer.data[0].accountType : "sssss",
			accountName:inTransportLayer.toJson().dataLayer.data[inIndex].accountName, //) ? inTransportLayer.toJson().dataLayer.data[0].accountType : "sssss",
			contactId:parseInt(inTransportLayer.toJson().dataLayer.data[inIndex].contactId),
			deviceId:parseInt(inWs.deviceId),
			emailAddress:inTransportLayer.toJson().dataLayer.data[inIndex].contactEmailAddress,
			id:parseInt("0" + inTransportLayer.toJson().dataLayer.data[inIndex].id),
			name:inTransportLayer.toJson().dataLayer.data[inIndex].contactName,
			phoneLabel:inTransportLayer.toJson().dataLayer.data[inIndex].phoneLabel,
			phoneNumber:inTransportLayer.toJson().dataLayer.data[inIndex].phoneNumber,
			phonePhotoUri:inTransportLayer.toJson().dataLayer.data[inIndex].phonePhotoUri,
			phoneThumbnailPhotoUri:inTransportLayer.toJson().dataLayer.data[inIndex].phoneThumbnailPhotoUri,
			phoneType:inTransportLayer.toJson().dataLayer.data[inIndex].phoneType,
			rawId:parseInt("0" + inTransportLayer.toJson().dataLayer.data[inIndex].rawId),
			ringTone:inTransportLayer.toJson().dataLayer.data[inIndex].ringTone,
			sourceId:inTransportLayer.toJson().dataLayer.data[inIndex].sourceId,
			starred:parseInt(inTransportLayer.toJson().dataLayer.data[inIndex].starred),
			syncTimeStamp:inTransportLayer.toJson().dataLayer.data[inIndex].syncTimeStamp,
			timesContacted:parseInt(inTransportLayer.toJson().dataLayer.data[inIndex].timesContacted),
			userId:parseInt(inWs.userId)
		}

		syncModel.addDeviceContactToDb(params, function(err, rows, fields){
			console.log('counts:' + inTransportLayer.toJson().dataLayer.data.length + "    ,  " + currentArrayIndex);
			if(++currentArrayIndex < inTransportLayer.toJson().dataLayer.data.length){
				console.log('currentArrayIndex:' +currentArrayIndex );
				updateModel(currentArrayIndex, inWs, inTransportLayer);
			}else{
				console.log('transmiting');
				//return back----------
				var TL_replyForClient = inTransportLayer.getTransportLayerOnly();
				TL_replyForClient.addRoutingLayer(
					{
						type:'transactionToClient',
						command:''
					}
				);

				TL_replyForClient.addDataLayer(
					{
						data:{}
					}
				);
				currentArrayIndex = 0;
				inWs.send(TL_replyForClient.toString());
			}
		});


	}


}

module.exports = Controller;