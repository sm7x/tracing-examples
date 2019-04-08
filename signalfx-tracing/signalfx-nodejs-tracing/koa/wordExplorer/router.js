const tracer = require('./tracer');
const BodyParser = require('koa-bodyparser');
const initDB = require("./database")();
const koaRequest = require('koa-http-request');
const Router = require('koa-router');
const Word = require('./models/words');
const uuid = require('uuid/v4');
const { Explorer} = require('./explorer')




const apiKey = process.env.DICTIONARY_API_KEY;
const router = new Router();

let output_dict = {};

//function openExplorer(req, res) {
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
    const span = tracer.scope().active();
    span.setTag('added_word', output_dict.word);
    let usage = ctx.request.body.usage;
    output_dict['usage_note'] = usage;
    if (output_dict.word){
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
    }


async function deleteWord(ctx) {
        console.log('Delete called')
        let wordQuery = {"word": ctx.params.word};
        retrieve_response = await Word.findOneAndRemove(wordQuery)
        ctx.body = {message: `'${retrieve_response.word}' has been removed.`};
        console.log(`'${retrieve_response.word}' has been removed.`)
}


async function exploreWord(ctx){
    const span = tracer.scope().active();
    var word = ctx.request.body.word;
    span.setTag('explored_word', word);
    let url = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${apiKey}`;
    let response = await ctx.get(url);
    console.log(response[0].shortdef)
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
    console.log('Listing words...')
    const span = tracer.scope().active()
    span.setTag('list_word', 'True')
    ctx.body = await Word.find();
    ctx.render('viewWords', response=ctx.body);
    }


async function updateUsage(ctx) {
    const span = tracer.scope().active()
    let wordQuery = {"word": ctx.params.word};
    span.setTag('updated_word', wordQuery.word)
    let usage_note = ctx.request.body.usage;
    await Word.findOneAndUpdate(wordQuery, {$set: {usage_note}})
    retrieve_model = await Word.findOne(wordQuery)
    ctx.render('viewWord', {response: retrieve_model, error: null});
    console.log(retrieve_model.usage_note)
    }


async function viewWord(ctx) {
    const span = tracer.scope().active()
    let wordQuery = {"word": ctx.params.word}
    span.setTag('viewed_word', wordQuery.word)
    retrieve_response = await Word.findOne(wordQuery);

    if (retrieve_response){
        ctx.render('viewWord', {response: retrieve_response, error: null});
     }else{
        let unknown_word = `<h3>Error</h3>Word not found. Check spelling, try another word, or add word to your vocab list.`;
        ctx.render('viewWord', {response: unknown_word, error: null});
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
    .delete('/words/:word', deleteWord)

module.exports = router;