Add the following to your ui-content selector:
{
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
}
This doesn't work with headers, unfortunately
-------------------------------------------------------



Important note: Use this solution for specific pages, where you don't want page or page's content to scroll vertically. Because page's height will set to 100%, hence, it won't scroll and you will face this problem.
Full Screen:

html,
body,
#pageID { /* specify page */
  height: 100%;
  margin: 0;
  padding: 0;
}

#pageID .ui-content {
  padding: 0;
}

.ui-content,
.ui-content #full-height-div { /* divs will inherit page's height */
  height: inherit;
}
--------------------------------------------------------
Fixed Toolbars (header/footer):

html,
body,
#pageID {
  height: 100%;
  margin: 0;
  padding: 0;
}

#pageID,
#pageID * {
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}

#pageID .ui-content {
  height: inherit; /* inherit height without padding nor border */
}

---------------------------------------------------------------------

Floating Toolbars:

html,
body,
#pageID {
  height: 100%;
  margin: 0;
  padding: 0;
}

#pageID,
#pageID * {
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}

#pageID .ui-content {
  height: calc(100% - 89px); /* 88px = header's height 44px and footer's 44px plus 1px */
}

---------------------------------------------------------------------
With pure CSS works fine for portrait pages. You must set top and bottom position depending of your header and footer height

position: absolute;
top: 88px; /*your header height*/
right: 0;
bottom: 44px; /*your footer height */
left: 0;
background: white;
---------------------------------------------------------------------
---------------------------------------------------------------------
---------------------------------------------------------------------
---------------------------------------------------------------------
---------------------------------------------------------------------
---------------------------------------------------------------------
