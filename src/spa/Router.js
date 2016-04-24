/**
 * Created by cwasser on 09.04.16.
 */
var _ = require('lodash');
/**
 * spa/Router.js
 * @description This component is responsible for the routing within the jQuery SPA plugin.
 * It will dispatch routes to callbacks and is the only entry point for all routes. It is communicating
 * with the jQuery SPA History and jQuery SPA Data components to do AJAX requests or manipulate the URL / History
 * if needed.
 * @author Christian Wasser <admin@chwasser.de>
 * @type {{configModule, navigate, createResource, updateResource, deleteResource, addRoute, removeRoute}}
 */
module.exports = (function( $ ) {
    'use strict';
    //----------------- BEGIN MODULE SCOPE VARIABLES ----------------------
    var defaults = {
            routes : [],
            routeDefaultOptions : {
                isResource : false,
                httpMethod : 'GET',
                shouldTriggerStateUpdate : false,
                useHistoryStateFallback : false,
                data : {}
            }
        },
        stateMap = $.extend( true, {}, defaults),
        settablePropertyMap = {
            routes : false,
            routeDefaultOptions : false
        },

        Data = require('./Data'),
        History = require('./History'),
        Util = require('./Util'),

        _mergeRouteOptions, _checkRoute, _findRoute, _getRoute, _performDataRequest, _wrapCallbackForResource,

        navigate, createResource, updateResource, deleteResource, getResource,
        addRoute, removeRoute, configModule;

    //----------------- END MODULE SCOPE VARIABLES ------------------------
    //----------------- BEGIN INTERNAL METHODS ----------------------------
    /**
     * @description Returns the final optional route options for a single route and makes
     *      sure that each necessary property is set for a route.
     * @return object the merged options, default route options overwritten by the user
     * @param {object} userOptions       - An object with user options for a single route
     * @private
     */
    _mergeRouteOptions = function ( userOptions ) {
        // Prevent any misbehaviour of the data property usage on addRoute(),
        // the data property can only be set by the Data component or via
        // createResource() and updateResource() calls.
        if( ! $.isEmptyObject( userOptions.data ) ) {
            userOptions.data = {};
        }
        return $.extend( true, {}, stateMap.routeDefaultOptions, userOptions );
    };

    /**
     * @description Check if a route is matching a regex to disallow malformed routes in
     *      this component.
     * @param {string} route - The route string to be checked.
     * @returns {boolean}   - If the route matches with the internal regex.
     *      * true          - The route string matches.
     *      * false         - The route does not match with the regex.
     * @private
     */
    _checkRoute = function ( route ) {
        // Regex for simple URL checking, matches all '/...(/...)'
        return /^\/[a-zA-Z0-9]*(\/[a-zA-Z0-9]*)?/g.test( route );
    };

    /**
     * @description Find the index of the given route and httpMethod string and returns it.
     * @return {int}        - The index of the route.
     *      * -1            - The component does not contain the given route.
     *      * 0 ... n       - The index of the route object in this component.
     * @private
     * @param {string} route - Any route string to look for.
     * @param {string} httpMethod    - Any HTTP method connected with the given route, allowed methods are
     *                  findable within the jQuery SPA Data component.
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
     * @description Get a deep copy of a route object of this component for the given route string
     *      and HTTP method string.
     * @return {object}     - A copy of the route object with the given route and httpMethod or
     *                  an empty javascript object if the component does not contain a corresponding
     *                  object.
     * @param {string} route    - Any route string to look for to deliver the route object.
     * @param {string} httpMethod - Any HTTP method connected with the given route, allowed methods are
     *                  findable within the jQuery SPA Data component.
     * @private
     */
    _getRoute = function ( route, httpMethod ) {
        var index = _findRoute( route, httpMethod );
        if ( index >= 0 ) {
            return $.extend( true, {}, stateMap.routes[index] );
        }
        return {};
    };

    /**
     * @description This method will wrap the callback of the given route object into one more callback,
     *      to perform an AJAX request via the jQuery SPA Data component.
     * @param {object} routeObj     - The route object from the state map of this component.
     * @returns {Function}          - The wrapped callback for the given route object, which is ready to perform
     *                  an AJAX request on call of the callback.
     * @private
     */
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
                    useHistoryStateFallback : routeCopy.useHistoryStateFallback,
                    data : routeCopy.data
                }
            );
        };
    };

    /**
     * @description Will wrap the callback of the given route object into an AJAX callback. It also
     *      checks additionally the HTTP method of the route object to set some History specific
     *      flags. This method is used by all data related functions of the Router component.
     * @param {object} routeObj     - The route object from the state map of this component.
     * @param {object} data         - Additional data javascript object, which should be used as data for the
     *              AJAX request.
     * @returns {Function}  - The wrapped callback for the given route object, which is ready
     *              to perform an AJAX request on call of the callback.
     * @private
     */
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

    /**
     * @description This listener will be registered instantly and will listen on specific events from the
     * jQuery SPA History component. When the event it triggered, this will execute the callback
     * after the History manipulation.
     */
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
    //----------------- END INTERNAL METHODS ------------------------------
    //----------------- BEGIN PUBLIC METHODS ------------------------------
    /**
     * @description This method will navigate to the given route string, this means that it will
     *      change the URL and use the jQuery SPA History component. Additionally it will perform
     *      an AJAX GET request depending on the configuration for the given route in this component.
     * @param {string} route            - The route string to navigate to.
     */
    navigate = function ( route ) {
        if ( _findRoute( route, 'GET' ) >= 0 ) {
            // a route for the given string is defined, changing the URL relies always on the GET
            History.navigate( route );
            return;
        }
        throw 'jQuery SPA Error: The given route is not defined within the plugin';
    };

    /**
     * @description This function will get an resource from the, in the jQuery SPA Data component
     *      configured, server. This requires an existing configuration for the given route within
     *      the Router component. If a route for GET with the given route string is configured,
     *      it will perform an AJAX request but no jQuery SPA History function call at all.
     *      Additionally it will modify automatically the copy of the route configuration to
     *      prevent any jQuery SPA History calls.
     * @param {string} route                - The route string for getting the resource.
     */
    getResource = function ( route ) {
        var routeObj = _getRoute( route, 'GET' ),
            execute;

        if ( !$.isEmptyObject( routeObj ) ) {
            // For only data retrieval without any URL change modify the options for this route
            // object copy.
            routeObj.shouldTriggerStateUpdate = false;
            routeObj.useHistoryStateFallback = false;

            execute = _performDataRequest( routeObj );
            execute();
        } else {
            throw 'jQuery SPA Error: No configuration found for the given route';
        }

    };

    /**
     * @description This function will create an resource on the, in the jQuery SPA Data component
     *      configured, server. This requires an existing configuration for the given route within
     *      the Router component. If a route for POST with the given route string is configured,
     *      it will perform an AJAX request but no jQuery SPA History function call at all.
     * @param {string} route            - The route string for creating the resource.
     * @param {object} data             - An javascript object containing the data to use for the AJAX request.
     */
    createResource = function ( route, data ) {
        var routeObj, execute;

        if ( typeof data === 'undefined' || $.isEmptyObject( data ) ) {
            throw 'jQuery SPA Error: You must not call createResource() without any data';
        }
        routeObj = _getRoute( route, 'POST' );
        if ( !$.isEmptyObject( routeObj ) ) {
            execute = _performDataRequest( routeObj, data );
            execute();
        } else {
            throw 'jQuery SPA Error: No configuration found for the given route';
        }
    };

    /**
     * @description This function will update an resource on the, in the jQuery SPA Data component
     *      configured, server. This requires an existing configuration for the given route within
     *      the Router component. If a route for PUT with the given route string is configured,
     *      then it will perform an AJAX request but no jQuery SPA History function call at all.
     * @param {string} route            - The route string for updating the resource.
     * @param {object} data             - An javascript object containing the data to use for the AJAX request.
     */
    updateResource = function ( route, data ) {
        var routeObj, execute;
        if ( typeof data === 'undefined' || $.isEmptyObject( data ) ) {
            throw 'jQuery SPA Error: You must not call updateResource() without any data';
        }
        routeObj = _getRoute( route, 'PUT' );
        if ( !$.isEmptyObject( routeObj ) ) {
            execute = _performDataRequest( routeObj, data );
            execute();
        } else {
            throw 'jQuery SPA Error: No configuration found for the given route';
        }
    };

    /**
     * @description This function will delete an resource on the, in the jQuery SPA Data component
     *      configured, server. This requires an existing configuration for the given route within
     *      the Router component. If a route for DELETE with the given route string is configured,
     *      then it will perform an AJAX request but no jQuery History function call at all.
     * @param {string} route            - The route for the resource to delete.
     */
    deleteResource = function ( route ) {
        var routeObj = _getRoute( route, 'DELETE'),
            execute;
        if ( !$.isEmptyObject( routeObj ) ) {
            execute = _performDataRequest ( routeObj, {} );
            execute();
        } else {
            throw 'jQuery SPA Error: No configuration found for the given route';
        }
    };

    /**
     * @description This function will add a new route configuration to the jQuery SPA Router
     *      component. Required parameters are the route string and the corresponding callback
     *      for this route. Optional you can also give some options to define optional things
     *      for the new route configuration. By default it will always be an simple GET route
     *      without any AJAX calls.
     * @param {string} route            - The route string for the new configuration.
     * @param {Function} callback       - The callback function which should be executed after executing
     *      the route via Router.navigate() or any other resource related calls.
     * @param {object} options          - Optional options javascript object for the new route configuration.
     *      By default it will use a GET route without any data retrieval. Allowed options are:
     *      * options.isResource : boolean      - If true, then it will perform an AJAX request
     *                      on executing the route.
     *                                          - If false, then it will not perform any AJAX
     *                      request.
     *      * options.httpMethod : string       - Allowed are 'GET', 'POST', 'PUT' and 'DELETE'.
     *                      It defines the connected HTTP method for this route.
     *      * options.shouldTriggerStateUpdate : boolean    - If true, then it will update the
     *                      jQuery History state for GET routes only. This state can be used as
     *                      a fallback data retrieval.
     *      * options.useHistoryStateFallback : boolean     - If true, the it will use the jQuery
     *                      History component state for the data retrieval if the AJAX request fails
     *                      for GET routes.
     * @example Router.addRoute(
     *      'some/route',
     *      function(data) {},
     *      {
     *          isResource : true,
     *          httpMethod : 'GET',
     *          useHistoryStateFallback : true,
     *          shouldTriggerStateUpdate : true
     *      }
     * );
     */
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

    /**
     * @description This function will remove an existing route configuration from the jQuery
     *      SPA Router component.
     * @param {string} route            - The route string to identify the route configuration to remove.
     * @param {string} httpMethod       - Additional HTTP method string to identify the route configuration
     *      to remove.
     */
    removeRoute = function ( route, httpMethod ) {
        var index;
        if ( index = _findRoute( route, httpMethod ) >= 0 ) {
            stateMap.routes.splice( index, 1 );
        }
    };

    // --------------------- BEGIN CONFIG ---------------------------------
    /**
     * @description This function will configure the jQuery SPA Router component with some
     *      options from outside. A call of this function is not required, because by default
     *      the component will contain a default configuration.
     * @param {object} options          - An javascript object which contains the options to configure
     *      this component. So far there is no existing configuration necessary and also not
     *      available for this component.
     */
    configModule = function ( options ) {
        if ( typeof options !== 'object' || options === null ) {
            throw 'SPA Router needs a JavaScript Object to be configured';
        }

        Util.setStateMap({
            stateMap : stateMap,
            settablePropertyMap : settablePropertyMap,
            inputMap : options
        });
    };
    //----------------- END PUBLIC METHODS --------------------------------

    return {
        configModule : configModule,
        navigate : navigate,
        getResource : getResource,
        createResource : createResource,
        updateResource : updateResource,
        deleteResource : deleteResource,
        addRoute : addRoute,
        removeRoute : removeRoute
    };
}( window.jQuery ));
