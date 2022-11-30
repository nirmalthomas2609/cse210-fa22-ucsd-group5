function launchUser() {
    console.log("Inside launch user");

    // let userScreen = document.getElementById('user-div');
    let userScreen = document.getElementById('topics');

    // else create class new user
    user = new User(userScreen, db);
    let userItems = user.getHTMLElements();
}

(function app() {
    setupDB("note-taker", launchUser)
})();