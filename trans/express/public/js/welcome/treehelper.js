



var createTree = function(){
	var filterObj = new commManager.FilterObject();
	filterObj.add('widget_appFileSystem', function(inMsg, inLocal, inTransportLayer_json, inRefObj){
		console.log('filterObj widget_appFileSystem:')
		//console.dir(inTransportLayer_json);
		if(inTransportLayer_json.dataLayer.action == 'responseFolderContents'){
			console.log('xdataLayer:');
			console.dir(inTransportLayer_json.dataLayer);

			//var node = $('#tree').tree('getRoot');
			var node = findNodeByAbsPath(inTransportLayer_json.dataLayer.data.rqPath);
			for(index in inTransportLayer_json.dataLayer.data.contents){
				console.log('->>' + inTransportLayer_json.dataLayer.data.contents[index].file);
				var xText = inTransportLayer_json.dataLayer.data.contents[index].file;
				addNode(node,
					[
						{
							id:getNewId(),
							text:xText,

							state: (inTransportLayer_json.dataLayer.data.contents[index].type == 'dir' ? 'closed' : false),
							attributes:
								{
									isFolder:(inTransportLayer_json.dataLayer.data.contents[index].type == 'dir' ? true : false),
									absPath:inTransportLayer_json.dataLayer.data.contents[index].absPath,
									byteSize:inTransportLayer_json.dataLayer.data.contents[index].byteSize,
									file:inTransportLayer_json.dataLayer.data.contents[index].file,
									dir:inTransportLayer_json.dataLayer.data.contents[index].dir,
									ext:inTransportLayer_json.dataLayer.data.contents[index].ext
								}
						}
					]
				);
			}
			$('#tree').tree('toggle', node.target);
			$('#tree').tree('toggle', node.target);
		}

		if(inTransportLayer_json.dataLayer.action == 'responseFile'){
			console.log('responseFile:');
			console.dir(inTransportLayer_json.dataLayer.data.domainFilePath);
			var ext = inTransportLayer_json.dataLayer.data.fileExt;
			$("#downloadLink").attr("href", inTransportLayer_json.dataLayer.data.domainFilePath);
			$("#downloadLink").html('<h4>' + inTransportLayer_json.dataLayer.data.domainFilePath + '</h4>')
			if(ext == 'jpg' || ext == 'png'){
				$('#displayDiv').html('<img src="' + inTransportLayer_json.dataLayer.data.domainFilePath + '" width="250px"/>');
			}
		}
	});

	commManager.sendCommand(commManager.getConnectedDeviceTokenId(), 'widget_appFileSystem', 
		{
			action:'getFolderContents',
			path:'/'
		}
	);



		$('#tree').tree(
			{
				data: 
					[
						{
							id:getNewId(),
							text: 'ROOT',
							state: 'open',
							attributes:
								{
									isFolder:true,
									absPath:'/',
									byteSize:'',
									file:'',
									dir:'/',
									ext:''
								}

						},
						{
							//id:getNewId(),
							text: 'Item2',
							children:[{text:'1'}]
						}
					]
			}
		);



		var node = $('#tree').tree('getRoot');
		var nodes = 
		[
			{
				"id":getNewId(),
				"text":"Raspberry"
			},
			{
				"id":getNewId(),
				"text":"Cantaloupe"
			}
		];
	
		$('#tree').tree('append', {
			parent:node.target,
			data:nodes
		});


		//--click of node----------
		$('#tree').tree({
			onClick: function(node){
				console.log('>>' + node.text);
				$('#tree').tree('toggle', node.target);
				/*addNode(node,[{text:'newText' +getNewId()}])*/
				console.log('node data:---------------');
				console.dir(node);
				var childrenCount;
				if(typeof(node.children) !== 'undefined')
					childrenCount = node.children.length;
				else{
					childrenCount = 0;
				}
				console.log('len:' + childrenCount);
				if(childrenCount < 1){
					if(typeof(node.attributes) !== 'undefined'){
						if(node.attributes.isFolder){
							commManager.sendCommand(commManager.getConnectedDeviceTokenId(), 'widget_appFileSystem', 
								{
									action:'getFolderContents',
									path:node.attributes.dir
								}
							);
						}else{
							commManager.sendCommand(commManager.getConnectedDeviceTokenId(), 'widget_appFileSystem', 
								{
									action:'getFile',
									absPath:node.attributes.absPath,
									file:node.attributes.file,
									ext:node.attributes.ext
								}
							);
						}
					}
				}



				//alert(node.attributes.name);  // alert node text property when clicked*/


			}
		});
}

var addNode = function(node, newNode){
	//var node = $('#tree').tree('getSelected');
	if (node){
		$('#tree').tree('append', {
			parent:node.target,
			data: newNode
		});
	}
}



//------------------------------
var global_id = 0;
var getNewId = function(){
	return global_id++;
}

var findNodeByAbsPath = function(inAbsPath){
	var node;
	for(var i = 0; i < global_id; i++){
		node = $('#tree').tree('find', i);
		if(node){
			if(typeof(node.attributes) !== 'undefined'){
				if(node.attributes.isFolder){
					console.log('index:' + i);
					console.log('txt:' + node.attributes.absPath);
					if(node.attributes.absPath == inAbsPath){
						return node;
					}
				}
			}
		}
	}
	
	//$('#tt').tree('select', node.target);
}