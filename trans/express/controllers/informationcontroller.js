var UserModel = require('../models/usermodel');
var userModel = new UserModel();
var path = require('path');
var basePath = path.dirname(require.main.filename);
var uuid = require(basePath + '/node_modules/node-uuid');
var url = require('url');

var fs = require('fs');

module.exports.controller = function(app) {

	var configData = fs.readFileSync(path.dirname(require.main.filename) + '/main.conf', 'utf8');
	configData = JSON.parse(configData);


	app.post('/information/default', function(req, res){
		console.log("/widget_contactsform post");
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(
			{
				//hadError:((inErr)? true : false),
				hadError:false,
				//err:inErr,
				err:false,
				result:
					{
						domain:configData.domain.address + ":" + configData.domain.port,
						ip:configData.domain.address,
						port:configData.domain.port + "",

						secureDomain:configData.secureDomain.address + ":" + configData.secureDomain.port,
						secureIp:configData.secureDomain.address,
						securePort:configData.secureDomain.port + "",

						websockDomain:configData.webSocketClient.address + ":" + configData.webSocketClient.port,
						websockIp:configData.webSocketClient.address,
						websockPort:configData.webSocketClient.port + "",
						websockConnectString:configData.webSocketClient.connectString,

						loginRoute:'/user/mobileLogin',
						//loginRoute:configData.loginRoute,

						defaultUserImageUrl:configData.defaultUserImageUrl,

						addUserRoute:'/user/database/addUser',
						//addUserRoute:configData.addUserRoute,

						//userNameExistRoute:'/user/userNameExist',
						userNameExistRoute:configData.userNameExistRoute,
						tempUploadRoute:configData.tempUploadRoute,
						contactImageUploadRoute:configData.contactImageUploadRoute,
						userImageUploadRoute:configData.memberImageUploadRoute,
						userImageFolder:configData.userImageFolder,
						phoneCacheRoute:configData.phoneCacheRoute,

						//app products---------------------------------------
						/*inAppProductIds:
							[
								{
									productId:'arfsync.testapp.test_subscribe_product_500',
									productType:'subs',
									productCaption:'capMissing0',

								},
								{
									productId:'arfsync.testapp.testproduct_000',
									productType:'inapp',
									productCaption:'capMissing1',

								},
								{
									productId:'arfsync.testapp.testproduct_001',
									productType:'inapp',
									productCaption:'capMissing2',

								},
								{
									productId:'test0',
									productType:'inapp',
									productCaption:'captest0',

								},
								{
									productId:'arfsync.test1',
									productType:'inapp',
									productCaption:'caparfsync.test1',

								},
								{
									productId:'android.test.purchased',
									productType:'inapp',
									productCaption:'caparfsync.test1',

								},
								{
									productId:'android.test.canceled',
									productType:'inapp',
									productCaption:'caparfsync.test1',

								},

							],
*/
					}
			}
		));
	});


}