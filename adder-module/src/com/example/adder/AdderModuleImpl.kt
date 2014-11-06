package com.example.adder

public class AdderImpl : Adder {
    override public fun add(a: Int, b: Int): Int = a + b
}

public object AdderModule {
    fun createAdder(): Adder = AdderImpl()
}
