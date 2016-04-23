/**
 * Created by cwasser on 23.04.16.
 */
module.exports = (function () {
    'use strict';
    //----------------- BEGIN MODULE SCOPE VARIABLES ----------------------
    var setStateMap;
    //----------------- END MODULE SCOPE VARIABLES ------------------------
    //----------------- BEGIN INTERNAL METHODS ----------------------------
    //----------------- END INTERNAL METHODS ------------------------------
    //----------------- BEGIN PUBLIC METHODS ------------------------------
    /**
     * Purpose  : This helper function will set the properties of a given map
     *      to the property values of the given input map, depending on the values
     *      of a given map with the allowed properties for the given map.
     * Notice   : This functions works with references, that means it will not return
     *      any new object but simply change properties of the given args.stateMap.
     * @param args      - An object which contains the maps. args should have the following format:
     *      * args.stateMap : {}    - A javascript object which is the map to change. Properties
     *                  of this should be defined in args.settablePropertyMap.
     *      * args.inputMap : {}    - A javascript object which contains the new properties for the
     *                  args.stateMap. Property of this map will be checked by args.settablePropertyMap.
     *      * args.settablePropertyMap : {} - A javascript object which represents all settable
     *                  properties for the args.stateMap. The object must have the following key value
     *                  pairs: [propertyName] : true | false. True or false represents if the property is
     *                  activated or not to set.
     */
    setStateMap = function ( args ) {
        var
            stateMap = args.hasOwnProperty('stateMap') ? args['stateMap'] : {},
            inputMap = args.hasOwnProperty('inputMap') ? args['inputMap'] : {},
            settablePropertyMap = args.hasOwnProperty('settablePropertyMap') ?
                args['settablePropertyMap'] : {},
            keyName;

        for ( keyName in inputMap ) {
            if ( inputMap.hasOwnProperty( keyName ) ) {
                // The property of the inputMap is set
                if ( settablePropertyMap.hasOwnProperty( keyName ) ) {
                    // settableProperMap contains the property
                    if ( !!settablePropertyMap[keyName] ) {
                        // It is settable and allowed to set
                        stateMap[keyName] = inputMap[keyName];
                    }
                }
            }
            // If nothing of all requirements fits, then simply ignore the property from the inputMap.
            // It is also possible to throw an error, but right now, simply ignore it.
        }
    };
    //----------------- END PUBLIC METHODS --------------------------------
    return {
        setStateMap : setStateMap
    };
}());
