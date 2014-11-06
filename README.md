spaghetti-hello
=========
[Spaghetti](https://github.com/prezi/spaghetti) provides type-safe communication between JavaScript modules.

Contents
 - [Minimal Example](#minimal-example)
 - [Step-by-Step: Hello, World!](#step-by-step-hello-world)
 	- [Installing Spaghetti](#installing-spaghetti)
 	- [Your First Module](#your-first-module)
 		- [Generating Headers](#generating-headers)
 		- [Writing Module Code](#writing-module-code)
 		- [Bundling](#bundling)
 	- [Your Second Module](#your-second-module)
 	- [Packaging the Application](#packaging-the-application)
 - [Breaking Stuff](#breaking-stuff)
 - [Further Reading](#furtehr-reading)

## Minimal Example
A minimal example of TypeScript and Haxe code working together via Spaghetti.

#### Requirements
------------------
 * [https://github.com/prezi/spaghetti](Spaghetti)
  * OS X: `brew tap prezi/oss && brew install spaghetti`
 * [http://haxe.org/](Haxe) compiler
  * OS X: `brew install haxe`
 * [http://www.typescriptlang.org/](TypeScript)
  * OS X: `npm install -g typescript`

#### Running
------------------
```
git clone https://github.com/prezi/spaghetti-hello
cd spaghetti-hello
```

Then you have several options to check out how to use build systems for building.

#### Simple shell-script
------------------

```
$ ./build.sh
$ node app/application.js
```

#### Grunt
------------------

```
$ npm install -g grunt-cli  # If you don't have grunt-cli installed yet
$ npm install grunt
```

Step-by-Step: Hello, World!
=========

Let's create the mother of all tutorial-applications: a simple "Hello, World!" 

#### Installing Spaghetti
------------------

Install the command-line tool via [Homebrew](http://brew.sh) so that you can easily run spaghetti from the command-line:

```bash
$ brew tap prezi/oss
$ brew install spaghetti
$ spaghetti version
Spaghetti version 2.0
```

Then create a new directory somewhere (we will call our created directory "spaghetti"), and start cracking.

#### Your first module
------------------

We'll need a directory for each module, so let's create one for the first one:

```bash
spaghetti$ mkdir greeter-module
spaghetti$ cd greeter-module
```

Create a `Greeter.module` file in `greeter-module`:

```text
module com.example.greeter

/**
 * A simple greeter.
 */
interface Greeter {
    string sayHello(string user)
}

Greeter createGreeter()
```

#### Generating Headers
------------------
Now let's generate some TypeScript headers:

```bash
greeter-module$ spaghetti generate headers --definition Greeter.module \
  --language typescript --output headers
```

You should see the following files in the `headers` directory created:

	```bash
	headers
	|-- GreeterModule.ts
	`-- Spaghetti.ts
	```

`GreeterModule.ts` is the TypeScript manifestation of the Spaghetti API we just defined:

	```typescript
	/*
	 * Generated by Spaghetti 2.0
	 */
	module com.example.greeter {
	    /**
	     * A simple greeter.
	     */
	    export interface Greeter {
	        sayHello(user:string):string;

	    }
	    export class __GreeterModuleProxy {
	        createGreeter():com.example.greeter.Greeter {
	            return com.example.greeter.GreeterModule.createGreeter();
	        }

	    }
	    export function __createSpaghettiModule():any {
	        return new com.example.greeter.__GreeterModuleProxy();
	    }
	}
	```

**Pro tip:** You can add Javadoc-style comments to methods, interfaces, or even whole modules that are preserved in the generated code.

The role of `Spaghetti.ts` is explained on the [[wrapping|Wrapping#the-spaghetti-object]] page.

#### Writing Module Code
------------------
Add a `GreeterModuleImpl.ts`:

	```typescript
	module com.example.greeter {
	    export class GreeterImpl implements Greeter {
	        sayHello(user:string):string {
	            return "Hello " + user + "!";
	        }
	    }

	    export class GreeterModule {
	        static createGreeter():com.example.greeter.Greeter {
	            return new GreeterImpl();
	        }
	    }
	}
	```
We will need the TypeScript compiler for the next step, so install it with `npm install -g typescript` if you don't already have it. 

Then, compile `GreeterModuleImpl.ts`:

```bash
greeter-module$ tsc GreeterModuleImpl.ts headers/GreeterModule.ts \
  headers/Spaghetti.ts --out Greeter.js
```

This creates a `Greeter.js` file that should look something like this:

```js
var com;
(function (com) {
  (function (example) {
    (function (greeter) {
      var GreeterImpl = (function () {
        function GreeterImpl() {
        }
        GreeterImpl.prototype.sayHello = function (user) {
          return "Hello " + user + "!";
        };
        return GreeterImpl;
      })();
      greeter.GreeterImpl = GreeterImpl;

      var GreeterModule = (function () {
        function GreeterModule() {
        }
        GreeterModule.createGreeter = function () {
          return new GreeterImpl();
        };
        return GreeterModule;
      })();
      greeter.GreeterModule = GreeterModule;
    })(example.greeter || (example.greeter = {}));
    var greeter = example.greeter;
  })(com.example || (com.example = {}));
  var example = com.example;
})(com || (com = {}));
var com;
(function (com) {
  (function (example) {
    /*
    * Generated by Spaghetti 2.0
    */
    (function (greeter) {
      var __GreeterModuleProxy = (function () {
        function __GreeterModuleProxy() {
        }
        __GreeterModuleProxy.prototype.createGreeter = function () {
          return com.example.greeter.GreeterModule.createGreeter();
        };
        return __GreeterModuleProxy;
      })();
      greeter.__GreeterModuleProxy = __GreeterModuleProxy;
      function __createSpaghettiModule() {
        return new com.example.greeter.__GreeterModuleProxy();
      }
      greeter.__createSpaghettiModule = __createSpaghettiModule;
    })(example.greeter || (example.greeter = {}));
    var greeter = example.greeter;
  })(com.example || (com.example = {}));
  var example = com.example;
})(com || (com = {}));
```

#### Bundling
------------------
Now we need to make our module into a reusable module bundle:

```bash
greeter-module$ spaghetti bundle --definition Greeter.module --language typescript \
  --source Greeter.js --output bundle
```

This will create a directory called `bundle`:

```bash
bundle
|-- META-INF
|   `-- MANIFEST.MF
|-- module.def
`-- module.js

1 directory, 3 files
```

The `module.def` file contains the module's definition. The `module.js` file is almost exactly the same as `Greeter.js`, except for the bundle's [wrapping](Wrapping) function:

```js
module(function(Spaghetti) {
    // ...
})
```

#### Your Second Module
------------------
Now we have bundled our module, so we can create another one:

```bash
greeter-module$ cd ..
spaghetti$ mkdir runner-module
spaghetti$ cd runner-module
```

Let's create an executable module in `Runner.module`. It's as simple as:

```text
module com.example.runner

void main()
```

From this module we want to use `greeter-module`, so we need to supply its bundle on the command-line:

```bash
runner-module$ spaghetti generate headers --definition Runner.module \
  --language haxe --dependency-path ../greeter-module/bundle --output headers
```

Again, we get some sources in the `headers` directory:

```bash
headers
|-- Spaghetti.hx
`-- com
    `-- example
        |-- greeter
        |   |-- Greeter.hx
        |   `-- GreeterModule.hx
        `-- runner
            |-- __RunnerModuleInit.hx
            `-- __RunnerModuleProxy.hx
```

This looks a little more complicated, because the Haxe generator uses a directory structure that matches the package structure of the source files. Haxe itself also needs a little bit more convincing to compile into Spaghetti-compatible JavaScript code, hence the `__RunnerModuleInit.hx`. But as you will see, this will compile to small enough JavaScript in the end.

But first, we need to write our second module! You need to create the directories `src/com/example/runner` and create `RunnerModule.hx` in this directory:

```haxe
package com.example.runner;

import com.example.greeter.GreeterModule;

class RunnerModule {
	public static function main():Void {
		var greeter = GreeterModule.createGreeter();
		trace(greeter.sayHello("Spaghetti"));
	}
}
```
Now we need Haxe. You can install Haxe with `brew install haxe` (it may ask you install XQuartz as well -- please do so).
Compile it with:

```bash
runner-module$ haxe -cp headers -cp src -js Runner.js \
  --macro "include('com.example.runner')"
```

The resulting `Runner.js` file should look like:

```js
(function () { "use strict";
var com = {};
com.example = {};
com.example.greeter = {};
com.example.greeter.Greeter = function() { };
com.example.greeter.GreeterModule = function() { };
com.example.runner = {};
com.example.runner.RunnerModule = function() { };
com.example.runner.RunnerModule.main = function() {
	var greeter = com.example.greeter.GreeterModule.module.createGreeter();
	greeter.sayHello("Spaghetti");
};
com.example.runner.__RunnerModuleProxy = function() {
};
com.example.runner.__RunnerModuleProxy.prototype = {
	main: function() {
		com.example.runner.RunnerModule.main();
	}
};
com.example.runner.__RunnerModuleInit = function() { };
com.example.runner.__RunnerModuleInit.delayedInit = function() {
	__haxeModule = new com.example.runner.__RunnerModuleProxy();
	return true;
};
com.example.greeter.GreeterModule.module = Spaghetti["dependencies"]["com.example.greeter"]["module"];
com.example.runner.__RunnerModuleInit.delayedInitFinished = com.example.runner.__RunnerModuleInit.delayedInit();
})();
```

As usual, we bundle this module, too:

```bash
runner-module$ spaghetti bundle --definition Runner.module --language haxe \
  --source Runner.js --output bundle -d ../greeter-module/bundle/
```

#### Packaging the Application
------------------
Now, let's create a runnable application:

```bash
runner-module$ cd ..
spaghetti$ spaghetti package --wrapper node \
  --dependency-path greeter-module/bundle:runner-module/bundle \
  --execute --main com.example.runner --output app
```

This will create an application in `app`:

```bash
app
|-- application.js
`-- node_modules
    |-- com.example.greeter
    |   `-- index.js
    `-- com.example.runner
        `-- index.js
```

To run the application, simply execute:

```bash
spaghetti$ node app/application.js
Hello Spaghetti!
```
## Breaking Stuff
Now that we have seen an ideal case where everything works, let's see what happens when our dependencies break. 

Change our function in Greeter.module file from "sayHello" to "sayHi", 
```
module com.example.greeter

/**
 * A simple greeter.
 */
interface Greeter {
    string sayHi(string user)
}

Greeter createGreeter()

```

Watch it break. 
```
$ ./build.sh
$ GreeterModuleImpl.ts(10,20): error TS2322: Type 'GreeterImpl' is not \
assignable to type 'Greeter':
  Property 'sayHi' is missing in type 'GreeterImpl'.
```

Fix this by updating "sayHello" to "sayHi" GreeterImpl.ts,

```
module com.example.greeter {
    export class GreeterImpl {
        sayHi(user:string):string {
            return "Hello " + user + "!";
        }
    }

    export class GreeterModule {
        static createGreeter():com.example.greeter.Greeter {
            return new GreeterImpl();
        }
    }
}
```

Let's do something more interesting. Change the passed data type from a string to a Person. 

```
module com.example.greeter

struct Person {
	string firstName
	string lastName
}

/**
 * A simple greeter.
 */
interface Greeter {
    string sayHi(Person user)
}

Greeter createGreeter()
```

Break stuff. 

```
src/com/example/greeter/GreeterModuleImpl.ts(10,20): error TS2322: Type 'GreeterImpl' is not assignable to type 'Greeter':
  Types of property 'sayHi' are incompatible:
    Type '(user: string) => string' is not assignable to type '(user: Person) => string':
      Types of parameters 'user' and 'user' are incompatible:
        Type 'string' is not assignable to type 'Person':
          Property 'firstName' is missing in type 'String'.
```

Fix stuff in GreeterModuleImpl.ts by changing sayHi(user:string) to sayHi(user:Person).
Also, change the return value to "Hello " + user.firstName + "!";

```
module com.example.greeter {
    export class GreeterImpl {
        sayHi(user:Person):string {
            return "Hello " + user.firstName + "!";
        }
    }

    export class GreeterModule {
        static createGreeter():com.example.greeter.Greeter {
            return new GreeterImpl();
        }
    }
}
```

and RunnerModule.hx.

```
package com.example.runner;

import com.example.greeter.GreeterModule;

class RunnerModule {
    public static function main():Void {
        var greeter = GreeterModule.createGreeter();
        trace(greeter.sayHi({firstName: "Spaghetti", lastName: "Pesto"}));
    }
}
```

Our application is fixed and will now build properly. Hooray! 

## Further reading

Read the [Spaghetti language reference](https://github.com/prezi/spaghetti/wiki/Spaghetti-Syntax) to add further features to your application. Or head over to the [Spaghetti Gradle example](https://github.com/prezi/spaghetti/wiki/tree) containing examples for many features.
