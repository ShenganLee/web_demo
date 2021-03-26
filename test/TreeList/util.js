const type = (arg) => Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()

export const isArray = (arg) => Array.isArray(arg)

export const isFunction = (arg) => type(arg) === 'function'

export const isBoolean = (arg) => type(arg) === 'boolean'

export const isString = (arg) => type(arg) === 'string'
