function compareNotes(first, second, order) {
  let result;
  if (first > second) {
    result = 1;
  } else if (first < second) {
    result = -1;
  } else {
    result = 0;
  }
  if (order === "descending") {
    result *= -1;
  }
  return result;
}

function sort(notes, sortBy, order) {
  if (!sortBy) {
    sortBy = "finish";
  }
  notes.sort((first, second) => {
    switch (sortBy) {
      case "created":
        return compareNotes(first.created, second.created, order);
      case "finish":
        return compareNotes(first.dueDate, second.dueDate, order);
      case "importance":
        return compareNotes(first.importance, second.importance, order);
    }
  });
}

module.exports.sortNotes = function(req, notes) {
  sort(notes, req.session.sortBy, req.session.order);
};
