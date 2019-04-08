const MongoClient = require('mongoose');
const MONGO_URL = `mongodb://localhost/words_db`

const initDB = function () {
    MongoClient.connect(MONGO_URL, { useNewUrlParser: true })
     .then((connection) => {
            console.log("Database connection established")
        })
        .catch((err) => console.error(err))


};

module.exports = initDB;