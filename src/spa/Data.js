/**
 * Created by cwasser on 09.04.16.
 */
module.exports = (function ( $ ){
    'use strict';
    //------------------------- BEGIN MODULE SCOPE VARIABLES ------------------------------------
    var defaults = {
        serverUrl : '127.0.0.1:8000',
        format : 'json',
        data : {},
        timeout : 3000,
        password : '',
        username : ''
    },
        stateMap = $.extend( true, {}, defaults),
        allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'],

        initialized = false,

        configModule, loadData, _performAjaxRequest;
    //------------------------- END MODULE SCOPE VARIABLES --------------------------------------
    //------------------------- BEGIN INTERNAL METHODS ------------------------------------------
    _performAjaxRequest = function ( route, method, callback, opts ) {
        $.ajax({
            url : stateMap.serverUrl + route,
            data : opts.data,
            dataType : opts.format,
            error : function ( jqXHR, textStatus, errorThrown) {
                var data = {};
                // try to get the latest data from the history state History.getDataForCurrentRoute(route);
                console.log('-- AJAX fail');
                console.log(errorThrown + ' : ' + textStatus);
                callback(data);
            },
            method : method,
            password : opts.password,
            username : opts.username,
            processData : !!( $.isEmptyObject( opts.data ) ),
            success : function ( data, textStatus, jqXHR ) {
                // The data needs to be an object for the state,
                // so it needs to be mapped into one because data could be also an array or string
                var stateData = {
                    payload : data
                };
                $(window).trigger('jQuery.spa.currentStateUpdate', stateData);

                console.log('-- Data received --');
                console.log(data);
                console.log(textStatus);
                console.log(jqXHR);
                callback(data);
            },
            timeout : opts.timeout
        });
    };
    //------------------------- END INTERNAL METHODS --------------------------------------------
    //------------------------- BEGIN EVENT METHODS ---------------------------------------------
    //------------------------- END EVENT METHODS -----------------------------------------------
    //------------------------- BEGIN PUBLIC METHODS --------------------------------------------
    loadData = function ( route, method, callback, options ){
        // validate options for the AJAX request here
        if ( $.inArray( method.toUpperCase(), allowedMethods ) >= 0 ){
            var opts = $.extend( true, stateMap, options );
            if ( callback !== null && typeof callback === 'function') {
                _performAjaxRequest( route, method, callback, opts );
                return true;
            }
        }
        return false;
    };

    configModule = function ( options ) {
        if ( typeof options !== 'object' || options === null ) {
            throw 'SPA Router needs a JavaScript Object to be configured';
        }

        stateMap = $.extend( true, stateMap, options );
        console.log('configModule: successfully configurated');

        if ( !initialized ) {
            initialized = true;
        }
    };
    //------------------------- END PUBLIC METHODS ----------------------------------------------
    return {
        configModule : configModule,
        loadData : loadData
    };
}( window.jQuery ));
