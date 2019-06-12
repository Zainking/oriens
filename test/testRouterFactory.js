const mergeRouterAndData = require('../lib/routerFactory').mergeRouterAndData

const res = mergeRouterAndData({
    "/": ["templateName", { "__data": "./simple/data/d.json" }],
    "/[id]/[id2]": [
        "templateName",
        {
            "id": "./simple/data/a",
            "id2": "./simple/data/b",
            "__data": "./simple/data/c.json"
        }
    ]
})
console.log(JSON.stringify(res))