# Contributing to Web WorldWind

#### Table of Contents

[Asking Questions](#asking-questions)

[Design and Coding Guidelines](#design-and-coding-guidelines)

[Contributing](#contributing)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting New Features](#suggesting-new-features)
- [Pull Requests](#pull-requests)

[Resources](#resources)

## Asking Questions

**Please do not file an issue to ask a question.** You will get faster results by using the following resources:

- Check out the [WorldWind Forum](https://forum.worldwindcentral.com/)
- Email the [Administrative Contact](mailto:arc-worldwind@mail.nasa.gov)

## Design and Coding Guidelines

These design and coding guidelines are for **Web WorldWind** and do not necessarily reflect the expectations for other
WorldWind projects.

### General

* The project's development IDE is Visual Studio Code. The VS Code configuration files for the project are checked in to the code repository. They define within them dependencies and formatting rules.
* The Module pattern is followed for all functionality. All JavaScript code is captured within a module. There is only one global defined by Web WorldWind, and that is the `WorldWind` singleton. It contains the constructors and static functions used throughout the rest of the library.
* RequireJS is used to support the Module pattern and to provide AMD. Every module participates in RequireJS/AMD.
* Web WorldWind never crashes the browser. Always catch exceptions at least at the highest entry point, e.g., event listeners and thread execution.
* Variable and function names are clear, descriptive and easy to read. They are not labelled with a convention not described in this document. Use whole words rather than abbreviations, e.g., "index" rather than "idx". Correct all variable spelling warnings flagged by WebStorm. Add necessary ones to your dictionary.
* There are no "private" properties or functions/methods in Web WorldWind. Assume that a module extender will need access to all variables and functions of the module.
* Third party libraries are used minimally and strong justification is required for their use. Any usage of third party libraries must be agreed upon among the team and incorporated into the build system.
* Protect WebGL state within a rendering unit, such as a layer, by bracketing state changes within exception handlers. The goal is to isolate any WebGL state changes to the rendering unit, both when the unit succeeds and when it fails.
* A rendering unit assumes that the WebGL state is entirely at its default value when the rendering unit is given control. The full WebGL state must be restored before the rendering unit releases control.
* Web WorldWind is designed such that the right things just happen once things are set up. The effect of something going wrong is benign. Avoiding micromanagement of state and code brittleness. For example, layers fork off retrieval of data but they don't try to keep track of these retrievals. If the retrieval succeeds then the data will be available the next time the layer looks for it. If it's not available at that point then the layer will simply ask for it again.
* All code uses the JavaScript "use strict" directive.
* The system is designed such that memory allocation and usage is minimized by both the system and its applications. To that end many methods that compute and return a value of type other than Number accept a "result" argument in which to return the computed value. When that argument exists, validate that it is non-null and defined. The result argument is typically used as the return value of the function.

### Exceptions

* Web WorldWind objects pass exceptions through to the application unless there's good reactive/corrective behavior that can be applied within Web WorldWind.
* Log any exceptions prior to throwing them. Use the same message for the log as for the exception. Use pre-defined logger messages (see Logger) when possible. Pre-define in Logger those messages expected to be used more than a few places.
* Ensure all exception messages are descriptive and helpful, but keep them short.
* "Public" functions validate their arguments and throw the appropriate exception, typically ArgumentError, and identify the exception message the parameter name and the problem -- null, out of range, etc. Validation is a necessary part of the implementation; code should not be checked in without it.
* "Protected" methods whose calling client can't be trusted validate their arguments and throw an appropriate exception.
* When validating arguments, do not validate for type. Just validate non-Number arguments for existence and appropriateness to the function. Validate arrays for sufficient length when the necessary length is known a priori.
* The audience for exceptions is not primarily the user of the client program, but the application or WorldWind developer. Throw exceptions that would let them know immediately that they're using faulty logic or data.

### Code Formatting

* All Web WorldWind code follows the same style and conventions and looks the same in style and format.
* Web WorldWind code is heavily commented. The comments describe both the what and how of a block of code.
* Web WorldWind variable and function names are descriptive.
* Web WorldWind follows the coding conventions described in Chapter 2 of the book *JavaScript Patterns*.
* Line length is 120 characters and indentation widths are 4 characters.
* Variable and function names use camel case. The exception is constructors, which capitalize their first letter. Constants are in all upper case with words separated by underscores.
* White space is preferred over packing code into a small space. Use white space liberally. Separate functional blocks of code with vertical white space. Think of code within a function as a sequence of paragraphs and separate each with a blank line.
* Standard copyright message should be included into new code files.

### Documentation

* Documentation is generated by JSDoc.
* Run JSDoc and review the results prior to checking in any code. It's a convenient check on documentation and typing.
* Document all functions and properties. Mark those meant for internal use only as such.
* Code isn't complete until the documentation is written. Write all documentation when you implement the function or property. Don't wait until "later". Assume that you will never return to a module to "clean up".
* Use present tense in all documentation. Examples are: "Indicates that ...", "Computes ...", "Returns ...". Do not use terms like "Will compute" or "Will return".
* Ensure that the type of all documented arguments and properties is specified in the documentation. For arrays, use {Number[]} and {Vec3[]} and not simply {Array}.
* Use correct capitalization and full sentences to document everything. All function, parameter and error descriptions start with an upper-case letter and end with a period.
* Ensure that all method arguments, return values and exceptions are documented.
* Use the IDE to identify spelling mistakes in documentation. It will flag them with a wavy underline.
* Class documentation goes in the @classdesc descriptor for the class' constructor.

### Commits and Branching

* The team follows the Gitflow Workflow. Read this article if you aren't familiar with this workflow: http://nvie.com/posts/a-successful-git-branching-model/
* In addition, the team prefix features branches:
* With `feature/` when the commits bring new functionality;
* With `fix/` when the commits address an issue or bug.

## Contributing

### Reporting Bugs

This section guides you through submitting a bug report to Web WorldWind. Following these guidelines helps both the
WorldWind team and community understand your report, reproduce the behavior, and find related reports.

#### Before Submitting a Bug Report

* Check the [**"Common Problems"**](https://worldwind.arc.nasa.gov/web/tutorials/common-problems/) page on the WorldWind
website. This page describes common issues that users or developers frequently encounter and gives solutions to those issues.
* Check the [**WorldWind Forum**](https://forum.worldwindcentral.com/forum/web-world-wind/web-world-wind-help).
* Check this repository's [**issues**](https://github.com/NASAWorldWind/WebWorldWind/issues) to see if the problem has
already been reported. If it has and the issue is **still open**, add a comment to the existing issue instead of opening
a new one.

> **Note:** If you find a **Closed** issue that seems like it is similar to what you are experiencing, open a new issue
and include a link to the original issue in the body of your new one.

#### Submitting a Good Bug Report

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you've complete the prerequisites
for submitting a bug, create an issue in the appropriate repository and providing the following information by filling out
the [template](ISSUE_TEMPLATE.md).

Explain the problem and include additional details to help the WorldWind team reproduce the problem:

* **Use a clear, descriptive title.**
* **Describe the exact steps which reproduce the problem.** Please be as detailed as possible. When listing steps, don't
just say what you did, but explain how you did it.
* **Provide specific examples.** Include the appropriate files, links, or code snippets which will help the WorldWind
team and community better understand the issue.
* **Describe the behavior.** Detail what behavior you observed and point out what is wrong with that behavior. Explain
which behavior you expected to see and why.

Provide more context by answering these questions:

* **Did the problem start happening recently?**
* **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which
conditions it normally happens.
* **Does the problem happen for all files, or only some?**
* **What is the name and version of the OS you're running?**

### Suggesting New Features

This section guides you through submitting and enhancement for Web WorldWind, including completely new features and minor
improvements to existing functionalities. Following these guidelines helps the WorldWind team and community understand
your suggestion and find related suggestions.

Before creating new feature suggestions, check this repository's [issues](https://github.com/NASAWorldWind/WebWorldWind/issues)
as you may find out that you don't need to create one. When you are creating an enhancement suggestion, please provide as many details as possible. Fill in the [template](ISSUE_TEMPLATE.md), including the steps that you imagine you would take if the feature you're requesting existed.

#### Submitting a Good New Feature Suggestion

New feature suggestions are tracked as [GitHub Issues](https://guides.github.com/features/issues/). After you've checked for existing issues that might relate to your suggestion, create an issue
in the appropriate repository and provide the following information:

* **Use a clear and descriptive title.**
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps.**
* **Explain why this enhancement would be beneficial** to most WorldWind users.
* **Specify the name and version of the OS you're using.**

### Pull Requests

* Fill in the [PULL_REQUEST template](PULL_REQUEST_TEMPLATE.md).
* Do not include issue numbers in the PR title.
* Provide a description of the change.
* Explain why this code should be in the core.
* Describe possible benefits and drawbacks from merging this pull request.
* Specify some issues to which this pull request is applicable.

## Resources

For Web WorldWind tutorials and examples, please check out our website: https://worldwind.arc.nasa.gov/.

For community support and FAQs, check out the WorldWind Forum: https://forum.worldwindcentral.com/.

To reach our Administrative Contact, please email: [arc-worldwind@mail.nasa.gov](mailto:arc-worldwind@mail.nasa.gov).

