const dataStore = require('../data/dataStore');

dataStore.insertNote({
    Title: "Some Title",
    Description: "I need to do something with my shoes",
    Importance: 3,
    DueDate: new Date(2001, 8, 17, 0, 0, 0, 0)
})