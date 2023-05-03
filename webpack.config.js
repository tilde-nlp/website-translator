const webpack = require('webpack')
const version = require('./src/js/PluginVersion')
const path = require('path')
const preprocessorOptions = {

}

module.exports = (env, options) => {
  preprocessorOptions.DEBUG = options.mode === 'development'

  /* eslint-disable */
  console.log("Preprocessor options:")
  console.log(preprocessorOptions)
  console.log(`Plugin version: ${version}`)
  /* eslint-enable */

  return {
    entry: './index.ts',
    output: {
      library: 'WebsiteTranslator',
      libraryTarget: 'umd',
      libraryExport: 'default',
      path: __dirname,
      filename: './dist/widget.js'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    devServer: {
      static: {
        directory: path.join(__dirname)
      },
      compress: true,
      port: 8030,
      liveReload: true,
      open: ['/pages/my-page.html'],
      devMiddleware: {
        index: true,
        publicPath: '/',
        writeToDisk: filePath => {
          return /widget.js$/.test(filePath)
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
          // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader'
          ]
        },
        {
        // test: /\.js$/,
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            { loader: 'ts-loader' },
            {
              loader: 'ifdef-loader',
              options: preprocessorOptions
            }
          ]
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loader: 'url-loader'
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: `WTW version: v${version}`
      })
    ]
  }
}
