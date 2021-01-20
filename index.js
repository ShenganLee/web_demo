function test1(deep = 0) {
    if (deep == 2) return
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            console.log(deep, i)
            i == 0 && test1(deep + 1)
        }, 0)
    }
}

test1(0)