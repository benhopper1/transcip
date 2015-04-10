var path = require('path');
var basePath = '..' + path.dirname(require.main.filename);
var mySql = require('../node_modules/mysql');
var fs = require('fs');
var readline = require('readline');

var configData = fs.readFileSync('../cip.conf', 'utf8');
configData = JSON.parse(configData);

var mySqlConnection = mySql.createConnection({
		host     : configData.mysqlServerConnection.host,
		user     : configData.mysqlServerConnection.user,
		password : configData.mysqlServerConnection.password,
		database : configData.mysqlServerConnection.database
});



var theFileName = process.argv[2];
console.log('fileName:' + theFileName);
/*
var theFile = fs.readFileSync(theFileName, 'utf8');
console.dir(theFile);
*/

var rd = readline.createInterface({
	input: fs.createReadStream(theFileName),
	output: process.stdout,
	terminal: false,
});

rd.on('line', function(line) {
	console.log('--------------------------------');
    console.log(line);
 	var jStruct = JSON.parse(line);
 	console.log('LABEL:' + jStruct.label);
 	console.log('KEYS:' + Object.keys(jStruct).toString());



	var fields = 
		{
			data:JSON.stringify(jStruct.data),
			label:jStruct.label,
			level:'na',
			objectKey:Object.keys(jStruct).toString(),
			objectValue:'na',
			server:'test_server',
			type:'common',
			when:jStruct.when,
		}


	var buff = new Buffer(JSON.stringify({"hello":"world"})).toString("base64");



	var sqlString = 
		"INSERT INTO tb_debugLog" + " " +
			"(data, label, level, objectKey, objectValue, server, type, whenEntry)" + " " +
				"VALUES(" 											+ " "  +
					mySqlConnection.escape(fields.data) 			+ ", " +
					mySqlConnection.escape(fields.label) 			+ ", " +
					mySqlConnection.escape(fields.level) 			+ ", " +
					mySqlConnection.escape(fields.objectKey)		+ ", " +
					mySqlConnection.escape(fields.objectValue)		+ ", " +
					mySqlConnection.escape(fields.server) 			+ ", " +
					mySqlConnection.escape(fields.type) 			+ ", " +
					mySqlConnection.escape(fields.when) 			+ " " +
				")"
	;

	console.log('SQL:' + sqlString);
	mySqlConnection.query(sqlString, function(err, rows, fields){
			// nothing to do here
			console.dir(err);
	});




});