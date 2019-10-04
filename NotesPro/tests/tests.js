const dataStore = require("../data/dataStore");

function areNotesEqual(firstNote, secondNote) {
  return (
    firstNote.Title === secondNote.Title &&
    firstNote.Description === secondNote.Description &&
    firstNote.Importance === secondNote.Importance &&
    firstNote.Date === secondNote.Date
  );
}

async function insertNotes(amount) {
  let allNotes = [];
  for (i = 1; i < amount + 1; i++) {
    const noteModel = await dataStore.insertNote({
      Title: "Title Note " + i,
      Description: "Description " + i,
      Importance: (i % 5) + 1,
      DueDate: new Date(2000 + i, (i % 12) + 1, (i % 28) + 1, 0, 0, 0, 0)
    });
    allNotes.push(noteModel);
  }
  return allNotes;
}

function writeError(testName, message) {
  console.log(testName + " failed! Message: " + message);
}

async function clearDataBase() {
  await dataStore.database.remove({}, { multi: true });
}

(async function () {
  async function InsertTest() {
    await clearDataBase();
    const notes = await insertNotes(1);
    loadedNote = await dataStore.findNoteById(notes[0]._id);

    if (!areNotesEqual(notes[0], loadedNote)) {
      writeError(
        "InsertTest",
        "Saved and loaded Note are not equal! \nSaved Note: " +
          notes[0] +
          "\nLoaded Note: " +
          loadedNote
      );
    }
    const allNotes = await dataStore.getNotesSortedByTitle();
    if (allNotes.length != 1) {
      writeError(
        "InsertTest",
        "Database has not exactly 1 note! Count: " + allNotes.length
      );
    }
  }
  await InsertTest();

  async function ModifyTest() {
    await clearDataBase();
    const notes = await insertNotes(1);
    notes[0].Description = "Changed description!";

    await dataStore.updateNoteById(notes[0]._id, notes[0]);

    const loadedNote = await dataStore.findNoteById(notes[0]._id);
    if (!areNotesEqual(notes[0], loadedNote)) {
      writeError(
        "ModifyTest",
        "Modified and loaded Note are not equal! \nSaved Note: " +
          notes[0] +
          "\nLoaded Note: " +
          loadedNote
      );
    }
    const allNotes = await dataStore.getNotesSortedByTitle();
    if (allNotes.length != 1) {
      writeError(
        "ModifyTest",
        "Database has not exactly 1 note! Count: " + allNotes.length
      );
    }
  }
  await ModifyTest();

  console.log('Tests finished!');
})();