http://demos.jquerymobile.com/1.4.5/panel/

Dynamic content

When you dynamically add content to a panel or make hidden content visible while the panel is open, you have to trigger the updatelayout event on the panel.


$( "#mypanel" ).trigger( "updatelayout" );


=================================================================================

Panel positioning

The panel will be displayed with the position:absolute CSS property, 
meaning it will scroll with the page. When a panel is opened the framework 
checks to see if the bottom of the panel contents is in view. If not, it scrolls to 
the top of the page.

You can set a panel to position:fixed, so its contents will appear 
no matter how far down the page you're scrolled, by adding the data-positio
n-fixed="true" attribute to the panel. The framework also checks to see if the panel
 contents will fit within the viewport before applying the fixed positioning because this property would 
 prevent the panel contents from scrolling and make it inaccessible. overflow is not well supported enough 
 to use at this time. If the panel contents are too long to fit within the viewport, the framework will simply 
 display the panel without fixed positioning. See an example of panels with fixed positioning.

