console.log('security model loading....');
var Connection = require(__dirname + '/connection.js');
var connection = false;

//instance:NO
var Model = function(){

}

//----static-------
Model.verify = function(inData){
	console.log('-----------verify------------------');
	console.dir(inData);
	if(!(connection)){connection = Connection.getInstance('arf').getConnection();}

	if(!(connection)){
		console.log('error on db connection in static SecurityModel.verify !!!!');
	}

	if(!(Model.tokenIsValid(inData.transportLayer.securityToken))){
		console.log('Security token Bad in static SecurityModel.verify!!!!!!!!!!!!!');
	}

	var sqlString = "SELECT id FROM tb_user WHERE userName = "+ connection.escape(inData.dataLayer.userName) + " AND password =" + connection.escape(inData.dataLayer.password);
	connection.query(sqlString, function(err, rows, fields){
		console.log('error:');
		console.dir(err);
		if(rows.length < 1){
			// not valid user && pass
			if(inData.onInvalid){
				console.log('userInvalid');
				var information = "userInvalid";
				inData.onInvalid(err, inData.transportLayer, information);
			}
		}else{
			//force userId
			console.log('userId:');
			console.log('userId:' + rows[0]['id'].toString());
			console.dir(rows);
			inData.transportLayer.userId = rows[0]['id'].toString();
			// valid
			// check deviceId for exist maybe create new
			console.log('device test(dev, user)' + inData.transportLayer.deviceId + "," + inData.transportLayer.userId);
			var sqlString = "SELECT id FROM tb_userDeviceList WHERE id = "+ connection.escape(inData.transportLayer.deviceId) + " AND userId = " + connection.escape(inData.transportLayer.userId);
			connection.query(sqlString, function(err, rows, fields){
				if(rows.length < 1){
					//device does not exist for user, create new devid
					console.log('device does not exist for user, create new devid');
					var sqlString = "INSERT INTO tb_userDeviceList (userId, deviceNumber, deviceTypeId, userAgent, deviceType) VALUES("+ connection.escape(inData.transportLayer.userId) + ", "+ connection.escape(inData.dataLayer.deviceNumber) + ", "+ connection.escape("4") + ", "+ connection.escape(inData.dataLayer.userAgent) + ", "+ connection.escape(inData.dataLayer.deviceType) + "); ";
					connection.query(sqlString, function(err, result){
						console.dir(err);
						console.log('newDevId:' + result.insertId);
						if(inData.onDone){
							var information = "newDeviceIdCreated";
							inData.onDone(err, inData.transportLayer, information, result.insertId.toString());
						}
					});
					return;
				}
				//everything checks good
				if(inData.onDone){
					console.log('dataCheckedGood');
					var information = "dataCheckedGood";
					inData.onDone(err, inData.transportLayer, information, false);
				}

			});

		}

	});


}

Model.tokenIsValid = function(){
	//TODO: implement something here...
	return true;
}





module.exports = Model;