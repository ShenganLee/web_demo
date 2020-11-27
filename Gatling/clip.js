function _push(key, value) {
    let bullets = this.bullets.get(key)

    if (!bullets) {
        bullets = new Set()
        this.bullets.set(key, bullets)
    }

    bullets.add(value)

    this.sights.forEach(sight => {
        const aim = sight.aim()
        if (aim) {
            const barrel = this.barrels.get(aim)
            barrel.emit(key, value)
        }
    })
}


// 弹夹
class Clip {
    constructor() {
        this.bullets = new Map() // 子弹
        this.sights = new Set() // 准星
        this.barrels = new WeakMap() // 枪管

        // window.setInterval(() => {

        // }, 1000)
    }

    createBarrels() {
        const sight = new Sight()
        const barrel = new Barrel(sight)
        this.sights.add(sight)
        this.barrels.set(sight.aim(), barrel)
    }

    push(key, value) {
        if (typeof key === 'string') _push.call(this, key, value)
        else if (typeof key === 'object') {
            Object.entries(key).forEach((k, v) => {
                _push.call(this, k, v)
            })
        }
    }    
}

