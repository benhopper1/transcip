var getClassArray = function(inId){
	var myClass = $('#' + inId).attr("class");
	alert(JSON.stringify(myClass));
}

//---OVERRIDE JQUERY ADD CLASS --------------------------------------------------------------------------------------------------
(function(){
		// Your base, I'm in it!
			var originalAddClassMethod = jQuery.fn.addClass;

			jQuery.fn.addClass = function(){
			// Execute the original method.
			var result = originalAddClassMethod.apply( this, arguments );

			// call your function
			// this gets called everytime you use the addClass method
			//myfunction();
			console.log('class change!!');
			//console.dir(arguments);
			console.log('lastOpenedPanel');
			console.dir(lastOpenedPanel);

			if(arguments[0] == 'mm-subopened'){
				//alert('open')
			}
			if(arguments[0] == 'mm-subclose'){
				//alert('close')
			}

			// return the original result

			return result;
			}
		})();