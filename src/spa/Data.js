/**
 * Created by cwasser on 09.04.16.
 */
module.exports = (function ( $ ){
    'use strict';
    //------------------------- BEGIN MODULE SCOPE VARIABLES ------------------------------------
    var defaults = {
        serverUrl : '127.0.0.1:8000',
        format : 'json',
        contentType : 'application/json; charset=utf-8',
        data : {},
        timeout : 3000,
        password : '',
        username : ''
    },
        stateMap = $.extend( true, {}, defaults),
        allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'],
        History = require('./History'),

        configured = false,

        configModule, performRequest, _performAjaxRequest, isConfigured;
    //------------------------- END MODULE SCOPE VARIABLES --------------------------------------
    //------------------------- BEGIN INTERNAL METHODS ------------------------------------------
    _performAjaxRequest = function ( route, method, callback, opts ) {
        $.ajax({
            url : stateMap.serverUrl + route,
            data : JSON.stringify( opts.data ),
            contentType : opts.contentType,
            dataType : opts.format,
            error : function ( jqXHR, textStatus, errorThrown) {
                var data = {};
                // try to get the latest data from the history state if the data is set;
                if (
                        typeof opts.useHistoryStateFallback !== 'undefined' &&
                        !! opts.useHistoryStateFallback
                   )
                {
                    data = History.getDataForCurrentState( route );
                }
                console.log('-- AJAX fail');
                console.log(errorThrown + ' : ' + textStatus);
                callback(data);
            },
            method : method,
            password : opts.password,
            username : opts.username,
            processData : !!( $.isEmptyObject( opts.data ) ),
            success : function ( data, textStatus, jqXHR ) {
                // The data needs to be an object for the state storing in the HTML5 History-API,
                // so it needs to be mapped into one because data could be also an array or string
                var stateData = {
                    payload : data
                };

                // Triggers a history state update for the current URL, this should be only used by the plugin
                // itself
                if (
                    typeof opts.shouldTriggerStateUpdate !== 'undefined' &&
                    opts.shouldTriggerStateUpdate
                ) {
                    History.updateCurrentState( route, stateData );
                }

                console.log('-- Data received --');
                console.log(data);
                console.log(textStatus);
                console.log(jqXHR);
                callback( stateData.payload);
            },
            timeout : opts.timeout
        });
    };
    //------------------------- END INTERNAL METHODS --------------------------------------------
    //------------------------- BEGIN EVENT METHODS ---------------------------------------------
    //------------------------- END EVENT METHODS -----------------------------------------------
    //------------------------- BEGIN PUBLIC METHODS --------------------------------------------
    performRequest = function ( route, method, callback, options ){
        // validate options for the AJAX request here
        if ( $.inArray( method.toUpperCase(), allowedMethods ) >= 0 ) {
            var opts = $.extend( true, {}, stateMap, options );

            if ( callback !== null && typeof callback === 'function' ) {
                _performAjaxRequest( route, method, callback, opts );
                return true;
            }

        }
        return false;
    };

    isConfigured = function () {
        return configured;
    };

    configModule = function ( options ) {
        if ( typeof options !== 'object' || options === null ) {
            throw 'SPA Router needs a JavaScript Object to be configured';
        }

        stateMap = $.extend( true, stateMap, options );
        console.log('configModule: successfully configurated');

        if ( !configured ) {
            configured = true;
        }
    };
    //------------------------- END PUBLIC METHODS ----------------------------------------------
    return {
        configModule : configModule,
        isConfigured : isConfigured,
        performRequest : performRequest
    };
}( window.jQuery ));
