/**
 * Created by cwasser on 09.04.16.
 */
var Router = (function() {
    'use strict';
    var History = require('./History'),
        testRouter;

    testRouter = function ( data ) {
        console.log('jquery.spa.Router: ' + data);
        History.testHistory('jquery.spa.Router: triggered History');
    };

    return {
        testRouter : testRouter
    };
}());

module.exports = Router;
