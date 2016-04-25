jQuery Single Page Application Plugin
=====================================
> **Important** : This version is not ready for contribution yet, since this
my bachelor thesis and it is not graduated yet. 



> A jQuery plugin which enables you to easily create an Single Page Application

This plugin offers a public API to SPAlify your client side web application. The API is available
under the the jquery.spa namespace after integrating the plugin in your website.
The plugin has hard dependencies to the utility library [lodash](https://github.com/lodash/lodash) (>= v4.3.0)
and also to [jQuery](https://github.com/jquery/jquery) (>= v2.2.0).
This plugin is developed as an official jQuery plugin. For further information about jQuery plugins
see https://plugins.jquery.com/.

## What does it and what is inside?
The plugin itself is developed with the usage of JavaScript closures and the CommonJS module pattern
from Node.js. It has also an configured build chain with gulp.

The public API offers you:

- Capsulized components within the plugin: A router, history and data component
- An well documented API and also annotated source code (checkout the source folder)
- Configurable components to modify the default behaviour
- A router where you can configure your routes with the callbacks for these routes
- A decoupled history component, which handles the URL and browser history manipulation
  to prevent any complete site reloads. This manipulation will be done either by the
  HTML5 History-API or by using hashes in your URL, depending on your configuration.
- A data component which is responsible for any asynchronous data retrieval via AJAX.
- A proxy component to facade the usage of the above described components.

## Checkout the source code
If you want to clone and checkout the source code on your local machine, then simply
do the following after cloning the repository:

```
npm install
gulp
```

## Getting Started with the plugin

Download the [production version][min] or the [development version][max].

[min]: https://raw.githubusercontent.com/cwasser/jquery-jquery-spa/master/dist/jquery.spa-v1.0.0.min.js
[max]: https://raw.githubusercontent.com/cwasser/jquery-jquery-spa/master/dist/jquery.spa-v1.0.0.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="jquery.spa-v1.0.0.min.js"></script>
<script>
  jQuery(function ($) {
    // Configure the plugin here
    $.spa.configModule({...});
    // Adding some routes
    $.spa.addRoutes([{...},{...},...]);
    // Start the plugin
    $.spa.run();
    // Starting using it
    $.spa.navigate('route');
    $.spa.getResource('route');
    $.spa.createResource('route', {});
    $.spa.updateResource('route', {});
    $.spa.deleteResource('route', {});
  });
</script>
```

For an optimal usage of the plugin you should start by configuring the plugin. Then simply add some
route configurations and call `$.spa.run()`. Keep in mind, you can always add route configurations
also after starting the plugin.
The following sections will give you an overview over the public API and the available options.
For more detailed information about the public API and their functionality check out the source and the
JSDoc within the source code.

### Configure the plugin
###### jQuery.spa.configHistory(options)

This function will configure the history module of the jQuery SPA component with the given options.
The currently available options for configuring the history module of the plugin are:
* useHistoryApi : {boolean}     - This boolean value will tell the history component to either use the
    HTML5 History-API if the flag is set to `true` and the browser supports the History-API. Or if the
    value is set to `false` the history component will use hash manipulated URLs.
    **Default value: ** `true`
    
**Example Usage:**
```javascript
jQuery.spa.configHistory({
    useHistoryApi : true
});
```

###### jQuery.spa.configRouter(options)

This function will configure the router module of the jQuery SPA component with the given options.
So far no options are supported, so it will always use a default configuration. But to keep 
the code style consistence this function is still available. 

###### jQuery.spa.configData(options)

This function will configure the data module of the jQuery SPA component with the given options.
The currently available options for configuring the data module of the plugin are:

* serverUrl : {string}      - This string value defines the server URL to fetch additional information
    for the AJAX request from. This value can be set to any valid server URL with RESTful support so far.
    **Default value:** `127.0.0.1:8000` (local loop back network interface)

* format : {string}         - This string value will define the format of the data to be send and retrieve
    from the configured server. So far only support for the `json` format is tested, but it should be also
    possible to use formats like `xml`.
    **Default value:** `json`
    
* contentType : {string}    - This define the content type for all AJAX request which will be send
    within the header of the request.
    **Default value:**  `application/json; charset=utf-8`

* username : {string}       - Optional username for the authentication on the configured server. This
    username will be used in each request, if no other is defined within the route configuration.
    **Default value:** `''`

* password : {string}       - Optional password for the authentication on the configured server. This
    password will be used together with the username in each request, if no other password is defined
    within the route configuration.
    **Default value:** `''`

* timeout : {int}           - This number in milliseconds will define the request timeout for all AJAX request. If the
    timeout is reached during an AJAX request, the request will fail instantly and call any error callbacks.
    **Default value:** `3000`

**Example usage:**
```javascript
jQuery.spa.configData({
    serverUrl : 'http://localhost:8000/any/api',
    format : 'json',
    contentType : 'application/json; charset=utf-8',
    username : 'example',
    password : 'example',
    timeout : 5000
});
```

###### jQuery.spa.configModule(options)

This configuration function is an all in one configuration for the configuration functions described
above. So it will use automatically the `configHistory()`, `configRouter()` and the `configData()` functions
depending on the given keys in the `options` object. Valid options for this functions are:

* historyConfig : {object}  - The given object should contain the same properties as described above in
    the `jQuery.spa.configHistory(options)` function.

* routerConfig : {object}   - The given object should contain the same properties as described above in
    the `jQuery.spa.configRouter(options)` function.

* dataConfig : {object}     - The given object should contain the same properties as described above in
    the `jQuery.spa.configData(options)` function.

**Example usage:**
```javascript
jQuery.spa.configModule({
    historyConfig : {},
    routerConfig : {},
    dataConfig : {}
});
```

### Adding route configurations

###### jQuery.spa.addRoute(route,callback,options)

This function offers the possibility to add new route configuration to the jQuery SPA plugin.
To navigate within your page with this plugin or to use the AJAX functionality the route
configurations are necessary. With this function you can define custom routes which are connected
to an given callback function. Also you have the possibility to define several options for
the new route configuration. The function expects the following parameters:

* route : {string}          - The route which should be added to the plugin, you will use later
    this route to navigate or retrieve any information via AJAX. This route needs to be unique with
    for the given HTTP method in the options.

* callback : {Function}     - The callback function which will be triggered after the route was
    executed either by using the jQuery SPA functions or by changing the URL. Additionally depending
    on the options it will make an AJAX request with the data component before executing the callback.
    The callback should have the following signature: `function(data, jqXHR, textStatus){}` for
    callback which are connected to an resource on the server and `function(){}` for routes without
    any resource connection. So an callback which is connected to an server resource will receive the
    following parameters:
        - data : {object}  - Any response from the server for the AJAX request. This contains the
            requested data or an empty object, if no data were sent.
        - jqXHR : {object} - The request object sent by jQuery.ajax(). See [jQuery.ajax()](http://api.jquery.com/jquery.ajax/).
        - textStatus : {string}    - The status text for the request. See [jQuery.ajax()](http://api.jquery.com/jquery.ajax/).
        - errorThrown : {string}   - This will only be passed if an jQuery.ajax() error occurred. See [jQuery.ajax()](http://api.jquery.com/jquery.ajax/).
        
* options : {object}        - Optional parameters for the route configuration. Following properties are allowed:
        - isResource : {boolean}    - This flag defines if the route is connected to an resource on
            configured server.
            **Default Value:** `false`
        - httpMethod : {string}     - This string defines the connected HTTP method for the route and
            it is used also for the AJAX requests.
            **Default Value:** `'GET'`
        - shouldTriggerStateUpdate : {boolean}  - This flag is only valid for routes with the `isResource`
            flag to `true` and `httpMethod` set to `'GET'`. It will trigger an state update of the history module
            of the jQuery SPA plugin for the given route if the data retrieval was successful.
            **Default value:** `false`
        - useHistoryStateFallback : {boolean}   - This flag is only valid for routes the `isResource` flag to
            `true` and `httpMethod` set to `'GET'`. It will use the latest history state for the
            given route if an AJAX request fails to retrieve the data from the state.

**Example usage:**
```javascript
jQuery.spa.addRoute(
    '/example',
    function(data, jqXHR, textStatus) { ... },
    {
        isResource : true,
        httpMethod : 'GET',
        shouldTriggerStateUpdate : true,
        useHistoryStateFallback : true
    }
);
```

###### jQuery.spa.addRoutes(routes)

This function offers the possibility to define more than one route in once. So it will call the 
`jQuery.spa.addRoute()` to add all given routes. This function expects an array of objects where a single
object represents a single routing configuration. This means the containing objects should have the parameters
as described above for `jQuery.spa.addRoute()`. This function expects the following parameter:

* routes : {array}      - An array of route configuration objects. A single object should contains the 
    following properties:
    - route : {string}      - see `jQuery.spa.addRoute()` (route parameter).
    - callback : {Function} - see `jQuery.spa.addRoute()` (callback parameter).
    - options : {object}    - see `jQuery.spa.addRoute()` (options parameter).

**Example usage:**
```javascript
jQuery.spa.addRoutes([
    { route : '/example', callback : function(){}, options : {} },
    { route : '/example/2', callback : function(){}, options : {} },
    ...
]);
```

###### jQuery.spa.removeRoute(route,httpMethod)

This function will remove an existing route configuration from the jQuery SPA plugin which is identified
by the given route and the corresponding HTTP method. The function expects the following parameters:

* route : {string}      - The route which should be removed from the plugin.
* httpMethod : {string} - The connected HTTP method to the route. Possible values are `'GET'`, `'POST'`, `'PUT'` and `'DELETE'`.

**Example usage:**
```javascript
jQuery.spa.removeRoute('/example', 'GET');
```

###### jQuery.spa.hasRoute(route,httpMethod)

This function will check if the plugin contains already an existing route configuration for the given
route and HTTP method. It will return `true`, if there is already one existing and `false` if there
is no existing route configuration for the given parameters:

* route : {string}      - The route which should be looked for in the plugin.
* httpMethod : {string} - The connected HTTP method to the route to looking for.

**Example usage:**
```javascript
jQuery.spa.hasRoute('/example', 'GET');
```

### Starting the plugin

For using the jQuery SPA plugin correctly it is necessary to start the plugin, so that the internal 
event listeners are registered. If you do not start the plugin, the usage for several functionality
will be denied.

###### jQuery.spa.run()

This function will start the plugin and register important internal event listeners. You have to call this
function and also only once. It is not possible to call this function twice. When the plugin has started
it is also possible to add new route configurations.

**Example usage:**
```javascript
jQuery.spa.run();
```

### Navigating to configured routes

###### jQuery.spa.navigate(route)

This function will navigate to different URLs with the configured route configurations. Depending on the
history configuration it will change the URL either with the History-API or with hashes within the URL.
Also it will try to fetch additionally needed information with AJAX from the server, but this is depending 
on the configuration for the given route. Thus it is also possible to navigate to an route without
any server requests. The function expects the following parameters:

* route : {string}      - The route to navigate to. The route needs to be defined within the plugin before via `jQuery.spa.addRoute()`.

**Example usage:**
```javascript
jQuery.spa.navigate('/example');
```

### Asynchronous manipulation of server resources

Additionally to the navigation functionality of the jQuery SPA plugin, it is possible to dynamically
send AJAX requests with the public API of the plugin. None of these functions will do any URL changes at all.

###### jQuery.spa.getResource(route)

This function will get an existing resource from the server. It will use an AJAX request with the 
'GET' method. An existing route configuration for the given route with the `httpMethod : 'GET'`
is required. It will then trigger the configured callback for this route.

* route : {string}      - The route from the server for retrieving an resource with 'GET'.

**Example usage:**
```javascript
jQuery.spa.getResource('/example/1');
```

###### jQuery.spa.deleteResource(route)

This function will delete an existing resource from the server. It will use an AJAX request with
the 'DELETE' method. An existing route configuration for the given route with the `httpMethod : 'DELETE'`
is required. It will then trigger the configured callback for this route.

* route : {string}      - The route from the server for deleting an existing resource with 'DELETE'.

**Example usage:**
```javascript
jQuery.spa.deleteResource('/example/1');
```

###### jQuery.spa.createResource(route,data)

This function will create a new resource on the configured server. It will use an AJAX request with
the 'CREATE' method and sent the given data. An existing route configuration for the route with the
 `httpMethod : 'CREATE'` is required. It will then trigger the configured callback for this route.

* route : {string}      - The route from the server for creating a new resource with 'CREATE'.
* data : {object}       - The data object which contains the data for the new resource.

**Example usage:**
```javascript
jQuery.spa.createResource(
    '/example',
    {
        name : 'example',
        color : 'green'
    }
);
```

###### jQuery.spa.updateResource(route,data)

This function will update an existing resource on the configured server with the given data. It will
use an AJAX request with the 'PUT' method and sent the given data to update the resource. An existing
route configuration for the route with the `httpMethod : 'PUT'` is required. It will then trigger
the configured callback for this route.

* route : {string}      - The route from the server for updating the existing resource with 'PUT'.
* data : {object}       - The new data for the resource on the server.

**Example usage:**
```javascript
jQuery.spa.updateResource(
    '/example/1',
    {
        name : 'example update',
        color : 'light-green'
    }
);
```

## Internal architecture

As already described above, the jQuery SPA plugin contains 4 major 
components: The spa proxy, the Router, the History and the Data component.

#### The SPA proxy

This component is responsible for faceting the internal components and offers the public API.
This is the main entry point for the plugin usage. It also prevents the plugin components from
malformed usages.

#### The Router component

This component is responsible for all routing configurations. It acts like an Dispatcher between
routes and their callbacks. Additionally it contains logic to call dynamically the Data component
for dynamic requests to the server depending on the given configuration for one route. It will also
communicate with the History component for any URL manipulation and listens on the History when the
URL has changed and the execute the corresponding callback function for the route in the URL.

#### The History component

This component is responsible for the whole browser history manipulation, the URL changing and also
the state management for the history entries. it is able to use either the HTML5 History-API
or adding hashes to the URL for all URL manipulations. It listens also on URL changes and then triggers
and event for the Router so that the Router is able to call the corresponding callback for the changed
URL. This component is completely decoupled from the other component of the jQuery SPA plugin.
So it could be also used as an standalone component.

#### The Data component

The only responsibility of this component is to do asynchronous requests to the server for any
data retrieval or manipulation from the server. It will use internally the `jQuery.ajax()` function
for these asynchronous requests. This component is very configurable for manipulating the 
AJAX request which will be send. The Router component will use this component for any resource
related requests.

## Where to go?

There are many outstanding ideas for the plugin for upcoming version. The most important thing currently is
to finish with this version my bachelor thesis. But after this there are many ideas:

* Go away from an jQuery plugin since this behaves more like an framework or independent library.
* Add MVC pattern to the existing solution.
* Make it possible to use named parameter in routes.
* Make the plugin extendable to enable developers to use predefined skeletons for their development tasks.

## Important for contribution

> NOTE: This version is not ready for contribution yet.

The project contains the implementation of a currently ongoing bachelor thesis, so there is no chance to 
really contribute to this project. After finishing the thesis or the release of the first stable version,
you are free to contribute to this project. But until this point, i will ignore open MR oder issues.

## License

MIT © Christian Wasser
