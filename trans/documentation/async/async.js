




async.eachSeries(checkedRowsArray, function(theRow, next){
	



	next();

},function(err){
	//=====================================
	// ASYNC DONE
	//=====================================

	_this.importGridRefresh();
	_this.gridSelectLastRow();
	if(inPostFunction){
		inPostFunction(err);
	}
});


