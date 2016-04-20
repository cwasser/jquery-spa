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

        _onLocationChange, _onCurrentStateUpdate, _findHashState, _loadRoute,
        configModule, navigate, run;
    //------------------------- END MODULE SCOPE VARIABLES --------------------------------------
    //------------------------- BEGIN INTERNAL METHODS ------------------------------------------
    _findHashState = function ( route ) {
        var hashStates = $.extend(true, [], stateMap.historyHashStates);

        return _.findIndex(
            hashStates.reverse(),
            {
                route : route
            }
        );
    };

    _loadRoute = function ( route, state ) {
        $(window).trigger('jQuery.spa.locationChange', {
            route : state.route,
            httpMethod : state.httpMethod
        });
    };

    //------------------------- END INTERNAL METHODS --------------------------------------------
    //------------------------- BEGIN EVENT METHODS ---------------------------------------------
    _onLocationChange = function () {
        console.log(stateMap);
        if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ) {
            $(window).on('popstate', function ( event ) {
                var state;

                console.log('History: POPSTATE triggered with event: ');
                console.log(event);
                console.log(stateMap.history.state);

                if ( stateMap.history.state === null)
                {
                    stateMap.history.state = {
                        route : window.location.pathname,
                        data : {},
                        httpMethod : 'GET'
                    };
                }
                state = stateMap.history.state;

                _loadRoute( state.route, state );
            });
        } else {
            $(window).on('hashchange', function ( event ) {
                var route = window.location.hash.substring(2),
                    stateIndex = _findHashState(route),
                    state;
                console.log('History: HASHCHANGE triggered with event: ');
                console.log(event);

                if ( stateIndex < 0 ) {
                    stateMap.historyHashStates.push({
                        route : route,
                        data : {},
                        httpMethod : 'GET'
                    });
                    stateIndex = 0;
                }
                state = stateMap.historyHashStates[stateIndex];

                _loadRoute( state.route, state );
            });
        }
    };

    _onCurrentStateUpdate = function () {
        $(window).on('jQuery.spa.currentStateUpdate', function ( event, data ){
            console.log('------- onCurrentStateUpdate ----------- ');
            console.log('NEW STATE');
            console.log(data);
            console.log('OLD STATE');
            var oldState, currentState;
            if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ) {
                console.log(stateMap.history.state);
                oldState = stateMap.history.state;
                currentState = {
                    route : oldState.route,
                    data : data,
                    httpMethod : oldState.httpMethod
                };

                stateMap.history.replaceState(currentState, null, currentState.route ); //window.localtion.pathname später durch state.route ersetzen?
            } else {
                var lastIndex = stateMap.historyHashStates.length - 1;
                console.log(stateMap.historyHashStates[lastIndex]);
                oldState = stateMap.historyHashStates[lastIndex];
                currentState = {
                    route : oldState.route,
                    data : data,
                    httpMethod : oldState.httpMethod
                };
                stateMap.historyHashStates[lastIndex] = currentState;
            }
        });
    };
    //------------------------- END EVENT METHODS -----------------------------------------------
    //------------------------- BEGIN PUBLIC METHODS --------------------------------------------
    run = function () {
        _onLocationChange();
        _onCurrentStateUpdate();

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

            // Popstate needs to be triggered since it is usually only triggered by history back- and forward-buttons
            $(window).trigger('popstate');

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
