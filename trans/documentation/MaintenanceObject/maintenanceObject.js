
D O C U M E N T --------------------

MaintenanceObject


var MaintenanceObject = require(basePath + '/libs/maintenance/maintenanceobject.js');
var maintenanceObject = new MaintenanceObject(
	{
		label:'TESTING MAINTENANCE v.000',
		when:
			{
				//dayOfWeek:MaintenanceObject.range(0, 6),
				//hour:MaintenanceObject.range(0, 24),
				//minute:MaintenanceObject.range(0, 60),
				second: MaintenanceObject.range(0, 60, 5),
			},
	}
);

var funcId = maintenanceObject.add(function(inSS, inS){
	console.log('---------------------------------------');
	console.log('m object call back ENTERED');
	console.dir(inS);
})

maintenanceObject.start();