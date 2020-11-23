const proxy = function($, handler) {
    const proxy = new Proxy($, handler)
    return proxy
}
proxy.__proto__.create = function(_class) {
    return function (handler, ..._args) {
        const $ =  new _class(..._args)
        return proxy($, handler)
    }
}

module.exports = proxy