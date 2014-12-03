module Meta {

    /**
     * Parses information about functions of a class
     */
    export class FunctionParser {

        /**
         * Gets the name of a function
         *
         * @param functionString :string, the function as a string
         * @returns {string} , the function name
         */
        static getFunctionName(functionString:string):string {
            var endIndex = functionString.indexOf('(');
            return functionString.substring(9, endIndex).trim();
        }

        /**
         * Gets all function names of a function
         *
         * @param functionString :string, complete function string
         * @returns {string[]} , all parameter names of the class
         */
        static getFunctionParameterNames(functionString:string):string[] {
            var argsStart = functionString.indexOf('(') + 1;
            var argsEnd = functionString.indexOf(')');

            var argsString = functionString.substring(argsStart, argsEnd).replace(/\s/g, '');
            return argsString.length === 0 ? undefined : argsString.split(',');
        }

        /**
         * Gets the function body from exclusive { to the end
         *
         * @param functionString :string, complete function string
         * @returns {string} , cropped string
         */
        static getFunctionBodyFlatStartString(functionString:string) {
            var bodyStart = functionString.indexOf('{') + 1;
            return functionString.substring(bodyStart).replace(/(\r)/g, '').replace(/(\n)/g, '').replace(/\s+'/g, "'");
        }

        /**
         * Gets all annotations strings in the function
         *
         * @param bodyStartString :string: cropped function string
         * @returns {string[]} , all annotations
         */
        static getFunctionAnnotations(bodyStartString:string):string[] {
            var split = bodyStartString.split(';');
            var result = [];
            for (var i = 0; i < split.length; i++) {
                var expression = split[i];
                if (expression.match(/^'.*'/) != null) result.push(expression);
                else break;
            }
            return result.length === 0 ? undefined : result;
        }

        /**
         * Gets function information for an instance
         * in the form {functionName:{parameters;annotations}, ...}
         *
         * @param instance :any, instance to parse
         * @returns {string:{parameters:string[];annotations:string[]}
         */
        static getFunctionInfo(instance:any):any{
            var result = {};

            for (var property in instance) {
                // No property check because we want to use the class, just in case the instance is not ready yet

                //noinspection JSUnfilteredForInLoop
                if (typeof instance[property] !== 'function') continue;

                //noinspection JSUnfilteredForInLoop
                var functionString = instance[property].toString();

                var parameters = FunctionParser.getFunctionParameterNames(functionString);
                var annotations = FunctionParser.getFunctionAnnotations(
                        FunctionParser.getFunctionBodyFlatStartString(functionString));

                //noinspection JSUnfilteredForInLoop
                result[property] = {parameters: parameters, annotations: annotations};
            }

            return result;
        }
    }
}