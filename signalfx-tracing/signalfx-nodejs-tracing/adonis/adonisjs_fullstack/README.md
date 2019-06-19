<h1>AdonisJS Test Example</h1>

**Pointers**<br/>
Clone branch: `git clone -b adonis_ex git@github.com:sm7x/tracing-examples.git` <br/>
Path to folder: `tracing-examples/signalfx-tracing/signalfx-nodejs-tracing/adonis/adonisjs_fullstack/`<br/>

```
# Install postgres
npm run postgres
# Install external module dependencies
npm install
```
In one terminal (which could become the 'server terminal') run:

```
cd ContactKeeper
npm install
../../node_modules/.bin/adonis migration:run
npm start

```

Presently working commands to be run from the `adonisjs_fullstack` directory (which is where the `client.js` file is):

```
npm run client add <name> <email> <title> <phone>
npm run client list
npm run client getByID <id>
npm run client deleteByID <id>
```