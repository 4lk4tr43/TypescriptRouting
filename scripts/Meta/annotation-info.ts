module Meta {

    /**
     * Information passed to an annotation class when executing
     */
    export class AnnotationInfo {

        /**
         * Information fields
         * @param args :any, argument json part of the annotation transformed to a javascript object
         * @param annotated :any, the instance to be annotated
         * @param funcName :string, name of the function that is annotated
         * @param funcParamNames :string[], parameter names of the annotated function
         */
        constructor(public args:any, public annotated:any, public funcName:string, public funcParamNames:string[]) {
        }
    }
}