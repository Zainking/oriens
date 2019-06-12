const mergeRouterAndData = require('../lib/routerFactory').mergeRouterAndData

const res = mergeRouterAndData({
    "/": ["templateName", { "__data": "./simple/data/1.json" }],
    "/[id]/[id2]/[id3]": [
        "templateName",
        {
            "id": "./simple/data/a",
            "id2": "./simple/data/a",
            "id3": "./simple/data/a",
            "__data": "./simple/data/1.json"
        }
    ]
})
console.log(JSON.stringify(res))