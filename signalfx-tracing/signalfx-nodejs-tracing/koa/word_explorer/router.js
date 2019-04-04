const tracer = require('./tracer');
const BodyParser = require('koa-bodyparser');
const initDB = require("./database")();
const koaRequest = require('koa-http-request');
const Router = require('koa-router');
const Word = require('./models/words');

//const logger = require('koa-logger');


const apiKey = process.env.DICTIONARY_APIKEY;
const router = new Router();

var output_dict = {}




async function addWord(ctx) {
    let usage = ctx.request.body.usage;
    output_dict['usage_note'] = usage;
    console.log('here', output_dict.word)
    var newWord = new Word({
        word: output_dict.word,
        meaning: output_dict.meaning,
        synonyms: output_dict.synon,
        usage_note: output_dict.usage_note,
    });
    newWord.save();
    let response = `<h3>Success!</h3>You just added ${output_dict.word} to your vocab list!.`;
    ctx.render('add', {response: response, error: null});
    }


async function deleteWord(ctx) {
        console.log('Delete called')
        let idQuery = {"_id": ctx.params.id};
        retrieve_response = await Word.findOne(idQuery)
        console.log(idQuery._id)
        await Word.findByIdAndRemove(idQuery._id)
        ctx.body = {message: `'${retrieve_response.word}' has been removed.`};
}


async function exploreWord(ctx){
    var word = ctx.request.body.word;
    let url = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${apiKey}`;
    let response = await ctx.get(url);
    if (response[0].shortdef){
        response = response[0]
        var meaning = response.shortdef
        var synon = response.meta.syns
        let explored_response = `<h2>Explored word: ${word}</h2><br><b>Brief definition:</b><br> ${response.shortdef}<br><br><b>Synonyms:</b><br>${response.meta.syns}\n`;
        ctx.render('word', {explored: explored_response, explored_word: word, meaning: meaning, synon: synon, error: null});
      } else {
        let unknown_word = `<h3>Error</h3>Word not found. Check spelling or try another word.`;
        ctx.render('index', {explored: unknown_word, error: null});
        }
   output_dict = {'word': word, 'meaning': meaning, 'synon': synon};
}


async function index(ctx){
    ctx.render('index');
}


async function listWords(ctx){
    ctx.body = await Word.find();
    ctx.render('view_words', response=ctx.body);
    }


async function updateUsage(ctx) {
    let idQuery = {"_id": ctx.params.id};
    let usage_note = ctx.request.body.usage;
    await Word.findByIdAndUpdate(idQuery._id, {$set: {usage_note}})
    retrieve_model = await Word.findById(idQuery._id)
    console.log('usage:',  retrieve_model.usage_note)
    ctx.render('view_word', {response: retrieve_model, error: null});
    console.log('model:', retrieve_model)
    }


async function viewWord(ctx) {
    let wordQuery = {"_id": ctx.params.id};
    retrieve_response = await Word.findOne(wordQuery);
    if (retrieve_response){
        console.log(retrieve_response.synonyms)
        ctx.render('view_word', {response: retrieve_response, error: null});
     }else{
        let unknown_word = `<h3>Error</h3>Word not found. Check spelling, try another word, or add word to your vocab list.`;
        ctx.render('view_word', {response: unknown_word, error: null});
    }

}




router
    .use(koaRequest({dataType: 'json'}))
    .use(BodyParser())
    .get('/', index)
    .get ('/words', listWords)
    .get('/words/:id', viewWord)
    .post('/explore', exploreWord)
    .post('/add', addWord)
    .put('/words/:id', updateUsage)
    .delete('/words/:id', deleteWord)

module.exports = router;