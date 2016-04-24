/**
 * Created by cwasser on 09.04.16.
 */
/**
 * spa/History.js
 * @description This component is responsible for all browser history management and URL manipulation.
 * It is able to use either the HTML5 History-API or the Hash method for the URL manipulation
 * and state management. It is completely decoupled from the other components of the jQuery
 * SPA plugin. So it can also be used as a standalone component.
 * @author Christian Wasser <admin@chwasser.de>
 * @type {{configModule, isStarted, navigate, getDataForCurrentState, updateCurrentState, run}}
 */
module.exports = (function ( $ ){
    'use strict';
    //------------------------- BEGIN MODULE SCOPE VARIABLES ------------------------------------
    var defaults = {
        hasHistoryApi : !!(window.history && history.pushState),
        history : !!(window.history && history.pushState) ? window.history : null,
        useHistoryApi : !!(window.history && history.pushState),
        historyHashStates : {}
        },
        stateMap = $.extend( true, {}, defaults),
        settablePropertyMap = {
            useHistoryApi : true,
            history : false,
            historyHashStates : false,
            hasHistoryApi : false
        },

        started = false,
        Util = require('./Util'),

        _onLocationChange, _shouldUpdateCurrentLocation, _loadRoute,
        configModule, isStarted, updateCurrentState, getDataForCurrentState, navigate, run;
    //------------------------- END MODULE SCOPE VARIABLES --------------------------------------
    //------------------------- BEGIN INTERNAL METHODS ------------------------------------------
    /**
     * @description This will trigger an custom event after the URL has changed to notify
     *      the application about the URL change regardless if the URL is an hash or normal URL.
     * @param route     - The route string with contains the current route from the URL. This
     *      will be attached to the fired event.
     * @fires <History>#jQuery.spa.locationChange   - Event which has the current URL route attached
     * @private
     */
    _loadRoute = function ( route ) {
        $(window).trigger('jQuery.spa.locationChange', {
            route : route
        });
    };

    /**
     * @description This function checks if the current URL should be updated with the given route
     *      depending on the jQuery SPA History configuration.
     * @param {string} route            - The route string to check with the current URL route
     * @returns {boolean}
     *      * true                      - The given route differs from the current URL route
     *      * false                     - The given route equals with the current URL route
     * @private
     */
    _shouldUpdateCurrentLocation = function ( route ) {
        var currentRoute;
        if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ) {
            currentRoute = window.location.pathname;
        } else {
            currentRoute = window.location.hash.substring(2);
        }
        return route !== currentRoute;
    };

    //------------------------- END INTERNAL METHODS --------------------------------------------
    //------------------------- BEGIN EVENT METHODS ---------------------------------------------
    /**
     * @description This function will add event listener for URL changes depending on the jQuery SPA
     *      History configuration, it will either add an event listener for the 'popstate' event or the
     *      'hashchange' event. Then it will call the History._loadRoute() function with the extracted
     *      route from the URL.
     * @listens <popstate> || <hashchange>
     * @private
     */
    _onLocationChange = function () {
        if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ) {
            $(window).on('popstate', function () {
                _loadRoute( window.location.pathname );
            });
        } else {
            $(window).on('hashchange', function () {
                var route = window.location.hash.substring(2);

                // In cases if we landing on the page without any URI, we have no route, so in cases
                // of an empty route, simply set it to the root
                if ( route === '' ) {
                    route = '/';
                }
                // Creating an empty entry within the stateMap for hashRoutes in case if there is no
                // existing one.
                if ( !stateMap.historyHashStates.hasOwnProperty( route ) ) {
                    stateMap.historyHashStates[ route ] = {};
                }

                _loadRoute( route );
            });
        }
    };
    //------------------------- END EVENT METHODS -----------------------------------------------
    //------------------------- BEGIN PUBLIC METHODS --------------------------------------------
    /**
     * @description This function will start the jQuery SPA History component. First it will check the
     *      started flag to never start the History more than onces. It will also register the event
     *      listeners for the URL via History._onLocationChange() and then triggers directly the
     *      corresponding event to directly process with actions for the current URL.
     * @fires <window>#popstate || <window>#hashchange
     */
    run = function () {
        if ( !started ) {
            started = true;
            _onLocationChange();

            if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ){
                $(window).trigger('popstate');
            } else {
                $(window).trigger('hashchange');
            }
        }
    };

    /**
     * @description This function will navigate the browser to an given route. Thus with this it will
     *      create a new entry in the state cache (History components own cache for hash usage or the
     *      History-API state cache for routes). It will also directly change the URL to the given route.
     * @param {string} route                - The route string to navigate the browser to.
     * @fires <window>#popstate || <window>#hashchange
     */
    navigate = function ( route ){
        if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ){
            if ( _shouldUpdateCurrentLocation( route ) ) {
                stateMap.history.pushState({
                    route : route,
                    data : {}
                }, null, route);
            }
            // Popstate needs to be triggered since it is usually only triggered by history back- and forward-buttons
            $(window).trigger('popstate');

        } else {
            if ( _shouldUpdateCurrentLocation( route ) ) {
                stateMap.historyHashStates[route] = {};
            }
            window.location = '/#!' + route;
        }
    };

    /**
     * @description This function will return the saved data in the corresponding cache for the given
     *      route. It will either use the History-API or the internal state cache for hash usage.
     *      If there is no data connected for the state, it will return an empty object.
     * @param {string} route                - The route string for identifying the state.
     * @returns {object}                    - The saved data from the state for the given route string.
     */
    getDataForCurrentState = function ( route ) {
        var data = {};
        if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ) {
            if ( stateMap.history.state !== null && typeof stateMap.history.state.hasOwnProperty('payload') ) {
                data = stateMap.history.state.payload;
            }
        } else {
            if ( stateMap.historyHashStates.hasOwnProperty( route ) ) {
                data = stateMap.historyHashStates[route].payload;
            }
        }
        return data;
    };

    /**
     * @description This function will update the current state for a given route with the given data.
     *      It will either use the History-API or the internal state cache, depending on the components
     *      configuration.
     * @param {string} route                - The route string for identifying the state.
     * @param {object} data                 - The new data which should be saved for the state of the given route.
     * @returns {boolean}
     *      * true                          - If the state for a given route is updated with the new data.
     *      * false                         - If no update of a state occured.
     */
    updateCurrentState = function ( route, data ) {
        if ( stateMap.useHistoryApi && stateMap.hasHistoryApi ) {
            stateMap.history.replaceState( data, null, route );
            return true;
        } else {
            if ( stateMap.historyHashStates.hasOwnProperty( route ) ) {
                stateMap.historyHashStates[route] = data;
                return true;
            }
        }
        return false;
    };

    /**
     * @description This function will return a boolean for identifying if the History component has
     *      already started or not yet.
     * @returns {boolean}
     *      * true                          - The jQuery SPA History has started already.
     *      * false                         - The jQuery SPA History has not started yet.
     */
    isStarted = function () {
        return started;
    };

    /**
     * @description This function will configure the jQuery SPA History component with some
     *      options from outside. A call of this function is not required, because by default
     *      the component will contain a default configuration. But to configure the component
     *      to use another behaviour this function should be called.
     * @param {object} options              - An javascript object which contains the options
     *      to configure this component. Allowed options are:
     *      * options.useHistoryApi         - An boolean to configure the component to use the
     *              History-API on true or the hash changes for the URL on false.
     * @example
     *      History.configModule({
     *          useHistoryApi : true
     *      });
     */
    configModule = function ( options ) {
        if ( typeof options !== 'object' || options === null ) {
            throw "SPA History needs a JavaScript Object to be configured";
        }

        // Set stateMap by the given options
        Util.setStateMap({
            stateMap : stateMap,
            settablePropertyMap : settablePropertyMap,
            inputMap : options
        });
    };
    //------------------------- END PUBLIC METHODS ----------------------------------------------
    return {
        configModule : configModule,
        isStarted : isStarted,
        navigate : navigate,
        getDataForCurrentState : getDataForCurrentState,
        updateCurrentState : updateCurrentState,
        run : run
    };
}( window.jQuery ));
