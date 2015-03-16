var path = require('path');
var basePath = path.dirname(require.main.filename);
var fs = require('fs');
//var Connection = require(__dirname + '/connection.js');
var uuid = require(basePath + '/node_modules/node-uuid');
var extend = require(basePath + '/node_modules/node.extend');
var finish = require(basePath + '/node_modules/finish');
var email   = require(basePath + '/node_modules/emailjs/email');


//connection = Connection.getInstance('arf').getConnection();




//model----------------
var Mail = function(inJstruct){
	var options =
		{
			user:false,
			password:false,
			host:false,
			ssl:false,
		}
	options = extend(options, inJstruct);
	var server  = email.server.connect({
		user:    	options.user,
		password:	options.password,
		host:    	options.host,
		ssl:     	options.ssl,
	});

	this.send = function(inJstruct, inPostFunction){
		var sendOptions =
		{
			text:false,
			fromCaption:false,
			to:false,
			cc:false,
			subject:false,
			html:false,
		}
		sendOptions = extend(sendOptions, inJstruct);
		console.log('sendOptions' + sendOptions.fromCaption + '<' + options.user + '>');
		console.dir(sendOptions);
		server.send(
			{
				text:    sendOptions.text,
				from:    sendOptions.fromCaption + ' <' + options.user + '>',
				to:      'someone <' + sendOptions.to + '>',
				cc:      sendOptions.cc,
				subject: sendOptions.subject,
				attachment: 
					[
						{
							data:sendOptions.html,
							alternative:true
						},
						//{path:"path/to/file.zip", type:"application/zip", name:"renamed.zip"}
					]
			}, function(err, message){
					if(inPostFunction){inPostFunction(err, message);}
			}
		);
	}


}

module.exports = Mail;




/*var email   = require("./node_modules/emailjs/email");
var server  = email.server.connect({
   user:    "arfsync@walnutcracker.net", 
   password:"hist0l0gy", 
   host:    "vps.walnutcracker.net", 
   ssl:     false
});

// send the message and get a callback with an error or details of the message that was sent
server.send({
   text:    "i hope this works", 
   from:    "ArfSync RRR <arfsync@walnutcracker.net>", 
   to:      "someone <hopperdevelopment@gmail.com>",
   cc:      "else <else@your-email.com>",
   subject: "testing emailjs",
	attachment: 
	   [
		  {data:"<html>i <i>hope</i><h1>ARFSYNC</h1> this works!</html>", alternative:true},
		  //{path:"path/to/file.zip", type:"application/zip", name:"renamed.zip"}
	   ]
}, function(err, message) { console.log(err || message); });*/