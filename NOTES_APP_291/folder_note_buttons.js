// Function for folder creation
function folder_button() {
    var button = document.createElement("folder_button");
    button.innerHTML = "New Folder      📁";

    var body = document.getElementsByTagName("body")[0];
    body.appendChild(button);


    button.addEventListener ("click", function() {
    alert("Folder Created");
});
}

// Function for note creation
function note_button() {
    var button = document.createElement("note_button");
    button.innerHTML = "New Note        📝";

    var body = document.getElementsByTagName("body")[0];
    body.appendChild(button);


    button.addEventListener ("click", function() {
    alert("Note Created");
});
}

// Calling note creation function
note_button();
// calling folder creation function
folder_button();