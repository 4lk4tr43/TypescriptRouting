TestCase('HashParser', {
    testNumberOrString: function () {
        assertEquals(['Test'], Routing.HashParser.getArguments('Test', '.*'));
        assertEquals(['123Test'], Routing.HashParser.getArguments('123Test', '.*'));
        assertEquals([123], Routing.HashParser.getArguments('123', '.*'));
    },
    testRest: function () {
        assertEquals(['invalid'], Routing.HashParser.getArguments('invalid', '.*'));
        assertEquals([{ a: 1 }], Routing.HashParser.getArguments('a=1', '.*'));
        assertEquals([{ a: [1, 2] }], Routing.HashParser.getArguments('a=1&a=2', '.*'));
        assertEquals([{ a: 1, b: 2 }], Routing.HashParser.getArguments('a=1&b=2', '.*'));
        assertEquals([{ a: '', b: 2 }], Routing.HashParser.getArguments('a=&b=2', '.*'));
        assertEquals([{ a: ['', 2] }], Routing.HashParser.getArguments('a=&a=2', '.*'));
        assertEquals([{ a: 1, '': 2 }], Routing.HashParser.getArguments('a=1&=2', '.*'));
    },
    testResources: function () {
        assertEquals([{ r: { a: 1 } }], Routing.HashParser.getArguments('r?a=1', '.*'));
        assertEquals([{ '': { a: 1 } }], Routing.HashParser.getArguments('?a=1', '.*'));
        assertEquals([{ r: [{ a: 1 }, { b: 2 }] }], Routing.HashParser.getArguments('r?a=1/r?b=2', '.*'));
        assertEquals([{ r: { a: 1, b: 2 } }], Routing.HashParser.getArguments('r?a=1&b=2', '.*'));
        assertEquals([{ r: { a: 1 }, s: { b: 2 } }], Routing.HashParser.getArguments('r?a=1;s?b=2', '.*'));
        assertEquals([{ r: [{ a: 1 }, { b: 2 }] }], Routing.HashParser.getArguments('r?a=1;r?b=2', '.*'));
        assertEquals([{ r: [{ a: 1 }, { b: 2 }] }], Routing.HashParser.getArguments('r?a=1/r?b=2', '.*'));
        assertEquals([{ r: { a: 1 }, s: { b: 2 } }], Routing.HashParser.getArguments('r?a=1/s?b=2', '.*'));
    },
    testCropping: function () {
        assertEquals([], Routing.HashParser.getArguments('', ''));
        assertEquals([''], Routing.HashParser.getArguments('', '.*'));
        assertEquals([''], Routing.HashParser.getArguments('a/b', 'a/b(/.+)?'));
        assertEquals(['a', 'b', 1], Routing.HashParser.getArguments('a/b/a/b/1', 'a/b.*'));
        assertEquals(['a', 'b', 1], Routing.HashParser.getArguments('a/b/a/b/1', 'a/b.*'));
    }
});