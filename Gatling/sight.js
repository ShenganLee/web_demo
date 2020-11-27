//准星
class Sight {
    constructor() {
        this.ref = Object.create(null)
    }

    aim() {
        return this.ref
    }

    close() {
        this.ref = null
    }
}