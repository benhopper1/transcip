script(src="/public/js/jquery/hopper/jquery.hopper.extension.dynamictable.js")
dependent on footable :

link(href="/public/js/footable/css/footable.core.css?v=2-0-1" rel="stylesheet" type="text/css")
script(src="/public/js/footable/js/footable.js?v=2-0-1")



$('#dynamicTableDiv').DynamicTable('create',
			{
				fieldHeader:
					[
						{
							caption:'number_1',
							attributes:
								{
									test:'1testValue',
									test2:'1testval2'
								},
							style:'',
						},
						{
							caption:'number_2',
							attributes:
								{
									test:'2testValue',
									test2:'testval2'
								},
							style:'',
						},
						{
							caption:'number_3',
							attributes:
								{
									test:'3testValue',
									test2:'3testval2'
								},
							style:'',
						},
						{
							caption:'number_4',
							attributes:
								{
									'data-toggle':true,
									test:'4testValue',
									test2:'4testval2',
									style:'jj:88;',
									//onClick:'alert("HELLO")',
								},
							style:'',
						},
					],
				class:'footable ui-body-d table-stripe',
				attributes:
					{

					},
				onClick:function(inIndex, inData, inJref){
					alert('onClick' + inIndex + JSON.stringify(inData));
					$('#dynamicTableDiv').DynamicTable('clear');
				}
			}
		);
		//$('#dynamicTableDiv').DynamicTable('test');

		for(i in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]){
		$('#dynamicTableDiv').DynamicTable('addRow', 
			{
				rowArray:
					[
						'1',
						'2',
						'<img src="/public/images/users/02291390-a3fc-11e4-be6b-99ef5cb46bcf.png" height="60px"></img>',
						'4ffffffffffffffff'
					],
				data:{key:i}
			}
		);
		}