/**
 * Created by cwasser on 09.04.16.
 */
/**
 * @description This component is responsible for all asynchronous data retrieval in the jQuery
 *      SPA plugin. It is configurable to use different servers and also different data types.
 *      It is used by the jQuery SPA Router component.
 * @author Christian Wasser <admin@chwasser.de>
 * @type {{configModule, performRequest}}
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
            username : '',
            allowedMethods : ['GET', 'POST', 'PUT', 'DELETE']
        },
        stateMap = $.extend( true, {}, defaults),
        settablePropertyMap = {
            serverUrl : true,
            format : true,
            contentType : true,
            data : false,
            timeout : true,
            password : true,
            username : true,
            allowedMethods : false
        },

        History = require('./History'),
        Util = require('./Util'),

        configModule, performRequest, _performAjaxRequest;
    //------------------------- END MODULE SCOPE VARIABLES --------------------------------------
    //------------------------- BEGIN INTERNAL METHODS ------------------------------------------
    /**
     * @description This internal function will perform an AJAX request with the given parameters.
     *      It will also use the configured general AJAX options. It will call the callback always,
     *      regardless if an error occurred or the request was successful. It will always
     *      request the configured server with the given route.
     * @param {string} route                - The route for the AJAX request.
     * @param {string} method               - The HTTP method connected to the route, either
     *      'GET', 'POST', 'PUT' or 'DELETE'.
     * @param {Function} callback           - The callback function which is always executed
     *      after a response from the server.
     * @param {object} opts                 - optional options for the AJAX request, for the
     *      standard options @see jQuery.ajax(). Additionally it is possible to use History
     *      related options like useHistoryStateFallback and shouldTriggerStateUpdate. If these
     *      flags are set to true, it will call the corresponding function of the jQuery SPA
     *      History before the callback is executed.
     * @private
     */
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
                callback( data, jqXHR, textStatus, errorThrown );
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
                callback( stateData.payload, jqXHR, textStatus );
            },
            timeout : opts.timeout
        });
    };
    //------------------------- END INTERNAL METHODS --------------------------------------------
    //------------------------- BEGIN EVENT METHODS ---------------------------------------------
    //------------------------- END EVENT METHODS -----------------------------------------------
    //------------------------- BEGIN PUBLIC METHODS --------------------------------------------
    /**
     * @description This function will call the internal _performAjaxRequest() function, it
     *      proxies the usage of the AJAX request but it will also do some validation on the
     *      given method and callback.
     * @param {string} route            - The route on the, in this component configured, server.
     * @param {string} method           - The HTTP method for the AJAX request, available methods
     *      are 'GET', 'POST', 'PUT' and 'DELETE'.
     * @param {Function} callback       - The callback function which is always executed after
     *      the response from the server.
     * @param {options} options         - Additional options for the AJAX request. Available options are:
     *      * data : {object}           - The data which should be send within the AJAX request.
     *          Default it is an empty object.
     *      * contentType : {string}    - The content type for the AJAX request. By default it is
     *          set to 'application/json; charset=UTF-8'.
     *      * format : {string}         - The format of the data to be send and retrieve from the
     *          server, by default it is set to 'json'.
     *      * username : {string}       - A username which is potentially required from the server for
     *          the authentication.
     *      * password : {string}       - The password which is potentially require from the server
     *          for the authentication.
     *      * timeout : {int}           - A timeout for the AJAX request in milliseconds. By default
     *          it is set to 3000 ms.
     *      * shouldTriggerStateUpdate : {boolean}  - Additionally option to trigger a state update
     *          for the jQuery SPA History after a successful AJAX retrieval. This update will occur
     *          before the callback is called.
     *      * useHistoryStateFallback : {boolean}   - Additionally option to retrieve the latest
     *          state data for the given route from the jQuery SPA History on any AJAX errors.
     *          This retrieval from the History will occur before the given callback is called.
     * @returns {boolean}
     *      * true                      - The AJAX request is performing for the given parameters.
     *      * false                     - Any validation error occurred, so no AJAX call is executed.
     */
    performRequest = function ( route, method, callback, options ){
        // validate options for the AJAX request here
        if ( $.inArray( method.toUpperCase(), stateMap.allowedMethods ) >= 0 ) {
            var opts = $.extend( true, {}, stateMap, options );

            if ( callback !== null && typeof callback === 'function' ) {
                _performAjaxRequest( route, method, callback, opts );
                return true;
            }

        }
        return false;
    };

    /**
     * @description This function will configure the jQuery SPA Data component with some
     *      options from outside. A call of this function is not required, because by default
     *      the component will contain a default configuration.
     * @param {object} options          - An javascript object which contains the options to
     *      configure this component. Allowed options are:
     *      * serverUrl : {string}      - The URL string to define the server where the AJAX request
     *          later on should be send to.
     *      * contentType : {string}    - The content type for the AJAX request. By default it is
     *          set to 'application/json; charset=UTF-8'.
     *      * format : {string}         - The format of the data to be send and retrieve from the
     *          server, by default it is set to 'json'.
     *      * username : {string}       - A username which is potentially required from the server for
     *          the authentication.
     *      * password : {string}       - The password which is potentially require from the server
     *          for the authentication.
     *      * timeout : {int}           - A timeout for the AJAX request in milliseconds. By default
     *          it is set to 3000 ms.
     * @example
     *      Data.configModule({
     *          serverUrl : 'http://localhost:8000/any/api',
     *          contentType : 'application/json; charset=utf-8',
     *          format : 'json',
     *          username : 'example',
     *          password : 'example',
     *          timeout : 3000
     *      });
     */
    configModule = function ( options ) {
        if ( typeof options !== 'object' || options === null ) {
            throw 'SPA Router needs a JavaScript Object to be configured';
        }

        Util.setStateMap({
            stateMap : stateMap,
            settablePropertyMap : settablePropertyMap,
            inputMap : options
        });
    };
    //------------------------- END PUBLIC METHODS ----------------------------------------------
    return {
        configModule : configModule,
        performRequest : performRequest
    };
}( window.jQuery ));
