function Vue(option) {
    const computedObj = {}
    const __watch__ = { status: 'close', key: null }

    const computedKeys = Object.keys(option.computed)

    const get = (target, key, receiver) => {
        if (__watch__.status === 'open') {
            computedObj[__watch__.key].binds.push(key)
        }

        return target[key]
    }
    
    const set = (target, key, value, receiver) => {
        target[key] = value

        computedKeys.forEach(computed => {
            const obj = computedObj[computed]

            if (obj && obj.binds && obj.binds.includes(key)) {
                target[computed] = undefined
            }
        })

        return true
    }

    const computedPropties = {}
    
    Object.entries(option.computed).forEach(([key, fn]) => {
        computedPropties[key] = {
            get: function() {
                if (!computedObj[key]) {
                    computedObj[key] = { binds: [] }

                    __watch__.status = 'open'
                    __watch__.key = key
                    const value = fn.call(this)
                    __watch__.status = 'close'
                    __watch__.key = null

                    computedObj[key].value = value
                }

                return computedObj[key].value
            },

            set: function() {
                const value = fn.call(this)
                computedObj[key].value = value

                return true
            }
        }
    })

    const info = Object.create({}, computedPropties)
    Object.assign(info, option.data)
    console.log(info)
    const proxy = new Proxy(info, { set, get })

    return proxy
}

function test() {
    var vm = new Vue({
        data: { a: 1, b: 2, c: 3 },
        computed: {
            value: function() {
                return this.a + this.b
            }
        }
    })
    
    console.log(vm)
    
    vm.a ++
    
    console.log(vm)
    
//     vm.b ++
    
//     console.log(vm)

//     vm.c --
    
//     console.log(vm)
}

test()