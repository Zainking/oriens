const createTemplate = require('../lib/templateFactory').createTemplate

const tpl = createTemplate('./simple/templates/a/test.pug', ['./simple/templates/a/1.styl', './simple/templates/a/2.styl'])
tpl.complie('./dist', { data: 'hello' })