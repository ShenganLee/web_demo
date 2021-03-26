import Collection from './collection'

class Database {
    constructor(name) {
        this.namespaces = name
        this.collection = new Map()
    }

    createCollection(name) {
        if (this.collection.has(name)) throw new Error(`Collection ${name} already exists`)
        const collection = new Collection(name)
        this.collection.set(name, collection)
        return collection;
    }

    getDB(name) {
        return this.collection.get(name)
    }

    deleteDB(name) {
        this.collection.delete(name)
    }

}

export default Database