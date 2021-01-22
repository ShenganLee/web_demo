import trees from './data.json'
class Trees {
    constructor({ data, isLeaf, getChildren }) {
        this.children = data.filter(Boolean).map(d => new Tree({ data: d, isLeaf, getChildren }))
    }

    get hasLeaf() {
        return this.children.some(child => child.hasLeaf)
    }

    getData(map, childrenKey = 'children') {
        return this.children.filter(child => child.hasLeaf).map(child => child.getData(map, childrenKey))
    }

    getNode(fn) {
        for (let child of this.children) {
            const data = child.getNode(fn)
            if (data) return data
        }
    }
}

class Tree {
    constructor({data, isLeaf, getChildren}) {
        this.target = data
        const children = !!getChildren ? getChildren(this.target) : data.children
        this.isLeaf = !!isLeaf ? isLeaf(this.target) : (!children || !children.length)
        if (!this.isLeaf) this.children = new Trees({ data: children || [], isLeaf, getChildren })
        
    }

    get hasLeaf() {
        if (this.isLeaf) return true
        else return this.children.hasLeaf
    }

    getData(map, childrenKey) {
        const result = map(this.target)
        if (!this.isLeaf) result[childrenKey] = this.children.getData(map, childrenKey)
        return result
    }

    getNode(fn) {
        const flag = fn && fn(this.target)
        return flag ? this.target : (this.children && this.children.getNode(fn))
    }
}

const myTrees = new Trees({
    data: trees,
    isLeaf: d => d.type == 'primitive',
    // childrenKey: 'children'
})

// const result = myTrees.getData(data => ({
//     label: data.name,
//     value: data.mdmId
// }))

const xxx = myTrees.getNode(d => d.mdmId === 'dev_53b045a4-f183-4a45-bf06-ccbe222ace2f')

console.log(JSON.stringify(xxx, null, 4))