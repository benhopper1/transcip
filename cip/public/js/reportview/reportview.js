var ReportView = function(inParams){
	var _this = this;
	var rowSize = 0;
	var params = 
		{
			columnPositions:[0,25,50,75,100,125,150,175,200,225,250,275,300,650,700,750,800,850,900,950,1000,1050,1100,1150,1200,1250,1300,1350,1400,1450,1500,1550,1600,1650,1700,1750,1800,1850,1900,1950,2000,2050,2100,2150,2200,2250,2300,2350,2400,2450,2500,2550,2600,2650,2700,2750,2800,2850,2900,2950,3000,3050,3100,3150],
			rowSizes:[10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
			fontSize:'10px',
			bold:false,
			font:'Arial',
			fontStyle:'normal',
			fontWeight:'normal',
			elementId:false,
			lineSpace:0,
			width:300


		}
	params = $.extend(params, inParams);

	var childDivHash = {};
	var lastRow = -1;
	var lastColumn = -1;
	var rowSizeHash = {};
	
	this.addTextArea = function(inAddParams){
		var addParams = 
			{
				column:0,
				row:(inAddParams.column && inAddParams.column != 0) ? lastRow : lastRow + 1,
				font:'Arial',
				fontSize:false,
				fontColor:'black',
				fontStyle:'normal',
				fontWeight:'normal',
				text:false,
				bold:false,
				italic:false,
				justify:'left',
				rows:5,
				columns:20

			}
		addParams = $.extend(addParams, inAddParams);
		addParams.column = (addParams.column == -1) ? 0:addParams.column;
		addParams.row = (addParams.row == -1) ? 0:addParams.row;
		lastColumn = addParams.column;
		lastRow = addParams.row;

		//- create new div
		var newId = params.elementId + '_' + addParams.column + '_' + addParams.row;
		childDivHash[newId] = jQuery('<textarea/>',
			{
				id: newId,
				text: addParams.text,
				rows:addParams.rows,
				cols:addParams.columns,
				style:	'position 	: absolute' 															+ ';' 	+ ' ' + 
						'left		:' 	+ params.columnPositions[addParams.column] 							+ ';' 	+ ' ' + 
						'width		:' 	+ params.width							 							+ ';' 	+ ' ' + 
						'top		:' 	+ _this.getRowPosition([addParams.row])								+ 'px;' + ' ' + 
						'font-size	:' 	+ params.rowSizes[addParams.row]									+ ';' 	+ ' ' + 
						'font-family:' 	+ params.font 														+ ';' 	+ ' ' + 
						//'rows:' 		+ params.rows 														+ ';' 	+ ' ' + 
						//'cols:' 		+ params.columns 													+ ';' 	+ ' ' + 
						//'vertical-align: middle'															+ ';' 	+ ' ' + 
						'font-weight :'	+ addParams.fontWeight												+ ';' 	+ ' ' + 
						'font-style :' 	+ addParams.fontStyle 												+ ';' 	+ ' '

				,	

			}
		);
		_this.redraw();
		
	}

	this.add = function(inAddParams){
		var addParams = 
			{
				column:0,
				row:(inAddParams.column && inAddParams.column != 0) ? lastRow : lastRow + 1,
				font:'Arial',
				fontSize:false,
				fontColor:'black',
				fontStyle:'normal',
				fontWeight:'normal',
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

		//- create new div
		var newId = params.elementId + '_' + addParams.column + '_' + addParams.row;

		_this.adjustRowSize(addParams.row,((addParams.fontSize) ? addParams.fontSize : params.fontSize));
		console.log('positRow:' +addParams.row + ':' +  _this.getRowPosition([addParams.row]));
		childDivHash[newId] = jQuery('<text/>',
			{
				id: newId,
				text: addParams.text,
				style:	'position 	: absolute' 															+ ';' 	+ ' ' + 
						'left		:' + params.columnPositions[addParams.column] 							+ ';' 	+ ' ' + 
						'width		:' + params.width							 							+ ';' 	+ ' ' + 
						'top		:' + _this.getRowPosition([addParams.row])								+ 'px;' + ' ' + 
						'font-size	:' + params.rowSizes[addParams.row]										+ ';' 	+ ' ' + 
						'font-family:' + params.font 														+ ';' 	+ ' ' + 
						'vertical-align: middle'															+ ';' 	+ ' ' + 
						'font-weight :'	+ addParams.fontWeight													+ ';' 	+ ' ' + 
						'font-style :' + addParams.fontStyle 													+ ';' 	+ ' '

				,	

			}
		);
		_this.redraw();
	}

	this.getRowSize = function(inRow){
		return rowSizes[inRow];
	}

	this.adjustRowSize = function(inRow, inTestSize){
		inTestSize = parseInt(inTestSize);
		console.log('adjustRowSize exist/test :' + params.rowSizes[inRow] + '   ' + inTestSize);
		if(inTestSize > params.rowSizes[inRow]){
			params.rowSizes[inRow] = inTestSize;
			console.dir(params.rowSizes);
			
		}
	}

	this.redraw = function(){
		$('#' + params.elementId).html();
		for(childDivHashIndex in childDivHash){
			$(childDivHash[childDivHashIndex]).html($(childDivHash[childDivHashIndex]).text());
			$('#' + params.elementId).append(childDivHash[childDivHashIndex]);

		}

	}

	this.getMinRowSize = function(){
		return Math.min(params.rowSizes);
	}

	this.getMaxRowSize = function(){}

	this.getRowPosition = function(inRowNumber){
		if(inRowNumber > params.rowSizes.length){
			var needCount = inRowNumber - params.rowSizes.length;
			var minSize = _this.getMinRowSize();
			for(var index = 0; index < needCount; index++){
				params.rowSizes.push(minSize);
			}
		}

		var calcLen = 0;
		for(var i = 0; i < inRowNumber ; i++){
			calcLen = calcLen + params.rowSizes[i] + params.lineSpace;
		}
		return calcLen;

	}

	this.addText = function(inRow, inCol, inText, inWeight, inStyle){
		var find = ' ';
		var re = new RegExp(find, 'g');
		inText = inText.replace(re, '&nbsp;');
		_this.add(
			{
				text:inText,
				column:inCol,
				row:inRow,
				fontWeight:inWeight,
				fontStyle:inStyle
			}
		);
	}

	/*this.addTextArea = function(inRow, inCol, inText, inMaxLineWidthCap, inWeight, inStyle){
		
		_this._addTextArea(
			{
				text:_this.newLineInfo(inText, inMaxLineWidthCap),
				column:inCol,
				row:inRow,
				fontWeight:inWeight,
				fontStyle:inStyle,
				textArray:_this.newLineInfo(inText, inMaxLineWidthCap)
			}
		);
	}*/

	this.setRowFontSize = function(inRow, inFontSize){
		params.rowSizes[inRow] = inFontSize;
	}

	this.formatAsCurrency = function(inValue){
		return '$' + inValue;
	}

	this.setLineSpace = function(inValue){
		params.lineSpace = inValue;
		//_this.getRowPosition(100);
		_this.redraw();

	}

	this.newLineInfo = function(inText, inMaxLineWidthCap){
		var fString = /\n/;
		var lines = inText.split(fString);
		var resultLines = [];

		for(var lineIndex in lines){
			while(lines[lineIndex].length > inMaxLineWidthCap ){
				var tmpLine = lines[lineIndex].substring(0, inMaxLineWidthCap );
				lines[lineIndex] = lines[lineIndex].substring(inMaxLineWidthCap, lines[lineIndex].length );
				resultLines.push(tmpLine);
			}
			resultLines.push(lines[lineIndex]);
		}

		var finalString = '';
		for(var theIndex in resultLines){
			finalString = finalString + resultLines[theIndex] + '\n';
		}

		return finalString;
	}




}
