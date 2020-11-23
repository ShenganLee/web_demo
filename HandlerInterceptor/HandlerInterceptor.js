const proxy = require('./proxy')


// const HandlerInterceptor = function($) {
//     const interceptor = new proxy($, handler)
//     return interceptor
// }
// HandlerInterceptor.__proto__.create = function(_class) {
//     return function (handler, ..._args) {
//         const $ =  new _class(..._args)
//         return HandlerInterceptor($, handler)
//     }
// }