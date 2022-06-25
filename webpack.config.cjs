const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin');
module.exports =  {
    mode: 'production',
    context:__dirname,
    entry: {
        'app': './src/index.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            parallel: true,
        })],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            },
            {
                test: /\.(tsx|ts)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        configFile: path.resolve('./tsconfig.json'),
                    },
                }],
            },
            {
                test: /\.html$/,
                use: [
                    {loader: "html-loader"}
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '/',
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            }
        ]
    },
    resolve: {
        alias: {
            'styles': path.join(__dirname, 'styles'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css']
    },
    plugins: [
        new WorkboxPlugin.GenerateSW({
            cacheId:"toolbox",
            clientsClaim: true,
            navigationPreload:false,
            cleanupOutdatedCaches: true,
            offlineGoogleAnalytics:true,
            skipWaiting: true,
            disableDevLogs: true,
            maximumFileSizeToCacheInBytes:30*1024*1024,
            exclude: [/\.(?:png|jpg|jpeg|svg)$/],
            // Define runtime caching rules.
            runtimeCaching: [
            ],
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
            minify: true
        }),
        new MiniCssExtractPlugin(
            {
                filename: "[name].css",
                chunkFilename: "[id].css"
            }
        ),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ]
};