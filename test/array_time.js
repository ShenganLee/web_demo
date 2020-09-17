var array = new Array(1000 * 10000).fill(1)
var map = new Map()

array.forEach(a => map.set(a, a))

function test(v) {
    // v + 1
    // new Array(...v.keys())

    Array.from(v.keys())
}

function forof() {
    console.time('forof')

    for(let a of array) {
        // test(a)
        test(map)
    }

    console.timeEnd('forof')
}

function forlength() {
    console.time('forlength')

    for(let i = 0; i < array.length; i++) {
        // test(array[i])
        test(map)

    }

    console.timeEnd('forlength')
}

function foreach() {
    console.time('foreach')

    array.forEach(a => {
        // test(a)
        test(map)
    })

    console.timeEnd('foreach')
}

function whilefun() {
    console.time('whilefun')

    // while(array.length) {
    //     array[array.length - 1] + 1
    //     array.length --
    // }

    let i = 0

    while(i < array.length) {
        // test(array[i])
        test(map)
        i ++
    }

    console.timeEnd('whilefun')
}

// forof()
forlength() // min time
// foreach()
// whilefun()