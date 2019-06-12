const createTemplate = require('../lib/templateFactory').createTemplate

const tpl = createTemplate('./simple/templates/a/a.pug', ['./simple/templates/a/a1.styl', './simple/templates/a/a2.styl'])
tpl.complie('./dist')