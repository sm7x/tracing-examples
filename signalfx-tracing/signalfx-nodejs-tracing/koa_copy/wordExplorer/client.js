const { serverUrl } = require('./config')

// http module auto-instrumentation will occur once the tracer is initialized,
// which occurs in the sourcing client script.
const http = require('http')
const Word = require('./models/words');

const wordExplorerUrl = `${serverUrl}/wordExplorer`

function addWord(usage){
    return new Promise((resolve, reject) => {
        const req = http.request(`${wordExplorerUrl}/add`, { method: 'POST' }, (res) => {
//          resolveData(res, resolve)
        })
        req.on('error', (e) => reject(e))
        const content = { usage }
        req.setHeader('Content-Type', 'application/json')
        req.write(JSON.stringify(content))
        req.end()
      })
}


function deleteWord(word){
    console.log('Delete words called');
    return new Promise((resolve, reject) => {
        const req = http.request(`${wordExplorerUrl}/words/${word}`, { method: 'DELETE' }, (res) => {
//          resolveData(res, resolve)
        })
        req.on('error', (e) => reject(e))
        req.end()
      })}


function exploreWord(word){
    return new Promise((resolve, reject) => {
        const req = http.request(`${wordExplorerUrl}/explore/`, { method: 'POST' }, (res) => {
//          resolveData(res, resolve)
        })
        req.on('error', (e) => reject(e))
        const content = { word }
        req.setHeader('Content-Type', 'application/json')
        req.write(JSON.stringify(content))
        req.end()
      })

}


function listWords(){
    console.log('List words called');
    return new Promise((resolve, reject) => {
        const req = http.request(`${wordExplorerUrl}/words`, { method: 'GET' }, (res) => {
//          resolveData(res, resolve)
        })
        req.on('error', (e) => reject(e))
        req.end()
      })}




function openExplorer(){
    console.log('Explorer opened');
    return new Promise((resolve, reject) => {
        const req = http.request(`${wordExplorerUrl}/`, { method: 'GET' }, (res) => {
//          resolveData(res, resolve)
        })
        req.on('error', (e) => reject(e))
        req.end()
      })

}





function updateWord(word, usage){
    console.log('Update called:', word, usage);
    return new Promise((resolve, reject) => {
        const req = http.request(`${wordExplorerUrl}/words/${word}`, { method: 'PUT' }, (res) => {
//          resolveData(res, resolve)
        })
        req.on('error', (e) => reject(e))
        const content = { usage }
        req.setHeader('Content-Type', 'application/json')
        req.write(JSON.stringify(content))
        req.end()
      })}


async function viewWord(find_word){
    return new Promise((resolve, reject) => {
        const req = http.request(`${wordExplorerUrl}/words/${find_word}`, { method: 'GET' }, (res) => {
//          resolveData(res, resolve)
        })
        req.on('error', (e) => reject(e))
        req.end()
      })
      }


module.exports = {addWord,  deleteWord, exploreWord, listWords, updateWord, viewWord, openExplorer}
