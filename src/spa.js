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

    $.spa = (function ( $ ) {
        var App = require('./spa/App'),
            Data = require('./spa/Data'),
            History = require('./spa/History'),
            Router = require('./spa/Router'),
            testAll,
            settings = {
                App : App,
                Data : Data,
                History : History,
                Router : Router
            };

        testAll = function() {
            window.console.log('RUNNING TEST ALL');
            window.console.log('defined components are : ' + settings);
            $.each(settings, function( component ){
                component.call('test' + component );
            });
        };

        return {
            testAll : testAll,
            App : App,
            Data : Data,
            History : History,
            Router : Router
        };
    }( $ ));
}( jQuery || $));

