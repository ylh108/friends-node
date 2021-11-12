const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require("path");
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.join(__dirname,'nodejs/images'),
                        to: 'nodejs/images',
                        noErrorOnMissing: true // 允许images文件夹为空
                    }
                ]
            })
        ]
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/wechatApi': {
                target: '',
                target: 'http://node.linaige.com',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/wechatApi': ''
                }
            }
        }
    }
}
