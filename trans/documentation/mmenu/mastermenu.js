


//* ADD HTML TO A PANEL:
//-----------------------------------------------------------------------------------------------------------------
masterMenu.addHtml(
	{
		panelId:'mainMenu_contacts',
		newElementId:'_' + index,
		html:masterMenu.getHtmlTemplate(
			{	
				template:'imageAndText',
				options:{
					imageSource:inRows[index].imageUrl,
					imageClass:'magicCirc',
					//imageWidth:'50px',
					imageStyle:'vertical-align:middle;width:100px',
					caption:inRows[index].name
				}
			}
		),
		onClick:function(inId, inRef){},
		onHover:function(inId, inRef){}
	}
);


//* GOBACK TO PREVIOUS PANEL
//-----------------------------------------------------------------------------------------------------------------
masterMenu.goBack();


//* OPEN SPECIFIC PANEL
//-----------------------------------------------------------------------------------------------------------------
masterMenu.openPanel('subMenu_contacts_add');

//* LOAD SLIDER TO A DIV
//-----------------------------------------------------------------------------------------------------------------
masterMenu.slider(
	{
		sliderDivId:inSliderDivId,
		sliderUrl:'/contacts/widget_contacts_slider',
		imageUrlArray:imageUrlArray,
		informationArray:inRows,
		divHeight:'25px',
		class:'magicCirc contactImage',
		sliderSize:
			{
				width:200
			}
	}
);
