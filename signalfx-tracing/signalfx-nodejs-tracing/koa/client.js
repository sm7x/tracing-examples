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
    // client.exploreWord(argv.word).then((response) => {
        console.log('called')
        // console.log(argv.word);

        })
        })

//      }).catch((e) => console.error(e))
//    }).catch((e) => console.error(e))
//// })

.command('explore [word]', 'Explore a word', {}, (argv) => {
  client.exploreWord(argv.word).then((response) => {
      // console.log(argv.word);
      })
      })

  .command('add [usage]', 'Add explored word to vocabulary list.', {}, (argv) => {
//    getId().then((id) => {
      console.log(argv.usage)

      client.addWord(argv.usage).then((response) => {}

//      }).catch((e) => console.error(e))
//    }).catch((e) => console.error(e))
  )
  })


    .command('list', 'Show vocabulary list.', {}, (argv) => {
  //    getId().then((id) => {
        client.listWords().then((response) => {
          console.log(response)
            }

  //      }).catch((e) => console.error(e))
  //    }).catch((e) => console.error(e))
    )
    })



    .command('delete [word]', 'Delete word.', {}, (argv) => {
      //    getId().then((id) => {
            client.deleteWord(argv.word).then((response) => {}

      //      }).catch((e) => console.error(e))
      //    }).catch((e) => console.error(e))
        )
        })


    .command('update [word] [usage]', 'Update word.', {}, (argv) => {
      //    getId().then((id) => {
            client.updateWord(argv.word, argv.usage).then((response) => {}

      //      }).catch((e) => console.error(e))
      //    }).catch((e) => console.error(e))
        )
        })




    .command('retrieve [word]', 'Retrieve word entry from your vocabulary list.', {}, (argv) => {
      //    getId().then((id) => {
            client.viewWord(argv.word).then((response) => {}

      //      }).catch((e) => console.error(e))
      //    }).catch((e) => console.error(e))
        )
        })


  .help().argv