const path = require('path');
// webpack
const webpack = require('webpack');
const Server = require('webpack-dev-server');
const boxen = require('boxen');
const chalk = require('chalk');
const { merge } = require('webpack-merge');
const common = require('./webpack.base.js');
const openBrowser = require('react-dev-utils/openBrowser');
const DEVELOPMENT ='development'

const devConfig = merge(common(DEVELOPMENT), {
  devtool: 'eval-cheap-module-source-map',
  plugins: [
      new webpack.DefinePlugin(
          {}
      ),
      // new WebpackBar({
      //     profile: true,
      //     color: '#fcab26'
      // }),
      // new BundleAnalyzerPlugin(),
  ],
  mode: DEVELOPMENT,
});
const compiler = webpack(devConfig);
const server = new Server({
  static: [
      {
          publicPath: '/',
          directory: path.resolve(__dirname,'../'),
      },
  ],
  client: {
      overlay: {
          errors: true,
          warnings: false,
      },
      progress: false,
      reconnect: 5,
  },
  historyApiFallback: true,
  port:8999,
  open: false,
  hot: "only",
  host: 'localhost',
  liveReload: false,
}, compiler);
server.startCallback((err) => {
  if (err) {
      console.log(boxen(chalk.red(err), { title: 'server start error', titleAlignment: 'center' }));
      return;
  }
  if (openBrowser(`http://localhost:8999`)) {
      console.log(boxen(chalk.green('The browser tab has been opened!'), { title: 'success', titleAlignment: 'center' }));
  }
});

['SIGINT', 'SIGTERM'].forEach(sig => {
  process.on(sig, () => {
      server.stopCallback((err) => {
          if (err) {
              console.log(boxen(chalk.red(err), { title: 'server stop error', titleAlignment: 'center' }));
          }
      });
      process.exit();
  });
});
