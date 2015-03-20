var fs = require('fs'),
	path = require('path');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var extend = require(basePath + '/node_modules/node.extend');


var ServerBuild = require(basePath + '/libs/serverbuild/serverbuild.js');
var util = require('util');
//==========================================================
// REPORT ERROR --------------------------------------------
//==========================================================
global.reportError = function(inCaption, inData, inClass){
	styleRedOpen = '\u001b[' + 31 + 'm';styleRedClose = '\u001b[' + 39 + 'm';styleWhiteBgOpen = '\u001b[' + 47 + 'm';styleWhiteBgClose = '\u001b[' + 49 + 'm';
	console.log(styleRedOpen + '===============  REPORT ERROR  =====================================');
	console.log(inCaption + '        CLASS:' + inClass);
	console.log('--------------------------------------------------------------------');
	console.log(util.inspect(inData, false, 7, true));
	console.log(styleRedOpen + '====================================================================' + styleRedClose);
}
global.reportNotify = function(inCaption, inData, inClass){
	//console.log(util.inspect({"FFFFFFFFFFF":'sss',ddd:888}, false, 2, true));
	console.log(util.inspect('===============  REPORT NOTIFY  =====================================', false, 2, true));
	console.log(util.inspect(inCaption + '        CLASS:' + inClass, false, 1, true));
	console.log('---------------------------------------------------------------------');
	console.log(util.inspect(inData, false, 7, true));
	console.log(util.inspect('=====================================================================', false, 2, true));
}
//==========================================================
// REPORT NOTIFICATION -------------------------------------
//==========================================================

console.log('---------------------  TEST APP RUNNING   -------------------------------------');






var createLinks = function(inCreatePublicLinkOptions){
	var createPublicLinkOptions = 
		[
		]
	createPublicLinkOptions = extend(true, createPublicLinkOptions, inCreatePublicLinkOptions);
	for(createPublicLinkOptionsIndex in createPublicLinkOptions){
		if(createPublicLinkOptions[createPublicLinkOptionsIndex].sourcePublicPath == false || createPublicLinkOptions[createPublicLinkOptionsIndex].targetPublicPath == false){
			return false;
		}
		try{
			fs.symlinkSync(createPublicLinkOptions[createPublicLinkOptionsIndex].sourcePublicPath, createPublicLinkOptions[createPublicLinkOptionsIndex].targetPublicPath);
		}catch(e){
			if(e.errno && e.errno == 47){
				global.reportNotify('Already EXIST newserver.createPublicLink',{path:createPublicLinkOptions[createPublicLinkOptionsIndex].targetPublicPath},0);
			}else{
				global.reportError('newserver.createPublicLink error on symlinkSync', 
					{
						error:e,
					}, 0
				);
			}
		}
	}
	global.reportNotify('newserver.createPublicLink DONE',{}, 0);
}

var streamFilesCopy = function(inStreamFileCopyOptions){
	var streamFileCopyOptions = 
		[
			/*
			{
				sourceFile:false,
				targetFile:false,
			},
			*/
		]
	streamFileCopyOptions = extend(true, streamFileCopyOptions, inStreamFileCopyOptions);
	for(streamFileCopyOptionsIndex in streamFileCopyOptions){
		if(streamFileCopyOptions[streamFileCopyOptionsIndex].sourceFile && streamFileCopyOptions[streamFileCopyOptionsIndex].targetFile){
			try{
					fs.createReadStream(streamFileCopyOptions[streamFileCopyOptionsIndex].sourceFile).pipe(fs.createWriteStream(streamFileCopyOptions[streamFileCopyOptionsIndex].targetFile));
			}catch(e){
				if(e.errno && e.errno == 47){
					global.reportNotify('Already EXIST newserver.streamFileCopy',{path:streamFileCopyOptions[streamFileCopyOptionsIndex].targetFile},0);
				}else{
					global.reportError('newserver.streamFileCopy error on streamFileCopy', 
						{
							error:e,
						}, 0
					);
				}
			}
		}
	}
}

var makeFoldersSync = function(inMakeFoldersSyncOptions){
	var makeFoldersSyncOptions = 
		[
			//{target:'myNewPath'},
		];
	makeFoldersSyncOptions = extend(true, makeFoldersSyncOptions, inMakeFoldersSyncOptions);
	for(var makeFoldersSyncOptionsIndex in makeFoldersSyncOptions){
		if(makeFoldersSyncOptions[makeFoldersSyncOptionsIndex].target){
			try{
				fs.mkdirSync(makeFoldersSyncOptions[makeFoldersSyncOptionsIndex].target);
			}catch(e){
				if(e.code == 'EEXIST'){
					global.reportNotify('Already EXIST newserver.makeFoldersSync',{path:makeFoldersSyncOptions[makeFoldersSyncOptionsIndex].target},0);
				}else{
					global.reportError('newserver.streamFileCopy error on streamFileCopy', 
						{
							error:e,
							path:makeFoldersSyncOptions[makeFoldersSyncOptionsIndex].target,
						}, 0
					);
				}
			}
		}
	}
}

