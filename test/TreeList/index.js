import {isFunction, isString, isArray} from './util'

class TreeList {
    constructor({ data, children, leaf }) {
        this.config = { children, leaf }
        this.trees = new Trees(data, config, null)
    }
}

class Trees {
    constructor(data, config, parent) {
        this.children = data.map(d => new Tree(d, config, parent))
    }
}

class Tree {
    constructor(data, config, parent) {
        this.parent = parent
        this.data = data
        this.config = config
    }

    get children() {
        let children
        if (isFunction(this.config.children)) {
            children = this.config.children(this.data)
        } else if (isString(this.config.children)) {
            children = this.data[this.config.children]
        }

        if (isArray(children)) {
            return new Trees(children, this.config, this)
        }
    }

    get leaf() {
        if (isFunction(this.config.leaf)) {
            return this.config.leaf(this.data)
        } else if (isString(this.config.leaf)) {
            return this.data[this.config.leaf]
        }

        return !this.children
    }
}