import tree_data from './data.json'

class Trees {
    constructor({ data, getChildren, isLeaf, parent, deep }) {
        this.deep = deep || 0
        this.children = data.map((node, index) => new Tree({ data: node, getChildren, isLeaf, parent, index, deep }))
    }

    map(fn, childrenKey) {
        const data = this.children.map((node, index) => node.map(fn, childrenKey, index))
        if (!!this.deep) return data
        return new Trees({ data, getChildren: node => node[childrenKey], isLeaf: node => !node[childrenKey].length, parent: undefined, deep: 0 })
    }

    filter(fn) {
        const data = this.children.filter((node, index) => node.filter(fn, index))
    }

    formatter() {

    }
}

class Tree {
    constructor({ data, getChildren, isLeaf, parent, index, deep }) {
        this.target = data
        this.parent = parent
        this.deep = deep
        this.isLeaf = !!isLeaf(data)
        if (!this.isLeaf) {
            this.children = new Trees({ data: getChildren(data, index), getChildren, isLeaf, parent: this, deep: deep + 1 }) 
        }
    }

    map(fn, childrenKey, index) {
        const data = fn(this.target, index, this.deep)
        if (!this.isLeaf) data[childrenKey] = this.children.map(fn, childrenKey)

        return data
    }

    filter(fn, index) {
        let flag = fn(this.target, index, this.deep)
        if (!flag && !this.isLeaf) flag = this.children.filter(fn)

        return  flag
    }
}