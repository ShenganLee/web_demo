const INIT = Symbol('init')

const DATASOURCE = Symbol('dataSource')
const CHILDNODES = Symbol('childNodes')
const SOURCETREE = Symbol('sourceTree')
const SOURCEMAP = Symbol('sourceMap')

const DATA = Symbol('data')
const TREENODES = Symbol('treeNodes')
const CHILDREN = Symbol('children')
const GETCHILDREN = Symbol('get children')
const FLATTEN = Symbol('flatten')

const FUNCS = {
    0: 'map',
    1: 'filter',
    2: 'foreach',
    3: 'flatten',
    map: 0,
    filter: 1,
    foreach: 2,
    flatten: 3,
}