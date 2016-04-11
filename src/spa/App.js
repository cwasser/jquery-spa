/**
 * Created by cwasser on 09.04.16.
 */
var App = (function (){
    'use strict';
    var Data = require('./Data'),
        History = require('./History'),
        Router = require('./Router'),
        testApp;

    testApp = function ( data ){
        console.log('jquery.spa.App: ' + data);
        Data.testData('data test');
        History.testHistory('history test');
        Router.testRouter('router test');
    };

    return {
        testApp : testApp
    };
}());

module.exports = App;
