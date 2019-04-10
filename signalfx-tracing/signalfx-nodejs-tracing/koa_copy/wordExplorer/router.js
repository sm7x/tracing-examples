const tracer = require('./tracer');
const BodyParser = require('koa-bodyparser');
const initDB = require("./database")();
const koaRequest = require('koa-http-request');
const Router = require('koa-router');
const Word = require('./models/words');
const WordNet = require('node-wordnet');
const uuid = require('uuid/v4');
const { Explorer} = require('./explorer')

const router = new Router();
const wordnet = new WordNet();

let outputDict = {};

function openExplorer(ctx) {
    console.log('Opening......')
    const span = tracer.scope().active()
    explorer = new Explorer(uuid())
    span.setTag('id', explorer.id)
    ctx.status = 201
    ctx.body = {
      id: explorer.id,
      message: 'WordExplorer is ready for your journey to begin.'
    }
  }



async function addWord(ctx) {
    console.log(outputDict)
    const span = tracer.scope().active();
    span.setTag('addedWord', outputDict.word);
    let usage = (ctx.request.body.usage) ? (ctx.request.body.usage) : outputDict.usageNote;
    console.log(usage)
    if (outputDict.word){
    var newWord = new Word({
        word: outputDict.word,
        pos: outputDict.pos,
        meaning: outputDict.meaning,
        synonyms: outputDict.synon,
        usageNote: usage,
    });
    newWord.save();
    console.log(newWord.usageNote)
    let response = `<h3>Success!</h3>You just added ${outputDict.word} to your vocab list!.`;
    ctx.render('add', {response: response, error: null});
    }
    }


async function deleteWord(ctx) {
    console.log('Delete called')
    let wordQuery = {"word": ctx.params.word};
    let retrievedResponse = await Word.findOneAndRemove(wordQuery)
    ctx.body = {message: `'${retrievedResponse.word}' has been removed.`};
    console.log(`'${retrievedResponse.word}' has been removed.`)
}


async function exploreWord(ctx, printer){
    const span = tracer.scope().active();
    let word = ctx.request.body.word;
    span.setTag('exploredWord', word);
    let results = await wordnet.lookupAsync(word)
    console.log(results[0])
    if (results[0]){
        let synon = results[0].synonyms
        let shortdef = results[0].gloss.split(';')
        let meaning = shortdef[0]
        let usage = ''
        if (shortdef[1]){
                usage  = shortdef[1].replace(/\"/g,"").replace(/\"/g,"")
            }
        let pos  = results[0].pos
        let exploredResponse = `<h4>Exploring: ${word}</h4>
                                <p>Part of speech:    ${pos}</p>
                                <h4>Brief definition:</h4><p>  ${meaning}</p>
                                <h4>Synonyms:</h4><p>${synon}</p>
                                <h4>Usage note:</h4><p>${usage}</p>`;
        ctx.render('word', {explored: exploredResponse,
//                            exploredWord: word,
//                            meaning: meaning,
//                            synon: synon,
//                            usageNote: usage,
                            error: null});
        outputDict = {'word': word, 'pos': pos, 'meaning': meaning, 'synon': synon, 'usageNote': usage};
        } else {
            let unknownWord = `<h3>Error</h3>Word not found. Check spelling or try another word.`;
            ctx.render('index', {explored: unknownWord, error: null});
        }
    }

async function updateUsageApi(ctx) {
    // validate the payload
    // do backend actions ex) updating DB, ...
    // decide status updated(200/204), 400 or not
    // decide what to include in the response
//    ctx.body =  {"message": "Update Usage API Response"};
    console.log('Hello world');

}

async function index(ctx){
    ctx.render('index');
}


async function listWords(ctx){
    console.log('Listing words...')
    const span = tracer.scope().active()
    span.setTag('listWord', 'True')
    ctx.body = await Word.find();
    ctx.render('viewWords', response=ctx.body);
    }


async function updateUsage(ctx) {
    const span = tracer.scope().active()
    let wordQuery = {"word": ctx.params.word};
    console.log(wordQuery)
    console.log(ctx.params.usage)
    span.setTag('updatedWord', wordQuery.word)
    let usageNote = ctx.request.body.usage;
    console.log(usageNote)
    await Word.findOneAndUpdate(wordQuery, {$set: {usageNote}})
    let retrievedModel = await Word.findOne(wordQuery)
    ctx.render('viewWord', {response: retrievedModel, error: null});
    console.log(retrievedModel.usageNote)
    }


async function viewWord(ctx) {
    const span = tracer.scope().active()
    let wordQuery = {"word": ctx.params.word}
    span.setTag('viewedWord', wordQuery.word)
    let retrievedResponse = await Word.findOne(wordQuery);
    console.log(retrievedResponse.usageNote)
    if (retrievedResponse){
        console.log(retrievedResponse)
        ctx.render('viewWord', {response: retrievedResponse, error: null});
     }else{
        let unknownWord = `<h3>Error</h3>Word not found. Check spelling, try another word, or add word to your vocab list.`;
        ctx.render('viewWord', {response: unknownWord, error: null});
    }

}



router
    .use(koaRequest({dataType: 'json'}))
    .use(BodyParser())
    .get('/', index)
    .get ('/words', listWords)
    .get('/words/:word', viewWord)
    .post('/explore', exploreWord)
    .post('/add', addWord)
    .post('/', openExplorer)
    .put('/words/:word', updateUsage)
    .put('/api/words/:word', updateUsageApi)
    .delete('/words/:word', deleteWord)

module.exports = router;