///<reference path="../scripts/Routing/route.ts"/>
window.onload = function () {
    console.log('Window ready\n');
    var context = { hit: false, miss: false };
    var route = new Routing.Route('b/.+/.+', function (res, next) {
        this.hit = true;
        console.log('Hit args: ' + res.a.b + ' ' + res.a.c + ' ' + next);
        console.log('Context set ' + context.hit);
    }, function () {
        this.miss = true;
        console.log('Miss');
        console.log('Context set ' + context.miss);
    }, true, context);
    route.register();
    window.location.hash = 'b/a?b=123&c=abc/n1';
    window.setTimeout(function () {
        console.log('\nTimeout 1000 before next hash change\n');
        window.location.hash = 'a';
    }, 1000);
};
//# sourceMappingURL=routing-test.js.map