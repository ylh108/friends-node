const express = require('express') // 引入express模块
const bodyParser = require('body-parser') // 支持post方法
const http = require('http');
const https = require('https');
const async = require('async')
const fs = require('fs')
const formidable = require('formidable')
const path = require('path')

const app = express() // 创建express的实例

const db = require('./mysql.js')
const api = require('./api/index.js') // sql操作语句

// app.use(bodyParser.json()) // 添加json解析
// app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb',extended: true}))

app.use(express.static('./public'))

// 服务开启后访问指定编译好的dist文件下的数据
// app.use(express.static(path.resolve(__dirname, '../dist')))
// app.get('*', function(req, res) {
//     const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
//     res.send(html)
// })

// 允许接口跨域  这里指定允许所有接口跨域
app.all('*',function(req,res,next) {
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods','PUT, GET, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers','X-Requested-With')
    res.header('Access-Control-Allow-Headers','Content-Type')
    next()
})
// 查询
app.post('/select',(req,res) => {
    db.query(api.friends.select,[],(result,fields) => {
        res.send(result) // 将查询结果返回给页面
    })
})
// 查询微信号
app.post('/selectAllWechat',(req,res) => {
    db.query(api.friends.selectAllWechat,[],(result,fields) => {
        res.send(result) // 将查询结果返回给页面
    })
})
// 查询-根据性别
app.post('/selectBySex',(req,res) => {
    db.query(api.friends.selectBySex,req.body,(result,fields) => {
        res.send(result) // 将查询结果返回给页面
    })
})
// 查询-根据微信号
app.post('/selectByWechat',(req,res) => {
    db.query(api.friends.selectByWechat,req.body,(result,fields) => {
        res.send(result) // 将查询结果返回给页面
    })
})
// 删除本地images中的图片-根据微信号
function deleteImagesByWechat (pics,res,del) {
    let fileImgs = fs.readdirSync(__dirname + '/images/')
    console.log('fileImgs:',fileImgs)
    let bol = true
    let pictures = pics.split(',')
    pictures.forEach((img) => {
        if(fileImgs.includes(img.split('/')[2])) {
            fs.unlink(__dirname + img,(err) => {
                if(err) {
                    console.log('原图删除失败')
                    bol = false
                    return
                }
                console.log('原图删除成功')
            })
        }
    })
    if(!del) {
        if(bol) {
            res.send({message: '原图删除成功'})
        } else {
            res.send({message: '原图删除失败'})
        }
    } else {
        return bol
    }
}

app.post('/deleteImagesByWechat',(req,res) => {
    db.query(api.friends.selectByWechat,req.body,(result,fields) => {
        if(result[0].pictures) {
            deleteImagesByWechat(result[0].pictures,res)
        } else {
            res.send({message: ''})
        }
    })
})
// 删除-根据微信号
app.post('/deleteByWechat',(req,res) => {
    db.query(api.friends.selectByWechat,req.body,(result,fields) => {
        let bol = deleteImagesByWechat(result[0].pictures,res,true)
        if(bol) {
            db.query(api.friends.deleteByWechat,req.body,(result,fields) => {
                res.send({message: '删除成功'}) // 将查询结果返回给页面
            })
        } else {
            res.send({message: '删除失败'})
        }
    })
})

// 提交
app.post('/save',(req,res) => {
    db.query(api.friends.save,req.body,(result,fields) => {
        res.send({message: '添加成功'}) // 将添加结果返回给页面
    })

})
// 修改-根据微信号
app.post('/updateByWechat',(req,res) => {
    db.query(api.friends.updateByWechat,req.body,(result,fields) => {
        res.send({message: '修改成功'}) // 将查询结果返回给页面
    })
})
// 上传或修改图片
app.post('/uploadPics',(req,res) => {
    let images = '/images/'
    let form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname,images) // 缓存地址
    console.log('uploadDir:',form.uploadDir)
    // form.keepExtensions = true // 是否包含文件后缀
    form.multiples = true  // 设置为多文件上传
    //得到拓展名
    form.parse(req,function(err,fields,files) {
        console.log('files:',files)
        let extname = '';
        let filePath = ''
        let pictures = []
        if(files.file) {
            if(!Array.isArray(files.file)) { // 一张图片
                extname = '.' + replaceExtname(files.file.type.split('/')[1]); // 得到拓展名
                filePath = images + files.file.path.substring(files.file.path.lastIndexOf('\\') + 1) + extname
                pictures.push(filePath)
                fs.rename(files.file.path,files.file.path + extname,function() { })
            } else { // 多张图片
                files.file.forEach(function(item) {
                    extname = '.' + replaceExtname(item.type.split('/')[1]); // 得到拓展名
                    console.log('extname:',extname)
                    console.log('item.path:',item.path + extname)
                    filePath = images + item.path.substring(item.path.lastIndexOf('\\') + 1) + extname
                    pictures.push(filePath)
                    fs.rename(item.path,item.path + extname,function() { })
                })
            }
        }
        db.query(api.friends.uploadPics,[(files.file ? pictures.join(',') : ''),fields.wechat],(result,fields) => {
            res.send({message: '上传成功'}) // 将查询结果返回给页面
        })
    })
})
function replaceExtname (extname) {
    if(extname.includes('x-icon') || extname.includes('icon')) {
        return 'ico'
    } else if(extname.includes('svg')) {
        return 'svg'
    }
    return extname
}
//根据项目的路径导入生成的证书文件
const httpsOptions = {
    pfx: fs.readFileSync(__dirname + '/ssl/5536899_node.linaige.com.pfx'),
    passphrase: 'x8ln2K48'
};
//创建http与HTTPS服务器
const httpServer = http.createServer(httpsOptions,app);
const httpsServer = https.createServer(httpsOptions,app);

// app.on('error',(error,ctx) => {
//     console.log('something error ' + JSON.stringify(ctx.onerror));
// });

const PORT = 3000 // 定义监听端口
const SSLPORT = 3001;
// 监听3000端口 nodemon index.js || pm2 start index.js --watch
// app.listen(PORT,() => console.log(`listening on port ${port}`))

//创建http服务器
httpServer.listen(PORT,function() {
    console.log('HTTP Server is running on:',PORT);
});

//创建https服务器
// httpsServer.listen(SSLPORT,function() {
//     console.log('HTTPS Server is running on:',SSLPORT);
// });
