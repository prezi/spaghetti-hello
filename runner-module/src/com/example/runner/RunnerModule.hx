package com.example.runner;

import com.example.greeter.GreeterModule;

class RunnerModule {
    public static function main():Void {
        var greeter = GreeterModule.createGreeter();
        greeter.sayHello("Spaghetti");
    }
}
