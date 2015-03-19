
var TransportLayer = function(){
	var _this = this;
	var messageString;
	var message_json ={};
	var routingLayer = new RoutingLayer();
	var dataLayer = new DataLayer();
	

	this.merge = function(inJson){
		message_json = $.extend(message_json, inJson);
	}

	this.fromServerBuild = function(inMessageString){
		messageString = inMessageString;
		message_json = JSON.parse(messageString);

		if(message_json['routingLayer']){
			routingLayer.buildFromJson(message_json['routingLayer']);
		}

		if(message_json['dataLayer']){
			dataLayer.buildFromJson(message_json['dataLayer']);
		}


		return message_json;
	}

	this.toServerBuild = function(inUserId, inDeviceId, inSecurityToken, inTransactionId){
		message_json = 
			{
				userId:inUserId,
				deviceId:inDeviceId,
				securityToken:inSecurityToken,
				transactionId:inTransactionId
			}
	}

	this.addDataLayer = function(inDataLayer){
		message_json.dataLayer = inDataLayer;
	}

	this.addRoutingLayer = function(inRoutingLayer){
		message_json.routingLayer = inRoutingLayer;
	}

	this.append = function(inData){
		//message_json.concat(inData);
		message_json = $.extend(true, {}, message_json, inData);
	}

	this.toString = function(){
		return JSON.stringify(_this.toJson());
	}

	this.toJson = function(){
		message_json['routingLayer'] = routingLayer.toJson();
		message_json['dataLayer'] = dataLayer.toJson();
		return message_json;
	}

	this.dump = function(){
		console.dir(message_json);
	}

	this.add = function(inKey, inValue){
		message_json[inKey] = inValue;
		return this
	}

	this.userId = function(inValue){
		message_json['userId'] = inValue;
		return this;
	}
	this.deviceId = function(inValue){
		message_json['deviceId'] = inValue;
		return this;
	}
	this.securityToken = function(inValue){
		message_json['securityToken'] = inValue;
		return this;
	}
	this.transactionId = function(inValue){
		message_json['transactionId'] = inValue;
		return this;
	}

	this.routingLayer = function(){
		return routingLayer;
	}

	this.dataLayer = function(){
		return dataLayer;
	}

}


/*############################################################################################################
  ------------------------------------------->--  Routing Layer  --<-------------------------------------------
  ###########################################################################################################*/
var RoutingLayer = function(){
	var routing_json = {};

	this.buildFromJson = function(inJson){
		routing_json = inJson;
	}

	this.merge = function(inJson){
		routing_json = $.extend(routing_json, inJson);
	}

	this.add = function(inKey, inValue){
		routing_json[inKey] = inValue;
		return this;
	}

	this.type = function(inValue){
		routing_json['type'] = inValue;
		return this;
	}

	this.filterKey = function(inValue){
		routing_json['filterKey'] = inValue;
		return this;
	}

	this.filterValue = function(inValue){
		routing_json['filterValue'] = inValue;
		return this;
	}

	this.toDeviceId = function(inValue){
		routing_json['toDeviceId'] = inValue;
		return this;
	}

	this.toString = function(){
		return JSON.stringify(routing_json);
	}

	this.toJson = function(){
		return routing_json;
	}

	this.clean = function(){
		routing_json = {};
		return this;
	}
}



/*############################################################################################################
  ------------------------------------------->--  Data Layer  --<-------------------------------------------
  ###########################################################################################################*/
var DataLayer = function(){
	var data_json = {};

	this.merge = function(inJson){
		data_json = $.extend(data_json, inJson);
	}

	this.buildFromJson = function(inJson){
		data_json = inJson;
	}

	this.add = function(inKey, inValue){
		data_json[inKey] = inValue;
		return this;
	}

	this.toString = function(){
		return JSON.stringify(data_json);
	}

	this.toJson = function(){
		return data_json;
	}
}


