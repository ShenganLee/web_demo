function newFunc(fun, ...args) {
    const obj = Object.create(fun.prototype)

    const result = fun.call(obj, ...args)
    if (result instanceof Object) {
        return result
    } 

    return obj
}

function newFunction(fun, ...args) {
    const obj = {}
    obj.__proto__ = fun.prototype;

    const result = fun.call(obj, ...args)
    if (result instanceof Object) {
        return result
    } 

    return obj
}


// =========TEST=================
function Test(name, age) {
    this.name = name
    this.age = age;
    // return null
    // return undefined
    // return 0
    // return false
    // return NaN
    // return ''
    // return Symbol('test')
    // return 1
    // return 'ssssssssss'

    // return []
    // return {}
    console.log(this.mm)
}

// var test = new Test()

var test = newFunc(Test, '111', 26)

console.log(test)