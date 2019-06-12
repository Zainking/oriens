const fs = require('fs')
const stylus = require('stylus')
const path = require('path')
/**
 * 递归创建文件夹
 * @param {string} dirPath 需要创建文件夹的路径
 */
function createDir(dirPath) {
    let pathStat
    try {
        pathStat = fs.statSync(dirPath)
    } catch(e) {}
    if (pathStat && pathStat.isDirectory()) {
        return
    }
    //如果该路径不存在
    const fatherDir = path.parse(dirPath).dir //上级路径
    //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    createDir(fatherDir)
    fs.mkdirSync(dirPath)
}
/**
 * 递归删除文件夹
 * @param {string} dirPath 需要删除文件夹的路径
 */
function delDir(dirPath) {
    let files = [];
    if (fs.existsSync(dirPath)) {
        files = fs.readdirSync(dirPath);
        files.forEach((file, index) => {
            let curPath = dirPath + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(dirPath);
    }
}
// async function complie(pugPath, stylPath, dataPath) {
//     const data = require(dataPath)
//     const __style = readStylFile(stylPath)
//     const html = pug.renderFile(pugPath, { ...data, __style })

//     return html
// }
module.exports = { createDir, delDir }