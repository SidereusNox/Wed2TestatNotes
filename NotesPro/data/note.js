class Note {
    constructor(){
        this.title = '';
        this.description = '';
        this.importance = 0;
        this.dueDate = new Date();
        this.created = Date.now();
        this.finished = false;
        this.deleted = false;
    }
}

module.exports = Note;