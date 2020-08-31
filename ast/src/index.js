const recast = require("recast");
const code = `function add(a, b) {return a + b}`
const ast = recast.parse(code);
const add = ast.program.body[0]
console.log('add', add)
console.log('---------------------------------------')

// 1. 定义AST中的对象
const { variableDeclaration, variableDeclarator, functionExpression } = recast.types.builders

// 2.组装
ast.program.body[0] = variableDeclaration("const", [
    variableDeclarator(add.id, functionExpression(
        null, // Anonymize the function expression.
        add.params,
        add.body
    ))
]);

// console.log(ast.program.body[0])
const output = recast.prettyPrint(ast, { tabWidth: 2 }).code
// console.log(output)