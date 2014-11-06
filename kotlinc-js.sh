#!/bin/bash

set -e

module_path=$1; shift
module_name=$1; shift

cd $module_path

if [ ! -d kotlinc ]; then
    wget -q https://github.com/JetBrains/kotlin/releases/download/build-0.9.66/kotlin-compiler-0.9.66.zip
    unzip kotlin-compiler-0.9.66.zip
fi

find . -name '*.kt' | xargs ./kotlinc/bin/kotlinc-js -output ./build/$module_name.js -library-files kotlinc/lib/kotlin-jslib.jar -nowarn -output-prefix kotlinc/lib/kotlin.js
