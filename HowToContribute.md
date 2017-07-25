# Web World Wind Design and Coding Guidelines

## General

* The project's development IDE is WebStorm. The WebStorm configuration files for the project are checked in to the code repository. They define within them dependencies and formatting rules.
* The Module pattern is followed for all functionality. All JavaScript code is captured within a module. There is only one global defined by Web World Wind, and that is the `WorldWind` singleton. It contains the constructors and static functions used throughout the rest of the library.
* RequireJS is used to support the Module pattern and to provide AMD. Every module participates in RequireJS/AMD.
* Web World Wind never crashes the browser. Always catch exceptions at least at the highest entry point, e.g., event listeners and thread execution.
* Variable and function names are clear, descriptive and easy to read. They are not labelled with a convention not described in this document. Use whole words rather than abbreviations, e.g., "index" rather than "idx". Correct all variable spelling warnings flagged by WebStorm. Add necessary ones to your dictionary.
* There are no "private" properties or functions/methods in Web World Wind. Assume that a module extender will need access to all variables and functions of the module.
* Third party libraries are used minimally and strong justification is required for their use. Any usage of third party libraries must be agreed upon among the team and incorporated into the build system.
* Protect WebGL state within a rendering unit, such as a layer, by bracketing state changes within exception handlers. The goal is to isolate any WebGL state changes to the rendering unit, both when the unit succeeds and when it fails.
* A rendering unit assumes that the WebGL state is entirely at its default value when the rendering unit is given control. The full WebGL state must be restored before the rendering unit releases control.
* Web World Wind is designed such that the right things just happen once things are set up. The effect of something going wrong is benign. Avoiding micromanagement of state and code brittleness. For example, layers fork off retrieval of data but they don't try to keep track of these retrievals. If the retrieval succeeds then the data will be available the next time the layer looks for it. If it's not available at that point then the layer will simply ask for it again.
* All code uses the JavaScript "use strict" directive.
* WebStorm flags code errors and warnings as you write it. The errors are indicated by red and yellow markers in the right margin of a module's editor window. When a module is checked in there should be no red flags and all yellow flags should be addressed to the extent possible. Use F2 in WebStorm to move among errors and warnings. Strive to have no warnings or spelling errors. In this case, the square at the top of the right margin will be dark green. (Light green indicates that there are spelling errors.)
* The system is designed such that memory allocation and usage is minimized by both the system and its applications. To that end many methods that compute and return a value of type other than Number accept a "result" argument in which to return the computed value. When that argument exists, validate that it is non-null and defined. The result argument is typically used as the return value of the function.

## Exceptions

* Web World Wind objects pass exceptions through to the application unless there's good reactive/corrective behavior that can be applied within Web World Wind.
* Log any exceptions prior to throwing them. Use the same message for the log as for the exception. Use pre-defined logger messages (see Logger) when possible. Pre-define in Logger those messages expected to be used more than a few places.
* Ensure all exception messages are descriptive and helpful, but keep them short.
* "Public" functions validate their arguments and throw the appropriate exception, typically ArgumentError, and identify the exception message the parameter name and the problem -- null, out of range, etc. Validation is a necessary part of the implementation; code should not be checked in without it.
* "Protected" methods whose calling client can't be trusted validate their arguments and throw an appropriate exception.
* When validating arguments, do not validate for type. Just validate non-Number arguments for existence and appropriateness to the function. Validate arrays for sufficient length when the necessary length is known a priori.
* The audience for exceptions is not primarily the user of the client program, but the application or World Wind developer. Throw exceptions that would let them know immediately that they're using faulty logic or data.

## Code Formatting

* All Web World Wind code follows the same style and conventions and looks the same in style and format.
* Web World Wind code is heavily commented. The comments describe both the what and how of a block of code.
* Web World Wind variable and function names are descriptive.
* Web World Wind follows the coding conventions described in Chapter 2 of the book *JavaScript Patterns*. These conventions are encoded in the WebStorm project files.
* Line length is 120 characters and indentation widths are 4 characters.
* Variable and function names use camel case. The exception is constructors, which capitalize their first letter. Constants are in all upper case with words separated by underscores.
* White space is preferred over packing code into a small space. Use white space liberally. Separate functional blocks of code with vertical white space. Think of code within a function as a sequence of paragraphs and separate each with a blank line.
* Set up WebStorm to insert the standard copyright message into new code files.

## Documentation

* Documentation is generated by JSDoc.
* Run JSDoc and review the results prior to checking in any code. It's a convenient check on documentation and typing. Set up Grunt (see [HowToBuildWebWW.md](HowToBuildWebWW.md) in the source repository) and use the jsdoc target.
* Document all functions and properties. Mark those meant for internal use only as such.
* Code isn't complete until the documentation is written. Write all documentation when you implement the function or property. Don't wait until "later". Assume that you will never return to a module to "clean up".
* Use present tense in all documentation. Examples are: "Indicates that ...", "Computes ...", "Returns ...". Do not use terms like "Will compute" or "Will return".
* Ensure that the type of all documented arguments and properties is specified in the documentation. For arrays, use {Number[]} and {Vec3[]} and not simply {Array}.
* Use correct capitalization and full sentences to document everything. All function, parameter and error descriptions start with an upper-case letter and end with a period.
* Ensure that all method arguments, return values and exceptions are documented.
* Use WebStorm to identify spelling mistakes in documentation. It will flag them with a wavy underline. Use F2 to move among them.
* Class documentation goes in the @classdesc descriptor for the class' constructor.

## Commits and Branching

* The team follows the Gitflow Workflow. Read this article if you aren't familiar with this workflow: http://nvie.com/posts/a-successful-git-branching-model/
* In addition, the team prefix features branches:
  * With `feature/` when the commits bring new functionality;
  * With `fix/` when the commits address an issue or bug.
