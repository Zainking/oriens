// test router
const mergeRouterAndData = require('../lib/routerFactory').mergeRouterAndData

const res = mergeRouterAndData({
    "/": ["templateName", { "__data": "./simple/data/d.json" }],
    "/[id]/[id2]": [
        "templateName",
        {
            "id": "./simple/data/a",
            "id2": "./simple/data/b",
            "id3": "./simple/data/b",
            "__data": "./simple/data/c.json"
        }
    ]
})
test('Test router and data merge.', () => {
    expect(res["/a1/b1"]["1"]["id2"].data).toBe("这是b/b1.json")
})

// test template
const createTemplate = require('../lib/templateFactory').createTemplate
const delDir = require('../lib/utils').delDir
const fs = require('fs')
const tpl = createTemplate('./simple/templates/a/a.pug', ['./simple/templates/a/a1.styl', './simple/templates/a/a2.styl'])
delDir('./dist/')
tpl.complie('./dist/')
test('Test template generator and complie.', () => {
    expect(fs.existsSync('./dist/index.html'))
})