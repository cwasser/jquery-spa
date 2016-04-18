/**
 * Created by cwasser on 09.04.16.
 */
var _ = require('lodash');

module.exports = (function( $ ) {
    'use strict';
    //----------------- BEGIN MODULE SCOPE VARIABLES ----------------------
    var defaults = {
            root : '/',
            routes : []
        },
        stateMap = $.extend( true, {}, defaults),

        Data = require('./Data'),
        History = require('./History'),

        _checkRoute, _wrapCallbackForResource, _findRoute,
        navigate, addRoute, removeRoute, configModule;

    //----------------- END MODULE SCOPE VARIABLES ------------------------
    //----------------- BEGIN INTERNAL METHODS ----------------------------
    _checkRoute = function ( route ) {
        // Regex for simple URL checking, matches all '/...(/...)'
        return /^\/[a-zA-Z0-9]*(\/[a-zA-Z0-9]*)?/g.test( route );
    };

    _wrapCallbackForResource = function ( route, callback, httpMethod, options ) {
        return function () {
            // fire event to save state information for an executed route in the history
            Data.loadData( route, httpMethod, callback, options);
        };
    };

    /**
     * Returns the index for the given parameters
     * @return int index of the route or -1 if not found
     * @private
     * @param route
     * @param httpMethod
     */
    _findRoute = function ( route, httpMethod ) {
        // Do not use $.inArray() here, because the array contains objects
        return _.findIndex(
            stateMap.routes,
            {
                route : route,
                httpMethod : (typeof httpMethod === 'undefined' ) ? 'GET' : httpMethod
            }
        );
    };
    //----------------- END INTERNAL METHODS ------------------------------
    //----------------- BEGIN PUBLIC METHODS ------------------------------

    navigate = function ( route, httpMethod ) {
        var index;
        if ( (index = _findRoute( route, httpMethod )) >= 0 ) {
            // a route for the given string is defined
            History.navigate( route, httpMethod );
            return;
        }
        throw 'jQuery SPA Error: The given route is not defined within the plugin';
    };

    addRoute = function ( route, callback, isResource, httpMethod, options ) {
        if ( _checkRoute( route ) ){
            // Route pattern is ok, check callback
            if ( callback === null || typeof callback  !== 'function') {
                throw 'Router.addRoute: Missing callback or given callback is not a function';
            }
            // Always add the isResource flag and the HTTP method for a route, a route can
            // have different methods connected e.g. POST and GET for /example
            if ( typeof isResource === 'undefined' ) {
                isResource = false;
            }
            if ( typeof httpMethod === 'undefined' ) {
                httpMethod = 'GET';
            }
            if ( typeof options === 'undefined' ) {
                options = {};
            }

            stateMap.routes.push({
                route : route,
                callback : callback,
                isResource : isResource,
                httpMethod : httpMethod,
                options : options
            });
        } else {
            throw 'Router.addRoute: Given route ' + route + ' is invalid';
        }
    };

    removeRoute = function ( route, httpMethod ) {
        var index;
        if ( index = _findRoute( route, httpMethod ) >= 0 ) {
            stateMap.routes.splice( index, 1 );
        }
    };

    $(window).on('jQuery.spa.locationChange', function ( event, obj ) {
        var index, routeObj,
            route = obj.route,
            httpMethod = obj.httpMethod;

        console.log(route);
        if ( (index = _findRoute( route, httpMethod )) >= 0 ) {
            routeObj = $.extend( true, {}, stateMap.routes[index]);
            // If the given route is connected to an resource, then wrap the callback into an
            // additional callback for data retrieval
            if ( stateMap.routes[index].isResource ) {
                routeObj.callback = _wrapCallbackForResource( route, routeObj.callback, httpMethod, routeObj.options );
            }

            routeObj.callback();
        }
    });

    configModule = function ( options ) {
        if ( typeof options !== 'object' || options === null ) {
            throw 'SPA Router needs a JavaScript Object to be configured';
        }

        stateMap = $.extend( true, stateMap, options );
        console.log('configModule: successfully configurated');
    };
    //----------------- END PUBLIC METHODS --------------------------------

    return {
        configModule : configModule,
        navigate : navigate,
        addRoute : addRoute,
        removeRoute : removeRoute
    };
}( window.jQuery ));
