Adblock-Sniffer
===============

Sample code and layout to sniff for use of ad-block and flash-block and generate reports in Google Analytics.

## Dependancy
- Google Analytics
- JQuery 1.5 or more

## Install
1. Copy script and asset files to server
2. Include script in header of pages that you want to track
3. (Optional) Configure

### Configuration
#### Assets
If you which to move the assets to a different location than _root/assets please configure as follows

	$.fn.blockerTracker({
		assets : {
			path : "js/blockerTracker/assets/"
		}
	});

#### Analytics
If you use an old analytics tracker, the plugin needs to be launched with settings different settings.
