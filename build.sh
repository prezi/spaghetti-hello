#!/bin/bash -e

echo "Starting on greeter-module"
cd greeter-module

echo "[greeter-module] Generating headers"
rm -rf headers
spaghetti generate headers --definition Greeter.module --language typescript --output headers

echo "[greeter-module] Compiling"
tsc src/com/example/greeter/GreeterModuleImpl.ts headers/GreeterModule.ts headers/Spaghetti.ts --out Greeter.js

echo "[greeter-module] Bundling"
spaghetti bundle --definition Greeter.module --language typescript --source Greeter.js --output bundle

echo "Done with greeter-module"
cd ..

echo "Starting on runner-module"
cd runner-module

echo "[runner-module] Generating headers"
rm -rf headers
spaghetti generate headers --definition Runner.module --language haxe --dependency-path ../greeter-module/bundle --output headers

echo "[runner-module] Compiling"
haxe -cp headers -cp src -js Runner.js --macro "include('com.example.runner')"

echo "[runner-module] Bundling"
spaghetti bundle --definition Runner.module --language haxe --source Runner.js --output bundle -d ../greeter-module/bundle/

echo "Done with runner-module"
cd ..

echo "Packaging application"
spaghetti package --wrapper node \
          --dependency-path greeter-module/bundle:runner-module/bundle \
          --execute --main com.example.runner --output app

echo "Done."
echo "You can now run the application with"
echo "   node app/application.js"
