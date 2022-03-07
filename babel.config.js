const config = {
    presets: [
        ["@babel/preset-env", {
            "modules": false,
            "targets": {
              "browsers": ["> 1%", "last 2 versions", "not ie <= 9"]
            },
            "useBuiltIns": "usage",
            "corejs": 3
        }],
        ['@babel/preset-react',{
            pragma:'Didact.createElement'
        }],
        [
            '@babel/preset-typescript',{
                isTSX: true,
                allExtensions:true
            }
        ],
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties'],
        ['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }, 'ant'],
        ["@babel/plugin-transform-runtime"],
    ],
};

//test env should not use antd 'es'
module.exports = {
    env: {
        development: {
            presets: config.presets,
            
        },
        production: {
            ...config,
        },
    },
};
