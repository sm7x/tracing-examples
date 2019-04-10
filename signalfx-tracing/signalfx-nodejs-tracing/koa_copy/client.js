#!/usr/bin/env node
// Initialize the tracer and initiate auto-instrumentation of all supported libraries
// and frameworks.  In this client example, we instrumented the http module used by the
// word_explorer client module.
const tracer = require('./wordExplorer/tracer')

// Note that importing other modules should occur after init() to ensure their supported
// dependencies have been auto-instrumented.
const yargs = require('yargs')
//const fs = require('fs')
const client = require('./wordExplorer/client')




yargs
  .usage('Usage: $0 <command> [options]')
  .scriptName('wordExplorer')
  .command('open', 'Begin exploration!', {}, (argv) => {
    client.openExplorer().then((response) => {
        console.log(response)
        })
    })


    .command('add [usage]', 'Add explored word to vocabulary list.', {}, (argv) => {
          client.addWord(argv.usage).then((response) => {
          console.log(response)
          })
        })



    .command('delete [word]', 'Delete word.', {}, (argv) => {
            client.deleteWord(argv.word).then((response) => {})
        })


    .command('explore [word]', 'Explore a word', {}, (argv) => {
            client.exploreWord(argv.word).then((response) => {})
       })


    .command('list', 'Show vocabulary list.', {}, (argv) => {
            client.listWords().then((response) => {})
    })



    .command('retrieve [word]', 'Retrieve word entry from your vocabulary list.', {}, (argv) => {
            client.viewWord(argv.word).then((response) => {})
        })


    .command('update [word] [usage]', 'Update word.', {}, (argv) => {
            client.updateWord(argv.word, argv.usage).then((response) => {})
        })

    .help().argv