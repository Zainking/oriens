#!/usr/bin/env node

const fs = require('fs')
const createTemplate = require('./lib/templateFactory').createTemplate
const mergeRouterAndData = require('./lib/routerFactory').mergeRouterAndData
const delDir = require('./lib/utils').delDir
const fse = require('fs-extra')

const cmd = process.argv[2]

switch (cmd) {
    case 'build':
        build()
        break
    case 'create':
        create()
        break
    default:
        console.log('请输入命令（现在支持 create [project name] 或 build）')
}

function create() {
    const name = process.argv[3]
    const path = './' + name
    if(!name) {
        console.log('请输入项目名称')
        return
    }
    if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
        console.log(name+ '目录已经存在')
        return
    }
    fse.copy(__dirname + '/simple', './' + name, err => {
        if (err) {
            console.log(err)
        } else {
            console.log('创建成功！工程目录：' + process.cwd() + '/' + name)
        }
    })
}

function build() {
    const cfgSrc = './config.json'
    try {
        const stat = fs.statSync(cfgSrc)
        if (!stat.isFile()) {
            throw new Error('config.json 文件不存在')
        }
    } catch (e) {
        throw new Error('config.json 文件不存在')
    }

    const str = fs.readFileSync(cfgSrc, 'utf8')
    const config = JSON.parse(str)

    const templates = {}
    Object.keys(config.templates).forEach(key => templates[key] = createTemplate(...config.templates[key]))

    Object.keys(config.routers).forEach(key => {
        const name = config.routers[key][0]
        if (!name || !templates[name]) {
            throw new Error('路由中的模板名称' + name + '不存在')
        }
    })

    delDir(config.output)

    const finalRouters = mergeRouterAndData(config.routers)
    Object.keys(finalRouters).forEach(router => {
        const templateName = finalRouters[router][0]
        const outputPath = `${config.output}/${router}`
        const finalData = { __globalData: config.globalData, ...finalRouters[router][1] }
        console.log(`输出 ${outputPath}/index.html`)
        templates[templateName].complie(outputPath, finalData)
    })
}