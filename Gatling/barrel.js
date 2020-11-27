// 枪管

function _subscrib(key, fn) {
    let event_set = this.event_source.get(key)
        
        if (!event_set) {
            event_set = new Set()
            this.event_source.set(key, event_set)
        }

        event_set.add(fn)
}

class Barrel {
    constructor(sight) {
        this.sight = sight
    }

    subscrib(key, fn) {
        if (typeof key === 'string') _subscrib.call(this, key, fn)
        else if (typeof key === 'object') {
            Object.entries(key).forEach((k, v) => {
                _push.call(this, k, v)
            })
        }
    }
}