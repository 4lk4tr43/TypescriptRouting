///<reference path="../../Meta/annotated.ts"/>
///<reference path="../route-description.ts"/>

module Routing.Annotations {

    /**
     * Define a hash route on a annotated class function.
     * Function name + 'Miss' will be called if the route is missed (optional)
     *
     * Additional methods will be generated on the class:
     * getRoutes, returns an array with all routes associated with the class
     * registerAll,  activates all routes on the class
     * unregisterAll, deactivates all routes on the class
     *
     * Usage:
     * 'Routing.Annotations.Route={"path":"RegexRoute", "register"=false}';
     * path :string, optional custom regex route (optional)
     * register :boolean, the route will be instantly active (optional)
     *
     * If no path is defined a route is constructed for ClassName/FunctionName/...
     * the parameter names can specialize the route in the form typeModifierName
     * e.g. intRepetitionA will add (/\d+/)+
     *
     * valid types are (optional)
     * int... -> integer
     * float... -> float
     * rest... -> {a: val1, b: val2:}
     * resource... -> { resourceName: {...} }, always will be the first parameter
     *
     * valid modifiers are (optional and can be combined)
     * ...Optional... -> the param is optional, only recommended as last
     * ...Repetition... -> the param can be a repetition e.g. a/b/1/2/3/..., only recommended as last
     */
    export class Route extends Meta.Annotation {

        /**
         * Converts parameter names to regex string parts
         *
         * @param param :string, name of the parameter
         * @returns {string} the regex string part
         */
        static getRegexPartForParam(param:string):string {
            var result;

            // looks for a type
            if (param.match(/^ressource/) != null)
                result =  '/.*\\?.*';
            else if (param.match(/^rest/) != null)
                result = '/.*=.*';
            else if (param.match(/^int/) != null)
                result = '/\\d+';
            else if (param.match(/^float/) != null)
                result = '/\\d*\\.?\\d+';
            else
                result = '/.+';


            // check for modifiers
            if (param.match(/Repetition/) != null) {
                result = '(' + result + ')+';
            }
            if (param.match(/Optional/) != null) {
                result = '(' + result + ')?';
            }

            return result;
        }

        /**
         * Applies the routing engine to a function
         *
         * @param info :Meta.AnnotationInfo, information about the class and function to be modified
         */
        static execute(info:Meta.AnnotationInfo):void {

            var routeRegex;
            var activate = true;

            // add functions to the class
            if (info.annotated.__proto__['getRoutes'] === undefined)
                info.annotated.__proto__['getRoutes'] = function () {
                    if (info.annotated._routes === undefined) {
                        info.annotated._routes = [];
                    }
                    return this._routes;
                };
            if (info.annotated.__proto__['registerAll'] === undefined)
                info.annotated.__proto__['registerAll'] = function () {
                    for (var i = 0; i < this._routes.length; i++) this._routes[i].register();
                };
            if (info.annotated.__proto__['unregisterAll'] === undefined)
                info.annotated.__proto__['unregisterAll'] = function () {
                    for (var i = 0; i < this._routes.length; i++) this._routes[i].unregister();
                };


            // check if we got annotation arguments
            if (info.args === undefined) {
                var className = info.annotated.constructor.name;
                if (className === undefined) { // this is for our beloved internet explorer
                    className = Meta.FunctionParser.getFunctionName(info.annotated.constructor.toString());
                }
                routeRegex = className + '/' + info.funcName;
                if (info.funcParamNames !== undefined)
                    for (var i = 0; i < info.funcParamNames.length; i++)
                        routeRegex += Route.getRegexPartForParam(info.funcParamNames[i]); // build standard route
            }
            else {
                routeRegex = info.args.path; // custom route
                activate = info.args.register !== false; // only when set to false we don't activate the route
            }

            var routes = info.annotated.getRoutes();
            routes.push(new Routing.RouteDescription(routeRegex, info.annotated[info.funcName], info.annotated[info.funcName + 'Miss'],
                activate, info.annotated)); // build a route for the hit and miss
        }
    }
}