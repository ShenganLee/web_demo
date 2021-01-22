
const ROOT = Symbol('root')

class Trees {
    constructor(opt) {
        // this.treeSet = new Set();

        const def_opt = {
            deep: 0,
            treeData: [],
            // treeSet: this.treeSet,
            getChildren: node => node.children,
            isLeaf: node => !node.children || !node.children.length,
        }

        const _opt = { ...def_opt, ...opt }

        this.children = new TreeNodes(_opt)
    }
}

class TreeNodes {
    constructor(opt) {
        this.children = opt.treeData.map((node, index) => new TreeNode({ ...opt, treeData: node, index }))
    }
}

class TreeNode {
    constructor(opt) {
        const { treeData, isLeaf, index, deep, parent } = opt

        this.parent = parent
        this.treeData = treeData
        this.isLeaf = isLeaf(treeData, index, deep )
        if (!isLeaf) this.children = new TreeNodes({
            ...opt,
            parent: this,
            deep: deep + 1,
            treeData: getChildren(treeData, index, deep)
        })
    }
}