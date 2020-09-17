// // Tree
// option = {
//     dataSource, // 数据源 array
//     childNodes, // 子节点 string | function
// }

// // TreeNode
// option = {
//     data, // 数据 object
//     childNodes, // 子节点 string | function
// }

const INIT = Symbol('init')
const DATASOURCE = Symbol('dataSource')
const CHILDNODES = Symbol('childNodes')
const SOURCETREE = Symbol('sourceTree')
const SOURCEMAP = Symbol('sourceMap')

const DATA = Symbol('data')
const TREENODES = Symbol('treeNodes')
const CHILDREN = Symbol('children')
const GETCHILDREN = Symbol('get children')
const FLATTEN = Symbol('flatten')

function createTreeNodes(children, childNodes) {
    return children.map(child => new TreeNode({ data: child, childNodes }))
}

class TreeNode {
    constructor(option) {
        this[DATA] = option.data
        this[CHILDNODES] = option.childNodes
        this[INIT]()
    }

    [INIT]() {
        this[CHILDREN] = this[GETCHILDREN]()

        if (this[CHILDREN] instanceof Array) {
            this[TREENODES] = createTreeNodes(this[CHILDREN], this[CHILDNODES])
        }
    }

    [GETCHILDREN]() {
        let children
        if (typeof this[CHILDNODES] === 'string') {
            children = this[DATA][this[CHILDNODES]]
        } else if (typeof this[CHILDNODES] === 'function') {
            children = this[CHILDNODES](this[DATA])
        }

        return children
    }

    [FLATTEN](map, parent) {
        map.set(this, parent)

        if (this[TREENODES]) {
            this[TREENODES].forEach(child => child[FLATTEN](map, this))
        }
    }

    treeMap(fn, key) {
        const tree = fn(this[DATA])

        if (!tree) return

        let childNodes

        if (this[TREENODES]) {
            childNodes = this[TREENODES].map(tree => tree.map(fn, key))
        }

        return { ...tree, [key]: childNodes }
    }
}

class Tree {
    static defOpt = { dataSource: [], childNodes: 'children' }

    constructor(option) {
        
        const opt = { ...Tree.defOpt, ...option }

        this[DATASOURCE] = opt.dataSource
        this[CHILDNODES] = opt.childNodes

        this[SOURCETREE] = []
        this[SOURCEMAP] = new Map()

        this[INIT]()

    }

    [INIT]() {
        this[SOURCEMAP].clear()
        this[SOURCETREE].length = 0
        this[SOURCETREE] = createTreeNodes(this[DATASOURCE], this[CHILDNODES])

        const sourceMap = this[SOURCEMAP]
        this[SOURCETREE].forEach(tree => {
            tree[FLATTEN](sourceMap, tree)
        })
    }

    setDataSource(dataSource) {
        this[DATASOURCE] = dataSource
        this[INIT]()
    }

    setChildNodes(childNodes) {
        this[CHILDNODES] = childNodes
        this[INIT]()
    }

    setOption(option) {
        const opt = { ...Tree.defOpt, ...option }

        this[DATASOURCE] = opt.dataSource
        this[CHILDNODES] = opt.childNodes

        this[INIT]()
    }

    flatten() {
        const set = new Set()
        const map = this[SOURCEMAP]
        const result = []

        for (let [key, value] of map) {
            set.add(key)
            set.add(value)
        }

        for (let value of set) {
            result.push(value[DATA])
        }

        return result
    }

    map(fn) {
        const trees = this.flatten()
        return trees.map(fn)
    }

    filter(fn) {
        const trees = this.flatten()
        return trees.map(fn)
    }

    forEach(fn) {
        this.flatten().forEach(fn)
    }

    treeMap(fn, key) { // key: number | string
        const childNodes = key || this[CHILDNODES]

        const type = typeof childNodes
        if (type !== 'string' || type !== 'number') {
            throw new Error('key is undefind')
        }

        return this[SOURCETREE].map(tree => tree.map(fn, childNodes))
    }

}

module.exports = Tree

