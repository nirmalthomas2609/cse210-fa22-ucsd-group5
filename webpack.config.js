const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "./src/index.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    plugins: [new MiniCssExtractPlugin({filename: "[name].css"}), new HtmlWebpackPlugin({
        template: 'src/index.html'
        })],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
        ]
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true
    }
}