const Note = require('../data/note');
const dataStore = require('../data/dataStore');

function compare(first, second, order){
  let result;
  if(first > second){
    result = 1;
  } else if (first < second){
    result = -1;
  } else {
    result =  0;
  }
  if(order==="descending"){
    result *= -1;
  }
  return result;
}

function sortNotes(notes, sortBy, order){
  if(!sortBy){
    sortBy = "finish"; 
  }
  notes.sort((first, second) =>{
    switch(sortBy){
      case "created":
        return compare(first.created, second.created, order);
      case "finish":
        return compare(first.dueDate, second.dueDate, order);
      case "importance":
        return compare(first.importance, second.importance, order);
    }
  })
}

function isValidSortBy(sortBy){
  return sortBy === "created" || sortBy === "finish" || sortBy === "importance";
}

function isValidOrder(order){
  return order === "ascending" || order === "descending"
}

function handleSorting(req){
  let order;
  let sortBy;
  if(isValidSortBy(req.query.sortBy)){
    sortBy = req.query.sortBy;
    req.session.sortBy = req.query.sortBy;
  } else {
    sortBy = req.session.sortBy;
  }
  if(isValidOrder(req.query.order)){
    order = req.query.order;
    req.session.order = req.query.order;
  } else {
    order = req.session.order;
  }
  if(!isValidSortBy(sortBy)){
    sortBy = "finish";
    req.session.sortBy = sortBy;
  }
  if(!isValidOrder(order)){
    order = "ascending";
    req.session.order = order;
  }
}

module.exports.renderOverviewScreen = async function (req, res, next){
  handleSorting(req);

  const notes = await dataStore.getNotes();
  sortNotes(notes, req.session.sortBy, req.session.order);

  res.render('index', {
    title: "NotesPro",
    sortBy: req.session.sortBy,
    order: req.session.order==="ascending" ? "descending" : "ascending",
    notes: notes
  });
}

module.exports.renderCreateNoteScreen = function (req, res, next){
  res.render('createAndEdit', {note: new Note(), isCreate: true});
}

module.exports.renderEditNoteScreen = async function(req, res, next){
  const note = await dataStore.getNoteById(req.params.id);
  if(note){
    res.render('createAndEdit', {note: note, isCreate: false});
  } else {
    next();
  }
}

module.exports.saveChanges = async function(req, res, next){
  let note = new Note();
  note.title = req.body.title;
  note.description = req.body.description;
  note.dueDate = req.body.dueDate;
  note.importance = req.body.importance;
  note.finished = req.body.finished ? true : false;
  note.created = Date.now();
  const id = req.params.id;
  if(id){
    await dataStore.updateNoteById(id, note);
  }else{
    await dataStore.insertNote(note);
  }
  res.redirect('/');
}