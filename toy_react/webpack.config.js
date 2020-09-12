module.exports = {
    mode: 'development',
    entry: {
        main: './main.js'
    },
    devtool: "source-map", // enum
    module: {
        rules: [{
            test: /\.js/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: [['@babel/plugin-transform-react-jsx', {pragma: 'ToyReact.creatElement'}]]
                }
            }
        }]
    }
}