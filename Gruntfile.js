module.exports = function(grunt) {
    grunt.initConfig({
        exec: {
            generate_greeter_headers: {
                command: 'rm -rf headers && spaghetti generate headers --definition Greeter.module --language typescript --output headers',
                cwd: 'greeter-module'
            },
            compile_greeter: {
                command: 'tsc src/com/example/greeter/GreeterModuleImpl.ts headers/GreeterModule.ts headers/Spaghetti.ts --out Greeter.js',
                cwd: 'greeter-module'
            },
            bundle_greeter: {
                command: 'spaghetti bundle --definition Greeter.module --language typescript --source Greeter.js --output bundle',
                cwd: 'greeter-module'
            },

            generate_runner_headers: {
                command: 'rm -rf headers && spaghetti generate headers --definition Runner.module --language haxe --dependency-path ../greeter-module/bundle --output headers',
                cwd: 'runner-module'
            },
            compile_runner: {
                command: "haxe -cp headers -cp src -js Runner.js --macro \"include('com.example.runner')\"",
                cwd: 'runner-module'
            },
            bundle_runner: {
                command: 'spaghetti bundle --definition Runner.module --language haxe --source Runner.js --output bundle -d ../greeter-module/bundle/',
                cwd: 'runner-module'
            },
            package_application: 'spaghetti package --wrapper node --dependency-path greeter-module/bundle:runner-module/bundle --execute --main com.example.runner --output app',

            clean: "rm -rf app {greeter,runner}-module/{*.js,bundle,headers}"
        }
    });

    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['exec']);

    grunt.registerTask('clean', ['exec:clean'])
};