makeFoldersSync(
	[
		{
			target:'/home/ben/git_project/transcip/cip/server_1b',
		},
		{
			target:'/home/ben/git_project/transcip/cip/server_1a/express',
		},
		{
			target:'/home/ben/git_project/transcip/cip/server_1b/express/tryThis',
		},
	]
);







/*
createPublicLink(
	[
		{
			sourcePublicPath:'/home/ben/git_project/transcip/trans/express/models',
			targetPublicPath:'/home/ben/git_project/transcip/cip/server_0/express/models',
		},
		{
			sourcePublicPath:'/home/ben/git_project/transcip/trans/express/controllers',
			targetPublicPath:'/home/ben/git_project/transcip/cip/server_0/express/controllers',
		},
		{
			sourcePublicPath:'/home/ben/git_project/transcip/trans/express/library',
			targetPublicPath:'/home/ben/git_project/transcip/cip/server_0/express/library',
		},
		{
			sourcePublicPath:'/home/ben/git_project/transcip/trans/express/node_modules',
			targetPublicPath:'/home/ben/git_project/transcip/cip/server_0/express/node_modules',
		},
		{
			sourcePublicPath:'/home/ben/git_project/transcip/trans/express/views',
			targetPublicPath:'/home/ben/git_project/transcip/cip/server_0/express/views',
		},
		{
			sourcePublicPath:'/home/ben/git_project/transcip/trans/express/public',
			targetPublicPath:'/home/ben/git_project/transcip/cip/server_0/express/public',
		},
		{
			sourcePublicPath:'/home/ben/git_project/transcip/trans/express/app.js',
			targetPublicPath:'/home/ben/git_project/transcip/cip/server_0/express/app.js',
		},
		{
			sourcePublicPath:'/home/ben/git_project/transcip/trans/express/purchase.log',
			targetPublicPath:'/home/ben/git_project/transcip/cip/server_0/express/purchase.log',
		},
	]
);


*/

/*

streamFilesCopy(
	[
		{
			sourceFile:'/home/ben/git_project/transcip/trans/express/main.conf',
			targetFile:'/home/ben/git_project/transcip/cip/server_0/express/main.conf',
		},
	]
);

*/






/*var myarray = [30, 2, 1, 9, 15];
myarray.sort(function(a, b){return a - b});
console.log(myarray)




function findMissing(arr, start, stop) {

	var current = start,
		next = stop,
		collector = new Array();

	function parseMissing(a, key) {
		if(key+1 == a.length) return;

		current = a[key];
		next = a[key + 1];

		if(next - current !== 1) {
			collector.push(current + 1);
			// insert current+1 at key+1
			a = a.slice( 0, key+1 ).concat( current+1 ).concat( a.slice( key +1 ) );
			return parseMissing(a, key+1);
		}

		return parseMissing(a, key+1);
	}

	parseMissing(arr, 0);
	return collector;
}




var missingArr = findMissing([2,2,4, 18]);

console.dir(missingArr);

*/







//console.log(ServerBuild.serverBuildNameToServerName('server_2')); //pass

//console.log(ServerBuild.serverBuildNameToServerNumber('server_66'));//pass



//console.log(ServerBuild.ServerNumberToServerName(205));//pass
//console.log(ServerBuild.ServerNumberToServerBuildName(33));//pass
/*console.log(ServerBuild.ServerNameToServerBuildName('Server_ws_30405'));
console.log(ServerBuild.ServerNameToServerNumber('Server_ex_30415'));
*/

/*var serverBuild = new ServerBuild(
	{
		serverNumber:0,
		serverIp:'192.168.0.16',
	}
);*/
/*var sum = 0;
var arr = [0,1,2,4,9];
for(var i = 0; i < arr.length; i++) {
	if (arr[i] == 0) {
		 idx = i; 
	} else {
		 sum += arr[i];
	}
}
console.log(((arr.length + 1) * arr.length / 2)- sum);
*/
/*console.log('serverBuild.getRequestScore:' + function(){
	return Math.floor(Math.random() * (1000 - 5)) + 5;
}());*/
//console.log('serverBuild.getProcessingScore:' + serverBuild.getProcessingScore());
/*int sum = 0;
//int idx = -1;
for (int i = 0; i < arr.length; i++) {
	if (arr[i] == 0) {
		 //idx = i; 
	} else {
		 sum += arr[i];
	}
}
console.log(((arr.length + 1) * arr.length / 2)- sum);*/

/*// the total sum of numbers between 1 and arr.length.
int total = (arr.length + 1) * arr.length / 2;

System.out.println("missing number is: " + (total - sum) + " at index " + idx);

*/