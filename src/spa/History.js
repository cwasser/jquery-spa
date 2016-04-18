/**
 * Created by cwasser on 09.04.16.
 */

var _ = require('lodash');

module.exports = (function ( $ ){
    'use strict';
    //------------------------- BEGIN MODULE SCOPE VARIABLES ------------------------------------
    var defaults = {
        hasHistoryApi : !!(window.history && history.pushState),
        location : typeof window !== 'undefined' ? window.location : null,
        history : !!(window.history && history.pushState) ? window.history : null,
        useHashChange : false,
        useHistoryApi : true,
        historyHashStates : []
    },
        stateMap = $.extend( true, {}, defaults),

        initialized = false,

        _onLocationChange, _findState,
        configModule, navigate, run;
    //------------------------- END MODULE SCOPE VARIABLES --------------------------------------
    //------------------------- BEGIN INTERNAL METHODS ------------------------------------------
    _findState = function ( route ) {
        return _.findIndex(
            stateMap.historyHashStates,
            {
                route : route
            }
        );
    };
    //------------------------- END INTERNAL METHODS --------------------------------------------
    //------------------------- BEGIN EVENT METHODS ---------------------------------------------
    _onLocationChange = function () {
        console.log(stateMap);
        if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ) {
            $(window).on('popstate', function (){
                console.log('History: POPSTATE triggered with event: ');
                var state = stateMap.history.state;

                $(window).trigger('jQuery.spa.locationChange', {
                    route : state.route || window.location.pathname,
                    httpMethod : state.httpMethod || 'GET'
                });
            });
        } else {
            $(window).on('hashchange', function () {
                console.log('History: HASHCHANGE triggered with event: ');
                var state = stateMap.historyHashStates[_findState(window.location.hash.substring(2))];

                // This needs to be refactored (http method needs also to be an identifier)

                $(window).trigger('jQuery.spa.locationChange', {
                    route : state.route || window.location.hash.substring(2),
                    httpMethod : state.httpMethod || 'GET'
                });
            });
        }
    };
    //------------------------- END EVENT METHODS -----------------------------------------------
    //------------------------- BEGIN PUBLIC METHODS --------------------------------------------
    run = function () {
        _onLocationChange();

        if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ){
            $(window).trigger('popstate');
        } else {
            $(window).trigger('hashchange');
        }
    };

    navigate = function ( route, httpMethod ){
        console.log("History.navigate: Called");
        console.log("History.navigate: Route is: " + route + " , HTTP method is: " + httpMethod);
        if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ){
            stateMap.history.pushState({
                route : route,
                data : {},
                httpMethod : httpMethod
            }, null, route);
        } else {
            stateMap.historyHashStates.push({
                route : route,
                data : {},
                httpMethod : httpMethod
            });

            window.location = '/#!' + route;
        }
        // Location change here!
    };

    configModule = function ( options ) {
        if ( typeof options !== 'object' || options === null ) {
            throw "SPA History needs a JavaScript Object to be configured";
        }

        stateMap = $.extend( true, stateMap, options );
        console.log("configModule: successfully configurated");

        if ( !initialized ) {
            initialized = true;
        }
    };
    //------------------------- END PUBLIC METHODS ----------------------------------------------
    return {
        configModule : configModule,
        navigate : navigate,
        run : run
    };
}( window.jQuery ));
