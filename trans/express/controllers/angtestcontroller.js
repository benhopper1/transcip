var path = require('path');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
configData = JSON.parse(configData);

module.exports.controller = function(app){
	app.get('/angtestSession', function(req, res){
		console.dir(req.session);
		req.session.user = 
			{
				test0:'test0value',
				test1:'test1value',
			}
		res.end();
	});

	app.get('/angtest', function(req, res){
		console.log("/angtest");
		console.log('session');
		console.dir(req.session);
		/*req.session.user = 
			{
				test0:'test0value',
				test1:'test1value',
			}
		;*/
		res.locals.user = 'billy';
		res.render('angtest/angtest.jade',
			{
				body:req.body,
				//req:req,
				test:'ben'
			}
		);
	});

	app.post('/angtest', function(req, res){
		console.log("/angtest POST");
		res.render('angtest/angtest.jade',{});
	});

	var counter = 0;
	app.post('/testrest', function(req, res){
		console.log("/testrest post");
		console.dir(req.body);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(
			{
				testKey:'testValue', 
				newName:req.body.contactName,
				body:req.body
			}
		));
	});


	app.get('/testrest', function(req, res){
		console.log("/testrest get");
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(
			{
				testKey:'testValue',
				body:req.body
			}
		));
		//res.end(JSON.stringify({testKey:'testValue',}));
	});

	app.get('/getFiles', function(req, res){
		console.log("/getFiles get");
		console.log('req.query' + req.query);
		console.dir(req.query);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(

				[
					{
						type:'file',
						dir:'someDir2',
						file:'someFile0.txt',
						ext:'.txt'
					},
					{
						type:'dir',
						dir:'someDir2',
						file:'directoryName',
						ext:''
					}
				]

		));
	});
}