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
        useHistoryApi : true,
        historyHashStates : {}
    },
        stateMap = $.extend( true, {}, defaults),

        configured = false,

        _onLocationChange, _shouldUpdateCurrentLocation, _loadRoute,
        configModule, isConfigured, updateCurrentState, getDataForCurrentState, navigate, run;
    //------------------------- END MODULE SCOPE VARIABLES --------------------------------------
    //------------------------- BEGIN INTERNAL METHODS ------------------------------------------
    _loadRoute = function ( route ) {
        $(window).trigger('jQuery.spa.locationChange', {
            route : route
        });
    };

    _shouldUpdateCurrentLocation = function ( route ) {
        var currentRoute;
        if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ) {
            currentRoute = window.location.pathname;
        } else {
            currentRoute = window.location.hash.substring(2);
        }
        return route !== currentRoute;
    };

    //------------------------- END INTERNAL METHODS --------------------------------------------
    //------------------------- BEGIN EVENT METHODS ---------------------------------------------
    _onLocationChange = function () {
        console.log(stateMap);
        if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ) {
            $(window).on('popstate', function ( event ) {

                console.log('History: POPSTATE triggered with event: ');
                console.log(event);
                console.log(stateMap.history.state);

                _loadRoute( window.location.pathname );
            });
        } else {
            $(window).on('hashchange', function ( event ) {
                var route = window.location.hash.substring(2);

                // In cases if we landing on the page without any URI, we have no route, so in cases
                // of an empty route, simply set it to the root
                if ( route === '' ) {
                    route = '/';
                }
                // Creating an empty entry within the stateMap for hashRoutes in case if there is no
                // existing one.
                if ( !stateMap.historyHashStates.hasOwnProperty( route ) ) {
                    stateMap.historyHashStates[ route ] = {};
                }

                console.log('History: HASHCHANGE triggered with event: ');
                console.log(event);

                _loadRoute( route );
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

    navigate = function ( route ){
        console.log("History.navigate: Called");
        console.log("History.navigate: Route is: " + route );
        if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ){
            if ( _shouldUpdateCurrentLocation( route ) ) {
                stateMap.history.pushState({
                    route : route,
                    data : {}
                }, null, route);
            }
            // Popstate needs to be triggered since it is usually only triggered by history back- and forward-buttons
            $(window).trigger('popstate');

        } else {
            if ( _shouldUpdateCurrentLocation( route ) ) {
                stateMap.historyHashStates[route] = {};
            }
            window.location = '/#!' + route;
        }
    };

    getDataForCurrentState = function ( route ) {
        var data = {};
        if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ) {
            if ( stateMap.history.state !== null && typeof stateMap.history.state.hasOwnProperty('payload') ) {
                data = stateMap.history.state.payload;
            }
        } else {
            if ( stateMap.historyHashStates.hasOwnProperty( route ) ) {
                data = stateMap.historyHashStates[route].payload;
            }
        }
        return data;
    };

    updateCurrentState = function ( route, data ) {
        if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ) {
            stateMap.history.replaceState( data, null, route );
            return true;
        } else {
            if ( stateMap.historyHashStates.hasOwnProperty( route ) ) {
                stateMap.historyHashStates[route] = data;
                return true;
            }
        }
        return false;
    };

    isConfigured = function () {
        return configured;
    };

    configModule = function ( options ) {
        if ( typeof options !== 'object' || options === null ) {
            throw "SPA History needs a JavaScript Object to be configured";
        }

        stateMap = $.extend( true, stateMap, options );
        console.log("configModule: successfully configurated");

        if ( !configured ) {
            configured = true;
        }
    };
    //------------------------- END PUBLIC METHODS ----------------------------------------------
    return {
        configModule : configModule,
        isConfigured : isConfigured,
        navigate : navigate,
        getDataForCurrentState : getDataForCurrentState,
        updateCurrentState : updateCurrentState,
        run : run
    };
}( window.jQuery ));
