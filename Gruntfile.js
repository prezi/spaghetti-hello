module.exports = function(grunt) {
    /**
     * In the long run this may be factored out into a separately distributed library
     *
     * Required keys in opts:
     *  name: name of the task set, to be interpolated into task name like generate_$NAME_headers
     *        must match the name of the .module file
     *  path: where the module exists on the file system, relative to the Gruntfile
     *  language: source language (like haxe, typescript)
     *  package: only required when language=haxe, the root package path to include in the compile step, passed o haxe --macro "include('$PACKAGE')"
     *
     * Optional keys in opts:
     *  dependencies: a list of module paths this module depends on, relative to this module
     *
     * TODO pass module dependencies to grunt, so it can resolve the correct task order
     *      right now the calls to spaghettiTaskSet need to be in the correct order (dependency before dependent)
     * TODO generate clean tasks
     */
    function spaghettiTaskSet() {
        var opts = this.data, spec,
            compileCommand = {
                "typescript": 'find . -name \'*.ts\' | xargs tsc --out ' + opts.name + '.js',
                "haxe": "haxe -cp headers -cp src/main/haxe -js " + opts.name + ".js --macro \"include('" + opts.package + "')\""
            };

        spaghettiTaskSet.modulePaths.push(opts.path);

        if (!config.hasOwnProperty('exec')) {
            config.exec = {};
        }

        spec = {
            command: "rm -rf headers && spaghetti generate headers --definition src/main/spaghetti/" + opts.name + ".module --language " + opts.language + " --output headers",
            cwd: opts.path
        };
        if (opts.hasOwnProperty("dependencies")) {
            for (var i = 0; i < opts.dependencies.length; i++) {
                spec.command += " --dependency-path " + opts.dependencies[i] + "/bundle";
            }
        }
        grunt.config("exec.Generate" + opts.name + "Headers", spec);

        grunt.config("exec.Compile" + opts.name, {
            command: compileCommand[opts.language],
            cwd: opts.path
        });

        spec = {
            command: "spaghetti bundle --definition src/main/spaghetti/" + opts.name + ".module --language " + opts.language + " --source " + opts.name + ".js --output bundle",
            cwd: opts.path
        };
        if (opts.hasOwnProperty("dependencies")) {
            for (var i = 0; i < opts.dependencies.length; i++) {
                spec.command += " -d " + opts.dependencies[i] + "/bundle";
            }
        }
        grunt.config("exec.Bundle" + opts.name, spec);
    }
    spaghettiTaskSet.modulePaths = [];

    grunt.registerMultiTask('spaghetti', spaghettiTaskSet);

    grunt.registerTask('spaghetti-package', function() {
        grunt.config('exec.SpaghettiPackage', 'spaghetti package --wrapper node --execute --main com.example.runner --output app --dependency-path ' + spaghettiTaskSet.modulePaths.map(function(p) { return p + "/bundle"; }).join(':'));
    });

    // Actual project definition starts here

    var config = {
        spaghetti: {
            greeter: {
                name: "Greeter",
                path: "greeter-module",
                language: "typescript"
            },
            runner: {
                name: "Runner",
                path: "runner-module",
                language: "haxe",
                package: "com.example.runner",
                dependencies: ["../greeter-module"]
            }
        },
        exec: {
            clean: "rm -rf app {greeter,runner}-module/{*.js,bundle,headers}",
        }
    };

    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-exec');
    grunt.registerTask('default', ['spaghetti', 'spaghetti-package', 'exec']);
    grunt.registerTask('clean', ['exec:clean'])
};
