///<reference path="route-manager.ts"/>

module Routing {

    /**
     * Stores route information
     */
    export class Route {
        /**
         * The route is managed by the route manager
         *
         * @type {boolean}
         */
        private isRegistered = false;

        /**
         * Constructor
         *
         * @param routeRegex :string, the regex that defines if the route is hit
         * @param hit :(...args[])=>void, executeWindowLoaded when the route is hit,
         *        must be a function not a lambda for the context to be passed correctly
         * @param miss :(...args[])=>void, executeWindowLoaded when the route is missed,
         *        must be a function not a lambda for the context to be passed correctly
         * @param register :boolean, register the route immediately
         * @param context ,any: the context the hit and miss function use as 'this', undefined equals 'window'
         */
        constructor(public routeRegex:string, public hit:(...args:any[])=>void = undefined, public miss:(...args:any[])=>void = undefined,  register:boolean = true, public context:any = undefined) {
            if (register) this.register();
        }

        /**
         * Registers with the route manager, route will executeWindowLoaded on hash changes
         */
        register() {
            if (!this.isRegistered) {
                RouteManager.addRoute(this);
                this.isRegistered = true;
            }
        }

        /**
         * Unregisters with the route manager, the route will no executeWindowLoaded on hash changes
         */
        unregister():void {
            RouteManager.removeRoute(this);
            this.isRegistered = false;
        }
    }
}