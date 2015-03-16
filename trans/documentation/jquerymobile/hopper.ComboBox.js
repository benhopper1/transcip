$('#contactModeSelect').ComboBox('create',
		{
			id:'selectSaveMode',
			optionClass:'',
			usePopup:true,
			optionArray:
				[
					{
						caption:'Edit Selected Value',
						value:'edit'
					},
					{
						caption:'Create New Contact',
						value:'insert',
					},

				],
			onChange:function(inIndex, inCaption, inValue, inJref){
			},
			onSelect:function(inIndex, inCaption, inValue, inJref){
				$('#contactsWindow').DataBinderObject('setMode', inValue);
			},
		}
	);
$('#contactModeSelect').ComboBox('changeCaption', {index:0,caption:'boy77'});
$('#contactModeSelect').ComboBox('selectByIndex', 10);
------------------------------------------------------------
$('#contactModeSelect').ComboBox('getSelected')
Object
	caption: " choose_1"
	index: 1
	jRef: m.fn.init[1]
	value: "myValue_1"
-----------------------------------------------------------