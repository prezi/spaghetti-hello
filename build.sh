#!/bin/bash -e

#
# Greeter
#
echo "Starting on greeter-module"
cd greeter-module

echo "[greeter-module] Generating headers"
rm -rf headers
spaghetti generate headers --definition src/main/spaghetti/Greeter.module --language typescript --output headers

echo "[greeter-module] Compiling"
tsc `find src/main/ts -name "*.ts"` `find headers -name "*.ts"` --out Greeter.js

echo "[greeter-module] Bundling"
spaghetti bundle --definition src/main/spaghetti/Greeter.module --language typescript --source Greeter.js --output bundle

echo "Done with greeter-module"
cd ..

#
# Adder
#

echo "Starting on adder-module"
cd adder-module

echo "[adder-module] Generating headers"
rm -rf headers
spaghetti generate headers --definition Adder.module --language kotlin --output headers

echo "[adder-module] Compiling"
cd ..
./kotlinc-js.sh adder-module Adder
cd adder-module

echo "[adder-module] Bundling"
spaghetti bundle --definition Adder.module --language kotlin --source Adder.js --output bundle

echo "Done with adder-module"
cd ..

#
# Runner
#

echo "Starting on runner-module"
cd runner-module

echo "[runner-module] Generating headers"
rm -rf headers
spaghetti generate headers --definition src/main/spaghetti/Runner.module --language haxe --dependency-path ../greeter-module/bundle:../adder-module/bundle --output headers

echo "[runner-module] Compiling"
haxe -cp headers -cp src/main/haxe -js Runner.js --macro "include('com.example.runner')"

echo "[runner-module] Bundling"
spaghetti bundle --definition src/main/spaghetti/Runner.module --language haxe --source Runner.js --output bundle -d ../greeter-module/bundle/:../adder-module/bundle

echo "Done with runner-module"
cd ..

echo "Packaging application"
spaghetti package --wrapper node \
          --dependency-path greeter-module/bundle:adder-module/bundle:runner-module/bundle \
          --execute --main com.example.runner --output app

echo "Done."
echo "You can now run the application with"
echo "   node app/application.js"
