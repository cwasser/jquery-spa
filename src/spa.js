/*
 * jQuery.spa.js
 * This file handles all the plugin exports for the final plugin functionality.
 *
 * Copyright (c) 2016 Christian Wasser
 * Licensed under the MIT license.
 */
var _ = require('lodash');

(function ( $, _ ) {
    'use strict';
    // First check the hard dependencies for this plugin
    if ( typeof $ !== 'function' || $ === undefined ) {
        throw 'jQuery.spa has a hard dependency on jQuery';
    }

    if ( typeof _ !== 'function' || _ === undefined ) {
        throw 'jQuery.spa has a hard dependency on lodash';
    }

    /**
     * @description This is the main entry point for the plugin usage. It offers the public API for the jQuery SPA plugin
     *      usage and proxies the public functions of the internal components. The most important internal
     *      component are the Data, the History and the Router component.
     *      The plugin has dependencies to jQuery and the lodash library for some utility functions.
     *      The plugin provides simple Single Page Application functionality like browser history support,
     *      dynamic data retrieval, URL manipulation without any reload, application state management within
     *      the History component, a Router component as a dispatcher for routes to callbacks. All components
     *      contain default values and are configurable.
     * @author Christian Wasser <admin@chwasser.de>
     * @type {{configModule, configHistory, configData, configRouter, addRoutes, addRoute, removeRoute, navigate, getResource, createResource, updateResource, deleteResource, run}}
     */
    $.spa =  (function () {
        //------------------------- BEGIN MODULE SCOPE VARIABLES ------------------------------------
        // Load internal components
        var Data = require('./spa/Data'),
            History = require('./spa/History'),
            Router = require('./spa/Router'),

            // component started?
            hasStarted = false,

            configModule, configHistory, configRouter, configData,
            addRoutes, addRoute, removeRoute, hasRoute,
            navigate, createResource, updateResource, deleteResource, getResource,
            run;
        //------------------------- END MODULE SCOPE VARIABLES --------------------------------------
        //------------------------- BEGIN INTERNAL METHODS ------------------------------------------
        //------------------------- END INTERNAL METHODS --------------------------------------------
        //------------------------- BEGIN EVENT METHODS ---------------------------------------------
        //------------------------- END EVENT METHODS -----------------------------------------------
        //------------------------- BEGIN PUBLIC METHODS --------------------------------------------
        /**
         * @see <spa/Router.js>#navigate(route)
         * @see <spa/History.js>#navigate(route)
         * @description This function will navigate to the given route.
         *      Depending on the routing configuration will additionally try to fetch
         *      additional information for the route via GET from the in the Data module
         *      configured server.
         * @throws exception        - If the SPA plugin is not started yet (spa.run()).
         * @param {string} route
         */
        navigate = function ( route ) {
            if ( hasStarted ) {
                Router.navigate( route );
            } else {
                throw 'Method spa.navigate() can not be called without starting the plugin, please call spa.run() before';
            }
        };

        /**
         * @see <spa/Router.js>#createResource(route,data)
         * @description This function will create a new resource on the, in the plugin configured, server.
         *      It will use an AJAX request with the 'POST' method. It does no manipulation of the history nor URL.
         * @param {string} route            - The route string to identify the resource on the server.
         * @param {object} data             - The data object which should be posted to the server.
         */
        createResource = function ( route, data ) {
            Router.createResource( route, data );
        };

        /**
         * @see <spa/Router.js>#updateResource(route,data)
         * @description This function will update an existing resource on the, in the plugin configured, server.
         *      It will use an AJAX request with the 'PUT' method. It does no manipulation of the history nor of the URL.
         * @param {string} route            - The route string to identify the resource on the server.
         * @param {object} data             - The data object with which the resource should be updated.
         */
        updateResource = function ( route, data ) {
            Router.updateResource( route, data );
        };

        /**
         * @see <spa/Router.js>#deleteResource(route)
         * @description This function will delete an existing resource on the, in the plugin configured, server.
         *      It will use an AJAX request with the 'DELETE' method. It does no manipulation of the history nor of the URL.
         * @param {string} route            - The route which is identifying the resource on the server.
         */
        deleteResource = function ( route ) {
            Router.deleteResource( route );
        };

        /**
         * @see <spa/Router.js>#getResource(route)
         * @description This function will get an existing resource on the, in the plugin configured, server.
         *      It will use an AJAX request with the 'GET' method. It does no manipulation of the history nor of the URL.
         * @param {string} route            - The route which is identifying the resource on the server.
         */
        getResource = function ( route ) {
            Router.getResource( route );
        };

        /**
         * @see also <spa/History.js>#run()
         * @description This function will start the whole plugin, it also possible to do configurations of components
         *      or adding routes after the plugin has started. It will also call the History component to start listening
         *      on the browser history/URL events. After calling this function it is not anymore possible to
         *      change the History configuration. This means the plugin will either use the HTML5 History-API
         *      or the hash based URL.
         * @throws exception                - If the SPA plugin is already started.
         */
        run = function () {
            if ( !hasStarted ){
                hasStarted = true;
                // Trigger the first hasChange or popState for triggering
                // the corresponding action for the current URL (support bookmarks)
                History.run();
            } else {
                throw 'The SPA plugin has started already';
            }
        };

        /**
         * @see <spa/Router.js>#addRoute(route,callback,options)
         * @description This function will add a new route configuration to the SPA plugin. Necessary
         *      parameters are the route and the callback, which should be added. Options are optional, by
         *      default the Plugin will assign some defaults to the route configuration.
         *      httpMethod : 'GET',
         *      isResource : false,
         *      shouldTriggerStateUpdate : false,
         *      useHistoryStateFallback : false
         * @param {string} route            - The new route which should be added.
         * @param {Function} callback       - The callback function which should be executed if the
         *      route is executed via the SPA public API.
         * @param {object} options          - Optional options for the new route configuration.
         *      Allowed options are:
         *      * isResource : {boolean}    - This flag defines if the route is connected to an
         *          resource on the configured web server. By default false.
         *      * httpMethod : {string}     - This string defines the connected HTTP method for
         *          the route. By default it is set to 'GET'.
         *      * shouldTriggerStateUpdate : {boolean} - This flag is only valid for routes with
         *          isResource : true and httpMethod : 'GET'. It will trigger an state update
         *          of the history state for the given route if the data retrieval was successful
         *          and is executed before the callback takes in.
         *      * useHistoryStateFallback : {boolean}  - This flag is only valid for routes with
         *          isResource : true and httpMethod : 'GET'. It will use the History state for the
         *          given route if an AJAX request fails to retrieve the latest data from the state.
         *          After this it will execute the callback.
         */
        addRoute = function ( route, callback, options ) {
            // Simply proxy the Router.addRoute() call
            Router.addRoute( route, callback, options );
        };

        /**
         * @see <spa/Router.js>#addRoute(route,callback,options)
         * @see <spa.js>#addRoute(route,callback,options)
         * @description This function allows the user of the plugin to direct add more than one
         *      route configuration as an array of route configurations to the plugin. Internally
         *      it will call the jQuery.spa.addRoute() method for each route configuration object.
         * @param {array} routes            - An array of route configuration objects.
         *      For a single route configuration object @see <spa.js>#addRoute(route,callback,options).
         */
        addRoutes = function ( routes ) {
            if ( routes instanceof Array ) {
                for(var i = 0; i < routes.length; i++ ) {
                    if ( typeof routes[i] === 'object'){
                        var route = routes[i];
                        if(
                            route.hasOwnProperty('route') &&
                            route.hasOwnProperty('callback') &&
                            route.hasOwnProperty('options')
                        ) {
                            addRoute(
                                route.route,
                                route.callback,
                                route.options
                            );
                        }
                    } else {
                        throw 'jQuery.spa.addRoutes: A single route configuration must be an object';
                    }
                }
            } else {
                throw 'jQuery.spa.addRoutes: needs an array of route configuration as an parameter';
            }
        };

        /**
         * @see <spa/Router.js>#removeRoute(route,httpMethod)
         * @description This function will remove an existing route configuration from the jQuery
         *      SPA plugin. It simply proxies the Router.js#removeRoute() function.
         * @param {string} route            - The route which identifies the configuration which should be deleted.
         * @param {string} httpMethod       - The HTTP method connected to the route to identify the to removed configuration.
         */
        removeRoute = function ( route, httpMethod ) {
            // Simply proxy the Router.removeRoute() call
            Router.removeRoute( route, httpMethod );
        };

        /**
         * @see <spa/Router.js>#hasRoute(route,httpMethod)
         * @description This function will check if the jQuery SPA plugin contains already an
         *      existing route configuration for the given route and HTTP method.
         * @param {string} route            - The route to looking for in the configuration.
         * @param {string} httpMethod       - The HTTP method to looking for in the configuration connected
         *      to the Route.
         * @returns {boolean}
         *      * true                      - The jQuery SPA plugin contains an existing route configuration
         *          for the given route and HTTP method.
         *      * false                     - The jQuery SPA plugin does not contain an existing route
         *          configuration for the given route and HTTP method.
         */
        hasRoute = function ( route, httpMethod ) {
            // Simply proxy the Router.hasRoute() call
            return Router.hasRoute( route, httpMethod );
        };

        /**
         * @see <spa/History.js>#configModule(options)
         * @description This function proxies the History.configModule function, because the History
         *      component should not be accessible from outside of the plugin at all.
         * @param options       - A javascript object which will configure the History component, which is
         *      responsible for all browser history actions and URL manipulation. For further information
         *      about the available History configuration @see <spa/History.js>#configModule(options).
         * @example
         *      jQuery.spa.configHistory({
         *          useHistoryApi : true
         *      });
         */
        configHistory = function ( options ) {
            History.configModule( options );
        };

        /**
         * @see <spa/Router.js>#configModule(options)
         * @description This function proxies the Router.configModule function, because the Router
         *      component should not be accessible from outside of the plugin at all.
         * @param options       - A javascript object which will configure the Router component
         *      for further information about the available Router configuration @see <spa/Router.js>#configModule(options).
         * @example
         *      jQuery.spa.configRouter({
         *
         *      });
         */
        configRouter = function ( options ) {
            Router.configModule( options );
        };

        /**
         * @see <spa/Data.js>#configModule(options)
         * @description This function proxies the Data.configModule function, because the Data
         *      component should not be accessible from outside of the plugin at all.
         * @param options       - A javascript object which will configure the Data component, which is
         *      responsible for all asynchronous server requests. For further information about the
         *      available Data configuration @see <spa/Data.js>#configModule(options).
         * @example
         *      jQuery.spa.configData({
         *          serverUrl : 'http://localhost:8000/any/api',
         *          contentType : 'application/json; charset=utf-8',
         *          format : 'json',
         *          username : 'example',
         *          password : 'example',
         *          timeout : 3000
         *      });
         */
        configData = function ( options ) {
            Data.configModule( options );
        };

        /**
         * @see <spa.js>#configRouter(options)
         * @see <spa.js>#configData(options)
         * @see <spa.js>#configHistory(options)
         * @description This function will configure all components of the jQuery spa plugin in once.
         * @param options      - An javascript object which contains the whole plugin configuration
         *      * options.routerConfig : {}     - @see <spa.js>#configRouter(options).
         *      * options.dataConfig : {}       - @see <spa.js>#configData(options).
         *      * options.historyConfig : {}    - @see <spa.js>#configHistory(options).
         * @example
         *      jQuery.spa.configModule({
         *          historyConfig : { @see <spa.js>#configHistory(options) },
         *          dataConfig : { @see <spa.js>#configData(options) },
         *          routerConfig : { @see <spa.js>#configRouter(options) }
         *      });
         */
        configModule = function ( options ){
            var historyConfigName = 'historyConfig',
                routerConfigName = 'routerConfig',
                dataConfigName = 'dataConfig';

            if ( typeof options !== 'object' || options === null ) {
                throw "The jQuery SPA plugin needs a JavaScript Object to be configured'";
            }

            if ( options.hasOwnProperty(historyConfigName) ) {
                if ( typeof options[historyConfigName] === 'object' ) {
                    configHistory( options[historyConfigName] );
                }
            }
            if ( options.hasOwnProperty(routerConfigName) ) {
                if ( typeof options[routerConfigName] === 'object' ) {
                    Router.configModule( options[routerConfigName] );
                }
            }
            if ( options.hasOwnProperty(dataConfigName) ) {
                if ( typeof options[dataConfigName] === 'object' ) {
                    Data.configModule( options[dataConfigName] );
                }
            }
        };

        //------------------------- END PUBLIC METHODS ----------------------------------------------
        return {
            // Plugin configuration functions
            configModule : configModule,
            configHistory : configHistory,
            configData : configData,
            configRouter : configRouter,
            // Adding and remove configuration for routes
            addRoutes : addRoutes,
            addRoute : addRoute,
            removeRoute : removeRoute,
            hasRoute : hasRoute,
            // Navigate to a configured route (can also contain a GET request)
            navigate : navigate,
            // GET, POST, PUT and DELETE request via AJAX
            getResource : getResource,
            createResource : createResource,
            updateResource : updateResource,
            deleteResource : deleteResource,
            // Starting the plugin - NECESSARY
            run : run
        };
    }());
}( window.jQuery, _ ));

