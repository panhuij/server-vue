
'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

// const url = require('url')
// const queryString = require('querystring')

const bodyParser = require('body-parser')
/**
 * 数据库
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123321',
  database: 'my use'
});
connection.connect();

/**
 * 
 */
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    before(app) {
      // select * from 1702h where name='张三'            ///   OK
      // UPDATE 1702h SET name='123' WHERE name='张三'    ///   OK
      // INSERT INTO 1702h SET name='Hello MySQL'         ///   ok
      // DELETE FROM 1702h WHERE name = "猪六"            ///   OK
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json())

      app.post('/insert', (req, res) => {
        // console.log(req.body)//ok
        // 在数据库中插入一条新数据
        const query = connection.query(`INSERT INTO 1702h SET name='${req.body.user}'`, function (error, results, fields) {
          // if (error) throw error;
          if (error) {
            res.send({ code: 1, msg: 'insert操作失败' })
          }
          if (results.insertId) {
            res.send({ code: 1, msg: 'insert操作成功' })
          } else {
            res.send({ code: 1, msg: 'insert操作失败' })
          }

          // console.log(results, fields)
          // OkPacket {
          //   fieldCount: 0,
          //   affectedRows: 1,
          //   insertId: 7,
          //   serverStatus: 2,
          //   warningCount: 0,
          //   message: '',
          //   protocol41: true,
          //   changedRows: 0 }   undefined
        })
        // console.log(query.sql)//打印查询语句


        // var post = { id: 1, title: 'Hello MySQL' };
        // var query = connection.query('INSERT INTO posts SET ?', post, function (error, results, fields) {
        //   if (error) throw error;
        //   // Neat!
        // });
        // console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
      })
      app.delete('/delete', (req, res) => {
        // console.log(req.query)
        connection.query(`DELETE FROM 1702h WHERE name = "${req.query.user}"`, function (error, results, fields) {
          if (error) throw error;
          // console.log('deleted ' + results.affectedRows + ' rows');
          // console.log(results)
          if (results.affectedRows == 0) {//删除数据的行数
            res.send({
              code: 0,
              msg: '删除失败'
            })
          } else {
            res.send({
              code: 1,
              msg: '删除成功'
            })
          }
        })
      })
      app.get('/select', (req, res) => {
        // console.log(req.query)
        connection.query(`select * from 1702h where name='${req.query.user}'`, function (error, results, fields) {
          // if (error) throw error;
          if (error) {
            res.send({ code: 1, msg: 'select操作失败' })
          };
          // console.log('The solution is: ', results[0].solution);
          if (results.length) {
            res.send({ code: 1, msg: 'select操作成功' })
          } else {
            res.send({ code: 1, msg: 'select操作失败' })
          }
        });
        // connection.query('SELECT * FROM `books` WHERE `author` = ?', ['David'], function (error, results, fields) {
        // });
      })
      app.put('/update', (req, res) => {
        // console.log(req.body)
        connection.query(`UPDATE 1702h SET password='${req.body.pass}' WHERE name='${req.body.user}'`, function (error, results, fields) {
          // if (error) throw error;
          if (error) {
            res.send({ code: 1, msg: 'update操作失败' })
          };
          // console.log(results)
          if (results.affectedRows == 0) {
            res.send({ code: 1, msg: 'update操作失败' })
          } else {
            res.send({ code: 1, msg: 'update操作成功' })
          }
        })
      })
    },
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
