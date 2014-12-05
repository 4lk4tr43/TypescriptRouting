///<reference path="../scripts/Routing/Annotations/route.ts"/>
///<reference path="../scripts/Meta/Annotated.ts"/>
///<reference path="../scripts/Routing/route-manager.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Ctrl = (function (_super) {
    __extends(Ctrl, _super);
    function Ctrl() {
        var _this = this;
        _super.call(this);
        this.viewA = document.querySelector('#viewA');
        this.viewB = document.querySelector('#viewB');
        this.viewC = document.querySelector('#viewC');
        this.viewD = document.querySelector('#viewD');
        var self = this;
        Routing.RouteManager.bypass = new Routing.Route(undefined, function () {
            self.viewA['innerHTML'] = 'This is view A';
            self.viewB['innerHTML'] = 'This is view B';
            self.viewC['innerHTML'] = 'This is view C';
            var e = document.createElement('li');
            e.innerHTML = "Missed all routes";
            _this.viewD.appendChild(e);
        }, undefined, false, self);
    }
    Ctrl.prototype.a = function () {
        'Routing.Annotations.Route={"path":"RouteA"}';
        var self = this;
        window.setTimeout(function () {
            self.viewA['innerHTML'] = 'Hello this is route A.';
        }, 0);
        window.setTimeout(function () {
            self.viewA['innerHTML'] = '';
            self.viewC['innerHTML'] = 'Hello this is route A.';
        }, 1000);
        window.setTimeout(function () {
            self.viewC['innerHTML'] = '';
            self.viewB['innerHTML'] = 'Hello this is route A.';
        }, 2000);
    };
    Ctrl.prototype.aMiss = function () {
        var e = document.createElement('li');
        e.innerHTML = "Missed route A";
        this.viewD.appendChild(e);
    };
    Ctrl.prototype.b = function (intA, intOptionalB) {
        'Routing.Annotations.Route';
        var self = this;
        window.setTimeout(function () {
            self.viewA['innerHTML'] = 'Ready';
        }, 0);
        window.setTimeout(function () {
            self.viewA['innerHTML'] = 'Set';
        }, 1000);
        window.setTimeout(function () {
            self.viewA['innerHTML'] = 'Go';
        }, 2000);
        self.viewB['innerHTML'] = 'Route B was here.';
        self.viewC['innerHTML'] = 'Route B likes view C the best.<br><br>';
        self.viewC['innerHTML'] += 'The first argument was the number <b>' + intA + '</b><br>';
        self.viewC['innerHTML'] += 'With an optional number ';
        if (intOptionalB !== undefined)
            self.viewC['innerHTML'] += '<b>' + intOptionalB + '</b>';
        else
            self.viewC['innerHTML'] += '<b>that was not provided.</b>';
    };
    Ctrl.prototype.bMiss = function () {
        var e = document.createElement('li');
        e.innerHTML = "Missed route B";
        this.viewD.appendChild(e);
    };
    return Ctrl;
})(Meta.Annotated);
//noinspection JSUnusedGlobalSymbols
var ctrl = new Ctrl();
//# sourceMappingURL=controller-test.js.map