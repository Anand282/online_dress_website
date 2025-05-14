const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://127.0.0.1:27017';
let database;

async function getDb() {
    const client = await MongoClient.connect(url,
        //     {
        //     useNewUrlParser:true,
        //     useUnifiedTopology:true
        // }
    )
    database = client.db('dressdb')
    if (database) {
        console.log('database connected');
    }
    else {
        console.log('database not connected');
    }
    return database;
}


module.exports = {
    getDb
}
