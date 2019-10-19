const Note = require("../data/note");
const dataStore = require("../data/dataStore");
const sortController = require("./sortController");
const filterController = require("./filterController");

module.exports.renderOverviewScreen = async function(req, res, next) {
  let notes = await dataStore.getNotes();
  notes = filterController.filterNotes(req, notes);
  sortController.sortNotes(req, notes);

  res.render("index", {
    title: "NotesPro",
    theme: req.session.theme,
    sortBy: req.session.sortBy,
    order: req.session.order === "ascending" ? "descending" : "ascending",
    showFinished: req.session.showFinished,
    notes: notes
  });
};

module.exports.renderCreateNoteScreen = function(req, res, next) {
  res.render("createAndEdit", {
    title: "Create Note",
    theme: req.session.theme,
    note: new Note(),
    isCreate: true
  });
};

module.exports.renderEditNoteScreen = async function(req, res, next) {
  const note = await dataStore.getNoteById(req.params.id);
  if (note) {
    res.render("createAndEdit", { 
      title: "Edit Note",
      theme: req.session.theme,
      note: note, 
      isCreate: false 
    });
  } else {
    next();
  }
};

module.exports.saveChanges = async function(req, res, next) {
  let note = new Note();
  note.title = req.body.title;
  note.description = req.body.description;
  note.dueDate = req.body.dueDate;
  note.importance = req.body.importance;
  note.finished = req.body.finished ? true : false;
  note.created = Date.now();
  const id = req.params.id;
  if (id) {
    await dataStore.updateNoteById(id, note);
  } else {
    await dataStore.insertNote(note);
  }
  res.redirect("/");
};
