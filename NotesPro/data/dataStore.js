const nedb = require('nedb-promises');
const Database = nedb.create('./datastore.db');

class DataStore{
    constructor(database){
        this.database = database;
    }

    async insertNote(note){
        await this.database.insert(note);
    }
}

 module.exports = new DataStore(Database);