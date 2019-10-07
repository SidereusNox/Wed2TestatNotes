const dataStore = require("../data/dataStore");

function areNotesEqual(firstNote, secondNote) {
  return (
    firstNote.Title === secondNote.Title &&
    firstNote.Description === secondNote.Description &&
    firstNote.Importance === secondNote.Importance &&
    firstNote.Date === secondNote.Date &&
    firstNote.Finished === secondNote.Finished &&
    firstNote.Deleted === secondNote.Deleted
  );
}

async function insertNotes(amount) {
  let insertedNotes = [];
  for (i = 1; i < amount + 1; i++) {
    const note = {
      Title: "Title Note " + i,
      Description: "Description " + i,
      Importance: (i % 5) + 1,
      DueDate: new Date(2000 + i, (i % 12) + 1, (i % 28) + 1, 0, 0, 0, 0),
      Finished: false,
      Deleted: false
    };
    const noteModel = await dataStore.insertNote(note);
    note._id = noteModel._id;
    insertedNotes.push(note);
  }
  return insertedNotes;
}

function writeError(testName, message) {
  console.log(testName + " failed! Message: " + message);
}

async function clearDataBase() {
  await dataStore.database.remove({}, { multi: true });
}

/////////////////////////////////////////////TESTS//////////////////////////////////////
//InsertTest
(async function () {
  async function InsertTest() {
    await clearDataBase();
    const notes = await insertNotes(1);
    loadedNote = await dataStore.database.findOne(notes[0]);

    if (!areNotesEqual(notes[0], loadedNote)) {
      writeError(
        "InsertTest",
        "Saved and loaded Note are not equal!"
      );
    }
    const allNotes = await dataStore.getNotes();
    if (allNotes.length != 1) {
      writeError(
        "InsertTest",
        "Database has not exactly 1 note! Count: " + allNotes.length
      );
    }
  }
  await InsertTest();

  //GetByIdTest
  async function GetByIdTest(){
    await clearDataBase();
    const notes = await insertNotes(1);
    
    const loadedNote = await dataStore.getNoteById(notes[0]._id);

    if(!areNotesEqual(notes[0], loadedNote)){
      writeError(
        "GetByIdTest",
        "The note loaded was does not equal the note that was inserted!"
      );
    }
  }
  await GetByIdTest();

  //ModyfyTest
  async function ModifyTest() {
    await clearDataBase();
    const notes = await insertNotes(1);
    notes[0].Description = "Changed description!";
    notes[0].Finished = true;

    await dataStore.updateNoteById(notes[0]._id, notes[0]);

    const loadedNote = await dataStore.getNoteById(notes[0]._id);
    if (!areNotesEqual(notes[0], loadedNote)) {
      writeError(
        "ModifyTest",
        "Modified and loaded Note are not equal!"
      );
    }
    const allNotes = await dataStore.getNotes();
    if (allNotes.length != 1) {
      writeError(
        "ModifyTest",
        "Database has not exactly 1 note! Count: " + allNotes.length
      );
    }
  }
  await ModifyTest();

  //GetNotesTest
  async function GetNotesTest(){
    await clearDataBase();
    let insertedNotes = await insertNotes(10);
    let loadedNotes = await dataStore.getNotes();
    if(insertedNotes.length != loadedNotes.length){
      writeError(
        "GetNotesTest",
        "Length of loadedNotes array not the same as length of insertedNote array: inserted: " + insertedNotes.length + " loaded: " + loadedNotes.length
      );
    }

    for(let i = 0 ; i < insertedNotes.length ; i++){
      const foundNotes = loadedNotes.filter(note => note._id === insertedNotes[i]._id);
      if(foundNotes.length != 1){
        writeError(
          "GetNotesTest",
          "More then one or no loaded note with the same _id as the inserted Note!"
        )
      }
      if(!areNotesEqual(insertedNotes[i], foundNotes[0])){
        writeError(
          "GetNotesTest",
          "loaded note at index " + i + "is not equal to inserted note."
        );
      }
    }
  }
  await GetNotesTest();

  console.log('Tests finished!');
})();