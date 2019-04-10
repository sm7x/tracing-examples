if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// The core of the auto-instrumentation process is made in the
// tracer.js module.  It consists of a single import and invocation
// of the 'signalfx-tracing' module.
const tracer = require('./wordExplorer/tracer')

// Note koa module import must come after init() that occurs
// in word_explorer/tracer module import, as well as any
//modules that load it.
//const BodyParser = require('koa-bodyparser');
const Koa = require('koa');
const Pug = require('koa-pug');

const wordExplorer = require('./wordExplorer');
const logger = require('koa-logger');
const router = require('koa-router')();
const serve = require('koa-static');

const port = wordExplorer.config.serverPort;

const server = new Koa();
const pug = new Pug({
    viewPath: './wordExplorer/views',
    basedir: './wordExplorer/views',
    app: server
});



router
    .use('/wordExplorer', wordExplorer.router.routes())

server
    .use(serve(__dirname + '/wordExplorer/public'))
    .use(logger())
    .use(router.routes(), router.allowedMethods())
    .listen(port, function(){
        console.log(`Word explorer listening on http://localhost:${port}`)
    })
