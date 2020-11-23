const FUNCS = {
    0: 'map',
    1: 'filter',
    2: 'foreach',
    3: 'flatten',
    map: 0,
    filter: 1,
    foreach: 2,
    flatten: 3,
}

const INIT = Symbol('init')

const DEEP = Symbol('deep')
const LIST = Symbol('list')
const INDEX = Symbol('index')
const CHILDREN = Symbol('children')
const TREENODES = Symbol('treeNodes')
const DATASOURCE = Symbol('dataSource')
const GETCHILDREN = Symbol('get children')

const REGISTERFNMAP = new Symbol('register Fn Map')
const MAPFN = Symbol('map fn')

class Tree {
    
    constructor(trees = [], children = 'children') {
        this[REGISTERFNMAP] = new Map()

        this[DATASOURCE] = trees
        this[GETCHILDREN] = typeof children === 'string' ? (data) => data[children] : children

        this[INIT] = false
    }

    get [CHILDREN] () {
        if (!this[INIT]) {
            this[TREENODES] = this[DATASOURCE]
                .map((node, index, list) => new TreeNode({ node, index, list, children: this[GETCHILDREN] }))

            this[INIT] = true
        }
        return this[TREENODES]
    }

    registerFn(key, fn) {
        this[REGISTERFNMAP].set(key, fn)
    }

    map(fn) {
        const tree = new Tree(this[DATASOURCE], this[GETCHILDREN])
        tree.registerFn('map', fn)
        return tree
    }

    getData(children = 'children') {
        
    }
}

class TreeNode {
    constructor({node, index, list, deep = 0, children}) {
        this[DEEP] = deep
        this[LIST] = list
        this[INDEX] = index
        this[DATASOURCE] = node
        this[GETCHILDREN] = children

        this[INIT] =  false
    }

    get [CHILDREN] () {
        if (!this[INIT]) {
            const children = this[GETCHILDREN](
                this[DATASOURCE],
                this[INDEX],
                this[DEEP],
                this[LIST]
            )

            if (children) {
                this[TREENODES] = children
                    .map((node, index, list) => new TreeNode({
                        node,
                        index,
                        deep: this[DEEP] + 1,
                        list,
                        children: this[GETCHILDREN]
                    }))
            }
            this[INIT] = true
        }
        return this[TREENODES]
    }

    getData(children) {
        // return 
    }
}