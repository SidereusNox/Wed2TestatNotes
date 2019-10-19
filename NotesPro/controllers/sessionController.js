function isValidTheme(theme) {
  return theme === "light" || theme === "dark";
}

function updateTheme(req) {
  let theme;
  if (isValidTheme(req.query.theme)) {
    theme = req.query.theme;
    req.session.theme = req.query.theme;
  } else {
    theme = req.session.theme;
  }
  if (!isValidTheme(theme)) {
    req.session.sortBy = "light";
  }
}

function isValidSortBy(sortBy) {
  return sortBy === "created" || sortBy === "finish" || sortBy === "importance";
}

function isValidOrder(order) {
  return order === "ascending" || order === "descending";
}

function updateSort(req) {
  let sortBy;
  let order;
  if (isValidSortBy(req.query.sortBy)) {
    sortBy = req.query.sortBy;
    req.session.sortBy = req.query.sortBy;
  } else {
    sortBy = req.session.sortBy;
  }
  if (isValidOrder(req.query.order)) {
    order = req.query.order;
    req.session.order = req.query.order;
  } else {
    order = req.session.order;
  }
  if (!isValidSortBy(sortBy)) {
    req.session.sortBy = "finish";
  }
  if (!isValidOrder(order)) {
    req.session.order = "ascending";
  }
}

function isValidShowFinished(showFinished){
  return showFinished === "true" || showFinished === "false";
}

function updateFilter(req){
  let showFinished;
  if(isValidShowFinished(req.query.showFinished)){
    showFinished = req.query.showFinished ==="true"?true:false;
    req.session.showFinished = showFinished;
  } else {
    showFinished = req.session.showFinished;
  }
  if(showFinished!==true&&showFinished!==false){
    req.session.showFinished = false;
  }
}

module.exports.updateSession = function(req, res, next) {
  updateTheme(req);
  updateSort(req);
  updateFilter(req);
  next();
};
