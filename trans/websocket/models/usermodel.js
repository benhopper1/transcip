console.log('=====================================================================================');
console.log('------------------------------  USER MODEL ------------------------------------------');
console.log('=====================================================================================');

var path = require('path');
var basePath = path.dirname(require.main.filename);
var Connection = require(__dirname + '/connection.js');
var extend = require(basePath + '/node_modules/node.extend');
//model----------------


//==================================================================
//--  USER MODEL  --------------------------------------------------
//==================================================================
var Model = function(){
	connection = Connection.getInstance('arf').getConnection();
	var _this = this;



	//==================================================================
	//--  USER EXIST RETURN PASSWORD  (special case) -------------------
	//==================================================================
	this.userExistRetPass = function(inUserName, inPostFunction){
		connection = Connection.getInstance('arf').getConnection();
		var sqlString = "SELECT password from tb_user WHERE userName = "+ connection.escape(inUserName) + " AND active = 1" + " ";
		connection.query(sqlString, function(err, rows, fields){
			var theRecord = {};
			if(rows.length > 0){
				theRecord = rows[0];
			}else{
				theRecord = rows;
			}
			if(inPostFunction){inPostFunction(err, theRecord);}
		});
	}
}

Model.getInstance = function(){return new Model();}
module.exports = Model;