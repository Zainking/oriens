const fs = require('fs')
const pug = require('pug')
const stylus = require('stylus')
const createDir = require('./utils').createDir

function isFile(path) {
    return fs.statSync(path).isFile()
}
class Template {
    /**
     * @param {string} templatePath 
     * @param {string[]} stylePathes 
     */
    constructor(templatePath, stylePathes) {
        if(!isFile(templatePath)) {
            throw new Error(templatePath + ' 模板文件未找到')
        }
        if (stylePathes && stylePathes.length) {
            stylePathes.forEach(path => {
                if (!isFile(path)) {
                    throw new Error(path + ' 样式文件未找到')
                }
            })
        }
        this.templatePath = templatePath
        this.stylePathes = stylePathes
    }
    /**
    * 指定路径下编译输出
    * @param {string} path 文件夹路径
    * @param {string} data html字符串数据
    */
    complie(path, data) {
        let __style = ""
        if (this.stylePathes && this.stylePathes.length) {
            this.stylePathes.forEach(path => __style += '\n' + this.readStylFile(path))
        }
        const html = pug.renderFile(this.templatePath, { ...data, __style })
        this.outputHtml(path, html)
    }
    /**
     * 将 styl 文件读取成 css 字符串
     * @private
     * @param {string} path styl文件路径
     * @returns {string} css字符串
     */
    readStylFile(path) {
        const stat = fs.statSync(path)
        if (stat.isFile()) {
            const str = fs.readFileSync(path, 'utf8')
            const styl = stylus(str).render()
            return styl
        }
    }
    /**
     * 指定文件夹下输出 index.html
     * @private
     * @param {string} path 文件夹路径
     * @param {string} data html字符串数据
     */
    outputHtml(path, data) {
        createDir(path)
        fs.writeFileSync(`${path}/index.html`, data)
    }
}
/**
 * @param {string} templatePath pug模板文件路径
 * @param {string[]} stylePathes styl文件路径数组
 */
function createTemplate(templatePath, stylePathes) {
    return new Template(templatePath, stylePathes)
}
module.exports = { createTemplate }