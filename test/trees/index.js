const Tree = require('./core')

var data = [{
    a: 11,
    children: [{
        a: 12
    }]
}, {
    a: 21,
    children: [{
        a: 22
    }]
}, {
    a: 31,
    children: [{
        a: 32
    }]
}]
function aaa() {
    const tree = new Tree({ dataSource: data })
    console.log(tree)
}
aaa()