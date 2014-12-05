///<reference path="hash-parser.ts"/>
///<reference path="route-description.ts"/>

module Routing {

    /**
     * Manages all active routes and executes them on hash changes
     */
    export class RouteManager {
        /**
         * Contains a map all route string and routes with compiled regexps
         * @type  {routeString: {routes: Route[], regex:RegExp}, ...
         */
        private static routesMap = {};

        /**
         * Used for stacking load functions
         */
        private static _onload:any;

        private static _silentHashUpdate:boolean;
        /**
         * Routes when all routes were missed
         */
        static bypass:RouteDescription;

        /**
         * Executes an array of routes
         *
         * @param hashFragment :string, the hash without leading #
         * @param routesRegex :string, the string regex representation, used to get the arguments
         * @param regex :RegExp, the regexp to decide for hit, miss
         * @param routes :Route[], the routes to be executed
         */
        private static executeRoutes(hashFragment:string, routesRegex:string, regex:RegExp, routes:RouteDescription[]):boolean {
            var match = hashFragment.match(regex);
            var args = HashParser.getArguments(hashFragment, routesRegex);

            var hasHit = false;
            for (var i = 0; i < routes.length; i++) {
                var route = routes[i];
                if (match != null && route.hit !== undefined) {
                    route.hit.apply(route.context, args);
                    hasHit = true;
                }
                else if (route.miss !== undefined) route.miss.apply(route.context, args);
            }
            return hasHit;
        }

        /**
         * Fires when hash is changed, executes all registered routes
         */
        static onHashChanged():void {
            if (RouteManager._silentHashUpdate) {
                RouteManager._silentHashUpdate = false;
                return;
            }
            var hashFragment = window.location.hash.substr(1);
            if (hashFragment.length === 0) return;

            var hasHit = false;
            for (var routesRegex in RouteManager.routesMap) {
                if (!RouteManager.routesMap.hasOwnProperty(routesRegex)) continue;

                var routes = RouteManager.routesMap[routesRegex];
                var result = RouteManager.executeRoutes(
                    hashFragment,
                    routesRegex,
                    RouteManager.routesMap[routesRegex].regex,
                    routes.routes);
                hasHit = hasHit || result;
            }

            if (!hasHit) {
                // executeWindowLoaded bypass if all routes were missed
                var bypass = RouteManager.bypass;
                if (bypass !== undefined) {
                    if (!hasHit && bypass.hit !== undefined) bypass.hit.apply(bypass.context, [hashFragment]);
                    else if (bypass.miss !== undefined) bypass.miss.apply(bypass.context, [hashFragment]);
                }
            }
        }

        /**
         * Initialize route manager
         */
        static init() {
            window.onhashchange = RouteManager.onHashChanged;
            RouteManager._onload = window.onload;
            if (window.onload === null)
                window.onload = RouteManager.onHashChanged;
            else
                window.onload = function (e) {
                    RouteManager._onload(e);
                    RouteManager.onHashChanged();
                };

        }

        /**
         * Adds a route that will be executed from then on
         *
         * @param route :Route, the route instance
         */
        static addRoute(route:RouteDescription):void {
            var routesMap = this.routesMap;

            if (routesMap[route.routeRegex] === undefined)
                routesMap[route.routeRegex] = {routes: [], regex: new RegExp('^' + route.routeRegex)};
            routesMap[route.routeRegex].routes.push(route);
        }

        /**
         * Removes a route from execution
         *
         * @param route :Route, the route instance
         */
        static removeRoute(route:RouteDescription):void {
            var routesMap = this.routesMap;

            for (var routesRegex in routesMap) {
                if (!routesMap.hasOwnProperty(routesRegex)) continue;
                var routes = routesMap[routesRegex];
                var index = -1;
                for (var i = 0; i < routes.length; i++) if (routes[i] === route) index = i;

                if (index != -1) {
                    routes.splice(index, 1);
                    break;
                }
            }
        }

        static setHash(hash:string, silentUpdate:boolean=true) {
            if (window.location.hash !== hash) {
                RouteManager._silentHashUpdate = silentUpdate;
                window.location.hash = hash;
            }
        }
    }

    RouteManager.init();
}