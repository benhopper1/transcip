//=======================================================================================================================================================
// Dynamic Table ------------------------------------------------------------------------------------------------------------------------------------
//=======================================================================================================================================================

var DynamicTable = function(inJrefOfThis, inJsonStruct){
	var _this = this;
	var theDivRef;
	var dataHashByRowId = {};
	var tableId;
	var options = 
		{
			id:((inJrefOfThis).attr('id'))? (inJrefOfThis).attr('id') + '_table' : new Date().getTime() + '_table',
			style:'',
			class:'',
			fieldHeader:[],
			attributes:{},
			onClick:false,
		}
	options = $.extend(options, inJsonStruct);
	theDivRef = options.divRef;
	var columnCount = 0;
	var rowCount = 0;

	this.test = function(){
		alert('DynamicTable TEST');
	}

	options.attributes['id'] = options.id;

	var createHtmlContainer = function(){
		var tableDiv =  $('<table></table>').attr(options.attributes)
		.addClass(options.class)
		;
		$(inJrefOfThis).append(tableDiv);

		tableId = $(tableDiv).attr('id');

		var theadDiv = $('<thead></thead>').attr({});
		var trDiv = $('<tr></tr>').attr({});
		$(theadDiv).append(trDiv);




		for(var fieldHeaderIndex in options.fieldHeader){
			var thDiv =  $('<th></th>').attr(options.fieldHeader[fieldHeaderIndex].attributes);
			$(trDiv).append($(thDiv).html(options.fieldHeader[fieldHeaderIndex].caption));
			columnCount++;
		}

		$(tableDiv).html(theadDiv);
		$(tableDiv).append('<tbody id="' + options.id + '_tbody' + '" style=""></tbody>');

	}

	this.getTableId = function(){
		return tableId;
	}




	createHtmlContainer();
	console.log('createHtmlContainer loaded');

	this.addRowTop = function(inJsonStruct){
		var inRowData = [];
		inRowData = $.extend(inRowData, inJsonStruct.rowArray);
		var theData = {}
		theData = $.extend(theData, inJsonStruct.data);

		var resultString;
		for(var inRowDataIndex in inRowData){
			resultString += '<td>' + inRowData[inRowDataIndex] + '</td>';
		}

		var rowId = options.id + '_row_' + rowCount;
		var theRow = '<tr id="' + rowId + '" index="' + rowCount + '">' + resultString +	'</tr>';
		$('#' + options.id + '_tbody').prepend(theRow);

		dataHashByRowId[rowId] = theData;
		$('#' + rowId ).click(function(){
			if(options.onClick){
				options.onClick($(this).attr('index'), dataHashByRowId[$(this).attr('id')], $(this));
			}
		});
		//$('#' + rowId ).table( "refresh" );
		rowCount++;
		//$('.footable').trigger('footable_redraw');
		$( "table#table-reflow tbody" ).closest( "table#table-reflow" )
            .table( "refresh" ).trigger( "create" );
	}



	this.addRow = function(inJsonStruct){
		var inRowData = [];
		inRowData = $.extend(inRowData, inJsonStruct.rowArray);
		var theData = {}
		theData = $.extend(theData, inJsonStruct.data);

		var resultString;
		for(var inRowDataIndex in inRowData){
			resultString += '<td>' + inRowData[inRowDataIndex] + '</td>';
		}

		var rowId = options.id + '_row_' + rowCount;
		var theRow = '<tr id="' + rowId + '" index="' + rowCount + '">' + resultString +	'</tr>';
		$('#' + options.id + '_tbody').append(theRow);

		dataHashByRowId[rowId] = theData;
		$('#' + rowId ).click(function(){
			if(options.onClick){
				options.onClick($(this).attr('index'), dataHashByRowId[$(this).attr('id')], $(this));
			}
		});
		//$('#' + rowId ).table( "refresh" );
		rowCount++;
		//$('.footable').trigger('footable_redraw');
		$( "table#table-reflow tbody" ).closest( "table#table-reflow" )
            .table( "refresh" ).trigger( "create" );
	}

	this.clear = function(){
		$('#' + options.id + '_tbody').children().each(function(){
			$(this).remove();
		});

		dataHashByRowId = {};
	}






}

$.fn.DynamicTable = function(inAction, inJsonStruct){
	var dynamicTable = $(this).data("dynamicTableInstance");

	if(!(dynamicTable) || inAction == 'create'){
		inJsonStruct['divRef'] = $(this);
		console.log('dynamicTable CREATED');
		var dynamicTable = new DynamicTable($(this), inJsonStruct);
		$(this).data("dynamicTableInstance", dynamicTable);
		return ;
	}
	if(inAction == 'test'){
		dynamicTable.test();
	}

	if(inAction == 'addRow'){
		return dynamicTable.addRow(inJsonStruct);
	}

	if(inAction == 'addRowTop'){
		return dynamicTable.addRowTop(inJsonStruct);
	}

	if(inAction == 'getTableId'){
		return dynamicTable.getTableId(inJsonStruct);
	}
	/*if(inAction == 'save'){
		return dynamicTable.save(inJsonStruct);
	}*/

	if(inAction == 'clear'){
		return dynamicTable.clear();
	}
}