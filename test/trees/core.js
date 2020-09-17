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
            sourceMap.add(tree, null)
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

    [FLATTEN](type, fn) {
        const result = []
        const array = Array.from(this[SOURCEMAP].keys())

        for (let tree of array) {
            const data = tree[DATA]
            switch(FUNCS[type]) {
                case 'map':
                    result.push(fn(data))
                    break
                case 'filter':
                    fn(data) && result.push(data)
                    break
                case 'foreach':
                    fn(data)
                    break
                case 'flatten':
                default:
                    result.push(data)
            }
        }

        return result
    }

    map(fn) {
        return this[FLATTEN](FUNCS.map, fn)
    }

    filter(fn) {
        return this[FLATTEN](FUNCS.filter, fn,)
    }

    flatten() {
        return this[FLATTEN](FUNCS.flatten)
    }

    treeMap(fn, key) { // key: number | string
        const childNodes = key || this[CHILDNODES]

        const type = typeof childNodes
        if (type !== 'string' || type !== 'number') {
            throw new Error('key type')
        }

        return this[SOURCETREE].map(tree => tree.treeMap(fn, childNodes))
    }

    treeFilter(fn, key) {
        const map = this[SOURCEMAP]
        const array = Array.from(map.keys())

        let values = array.filter(tree => fn(tree[DATA]))

        if (!values.length) return []

        let maxLen = 0

        const treeList = children.map(child => {
            const trees = [child]
            let parent = map.get(child)
            let _child = parent
            while(parent) {
                parent = map.get(_child)
                if (parent) trees.unshift(parent)
                _child = parent
            }

            trees.length > maxLen && (maxLen = trees.length)
            return trees
        })


        let i = 0
        while(maxLen - i) {
            // const 
        }
        
    }

}

// Trees Tree TreeNode

module.exports = Tree

