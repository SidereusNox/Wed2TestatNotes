const handlebars = require('hbs')
const Note = require('../data/note');
const dataStore = require('../data/dataStore');

handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

function writeCookies(res, sortBy, inverseSort){
  res.cookie("sortBy", sortBy);
  res.cookie("sortInverse", inverseSort);
}

function stringToBool(bool) {
  if (bool === "true") {
    return true;
  } else {
    return false;
  }
}

function compare(first, second, inverse){
  let result;
  if(first > second){
    result = 1;
  } else if (first < second){
    result = -1;
  } else {
    result =  0;
  }
  if(inverse){
    result *= -1;
  }
  return result;
}

module.exports.renderOverviewScreen = async function (req, res, next){
  const notes = await dataStore.getNotes();
  let sortBy = req.cookies.sortBy;
  let sortInverse = stringToBool(req.cookies.sortInverse);
  if(sortBy === undefined || sortInverse === undefined){
    sortBy = "finishDate";
    sortInverse = false;
    writeCookies(res, sortBy, sortInverse);
  }
  notes.sort((first, second) =>{
    switch(sortBy){
      case "createdDate":
        return compare(first.created, second.created, sortInverse);
      case "finishDate":
        return compare(first.dueDate, second.dueDate, sortInverse);
      case "importance":
        return compare(first.importance, second.importance, sortInverse);
    }
  })
  res.render('index', {
    title: "NotesPro",
    sortedBy: sortBy,
    notes: notes
  });
}

module.exports.sortByCreateDate  = function (req, res, next){
  if(req.cookies.sortBy === "createdDate"){
    writeCookies(res, "createdDate", !stringToBool(req.cookies.sortInverse));
  } else {
    writeCookies(res, "createdDate", false);
  }
  res.redirect('/');
}

module.exports.sortByFinishDate  = function (req, res, next){
  if(req.cookies.sortBy === "finishDate"){
    writeCookies(res, "finishDate", !stringToBool(req.cookies.sortInverse));
  } else {
    writeCookies(res, "finishDate", false);
  }
  res.redirect('/');
}

module.exports.sortByImportance  = function (req, res, next){
  if(req.cookies.sortBy === "importance"){
    writeCookies(res, "importance", !stringToBool(req.cookies.sortInverse));
  } else {
    writeCookies(res, "importance", false);
  }
  res.redirect('/');
}

module.exports.renderCreateNoteScreen = function (req, res, next){
  res.render('createAndEdit', new Note())
}

module.exports.renderModifyNoteScreen = function(req, res, next){

}
