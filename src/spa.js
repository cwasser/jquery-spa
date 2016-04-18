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

            configModule, addRoute, removeRoute, navigate, run;
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

        //Proxy Router.navigate()
        navigate = function ( route, httpMethod ) {
            if ( hasStarted ) {
                Router.navigate(route, httpMethod);
            } else {
                throw 'Method spa.navigate() can not be called without starting the plugin, please call spa.run() before';
            }
        };

        run = function () {
            if ( !hasStarted ){
                // Trigger the first hasChange or popState for triggering
                // the corresponding action for the current URL (support bookmarks)
                History.run();
                hasStarted = true;
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
            run : run,
            Data : Data,
            History : History,
            Router : Router
        };
    }( $ ));
}( window.jQuery ));

