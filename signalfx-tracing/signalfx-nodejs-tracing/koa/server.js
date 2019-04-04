// The core of the auto-instrumentation process is made in the
// tracer.js module.  It consists of a single import and invocation
// of the 'signalfx-tracing' module.
const tracer = require('./word_explorer/tracer')

// Note koa module import must come after init() that occurs
// in word_explorer/tracer module import, as well as any
//modules that load it.
//const BodyParser = require('koa-bodyparser');
const Koa = require('koa');
const Pug = require('koa-pug');

const explorer = require('./word_explorer');
const logger = require('koa-logger');
const router = require('koa-router')();
const serve = require('koa-static');

const port = explorer.config.serverPort;

const server = new Koa();
const pug = new Pug({
    viewPath: './views',
    basedir: './views',
    app: server
});



router
    .use('/word_explorer', explorer.router.routes())

server
    .use(serve(__dirname + '/public'))
    .use(logger())
    .use(router.routes(), router.allowedMethods())
    .listen(port, function(){
        console.log(`Word explorer listening on http://localhost:${port}`)
    })
