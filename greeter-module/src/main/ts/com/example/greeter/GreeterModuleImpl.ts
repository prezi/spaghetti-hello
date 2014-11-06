module com.example.greeter {
    export class GreeterImpl {
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
