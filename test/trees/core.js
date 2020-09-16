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
const CHILDREN = Symbol('children')
const TREENODES = Symbol('treeNodes')
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
        let children
        if (typeof this[CHILDNODES] === 'string') {
            children = this[DATA][this[CHILDNODES]]
        } else if (typeof this[CHILDNODES] === 'function') {
            children = this[CHILDNODES](this[DATA])
        }

        if (children instanceof Array) {
            this[TREENODES] = createTreeNodes(children, this[CHILDNODES])
        }
    }

    [FLATTEN](map, parent) {
        map.set(this, parent)

        if (this[TREENODES]) {
            this[TREENODES].forEach(child => child[FLATTEN](map, this))
        }
    }
}

class Tree {
    constructor(option) {

        const defOpt = { dataSource: [], childNodes: 'children' }
        const opt = { ...defOpt, ...option }

        this[DATASOURCE] = opt.dataSource
        this[CHILDNODES] = opt.childNodes

        this[SOURCETREE] = []
        this[SOURCEMAP] = new WeakMap()

        this[INIT]()

    }

    [INIT]() {
        this[SOURCETREE].length = 0
        this[SOURCETREE] = createTreeNodes(this[DATASOURCE], this[CHILDNODES])

        const sourceMap = this[SOURCEMAP]
        this[SOURCETREE].forEach(tree => {
            tree[FLATTEN](sourceMap, tree)
        })
    }
}

module.exports = Tree

