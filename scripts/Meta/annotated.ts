///<reference path="function-parser.ts"/>
///<reference path="annotation-info.ts"/>
///<reference path="annotation.ts"/>

module Meta {

    /**
     * Classes derived from this class can use annotations in functions.
     * There is an overhead in using this class at construction.
     *
     * E.g. funcA() { 'Annotation1={"paramName":arg}'; 'Annotation2'; }
     * Annotations must use single string delimiters for the start, and end, as well as end with a semicolon -> '...';
     */
    export class Annotated {

        /**
         * This function parses the annotation on class instantiation.
         *
         * @param instance :any derived class, the instance that will be annotated, members don't exist at this point,
         *                                     so one must use lazy getters to imprint fields on the class
         */
        private static __parseAnnotations(instance) {
            // get info about the class function from the function parser
            var functionsInfo = FunctionParser.getFunctionInfo(instance);

            for (var functionName in functionsInfo) {
                if (!functionsInfo.hasOwnProperty(functionName)) continue;

                // check if the function has annotations
                if (functionsInfo[functionName].annotations === undefined) continue;
                for (var i = 0; i < functionsInfo[functionName].annotations.length; i++) {
                    var annotation = functionsInfo[functionName].annotations[i]
                                        .substr(1, functionsInfo[functionName].annotations[i].length - 2);
                    var annotationIndex = annotation.indexOf('=');
                    var annotationClassName;
                    var annotationArgs = undefined;
                    if (annotationIndex == -1)
                        annotationClassName = annotation;
                    else {
                        annotationClassName = annotation.substring(0, annotationIndex);
                        var json = annotation.substring(annotationIndex + 1, annotation.length);
                        annotationArgs = JSON.parse(json); // get the annotation arguments
                    }

                    // get the real class of the annotation
                    var path = annotationClassName.split('.');
                    var annotationClass = window;
                    for (var j = 0; j < path.length; j++) {
                        var nextStep = path[j];
                        annotationClass = annotationClass[nextStep];
                    }

                    var info = new AnnotationInfo(annotationArgs, instance, functionName, functionsInfo[functionName].parameters);

                    // call the annotation class to modify the class
                    annotationClass['execute'](info);
                }
            }
        }

        // execute the annotation parsing on instantiation
        constructor() {
            Annotated.__parseAnnotations(this);
        }
    }
}