#!/usr/bin/env node

const tracer = require('./ContactKeeper/tracer');

const yargs = require('yargs');
const client = require('./ContactKeeper/client');

function printRes(response) {
  console.log('++++++++++++++++++++++++++++++++++');
  console.log('\nAdonis ContactBook: \n');
  console.log('----++---------++++---------++-----\n');
  if (response.message) {
    console.log(response.message);
  } else if (response.err) {
    console.log('ERROR:', response.err);
  } else {
  for (const [key, value] of Object.entries(response)) {
    console.log(`${key}: ${value}`)
  }
  }
  console.log('\n++++++++++++++++++++++++++++++++++\n');
}


function printList(response) {
  if (response.message) {
    return printRes(response);
  }
  console.log('+++++++++++++++++++++++++++++++++++');
  console.log('             Contact(s)');
  console.log('----++---------++++---------++-----\n');
  const properties = ['id', 'name', 'email', 'title', 'phone'];

  for (const [key, value] of Object.entries(response)) {
    properties.forEach((prop) => {
      console.log(`${prop}: ${value[prop]}`);
    });
    console.log('\n-----++---------++++---------++----');
  }
  console.log('\n+++++++++++++++++++++++++++++++++++\n');
}

//function printRes(response) {
//  console.log('++++++++++++++++++++++++++++++++++');
//  console.log('AdonisContactBook: \n');
//  if (response.message) {
//    console.log(response.message);
//  } else if (response.err) {
//    console.log('ERROR:', response.err);
//  }
//  console.log('\n++++++++++++++++++++++++++++++++++\n');
//}
//
//function print(response){
//for (const [key, value] of Object.entries(response)) {
//       console.log(`${key}: ${value}`)
//}
//
//
//
//function printList(response){
//  for (const [key, value] of Object.entries(response)) {
//    properties.forEach((prop) => {
//      console.log(`${prop}: ${value[prop]}`);
//    });
//    console.log('\n-----++---------++++---------++----');
//  }
//}
//
//function printContact(response) {
//  if (response.message) {
//    return printRes(response);
//  }
//  console.log('+++++++++++++++++++++++++++++++++++');
//  console.log('             Contact(s)');
//  console.log('----++---------++++---------++-----\n');
//  const properties = ['id', 'name', 'email', 'title', 'phone'];
//
//
//  }
//  console.log('\n+++++++++++++++++++++++++++++++++++\n');
//}
//
//function print(response, val=0) {
//  if (response.message) {
//    return printRes(response);
//  }
//  console.log('+++++++++++++++++++++++++++++++++++');
//  console.log('             Contact(s)');
//  console.log('----++---------++++---------++-----\n');
//  const properties = ['id', 'name', 'email', 'title', 'phone'];
//  if (val === 0){
//    printList(response)
//  } else {
//    printContact(response)
//  }
//
//
//  console.log('\n+++++++++++++++++++++++++++++++++++\n');
//}

yargs
    .usage('Usage: $0 <command> [options]')
    .scriptName('contactKeeper')
    .command('add <name> <email> <title> <phone>',
        'Add a new contact to your address book.',
        {}, (argv) => {
          client.addContact(argv.name, argv.email, argv.title, argv.phone)
              .then(printRes);
        })

    .command('delete <name> ', 'Delete a contact.', {}, (argv) => {
      client.deleteContact(argv.name)
          .then(printRes);
    })

    .command('deleteByID <id>', 'Delete a contact by ID.', {}, (argv) => {
      client.deleteByID(argv.id)
          .then(printRes);
    })

    .command('getByID <id>', 'Get contact from your ContactKeeper.',
        {}, (argv) => {
          client.getContactID(argv.id)
              .then(printRes);
        })

//    .command('get <name>', 'Get contact from your ContactKeeper.',
//        {}, (argv) => {
//          client.getContact(argv.name)
////              .then(printRes);
//              .then(console.log);
//        })

    .command('list', 'Show list.', {}, (argv) => {
      client.listContacts()
          .then(printList);
    })

//    .command('update <name> <email> <title> <phone>', 'Update a contact\'s email.',
//        {}, (argv) => {
//          client.updateEmail(argv.name, argv.email, argv.title, argv.phone)
//              .then(printRes);
//        })

//    .command('updateByID <id> <email>', 'Update a contact\'s email by ID.',
//        {}, (argv) => {
//          client.updateByID(argv.id)
//              .then(printRes);
//        })


    .help().argv;
