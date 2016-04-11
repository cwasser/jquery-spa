/**
 * Created by cwasser on 09.04.16.
 */

var History = (function (){
    'use strict';
    var testHistory;

    testHistory = function ( data ) {
        console.log('jquery.spa.History: ' + data);
    };

    return {
        testHistory : testHistory
    };
}());

module.exports = History;
