console.log('======================================================================================');
console.log(' --> EVENT ORIGIN <-- ');
console.log('======================================================================================');



//###################################### OBJECT ###############################################
//--------------------- > E v e n t   O b j e c t < -----------------------------------
//#############################################################################################
var EventOrigin = function(){
	var _this = this;

	var hashOfArray = new HashOfArrayObject_v002(false);

	this.setOn = function(inEventKey, inPostFunction){
		hashOfArray.add(inEventKey, inPostFunction);
	}

	this.reportOn = function(inEventKey, inData){
		var theArray = hashOfArray.getArrayFromHash(inEventKey);
		for(index in theArray){
			if(theArray[index]){
				theArray[index](inData);
			}
		}
	}

	this.dump = function(){
		hashOfArray.dump();
	}

}



