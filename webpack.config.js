const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true,
            chunks: ['index'],
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/about.html',
            inject: true,
            chunks: ['index'],
            filename: 'about.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/projects.html',
            inject: true,
            chunks: ['index'],
            filename: 'projects.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/tasks.html',
            inject: true,
            chunks: ['index'],
            filename: 'tasks.html',
        }),
    ],

    
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        open: true,
    },
    mode: 'development',
};
