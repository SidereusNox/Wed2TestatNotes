module.exports.filterNotes = function(req, notes){
    if(!req.session.showFinished){
        return notes.filter(note => !note.finished);
    }
    return notes;
}