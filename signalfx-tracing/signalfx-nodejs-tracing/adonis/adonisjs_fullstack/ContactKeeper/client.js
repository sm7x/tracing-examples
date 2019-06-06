const tracer = require('./tracer');

// http module auto-instrumentation will occur once
// the tracer is initialized, which occurs in
// the sourcing client script.

const http = require('http');
const {serverUrl} = 'http://127.0.0.1:3333/api';
const keeperUrl = `${serverUrl}/api`;

function resolveData(res, resolve) {
  // resolves a Promise with parsed http response
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
  try{
      resolve(JSON.parse(data));
    } catch (e) {
      console.error(e)
    }
  });
}

function addContact(name, email, title, phone) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:3333/api/contacts`,
        {method: 'POST'}, (res) => {
          resolveData(res, resolve);
        });
    req.on('error', (e) => reject(e));
    const content = {name, email, title, phone};
    req.setHeader('Content-Type', 'application/json');
    req.write(JSON.stringify(content));
    req.end();
  });
}

function deleteByID(id) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:3333/api/contacts/${id}`,
        {method: 'DELETE'}, (res) => {
          resolveData(res, resolve);
        });
    req.on('error', (e) => reject(e));
    req.end();
  });
}

function deleteContact(fName, lName) {
  return new Promise((resolve, reject) => {
    const req = http.request(`${keeperUrl}/contacts/?fName=${fName}&lName=${lName}`,
        {method: 'DELETE'}, (res) => {
          resolveData(res, resolve);
        });
    req.on('error', (e) => reject(e));
    req.end();
  });
}

function getContactID(id) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:3333/api/contacts/${id}`,
        {method: 'GET'}, (res) => {
          resolveData(res, resolve);
        });
    req.on('error', (e) => reject(e));
    req.end();
  });
}


function getContact(name) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:3333/api/contacts/${name}`,
        {method: 'GET'}, (res) => {
          resolveData(res, resolve);
        });
    req.on('error', (e) => reject(e));
    req.end();
  });
}

function listContacts() {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:3333/api/contacts`,
        {method: 'GET'}, (res) => {
          resolveData(res, resolve);
        });
    req.on('error', (e) => reject(e));
    req.end();
  });
}

function updateByID(id, email) {
  return new Promise((resolve, reject) => {
    const req = http.request(`${keeperUrl}/contacts/${id}`,
        {method: 'PUT'}, (res) => {
          resolveData(res, resolve);
        });
    req.on('error', (e) => reject(e));
    const content = {email};
    req.setHeader('Content-Type', 'application/json');
    req.write(JSON.stringify(content));
    req.end();
  });
}

function updateEmail(fName, lName, email) {
  return new Promise((resolve, reject) => {
    const req = http.request(`${keeperUrl}/contacts/?fName=${fName}&lName=${lName}`,
        {method: 'PUT'}, (res) => {
          resolveData(res, resolve);
        });
    req.on('error', (e) => reject(e));
    const content = {email};
    req.setHeader('Content-Type', 'application/json');
    req.write(JSON.stringify(content));
    req.end();
  });
}


module.exports = {addContact, getContact, getContactID, deleteByID, listContacts};

//module.exports = {addContact, getContact, deleteByID,
//  deleteContact, listContacts, updateByID, updateEmail};
//

