(function( $ ){	

	var _defaults = {
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
			id : "blockerTracker_" + new Date().getTime()
		},
		_settings,
		_loopBack = false,
		_checks = [],
		_tracker = window._gaq || false,
		_error = new Array(
			false,
			"Could not load script",
			"Method does not exist on jQuery.blockerTracker",
			"Failed to load API/Object"
		);
	
	var _public = {
			init : function( settings ){
				$.extend( _defaults, settings, true );
				_settings = _defaults;
				
				_private.prepearConsole();
				$.fn.blockerTracker( "flash" );
				$.fn.blockerTracker( "ads" );
				
				console.log( "Init Complete" );
			},
			ads : function(){
				var src = _settings.assets.path + _settings.assets.js,
					type = "AdBlocker";
				
				$.getScript( src, function(){
					_private.logToAnalytics( "Ads", _settings.report.success );					
				})
				.fail(function(){
					_private.logToAnalytics( "Ads", _settings.report.block );					
				});
			},
			setFlash : function( variable ){
				_checks[ "flash" ] = true;
			},
			flash : function(){
				console.log( _loopBack );
				if( _loopBack ){
					_private.toggleLoopback();
					_private.checkSWF();
				}
				else {
					_private.toggleLoopback();
					_private.loadSWF();
				}
			}
		},
		_private = {
			logToAnalytics : function( _type, _result, _value ){
				var trackingData = [
	                    _settings.analytics.trackType,
	                    _settings.analytics.catagory,
	                    _type,
	                    _result,
	                    _value || 0,
	                    _settings.analytics.influenceBounce
                    ];
				console.log( trackingData );
				if( _settings.analytics.legacyTracker ){
					_settings.analytics.legacyTracker[ trackingData.pop() ].apply( _settings.analytics.legacyTracker, trackingData );
				}
				else {
					if( typeof _gaq == "undefined" ){
						console.log( _error[ 3 ] + " (Analytics/_gaq)" )
					}
					else {
						_gaq.push( trackingData );;						
					}
				}
			},
			insertFlashObject : function(){
				var $SWFContainer = $("<div/>"),
					SWFId = _settings.id + "_SWFContainer",
					SWFPath = _defaults.assets.path + _defaults.assets.flash,
					SWFCallback = _private.loadSWFcallback;
				
				$SWFContainer.attr({
					id : SWFId
				});
				
				$("body").append( $SWFContainer );	
	
				swfobject.embedSWF(
					SWFPath,
					SWFId,
					"1",
					"1",
					"4.0.0",
					null,
					null,
					null,
					null,
					SWFCallback
				);	
				},
			loadSWF : function(){
				$.getScript( _settings.api.swfObject, function(){
					_private.insertFlashObject();		
				})
				.fail(function(){
					console.log( _error[ 3 ] + " (" + _settings.api.swfObject + ")" );
				});
			},
			loadSWFcallback : function( event ){
				if( event.success ){
					var t = setTimeout( "$.fn.blockerTracker( 'flash' )", 250 );
				}
				else {
					$( "#" + _settings.id + "_SWFContainer" ).hide();
					console.log( _error[ 3 ] + " (" + SWFPath + ")" );
				}
			},
			checkSWF : function(){
				$( "#" + _settings.id + "_SWFContainer" ).hide();
				if( typeof _checks[ "flash" ] == "undefined" ){
					_private.logToAnalytics( "Flash", _settings.report.block );					
				} else {					
					_private.logToAnalytics( "Flash", _settings.report.success );											
				}
			},
			toggleLoopback : function(){
				_loopBack = !_loopBack;
			},
			prepearConsole : function(){
				if( typeof console == "undefined" ){
					console.log = function(){};
					console.warn = function(){};
					console.error = function(){};
					console.info = function(){};
				}
			}
		};
	
	$.fn.blockerTracker = function( method ){
		if ( _public[method] ) {
			return _public[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if ( typeof method === 'object' || ! method ) {
			return _public.init.apply( this, arguments );
		}
		else {
			$.error( _error[2] + " (" + method +")" );
		}
	};

})( jQuery );
$(window).load( function(){
	$.fn.blockerTracker();
});