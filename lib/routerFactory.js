const fs = require('fs')
const deepClone = obj => JSON.parse(JSON.stringify(obj))
/**
 * 
 * @param {[string]: [string, any]} routerObj 
 */
function mergeRouterAndData(routerObj) {
    const resultRouterObj = {}
    Object.keys(routerObj).forEach(key => {
        let singleRouter = {
            [key]: routerObj[key]
        }
        const dataDirs = routerObj[key][1]
        const dataKeys = Object.keys(dataDirs).filter(key => key !== '__data')
        const data = {}
        dataKeys.forEach(datakey => {
            const nextSingleRouter = {}
            const dataDir = dataDirs[datakey]
            const fileNames = fs.readdirSync(dataDir)
            fileNames.forEach(name => {
                const path = dataDir + "/" + name
                const stat = fs.statSync(path)
                if(!stat.isFile() || !/.json$/.test(name)) {
                    return
                }
                const str = fs.readFileSync(path, 'utf8')
                !data[datakey] && (data[datakey] = {})
                data[datakey][name.replace(/.json/, "")] = JSON.parse(str)
            })
            Object.keys(singleRouter).forEach(currentSingleRouterKey => {
                Object.keys(data[datakey]).forEach(name => {
                    if (!currentSingleRouterKey.includes(`[${datakey}]`)) { return }
                    const currentRouterName = currentSingleRouterKey.replace(`[${datakey}]`, name)
                    nextSingleRouter[currentRouterName] = deepClone(singleRouter[currentSingleRouterKey])
                    nextSingleRouter[currentRouterName][1][datakey] = data[datakey][name]
                })
            })
            singleRouter = nextSingleRouter
        })
        if (routerObj[key][1].__data) {
            const str = fs.readFileSync(routerObj[key][1].__data, 'utf8')
            const defaultData = JSON.parse(str)
                Object.keys(singleRouter).forEach(nextKey => {
                    singleRouter[nextKey][1] = Object.assign(singleRouter[nextKey][1], defaultData)
                    delete singleRouter[nextKey][1].__data
                })
        }
        Object.assign(resultRouterObj, singleRouter)
    })
    return resultRouterObj
}

module.exports = { mergeRouterAndData }