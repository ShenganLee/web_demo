function apply(func, obj, args = []) {
    if (!func instanceof Function) {
        throw new Error("func must be function")
    }

    if (!obj instanceof Object) {
        throw new Error("func must be object")
    }
   
    if (!Array.isArray(args)) {
        throw new Error("args must be array")
    }
    const __fn__ = Symbol('__fn__')
    obj[__fn__] = func

    obj[__fn__](...args)

    delete obj[__fn__]
}