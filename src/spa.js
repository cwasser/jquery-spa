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

    $.spa =  (function ( $ ) {
        //------------------------- BEGIN MODULE SCOPE VARIABLES ------------------------------------
        var Data = require('./spa/Data'),
            History = require('./spa/History'),
            Router = require('./spa/Router'),
            defaults = {
                Data : Data,
                History : History,
                Router : Router
            },
            stateMap = $.extend( true, {}, defaults),

            hasStarted = false,

            configModule, addRoute, removeRoute, navigate, createResource, updateResource, deleteResource, run;
        //------------------------- END MODULE SCOPE VARIABLES --------------------------------------
        //------------------------- BEGIN INTERNAL METHODS ------------------------------------------
        //------------------------- END INTERNAL METHODS --------------------------------------------
        //------------------------- BEGIN EVENT METHODS ---------------------------------------------
        //------------------------- END EVENT METHODS -----------------------------------------------
        //------------------------- BEGIN PUBLIC METHODS --------------------------------------------

        configModule = function ( options ){
            if ( typeof options !== 'object' || options === null ) {
                throw "The jQuery SPA plugin needs a JavaScript Object to be configured'";
            }

            stateMap = $.extend( true, stateMap, options );

            if ( !hasStarted ){
                hasStarted = true;
            }
        };

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

        addRoute = function ( route, callback, isResource, httpMethod, options ) {
            // Simply proxy the Router.addRoute() call
            Router.addRoute( route, callback, isResource, httpMethod, options );
            //allow chaining of addRoute
            return this;
        };

        removeRoute = function ( route, httpMethod ) {
            // Simply proxy the Router.removeRoute() call
            Router.removeRoute( route, httpMethod );
            //allow chaining of removeRoute
            return this;
        };
        //------------------------- END PUBLIC METHODS ----------------------------------------------
        return {
            configModule : configModule,
            addRoute : addRoute,
            removeRoute : removeRoute,
            navigate : navigate,
            createResource : createResource,
            updateResource : updateResource,
            deleteResource : deleteResource,
            run : run,
            Data : Data,
            History : History,
            Router : Router
        };
    }( $ ));
}( window.jQuery ));

