/**
 * Created by cwasser on 09.04.16.
 */
var _ = require('lodash');

module.exports = (function( $ ) {
    'use strict';
    //----------------- BEGIN MODULE SCOPE VARIABLES ----------------------
    var defaults = {
            routes : []
        },
        stateMap = $.extend( true, {}, defaults),
        routeDefaultOptions = {
            isResource : false,
            httpMethod : 'GET',
            shouldTriggerStateUpdate : false,
            useHistoryStateFallback : false,
            data : {}
        },
        configured = false,

        Data = require('./Data'),
        History = require('./History'),

        _mergeRouteOptions, _checkRoute, _findRoute, _getRoute, _performDataRequest, _wrapCallbackForResource,

        navigate, createResource, updateResource, deleteResource,
        addRoute, removeRoute, isConfigured, configModule;

    //----------------- END MODULE SCOPE VARIABLES ------------------------
    //----------------- BEGIN INTERNAL METHODS ----------------------------
    /**
     * Returns the final optional route options for a single route and makes
     * sure that each necessary property is set for a route.
     * @return object the merged options, default route options overwritten by the user
     * @param userOptions object with user options for a single route
     * @private
     */
    _mergeRouteOptions = function ( userOptions ) {
        // Prevent any misbehaviour of the data property usage on addRoute(),
        // the data property can only be set by the Data component or via
        // createResource() and updateResource() calls.
        if( ! $.isEmptyObject( userOptions.data ) ) {
            userOptions.data = {};
        }
        return $.extend( true, routeDefaultOptions, userOptions );
    };

    _checkRoute = function ( route ) {
        // Regex for simple URL checking, matches all '/...(/...)'
        return /^\/[a-zA-Z0-9]*(\/[a-zA-Z0-9]*)?/g.test( route );
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

    /**
     * Returns a single route object
     * @return object a copy of the route object with the given route and httpMethod || {}
     * @param route
     * @param httpMethod
     * @private
     */
    _getRoute = function ( route, httpMethod ) {
        var index = _findRoute( route, httpMethod );
        if ( index >= 0 ) {
            return $.extend( true, {}, stateMap.routes[index] );
        }
        return {};
    };

    _wrapCallbackForResource = function ( routeObj ) {
        // This needs to be done, otherwise the routeObj would call itself again in the AJAX callback
        var routeCopy = $.extend( true, {}, routeObj );

        return function () {
            Data.performRequest(
                routeCopy.route,
                routeCopy.httpMethod,
                // This needs to be done, otherwise the routeObj would call itself again in the AJAX callback (Endless loop)
                routeCopy.callback,
                {
                    shouldTriggerStateUpdate : routeCopy.shouldTriggerStateUpdate,
                    useHistoryStateFallback : routeCopy.useHistoryStateFallback
                }
            );
        };
    };

    _performDataRequest = function ( routeObj, data ) {
        if ( typeof data === 'undefined' ) {
            throw 'jQuery SPA Error: Can not perform data retrieval without any data';
        }
        if ( routeObj.httpMethod.toUpperCase() === 'GET' ) {
            routeObj.useHistoryStateFallback = true;
            routeObj.shouldTriggerStateUpdate = true;
        }
        routeObj.data = data;

        return _wrapCallbackForResource( routeObj );
    };
    //----------------- END INTERNAL METHODS ------------------------------
    //----------------- BEGIN PUBLIC METHODS ------------------------------

    navigate = function ( route ) {
        if ( _findRoute( route, 'GET' ) >= 0 ) {
            // a route for the given string is defined, changing the URL relies always on the GET
            History.navigate( route );
            return;
        }
        throw 'jQuery SPA Error: The given route is not defined within the plugin';
    };

    $(window).on('jQuery.spa.locationChange', function ( event, obj ) {
        // This function will only be called by the History, so it will always be an resource with GET,
        // because URL changes happens only to reflect another state than before.
        var routeObj = _getRoute( obj.route, 'GET' );

        // Any data retrieval wanted for this URL from the server?
        if ( routeObj.isResource ) {
            routeObj.callback = _performDataRequest( routeObj, {} );
        }
        routeObj.callback();
    });

    createResource = function ( route, data ) {
        var routeObj, execute;

        if ( typeof data === 'undefined' || $.isEmptyObject( data ) ) {
            throw 'jQuery SPA Error: You must not call createResource() without any data';
        }
        routeObj = _getRoute( route, 'POST' );

        execute = _performDataRequest( routeObj, data );
        execute();
    };

    updateResource = function ( route, data ) {
        var routeObj, execute;
        if ( typeof data === 'undefined' || $.isEmptyObject( data ) ) {
            throw 'jQuery SPA Error: You must not call updateResource() without any data';
        }
        routeObj = _getRoute( route, 'PUT' );

        execute = _performDataRequest( routeObj, data );
        execute();
    };

    deleteResource = function ( route ) {
        var routeObj = _getRoute( route, 'DELETE'),
            execute;
        execute = _performDataRequest ( routeObj, {} );
        execute();
    };

    addRoute = function ( route, callback, options ) {
        var mergedOptions;

        if ( _checkRoute( route ) ){
            // Route pattern is ok, check callback
            if ( callback === null || typeof callback  !== 'function') {
                throw 'Router.addRoute: Missing callback or given callback is not a function';
            }
            // merge the given options from the user with the default options,
            // to make sure that all necessary properties have at least the default value
            mergedOptions = _mergeRouteOptions( options );

            stateMap.routes.push({
                route : route,
                callback : callback,
                isResource : mergedOptions.isResource,
                httpMethod : mergedOptions.httpMethod,
                useHistoryStateFallback : mergedOptions.useHistoryStateFallback,
                shouldTriggerStateUpdate : mergedOptions.shouldTriggerStateUpdate
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

    isConfigured = function () {
        return configured;
    };

    // --------------------- BEGIN CONFIG ---------------------------------
    configModule = function ( options ) {
        if ( typeof options !== 'object' || options === null ) {
            throw 'SPA Router needs a JavaScript Object to be configured';
        }

        stateMap = $.extend( true, stateMap, options );

        if ( !configured ) {
            configured = true;
        }

        console.log('configModule: successfully configurated');
    };
    //----------------- END PUBLIC METHODS --------------------------------

    return {
        configModule : configModule,
        isConfigured : isConfigured,
        navigate : navigate,
        createResource : createResource,
        updateResource : updateResource,
        deleteResource : deleteResource,
        addRoute : addRoute,
        removeRoute : removeRoute
    };
}( window.jQuery ));
