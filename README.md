# spaghetti-hello

A minimal example of TypeScript and Haxe code working together via Spaghetti.

## Requirements

 * [https://github.com/prezi/spaghetti](Spaghetti)
  * OSX: `brew tap prezi/oss && brew install spaghetti`
 * [http://haxe.org/](Haxe) compiler
  * OSX: `brew install haxe`
 * [http://www.typescriptlang.org/](TypeScript)
  * OSX: `npm install -g typescript`

## Running

```
git clone https://github.com/prezi/spaghetti-hello
cd spaghetti-hello
```

Then you have several options to check out how to use build systems for building.

### Simple shell-script

```
./build.sh
node app/application.js
```

### Grunt

```
npm install -g grunt-cli  # If you don't have grunt-cli installed yet
npm install
grunt
```
