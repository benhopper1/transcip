var ReportView = function(inParams){
	var params = 
		{
			columnPositions:[0,50,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850,900,950,1000,1050,1100,1150,1200,1250,1300,1350,1400,1450,1500,1550,1600,1650,1700,1750,1800,1850,1900,1950,2000,2050,2100,2150,2200,2250,2300,2350,2400,2450,2500,2550,2600,2650,2700,2750,2800,2850,2900,2950,3000,3050,3100,3150],
			rowPositions:[0,50,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850,900,950,1000,1050,1100,1150,1200,1250,1300,1350,1400,1450,1500,1550,1600,1650,1700,1750,1800,1850,1900,1950,2000,2050,2100,2150,2200,2250,2300,2350,2400,2450,2500,2550,2600,2650,2700,2750,2800,2850,2900,2950,3000,3050,3100,3150],
			fontSize:'20px',
			bold:false,
			font:'Arial',
			canvasId:false


		}
	params = $.extend(params, inParams);

	params.rowPositions[0] = parseInt(params.fontSize);

	var canvas;
	var context;
	if(params.canvasId){
		canvas = document.getElementById(params.canvasId);
		context = canvas.getContext("2d");
	}
	var lastRow = -1;
	var lastColumn = -1;


	this.add = function(inAddParams){
		var addParams = 
		{
			column:0,
			row:(inAddParams.column && inAddParams.column != 0) ? lastRow : lastRow + 1,
			font:'Arial',
			fontSize:'20px',
			fontColor:'black',
			text:false,
			bold:false,
			italic:false,
			justify:'left',
		}
		addParams = $.extend(addParams, inAddParams);
		addParams.column = (addParams.column == -1) ? 0:addParams.column;
		addParams.row = (addParams.row == -1) ? 0:addParams.row;
		lastColumn = addParams.column;
		lastRow = addParams.row;
		if(addParams.text){
			context.fillStyle = addParams.fontColor;
			context.font = ((addParams.bold) ? 'bold' : '') + ' ' + addParams.fontSize + ' ' + addParams.font;
			context.fillText(addParams.text, params.columnPositions[addParams.column], params.rowPositions[addParams.row]);
			//context.fillText("Bebbbo", 200, 100);
		}

	}
}