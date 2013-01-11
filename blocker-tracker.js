/*

  Plugin to checking if client is running blockers.
  Plugin tries to load content then checks for success.
  Method varies with content type, assets are required.
  
  Support:
  	AdBlocker
  	FlashBlocker
  -------------------

  @file		blocker-tracker.js
  @version	2.0.0
  @date     11-jan-2013
  @author   Sebastian Brage Hansen <sbh@dagbladet.no>

  Copyright (c) 2013 DB Medialab AS <http://www.medialaben.no>

*/
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
			id : "blockerTracker_" + new Date().getTime(),
			callbackDelay : 1000
		},
		_namespace = "BlockerTracker",
		_settings,
		_loopBack = false,
		_debug = false,
		_checks = [],
		_tracker = window._gaq || false,
		_error = new Array(
			false,
			"Could not load script",
			"Method does not exist",
			"Failed to load API/Object",
			"Plugin allready initialized"
		),
		_init = false,
		_log = [];
	
	var _public = {
			init : function( settings ){
				if( !_init ){
					_init = true;
					$.extend( true, _defaults, settings );
					_settings = _defaults;
					_private.prepearConsole();				
					
					_log.log( _namespace, "Plugin Initialized with settings:" );
					_log.log( _namespace, _settings );
				}
				else {
					_log.log( _namespace, _error[ 4 ] );
				}
			},
			ads : function(){
				var src = _settings.assets.path + _settings.assets.js,
					type = "AdBlocker";
				_log.log( _namespace, "Fetching AD (" + src +")" );
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
				_log.log( _namespace, trackingData );
				if( _settings.analytics.legacyTracker ){
					_settings.analytics.legacyTracker[ trackingData.pop() ].apply( _settings.analytics.legacyTracker, trackingData );
				}
				else {
					if( typeof _gaq == "undefined" ){
						_log.error( _namespace, _error[ 3 ] + " (Analytics/_gaq)" )
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
				}).css({
					display : "none"
				});
								
				_log.log( _namespace, "inserting SWF (" + SWFPath +")" );
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
				if( typeof swfobject == "undefined" ){
					$.getScript( _settings.api.swfObject, function(){
						_private.insertFlashObject();		
					})
					.fail(function(){
						_log.error( _namespace, _error[ 3 ] + " (" + _settings.api.swfObject + ")" );
					});					
				}
				else {
					_private.insertFlashObject();
				}
			},
			loadSWFcallback : function( event ){
				if( event.success ){
					var t = setTimeout( "$.fn.blockerTracker( 'flash' )", _settings.callbackDelay );
				}
				else {
					_log.log( _namespace, _error[ 3 ] + " (" + SWFPath + ")" );
				}
			},
			checkSWF : function(){
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
				if( _debug ){
					_log = console;
				}
				else {
					_log.log = function(){};
					_log.warn = function(){};
					_log.error = function(){};
					_log.info = function(){};
				}
			},
			disableLogging : function(){
				_log.log = function(){};
				_log.warn = function(){};
				_log.error = function(){};
				_log.info = function(){};
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
			console.log( _namespace, _error[2] + " (" + method +")" );
		}
	};

})( jQuery );
$(window).load( function(){	
	$.fn.blockerTracker();
	$.fn.blockerTracker( "ads" );
	$.fn.blockerTracker( "flash" );
});