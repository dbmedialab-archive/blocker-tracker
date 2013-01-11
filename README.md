Blocker Tracker - a AdBlock and FlashBlock sniffer
==================================================

Plugin to sniff for use of ad-block and flash-block.
The plugin reports its findings to Google Analytics as an event (default).

## Dependancy
- Google Analytics
- JQuery 1.5 or more

## Install
1. Copy script and asset files to server
2. Include script in header of pages that you want to track
3. (Optional) Configure

## Configuration
### Assets
If you which to move the assets to a different location than _root/assets please configure as follows

	$.fn.blockerTracker({
		assets : {
			path : "js/blockerTracker/assets/"
		}
	});

### Analytics
If you use an old analytics tracker, the plugin needs to be launched with settings different settings.

	$.fn.blockerTracker({
		analytics : {
			legacyTracker : "TRACKER OBJECT" //send with the actual tracker
		}
	});
	
### All defaults can be overriden

	_defaults = {
		api : {
			swfObject : "http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"
		},
		assets : {
			path: "assets/",
			js: "advertisement.dummy.js",
			flash : "flash.dummy.swf"
		},
		analytics : {
			trackType : "_trackEvent",
			influenceBounce : false,
			catagory : "BlockerTracker",
			legacyTracker : false
		},
		report : {
			success : "Showing",
			block : "Blocking"
		},
		id : "blockerTracker_" + new Date().getTime(),
		callbackDelay : 1000
	}
