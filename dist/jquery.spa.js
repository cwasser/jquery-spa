(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * jQuery.spa.js
 * This file handles all the plugin exports for the final plugin functionality.
 *
 * Copyright (c) 2016 Christian Wasser
 * Licensed under the MIT license.
 */
jQuery.spa = (function ( $ ) {
    'use strict';
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
}( jQuery ));

},{"./spa/App":2,"./spa/Data":3,"./spa/History":4,"./spa/Router":5}],2:[function(require,module,exports){
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

},{"./Data":3,"./History":4,"./Router":5}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./History":4}]},{},[3,4,5,2,1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY3dhc3Nlci9Ecm9wYm94L1ByaXZhdF9TdHVkaXVtLzhfU2VtZXN0ZXIvQmFjaGVsb3JfVGhlc2lzL0ltcGxlbWVudGF0aW9uL2pxdWVyeS1zcGEvc3JjL3NwYS5qcyIsIi9Vc2Vycy9jd2Fzc2VyL0Ryb3Bib3gvUHJpdmF0X1N0dWRpdW0vOF9TZW1lc3Rlci9CYWNoZWxvcl9UaGVzaXMvSW1wbGVtZW50YXRpb24vanF1ZXJ5LXNwYS9zcmMvc3BhL0FwcC5qcyIsIi9Vc2Vycy9jd2Fzc2VyL0Ryb3Bib3gvUHJpdmF0X1N0dWRpdW0vOF9TZW1lc3Rlci9CYWNoZWxvcl9UaGVzaXMvSW1wbGVtZW50YXRpb24vanF1ZXJ5LXNwYS9zcmMvc3BhL0RhdGEuanMiLCIvVXNlcnMvY3dhc3Nlci9Ecm9wYm94L1ByaXZhdF9TdHVkaXVtLzhfU2VtZXN0ZXIvQmFjaGVsb3JfVGhlc2lzL0ltcGxlbWVudGF0aW9uL2pxdWVyeS1zcGEvc3JjL3NwYS9IaXN0b3J5LmpzIiwiL1VzZXJzL2N3YXNzZXIvRHJvcGJveC9Qcml2YXRfU3R1ZGl1bS84X1NlbWVzdGVyL0JhY2hlbG9yX1RoZXNpcy9JbXBsZW1lbnRhdGlvbi9qcXVlcnktc3BhL3NyYy9zcGEvUm91dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7R0FFRztBQUNILE1BQU0sQ0FBQyxHQUFHLElBQUksV0FBVyxDQUFDLEdBQUc7SUFDekIsWUFBWSxDQUFDO0lBQ2IsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUMxQixJQUFJLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUM1QixPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQztRQUNsQyxNQUFNLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztRQUNoQyxPQUFPO1FBQ1AsUUFBUSxHQUFHO1VBQ1QsR0FBRyxHQUFHLEdBQUc7VUFDVCxJQUFJLEdBQUcsSUFBSTtVQUNYLE9BQU8sR0FBRyxPQUFPO1VBQ2pCLE1BQU0sR0FBRyxNQUFNO0FBQ3pCLFNBQVMsQ0FBQzs7RUFFUixPQUFPLEdBQUcsV0FBVztJQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFHLFFBQVEsQ0FBQyxDQUFDO0lBQzNELENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVUsU0FBUyxFQUFFO01BQ3BDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsRUFBRSxDQUFDO0tBQ3JDLENBQUMsQ0FBQztBQUNQLEdBQUcsQ0FBQzs7RUFFRixPQUFPO0lBQ0wsT0FBTyxHQUFHLE9BQU87SUFDakIsR0FBRyxHQUFHLEdBQUc7SUFDVCxJQUFJLEdBQUcsSUFBSTtJQUNYLE9BQU8sR0FBRyxPQUFPO0lBQ2pCLE1BQU0sR0FBRyxNQUFNO0dBQ2hCLENBQUM7QUFDSixDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQzs7O0FDcENiOztHQUVHO0FBQ0gsSUFBSSxHQUFHLElBQUksV0FBVztJQUNsQixZQUFZLENBQUM7SUFDYixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ3hCLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQzlCLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQ3BDLFFBQVEsT0FBTyxDQUFDOztJQUVaLE9BQU8sR0FBRyxXQUFXLElBQUksRUFBRTtRQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDM0IsT0FBTyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3pDLEtBQUssQ0FBQzs7SUFFRixPQUFPO1FBQ0gsT0FBTyxHQUFHLE9BQU87S0FDcEIsQ0FBQztBQUNOLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRUwsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7OztBQ3RCckI7O0dBRUc7QUFDSCxJQUFJLElBQUksSUFBSSxXQUFXO0lBQ25CLFlBQVksQ0FBQztBQUNqQixJQUFJLElBQUksUUFBUSxDQUFDOztJQUViLFFBQVEsR0FBRyxXQUFXLElBQUksR0FBRztRQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlDLEtBQUssQ0FBQzs7SUFFRixPQUFPO1FBQ0gsUUFBUSxHQUFHLFFBQVE7S0FDdEIsQ0FBQztBQUNOLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRUwsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7OztBQ2hCdEI7O0FBRUEsR0FBRzs7QUFFSCxJQUFJLE9BQU8sSUFBSSxXQUFXO0lBQ3RCLFlBQVksQ0FBQztBQUNqQixJQUFJLElBQUksV0FBVyxDQUFDOztJQUVoQixXQUFXLEdBQUcsV0FBVyxJQUFJLEdBQUc7UUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUNuRCxLQUFLLENBQUM7O0lBRUYsT0FBTztRQUNILFdBQVcsR0FBRyxXQUFXO0tBQzVCLENBQUM7QUFDTixDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVMLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7QUNqQnpCOztHQUVHO0FBQ0gsSUFBSSxNQUFNLElBQUksV0FBVztJQUNyQixZQUFZLENBQUM7SUFDYixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBQ3RDLFFBQVEsVUFBVSxDQUFDOztJQUVmLFVBQVUsR0FBRyxXQUFXLElBQUksR0FBRztRQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsc0NBQXNDLENBQUMsQ0FBQztBQUNwRSxLQUFLLENBQUM7O0lBRUYsT0FBTztRQUNILFVBQVUsR0FBRyxVQUFVO0tBQzFCLENBQUM7QUFDTixDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVMLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiBqUXVlcnkuc3BhLmpzXG4gKiBUaGlzIGZpbGUgaGFuZGxlcyBhbGwgdGhlIHBsdWdpbiBleHBvcnRzIGZvciB0aGUgZmluYWwgcGx1Z2luIGZ1bmN0aW9uYWxpdHkuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE2IENocmlzdGlhbiBXYXNzZXJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xualF1ZXJ5LnNwYSA9IChmdW5jdGlvbiAoICQgKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBBcHAgPSByZXF1aXJlKCcuL3NwYS9BcHAnKSxcbiAgICAgICAgRGF0YSA9IHJlcXVpcmUoJy4vc3BhL0RhdGEnKSxcbiAgICAgICAgSGlzdG9yeSA9IHJlcXVpcmUoJy4vc3BhL0hpc3RvcnknKSxcbiAgICAgICAgUm91dGVyID0gcmVxdWlyZSgnLi9zcGEvUm91dGVyJyksXG4gICAgICAgIHRlc3RBbGwsXG4gICAgICAgIHNldHRpbmdzID0ge1xuICAgICAgICAgIEFwcCA6IEFwcCxcbiAgICAgICAgICBEYXRhIDogRGF0YSxcbiAgICAgICAgICBIaXN0b3J5IDogSGlzdG9yeSxcbiAgICAgICAgICBSb3V0ZXIgOiBSb3V0ZXJcbiAgICAgICAgfTtcblxuICB0ZXN0QWxsID0gZnVuY3Rpb24oKSB7XG4gICAgd2luZG93LmNvbnNvbGUubG9nKCdSVU5OSU5HIFRFU1QgQUxMJyk7XG4gICAgd2luZG93LmNvbnNvbGUubG9nKCdkZWZpbmVkIGNvbXBvbmVudHMgYXJlIDogJyArIHNldHRpbmdzKTtcbiAgICAkLmVhY2goc2V0dGluZ3MsIGZ1bmN0aW9uKCBjb21wb25lbnQgKXtcbiAgICAgIGNvbXBvbmVudC5jYWxsKCd0ZXN0JyArIGNvbXBvbmVudCApO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdGVzdEFsbCA6IHRlc3RBbGwsXG4gICAgQXBwIDogQXBwLFxuICAgIERhdGEgOiBEYXRhLFxuICAgIEhpc3RvcnkgOiBIaXN0b3J5LFxuICAgIFJvdXRlciA6IFJvdXRlclxuICB9O1xufSggalF1ZXJ5ICkpO1xuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgY3dhc3NlciBvbiAwOS4wNC4xNi5cbiAqL1xudmFyIEFwcCA9IChmdW5jdGlvbiAoKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIERhdGEgPSByZXF1aXJlKCcuL0RhdGEnKSxcbiAgICAgICAgSGlzdG9yeSA9IHJlcXVpcmUoJy4vSGlzdG9yeScpLFxuICAgICAgICBSb3V0ZXIgPSByZXF1aXJlKCcuL1JvdXRlcicpLFxuICAgICAgICB0ZXN0QXBwO1xuXG4gICAgdGVzdEFwcCA9IGZ1bmN0aW9uICggZGF0YSApe1xuICAgICAgICBjb25zb2xlLmxvZygnanF1ZXJ5LnNwYS5BcHA6ICcgKyBkYXRhKTtcbiAgICAgICAgRGF0YS50ZXN0RGF0YSgnZGF0YSB0ZXN0Jyk7XG4gICAgICAgIEhpc3RvcnkudGVzdEhpc3RvcnkoJ2hpc3RvcnkgdGVzdCcpO1xuICAgICAgICBSb3V0ZXIudGVzdFJvdXRlcigncm91dGVyIHRlc3QnKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGVzdEFwcCA6IHRlc3RBcHBcbiAgICB9O1xufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHA7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgY3dhc3NlciBvbiAwOS4wNC4xNi5cbiAqL1xudmFyIERhdGEgPSAoZnVuY3Rpb24gKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciB0ZXN0RGF0YTtcblxuICAgIHRlc3REYXRhID0gZnVuY3Rpb24gKCBkYXRhICkge1xuICAgICAgICBjb25zb2xlLmxvZygnanF1ZXJ5LnNwYS5EYXRhOiAnK2RhdGEpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0ZXN0RGF0YSA6IHRlc3REYXRhXG4gICAgfTtcbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBjd2Fzc2VyIG9uIDA5LjA0LjE2LlxuICovXG5cbnZhciBIaXN0b3J5ID0gKGZ1bmN0aW9uICgpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgdGVzdEhpc3Rvcnk7XG5cbiAgICB0ZXN0SGlzdG9yeSA9IGZ1bmN0aW9uICggZGF0YSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2pxdWVyeS5zcGEuSGlzdG9yeTogJyArIGRhdGEpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0ZXN0SGlzdG9yeSA6IHRlc3RIaXN0b3J5XG4gICAgfTtcbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSGlzdG9yeTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBjd2Fzc2VyIG9uIDA5LjA0LjE2LlxuICovXG52YXIgUm91dGVyID0gKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgSGlzdG9yeSA9IHJlcXVpcmUoJy4vSGlzdG9yeScpLFxuICAgICAgICB0ZXN0Um91dGVyO1xuXG4gICAgdGVzdFJvdXRlciA9IGZ1bmN0aW9uICggZGF0YSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2pxdWVyeS5zcGEuUm91dGVyOiAnICsgZGF0YSk7XG4gICAgICAgIEhpc3RvcnkudGVzdEhpc3RvcnkoJ2pxdWVyeS5zcGEuUm91dGVyOiB0cmlnZ2VyZWQgSGlzdG9yeScpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0ZXN0Um91dGVyIDogdGVzdFJvdXRlclxuICAgIH07XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlcjtcbiJdfQ==
