var fs = require('fs'),
	path = require('path');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var extend = require(basePath + '/node_modules/node.extend');


var ServerBuild = require(basePath + '/libs/serverbuild/serverbuild.js');






var myarray = [30, 2, 1, 9, 15];
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