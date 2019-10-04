const nedb = require('nedb-promises');
const Database = nedb.create('./datastore.db');

class DataStore{

    constructor(database){
        this.database = database;
    }

    async insertNote(note){
        return await this.database.insert(note);
    }

    async findNoteById(id){
        return await this.database.findOne({_id: id});
    }

    async updateNoteById(id, note){
        return await this.database.update({_id: id}, note, {});
    }

    async getNotesSortedByTitle(){
        return await this.database.find({}).sort({Title: 1});
    }
}

 module.exports = new DataStore(Database);