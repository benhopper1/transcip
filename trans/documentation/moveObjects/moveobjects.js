		//script has to be in body
		script(src="/public/js/move/move.js")

		var MovingObject = new function(){
			var _this = this;

			var screenCenterX = Math.floor(window.innerWidth/2);
			var screenCenterY = Math.floor(window.innerHeight/2);
			var screenX = window.innerWidth;
			var screenY = window.innerHeight;

			var phoneCenterX;
			var phoneCenterY;
			var phoneCenterZ;

			var xUnit = Math.floor(screenX/50);

			var oldX = 0;

			this.refresh = function(inPhoneX, inPhoneY, inPhoneZ){
				var phoneDiffFromPhoneMarkCenter =   phoneCenterX - inPhoneX;
				//var newX = parseInt(screenCenterX - (phoneDiffFromPhoneMarkCenter * xUnit));
				var newX = parseInt((phoneDiffFromPhoneMarkCenter * xUnit));
				console.log('refresh newX:' + newX);
				//$('#downloaddiv').attr('left', newX);
				//if(newX > 0 && newX < (screenX + 1)){
					//$('#msgMemberImg_001').animate({'left':newX.toString()+'px'}, 100);
					//$('#tab_export').trigger('refresh');
					//$('#moveObj').html('<h1>' + newX.toString() + '</h1>');
					//move('#msgMemberImg_001').set('left', newX).end();
					move('#moveObj').x(-newX).end();
				//}
			}

			this.load = function(){
				commManager.transactionToDeviceToken(
					{
						routing:
							{
								command:'androidLocation',
								action:'getAttitudeMark'
							},
						data:{},

						onComplete:function(inDataLayer, inTransportLayer){
							//console.log('onComplete getAttitudeMark transactionToDeviceToken call back entered');
							//console.dir(inDataLayer);
							phoneCenterX = inDataLayer.x;
							phoneCenterY = inDataLayer.y;
							phoneCenterZ = inDataLayer.z;
						}
					}
				);

				commManager.transactionToDeviceToken(
					{
						routing:
							{
								command:'androidLocation',
								action:'startFilter'
							},
						data:
							{
								xOn:true,
								yOn:true,
								zOn:false,

								xDiff:'1.0',
								yDiff:'1.0',
								zDiff:'1.0',
							},

						onComplete:function(inDataLayer, inTransportLayer){
							//console.log('onComplete androidLocation transactionToDeviceToken call back entered');
							//refresh(inDataLayer.x);
						}
					}
				);

				//setup filters--------
				filterObj.add('androidLocation', function(inMsg, inLocal, inTransportLayer_json, inRefObj){
					if(inTransportLayer_json.dataLayer.action == 'onX'){
						//console.log('androidLocation onX');
						//console.dir(inTransportLayer_json.dataLayer);
						_this.refresh(inTransportLayer_json.dataLayer.x);
					}
				});

			}
		}();