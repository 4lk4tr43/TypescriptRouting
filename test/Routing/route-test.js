AsyncTestCase('Route', {

    // context and arguments don't work on jstd
    // see routing-test.html and routing-test.ts within html folder for a better test
    testBasicRouting: function (queue) {
        var context = {};

        var onHit = function () {
            context.hit = true;
        };

        var route = new Routing.Route(
            'a',
            onHit,
            undefined,
            context
        );

        window.location.hash = 'a';

        queue.call('Step 1', function (callbacks) {
            var wrapper = callbacks.add(onHit);
            window.setTimeout(wrapper);
        });

        queue.call('Step 2', function () {
            assertTrue(context.hit);
        });
    }
});