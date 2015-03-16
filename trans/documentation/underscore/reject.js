This is opposite of filter


var Underscore = require(basePath + '/node_modules/underscore');

var obj1 = 
	{
		testKey_0:'testValue0',
		testKey_1:'testValue1',
		testKey_2:'testValue2',

		level2:
			{
				testKey_0:'testValue0_l2',
				testKey_1:'testValue1_l2',
			}
	}

var obj2 = 
	{
		testKey_0:'testValue0',
		testKey_1:'testValue1',
		testKey_2:'testValue2',

		level2:
			{
				testKey_0:'testValue0_l2',
				testKey_1:'testValue1_l3',
			}
	}

var i =0;
var result = Underscore.reject(obj1, function(inFirstLayerValue){
	console.log( i++ + '  ' + inFirstLayerValue);
	if(inFirstLayerValue == 'testValue2'){
		//add to result
		return false;
	}else{
		return true;
	}
	
});

console.dir(result);