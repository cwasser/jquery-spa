/*
 * jQuery.spa.js
 * This file handles all the plugin exports for the final plugin functionality.
 *
 * Copyright (c) 2016 Christian Wasser
 * Licensed under the MIT license.
 */
(function ( $ ) {

    // First check the hard dependencies for this plugin
    if ( typeof $ !== "function" || $ === undefined ){
        throw "jQuery.spa has a hard dependency on jQuery";
    }

    $.spa =  (function () {
        //------------------------- BEGIN MODULE SCOPE VARIABLES ------------------------------------
        var Data = require('./spa/Data'),
            History = require('./spa/History'),
            Router = require('./spa/Router'),

            hasStarted = false,

            configModule, configHistory, configRouter, configData,
            addRoutes, addRoute, removeRoute,
            navigate, createResource, updateResource, deleteResource,
            run;
        //------------------------- END MODULE SCOPE VARIABLES --------------------------------------
        //------------------------- BEGIN INTERNAL METHODS ------------------------------------------
        //------------------------- END INTERNAL METHODS --------------------------------------------
        //------------------------- BEGIN EVENT METHODS ---------------------------------------------
        //------------------------- END EVENT METHODS -----------------------------------------------
        //------------------------- BEGIN PUBLIC METHODS --------------------------------------------
        /**
         * This function will navigate to the given route.
         * Depending on the routing configuration will additionally try to fetch
         * additional information for the route via GET from the in the Data module
         * configured server.
         * @throws exception if the spa is not started yet (spa.run())
         * @param route
         */
        navigate = function ( route ) {
            if ( hasStarted ) {
                Router.navigate( route );
            } else {
                throw 'Method spa.navigate() can not be called without starting the plugin, please call spa.run() before';
            }
        };

        createResource = function ( route, data ) {
            if ( hasStarted ) {
                Router.createResource( route, data );
            } else {
                throw 'Method spa.createResource() can not be called without starting the plugin, please call spa.run() before';
            }
        };

        updateResource = function ( route, data ) {
            if ( hasStarted ) {
                Router.updateResource( route, data );
            } else {
                throw 'Method spa.updateResource() can not be called without starting the plugin, please call spa.run() before';
            }
        };

        deleteResource = function ( route ) {
            if ( hasStarted ) {
                Router.deleteResource( route );
            } else {
                throw 'Method spa.deleteResource() can not be called without starting the plugin, please call spa.run() before';
            }
        };

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

        addRoute = function ( route, callback, options ) {
            // Simply proxy the Router.addRoute() call
            Router.addRoute( route, callback, options );
            //allow chaining of addRoute
            return this;
        };

        /**
         * Purpose  : This function allows the user of the plugin to direct add more than one
         *      route configuration as an array of route configurations to the plugin. Internally
         *      it will call the jQuery.spa.addRoute() method for each route configuration object.
         * @param routes        - An array of route configuration objects. For a single route
         *                  configuration object @see jQuery.spa.addRoute(...).
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

        removeRoute = function ( route, httpMethod ) {
            // Simply proxy the Router.removeRoute() call
            Router.removeRoute( route, httpMethod );
            //allow chaining of removeRoute
            return this;
        };

        /**
         * Purpose  : This function proxies the History.configModule function, because the History
         *      component should not be accessible from outside of the plugin at all.
         * @param options       - A javascript object which will configure the History component, which is
         *                  responsible for all browser history actions and URL manipulation. For further information
         *                  about the available History configuration @see History::configModule (src/History.js).
         */
        configHistory = function ( options ) {
            History.configModule( options );
        };

        /**
         * Purpose  : This function proxies the Router.configModule function, because the Router
         *      component should not be accessible from outside of the plugin at all.
         * @param options       - A javascript object which will configure the Router component
         *                  for further information about the available Router configuration @see Router::configModule()
         *                  (src/Router.js).
         */
        configRouter = function ( options ) {
            Router.configModule( options );
        };

        /**
         * Purpose  : This function proxies the Data.configModule function, because the Data
         *      component should not be accessible from outside of the plugin at all.
         * @param options       - A javascript object which will configure the Data component, which is
         *                  responsible for all asynchronous server requests. For further information about the
         *                  available Data configuration @see Data::configModule (src/Data.js).
         */
        configData = function ( options ) {
            Data.configModule( options );
        };

        /**
         * Purpose  : This function will configure all components of the jQuery spa plugin in once.
         * @param options      - An javascript object which contains the whole plugin configuration
         *      * options.routerConfig : {}    - @see jQuery.spa.configRouter( options ).
         *      * options.dataConfig : {}    - @see jQuery.spa.configData( options ).
         *      * options.historyConfig : {} - @see jQuery.spa.configHistory( options ).
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
            // Navigate to a configured route (can also contain a GET request)
            navigate : navigate,
            // POST, PUT and DELETE request via AJAX
            createResource : createResource,
            updateResource : updateResource,
            deleteResource : deleteResource,
            // Starting the plugin - NECESSARY
            run : run
        };
    }());
}( window.jQuery ));

