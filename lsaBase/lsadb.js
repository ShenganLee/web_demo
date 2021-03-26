import Database from './database'

class LSADB {
    constructor() {
        this.database = new Map()
    }

    createDB(name) {
        if (this.database.has(name)) throw new Error(`Database ${name} already exists`)
        const db = new Database(name)
        this.database.set(name, db)
        return db;
    }

    getDB(name) {
        return this.database.get(name)
    }

    deleteDB(name) {
        this.database.delete(name)
    }
}