module Routing {

    /**
     * Extracts variables from hash strings
     *
     * - constant regex parts are cropped from the left to the first non static element
     *   e,g, regex: a/\d?/b/\d+ hash: a/1/b/123 will result in 3 variables 1, 'b', 123
     * - resource variables are consolidated into an object with key resource that is always the first parameter
     *   e.g. .../var/.../r?a=1/.../r?a=2&a=3;s?b=4/... results in [{r:[{a:1}, {a:[2,3]}], s:{b:4}}, ...]
     * - variable pairs are converted to objects e.g .../a=1&b=2/... {a: 1, b:2}
     *   same name variables are consolidated into an array e.g. .../a=1&a=2/... {a:[1,2]}
     * - number are converted to number, e.g. .../123/... results in 123
     * - fallback to string e.g. .../1hello//hello2/... results in '1hello', 'hello2'
     */
    export class HashParser {
        /**
         * Parses a segment to a number, if the segment contains non number characters it returns the segment string
         * or undefined when the string has 0 length
         *
         * @param segment :string, the segment to parse
         * @returns {*} number when successful else the input string
         */
        private static getNumberOrString(segment:any /* have to use any, because isNaN is for numbers only */):any {
            if (isNaN(segment)) return segment;
            var n = parseFloat(segment);
            return isFinite(n) ? n : segment;
        }

        /**
         * Gets fields to an object from variable string.
         * Variable which already exist or appear more than once consolidated into arrays
         * E.g. o={a:0}; (a=2&a=1&b=3, o) adds o.a = 1 or o.a is [0, 2, 1] o.b os 3
         *
         * @param segment :string, the variable string, e.g. var1=val1&var1=val2&var2=val3
         * @returns {*} true if something was added
         */
        private static getRest(segment:string):any {
            if (segment.match(/(.+=.+&?)+/) == null) return undefined;

            var result = {};
            var splitAmpersand = segment.split('&');
            for (var i = 0; i < splitAmpersand.length; i++) {
                var splitEqual = splitAmpersand[i].split('=');
                var variableName = splitEqual[0];
                var variableValue = HashParser.getNumberOrString(splitEqual[1]);

                // Either create property or push to an array or create an array for the value
                if (result[variableName] === undefined) result[variableName] = variableValue;
                else if (result[variableName].constructor === Array) result[variableName].push(result[variableName]);
                else result[variableName] = [result[variableName], variableValue];
            }

            return result;
        }

        /**
         * Parses a segment into a object, or number, or string
         *
         * @param segment :string, segment to parse
         * @returns {*} object, number or string
         */
        private static getRestOrNumberOrString(segment:string):any {

            var result = HashParser.getRest(segment);
            if (result === undefined) result = HashParser.getNumberOrString(segment);

            return result;
        }

        /**
         * Parses a segment into an object with resource as property.
         * E.g. r?a=1;s?b results in {r:{a:1}, s:'b'}
         *
         * @param segment :string, segment to parse
         * @returns {*} resource map object
         */
        private static getResource(segment:string):any {
            if (segment.match(/(.*\?.+;?)+/) == null) return undefined;

            var result = {};

            var splitSemiColon = segment.split(';');
            for (var i = 0; i < splitSemiColon.length; i++) {
                var splitQuestionMark = splitSemiColon[i].split('?');
                var resourceName = splitQuestionMark[0];
                var valueSegment = splitQuestionMark[1];

                var rest = HashParser.getRest(valueSegment);
                if (rest !== undefined) {
                    if (result[resourceName] === undefined) result[resourceName] = rest;
                    else if (result[resourceName].constructor === Array) rest[resourceName].push(rest);
                    else result[resourceName] = [result[resourceName], rest];
                } else {
                    var value = HashParser.getNumberOrString(valueSegment);
                    // Either create property or push to an array or create an array for the value
                    if (result[resourceName] === undefined) result[resourceName] = value;
                    else if (result[resourceName].constructor === Array) result[resourceName].push(value);
                    else result[resourceName] = [result[resourceName], value];
                }
            }

            return result;
        }

        /**
         * Removes static parts from a hash and returns only the dynamic parts.
         * E.g. regex a(/.+)?/b(/.+)? will return only the segments (/.+)?/b(/.+)?
         *
         * @param hash :string the hash/fragment
         * @param regexString :string, the regex as string
         * @returns {Array} dynamic segments
         */
        private static cropStaticElementsFromLeft(hash:string, regexString:string):string[] {
            if (hash === regexString) return [];

            var resultHash = '';

            for (var i = 0; i < hash.length; i++) {
                if (i >= regexString.length) {
                    resultHash += hash[i];
                } else if (hash[i] != regexString[i])
                    resultHash += hash[i];
            }
            resultHash = resultHash.replace(/^\//, '');

            //if (resultHash === '') return [];

            return resultHash.split('/');
        }

        /**
         * Gets the arguments from a hash.
         *
         * @param hash :string, hash string, constant left part will not be evaluated
         * @param regexString :string, the route regex
         * @returns {Array} the arguments for an apply
         */
        static getArguments(hash:string, regexString:string):any[] {
            var result = [];

            var segments = HashParser.cropStaticElementsFromLeft(hash, regexString);

            var resources = {};
            var resourceAdded = false;
            for (var i = 0; i < segments.length; i++) {
                var segment = segments[i];
                var resource = HashParser.getResource(segment);
                if (resource !== undefined) {
                    for (var resourceName in resource) {
                        if (!resource.hasOwnProperty(resourceName)) continue;

                        if (resources[resourceName] === undefined) resources[resourceName] = resource[resourceName];
                        else if (resources[resourceName].constructor === Array) resources[resourceName].push(resource[resourceName]);
                        else resources[resourceName] = [resources[resourceName], resource[resourceName]];
                    }
                    resourceAdded = true;
                }
                else result.push(HashParser.getRestOrNumberOrString(segment));
            }
            if (resourceAdded) result.unshift(resources);

            return result;
        }
    }
}