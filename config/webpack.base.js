const path = require('path');
const os = require('os');
// webpack
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// tool
// variable

const PRODUCTION='production';
const DEVELOPMENT = 'development'
module.exports = mode => {
    const nodeEnv = mode === PRODUCTION ? PRODUCTION : DEVELOPMENT;
    const devMode = mode !== PRODUCTION;
    const bundle = mode === PRODUCTION ? 'bundle.[name].[contenthash].js' : 'bundle.[name].js';
    const distPath = path.resolve(__dirname,'../dist')
    const sourcePath = path.resolve(__dirname,'../src')
    const rootPath = path.resolve(__dirname,'../')
    const dllName = devMode ? 'dev' : 'pro';
    return {
        entry: path.join(sourcePath, './index.tsx'),
        context: rootPath,
        output: {
            path: distPath,
            publicPath: devMode ? '/' : '/dist/',
            filename: bundle,
            assetModuleFilename: 'resources/images/[name].[contenthash:8].[ext]',
        },
        module: {
            rules: [
                // {
                //     test: /\.css$/,
                //     use: [{
                //         loader: MiniCssExtractPlugin.loader,
                //     }, 
                //     {
                //         loader: 'css-loader',
                //         // antd css 不能 配置options,不然就加载不出来
                //     }],
                // },
                // {
                //     test: /\.less$/,
                //     exclude: loaderExclude,
                //     include: lessInclude,
                //     use: [
                //     {
                //         loader: MiniCssExtractPlugin.loader,
                //     }, 
                //     {
                //         loader: 'css-loader',
                //         options: {
                //             esModule: true,
                //             modules: {
                //                 localIdentName: '[name]__[local]--[hash:base64:5]',
                //             },
                //         },
                //     }, {
                //         loader: 'less-loader',
                //         options: {
                //             lessOptions: {
                //                 additionalData: lessLoaderModifyVars,
                //                 strictMath: false,
                //                 javascriptEnabled: true,
                //             },
                //         },
                //     }],
                // },
                {
                    test: /\.(j|t)s(x)?$/,
                    exclude: [path.resolve(__dirname,'../node_modules')],
                    include: [sourcePath],
                    use: [{
                        loader: 'thread-loader',
                        options: {
                            workers: os.cpus().length,
                            poolTimeout: 1500,
                        },
                    }, {
                        loader: 'babel-loader',
                        options: {
                            babelrc: true,
                            cacheDirectory: 'dist/',
                        }
                    }],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|svg)$/,
                    type: 'asset/inline',
                },
                {
                    test: /\.png$/,
                    type: 'asset/resource'
                },
            ],
        },
        resolve: {
            fallback: {
                stream: require.resolve("stream-browserify"),
                util: require.resolve("util"),
                crypto: require.resolve("crypto-browserify"),
                timers: require.resolve("timers-browserify"),
                vm: require.resolve("vm-browserify"),
            },
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
            alias: [],
            modules: ['node_modules/', sourcePath],
        },
        externals: [
           
        ],
        plugins: [
           
            new webpack.DefinePlugin({
                
            }),
            new webpack.IgnorePlugin({
                checkResource: (request, _context) => {
                    if (/^moment/.test(request)) {
                        return false;
                    }
                    if (/ali-oss$/.test(request)) {
                        return false;
                    }
                },
            }),
            // new webpack.DllReferencePlugin({
            //     context: rootPath,
            //     manifest:
            //         nodeEnv === PRODUCTION
            //             ? require('../../pro-dll/reactDll-manifest.json')
            //             : require('../../dev-dll/reactDll-manifest.json'),
            // }),
            // new webpack.DllReferencePlugin({
            //     context: rootPath,
            //     manifest:
            //         nodeEnv === PRODUCTION
            //             ? require('../../pro-dll/toolDll-manifest.json')
            //             : require('../../dev-dll/toolDll-manifest.json'),
            // }),
            new HtmlWebpackPlugin({
                title: 'CREAMS',
                alwaysWriteToDisk: true,
                inject: true,
                template: path.resolve(rootPath, './public/index.html'),
                filename: 'index.html',
            }),
            // new HtmlWebpackTagsPlugin({
            //     append: false,
            //     tags: [{
            //         path: `${dllName}-dll`,
            //         globPath: path.resolve(rootPath + `/${dllName}-dll`),
            //         glob: `./*.dll.js`,
            //     }],
            //     publicPath: '/'
            // }),
            new ForkTsCheckerWebpackPlugin({
                async: devMode,
                logger:{
                    infrastructure:'console',
                    issues: 'console', 
                    devServer: false 
                },
                typescript: {
                    configFile: path.resolve(rootPath, 'tsconfig.json'),
                    memoryLimit: 3000,
                    configOverwrite: {
                        compilerOptions: {
                            jsx: 'preserve',
                            resolveJsonModule: true,
                            // moduleResolution: 'node',
                            module: 'ESNext',
                        },
                    },
                },
                // eslint:{
                //     enabled:true,
                //     files:['src']
                // }
            }),
        ],
        optimization: {
            minimize: false,
            moduleIds: 'deterministic',
            splitChunks: {
                // chunks: 'all',
                automaticNameDelimiter: '~',
                cacheGroups: {
                    vendor: {
                        test: /node_modules/,
                        chunks: 'initial',
                        name: 'vendor',
                        priority: 4,
                        enforce: true,
                        reuseExistingChunk: true,
                    },
                },
            },
            runtimeChunk: { name: 'manifest' },
            
        },
    };
};
