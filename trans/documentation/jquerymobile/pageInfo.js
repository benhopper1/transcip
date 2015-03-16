===================================================
CENTER A PAGE: using == data-dialog="true"
===================================================
div(data-role="page" id="page_userForm" data-dialog="true" data-theme="b" style="" class=".center-me")
	data-dialog="true" makes this work
--------------------------------------------------

CHANGE PAGE:
$(':mobile-pagecontainer').pagecontainer('change', '#pick');
$(':mobile-pagecontainer').pagecontainer('change', '#pg_page_2', {transition:'turn', reverse:'true'});

----------------------------------------------------------

===================================================
LOAD PAGE
===================================================
$.mobile.loadPage (method)
Load an external page, enhance its content, and insert it into the DOM. This method is called internally by the changePage() function when its first argument is a URL. This function does not affect the current active page so it can be used to load pages in the background. The function returns a deferred promise object that gets resolved after the page has been enhanced and inserted into the document.
Arguments
url (string or object, required) A relative or absolute URL.
options (object, optional)
Properties:
data (object or	string,	default: undefined) The data to send with an Ajax page request.
loadMsgDelay (number (in ms), default: 50) Forced delay before the loading message is shown. This is meant to allow time for a page that has already been visited to be fetched from cache without a loading message.
pageContainer (jQuery collection,	default:	$.mobile.pageContainer) Specifies the element that should contain the page after it is loaded.
reloadPage (boolean, default: false) Forces a reload of a page, even if it is already in the DOM of the page container.
role (string,	default:	undefined) The data-role value to be used when displaying the page. By default this is undefined which means rely on the value of the @data-role attribute defined on the element.
type (string, default: "get") Specifies the method ("get" or "post") to use when making a page request.
Examples:
			
//load the "about us" page into the DOM
$.mobile.loadPage( "about/us.html" );

//load a "search results" page, using data from a form with an ID of "search"" 	
$.mobile.loadPage( "searchresults.php", {
	type: "post",
	data: $("form#search").serialize()
});
			
			

----------------------------------------------------------------------------
$('#xxxxx').load("/users/checkemail #remoteLoadHereDiv");

===================================================
Page Go Back
===================================================
//button id
$('#goBackDiv').click(function(){
	history.back();
	return false;
});


===================================================
POST
===================================================
$.mobile.changePage( "searchresults.php", {
	type: "post",
	data: $("form#search").serialize()
});

===================================================
load fragments of page
===================================================
$.mobile.changePage( "searchresults.php", {

$('#tab_export').load("/jqm/contactexport #level_1", function(){
	console.log('loaded');
	$('#tab_export').trigger('create');
	console.log('dog:' + dog);
});


===================================================
load events
===================================================

If you want the code to run on a certain page (I bet that's the case) you can use this pattern:

$('div:jqmData(url="thepageyouwanted.html")').live('pageshow',function(){
    // code to execute on that page
    //$(this) works as expected - refers the page
});
Events you can use:

pagebeforeshow starts just before transition
pageshow starts right after transition
pagecreate starts only the first time page is loaded
