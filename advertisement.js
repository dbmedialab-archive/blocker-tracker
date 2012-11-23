/*
 * AD BLOCKER SNIFFER
 * ---------------------------------
 * Ad Block will commonly block scripts named advertisement.js from loading.
 * Utilize this to check for the presence of AdBlock.
 * 
 * @file advertisement.js
 * @author Sebastian Brage Hansen
 * @date 22-November-2012;
 * 
 * Copyright (c) 2012 DB Medialab AS <http://www.dbmedialab.no/>

 * USAGE
 * ---------------------------------
 * @parameters none;
 * @dependency jQuery;
 * @returns nothing;
 * 
 * Load the script
 * <script type="text/javascript" src="http://www.dagbladet.no/annonse/adBlockerTest/advertisement.js" charset="utf-8"></script>
 * 
 * Check for presence of jQuery.adTestSuccess
 * <script>
 * 	if( $.adTestSuccess === undefined ){
 * 		//do stuff with page without ads
 * 	}
 * 	else {
 * 		//do stuff with normal page
 * 	}
 * </script>
 * 
 * INSTALLATION
 * ---------------------------------
 * <script type="text/javascript" src="http://www.dagbladet.no/annonse/adBlockerTest/advertisement.js" charset="utf-8"></script>
 * <script>
 *	$(document).ready( function(){
 *		var isUsingAdBlock = $.adTestSuccess === undefined ? "Blokkerer annonser" : "Viser annonser";
 *		tracker.push( [ "_trackEvent", "AdBlock", isUsingAdBlock ] );
 *	});
 * </script>
 * 
 * */

jQuery.adTestSuccess = true;