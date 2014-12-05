///<reference path="../scripts/Routing/Annotations/route.ts"/>
///<reference path="../scripts/Meta/Annotated.ts"/>
///<reference path="../scripts/Routing/route-manager.ts"/>

class Ctrl extends Meta.Annotated {

    viewA = document.querySelector('#viewA');
    viewB = document.querySelector('#viewB');
    viewC = document.querySelector('#viewC');
    viewD = document.querySelector('#viewD');

    constructor() {
        super();

        var self = this;
        Routing.RouteManager.bypass = new Routing.RouteDescription(undefined, ()=> {
            self.viewA['innerHTML'] = 'This is view A';
            self.viewB['innerHTML'] = 'This is view B';
            self.viewC['innerHTML'] = 'This is view C';
            var e = document.createElement('li');
            e.innerHTML = "Missed all routes";
            this.viewD.appendChild(e);
        }, undefined, false, self);
    }

    a() {
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
    }
    aMiss() {
        var e = document.createElement('li');
        e.innerHTML = "Missed route A";
        this.viewD.appendChild(e);
    }

    b(intA, intOptionalB) {
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
    }

    bMiss() {
        var e = document.createElement('li');
        e.innerHTML = "Missed route B";
        this.viewD.appendChild(e);
    }
}
//noinspection JSUnusedGlobalSymbols
var ctrl = new Ctrl();

function SetRoute() {
    Routing.RouteManager.setHash('#RouteA', true);
}