ul(ul data-role="controlgroup" data-type="horizontal" class="localnav ui-corner-all ui-controlgroup ui-controlgroup-horizontal")
							li
								a(href="index.html" data-role="button" data-transition="fade" data-theme="c" class="ui-btn ui-btn-up-c ui-corner-left")
									span(class="ui-btn-inner ui-corner-left")
										span(class="ui-btn-text") MOBILE
							li
								a(href="index.html" data-role="button" data-transition="fade" data-theme="c" class="ui-btn ui-btn-up-c ui-corner-left")
									span(class="ui-btn-inner ui-corner-left")
										span(class="ui-btn-text") HOME
							li
								a(href="index.html" data-role="button" data-transition="fade" data-theme="c" class="ui-btn ui-btn-up-c ui-corner-left")
									span(class="ui-btn-inner ui-corner-left")
										span(class="ui-btn-text") WORK
							li
								a(href="index.html" data-role="button" data-transition="fade" data-theme="c" class="ui-btn ui-btn-up-c ui-corner-left")
									span(class="ui-btn-inner ui-corner-left")
										span(class="ui-btn-text") OTHER

Refreshing a radio button

If you manipulate a radio button via JavaScript, you must call the refresh method on it to update the visual styling. Here is an example:

$("input[type='radio']").attr("checked",true).checkboxradio("refresh");