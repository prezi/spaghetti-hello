package com.example.runner;

import com.example.greeter.GreeterModule;
import com.example.adder.AdderModule;

class RunnerModule {
    public static function main():Void {
        var greeter = GreeterModule.createGreeter();
		var adder = AdderModule.createAdder();
        trace(greeter.sayHello("Spaghetti"));
		trace("I can also add 2 + 3: " + adder.add(2, 3));
    }
}
