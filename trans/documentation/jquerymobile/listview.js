image thumbnail size: 80 * 80



/* this changes the actual div*/
style.
	#mainmenu li a{
		background-color: transparent !important;
		//background-image: url('') !important;
		//background: rgb(0, 0, 0);
		//background: rgba(0, 0, 0, 0.6);
	}
	#mainmenu li a:hover { 
		background-color:#feeebd !important;
	}
	#mainmenu li a:active { 
		background-color:#817865 !important;
	}

	#mainmenu li a img { 
		height:80px;
	}

	.menu_li{
		//background-color:black !important;
		background-color: transparent !important;
		//background: rgb(0, 0, 0);
		//background: rgba(0, 0, 0, 0.6);

	}


div(data-role="main" class="ui-content" syle="")
	div(class="ui-field-contain" id="main_bg" style="width:300px; left:10px")
		ul(data-role="listview" id="mainmenu" class=""  data-inset="true" )
			li(id="contactManagerDiv" class="menu_li" )
				a("/hjhjhjh" style="") Contact Manager
					img(src="/public/images/ui/userconfig.png" )
			//br
			li(id="smsManagerDiv" class="menu_li")
				a("/hjhjhjh") Sms Manager
					img(src="/public/images/ui/mobile-sms.png" )
			//br
			li(id="handsetControllerDiv" class="menu_li")
				a("/hjhjhjh") Handset Controller
					img(src="/public/images/ui/androidPhoneImg.png" )
			//br
			li(id="downloaddiv" class="menu_li")
				a("/hjhjhjh") Get Android App
					img(src="/public/images/ui/download_android_app_button.png" )
			//br
			li(class="menu_li")
				a("/hjhjhjh") XXXXXXXX
					img(src="/public/images/ui/userconfig.png" )




Also don't forget to call .listview( twice, first without refresh parameter, and 
second time with a refresh parameter. Without it you will receive this error:
cannot call methods on listview prior to initialization


var appendList = function(){
	var imageUrl = '/public/images/contacts/7887d790-94fe-11e4-8136-2de23de6a176.jpg';
	var name = 'Pepper Hopper';
	var number = '1(256)777-8888';
	var type = '[WORK]';

	var html = '' + 
		'<li class="menu_li"  data-inset="true">' 													+ ' ' +
			'<a "/hjhjhjh"> ' + name 										+ ' ' +
				'<img src="' + imageUrl + '" class="magicCirc" height="50px"/>'				+ ' ' +
				'<p>' + number + '</p>'											+ ' ' +
				'<p>' + type + '</p>'											+ ' ' +
			'</a>'																+ ' ' +
		'</li>'
	;

	$('#mainmenu').append(html);
	$('#mainmenu').listview().listview('refresh');
}



===================================================
LEFT   OR    RIGHT   
===================================================
ui-btn-icon-left