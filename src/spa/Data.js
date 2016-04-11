/**
 * Created by cwasser on 09.04.16.
 */
var Data = (function (){
    'use strict';
    var testData;

    testData = function ( data ) {
        console.log('jquery.spa.Data: '+data);
    };

    return {
        testData : testData
    };
}());

module.exports = Data;
