//===========================================================================================
// E X A M P L E
//===========================================================================================

this.getAllPhoneContacts = function(inPostFunction){
		var theArray;
		commManager.sendTransactionSeries(
			{
				command:'getAllPhoneContacts',
				data:
					{
						notUsed:'na'
					},
				onFirst:function(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next){
					console.log("CALBACK onFirst");
					theArray = [];
				},

				onLast:function(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next){
					console.log("CALBACK onLast");
					console.dir(theArray);
				},

				onAll:function(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next){
					console.log("CALBACK onAll");

					if(inDataLayer_json.dataArray){
						for(index in inDataLayer_json.dataArray){
							theArray.push(inDataLayer_json.dataArray[index]);
						}
					}

					next();
				},
				onComplete:function(inTransportLayer_json, inCommand, inTransactionSeriesId, inFrame, inDataLayer_json, next){
					console.log("CALBACK onComplete");
					console.dir(theArray);
					if(inPostFunction){
						inPostFunction(theArray);
					}
				}
			}
		);
	}