const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require("compression-webpack-plugin");

const PRODUCTION ='production'
const rootPath = '../';

module.exports = (_env, argv) => {
    const nodeEnv = argv.mode === PRODUCTION ? true : false;
    const dllDir = nodeEnv ? '/pro-dll' : '/dev-dll';
    return {
        devtool:false,
        entry: {
            reactDll: [
              
            ],
            toolDll: [
            
            ],
        },
        output: {
            path: path.join(rootPath, dllDir),
            filename: '[name]-[contenthash].dll.js',
            library: '_dll_[name]',
        },
        plugins: [
            new webpack.DllPlugin({
                context: rootPath,
                name: '_dll_[name]',
                path: path.join(rootPath, dllDir, '[name]-manifest.json'),
            }),
            new CompressionPlugin({
                algorithm: "gzip",
                threshold: 0,
                minRatio: 0.8,
            }),
        ],
    };
};
