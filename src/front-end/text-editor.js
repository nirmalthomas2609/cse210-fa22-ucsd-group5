import { AbstractObserverPattern } from "./abstract-observer";

class TextEditor extends AbstractObserverPattern {
	// Class TextEditor is the interface for editing a note

	// TextEditor constructor does not depend on any objects
	constructor() {
		super('_textEditorUpdate');
        this.textEditorContainer = document.getElementById('text-editor-container');
		this.textEditorContainer.classList.add('hidden');
		this.title = document.getElementById('tweet-title');
        this.saveButton = document.getElementById('save-button');
        this.textEditor = document.getElementById('text-editor');
		
		this.title.oninput = () => {
			this._setSavedStatus(false);
		}
		this.textEditor.oninput = () => {
			this._setSavedStatus(false);
		}
		this.tweetId = null;
		this.topicId = null;
	}

    // Function: reset
    //
    // Creates an empty text window
    //
    // Parameters:
    //
    //  None
    // 
    //  Returns:
    //
    //      Nothing
	reset() {
		this.textEditorContainer.classList.add('hidden');
		this.textEditorContainer.classList.remove('not-saved');
		this.tweetId = null;
		this.topicId = null;
		this.title.innerHTML = '';
		this.textEditor.value = '';
	}

	// Function: isRunning
    //
    // Indicator for whether text editor is actively running
    //
    // Parameters:
    //
    //  None
    // 
    //  Returns:
    //
    //      A boolean value indicating whether there are unsaved changes

	isRunning() {
		// returns boolean value if unsaved changes in text editor
		return this._isUnSaved();
	}

	
	// Function: start
    //
    // Creates an empty text editor upon new note creation
    //
    // Parameters:
    //
    //  title - title/name of text editor
	//	content - content to fill the text editor with
	//	tweetId - id of the tweet currently in the editor
	// 	topicId -  topic id of the tweet currently in the editor
    // 
    //  Returns:
    //
    //      None
	start(title, content, tweetId, topicId) {
		if(this.isRunning()) {
			throw new Error('cannot text editor while it is running');
		}		
		this.textEditorContainer.classList.remove('hidden');
		this.tweetId = tweetId;
		this.topicId = topicId;
		this.setTitle(title);
		this.textEditor.value = content;
		this.textEditor.focus();
		this.textEditor.selectionEnd = 0;
		
		this.saveButton.onclick = () => {
			this._save();
		}
	}

	// Function: getSaveObj
    //
    // get method for the saved tweet in the text editor
    //
    // Parameters:
    //
    //  None
    // 
    //  Returns:
    //
    //      The object of the saved text editor, with attributes tweetId, topicId, title, and content
	getSaveObj() {
		// return the saved note object
		let savedObj = {
			tweetId: this.tweetId,
			topicId: this.topicId,
			title: this.title.innerHTML,
			content: this.textEditor.value
		}
		return savedObj;
	}

	// Function: close
    //
    // Closes the actively opened text editor
    //
    // Parameters:
    //
	//		None
    // 
    //  Returns:
    //
    //      The saved text editor upon closing it
	close() {
		
		this.textEditorContainer.classList.add('hidden');
		if(!this._isUnSaved()) {
			return null;
		}

		this._setSavedStatus(true);
		let savedObj = this.getSaveObj();
		if(!confirm(`Save changes to tweet .\nYour changes will be lost if you don't save them.`)) {
			savedObj = null;
		} 
		this.tweetId = null;
		this.topicId = null;
		this.title.innerHTML = '';
		this.textEditor.value = '';
		return savedObj;
	}

	// Function: _save
    //
    // Sets saved status as true
    //
    // Parameters:
    //
    //  None
    // 
    //  Returns:
    //
    //      None

	_save() {
		// sets a note as saved
		this._setSavedStatus(true);
	}

	// Function: _setSavedStatus
    //
    // Creates an empty text editor upon new note creation
    //
    // Parameters:
    //
    //  isSaved   - boolean value to indicate whether tweet is saved
    // 
    //  Returns:
    //
    //      None
	_setSavedStatus(isSaved) {
		// update the button based on save status
		if(isSaved) {
			this.textEditorContainer.classList.remove('not-saved');
		} else  {
			this.textEditorContainer.classList.add('not-saved');
		}
	}
	
	// Function: _isUnSaved
    //
    // Indicator for if tweet is unsaved
    //
    // Parameters:
    //
    // 		None
    // 
    //  Returns:
    //
    //      True if the tweet is unsaved, returns false if it is saved
	_isUnSaved() {
		// returns True if note is unsaved
		return this.textEditorContainer.classList.contains('not-saved');
	}

	// Function: setTitle
    //
    // Sets the title of the text editor
    //
    // Parameters:
    //
    //  title - title/name of text editor
    // 
    //  Returns:
    //
    //      None

	setTitle(title) {
		this.title.innerHTML = title;
	}


	// Function: getTitle
    //
    // Gets the title of a tweet in the text editor
    //
    // Parameters:
    //
    //  None
    // 
    //  Returns:
    //
    //      the title of the tweet in the text editor
	getTitle() {
		return this.title.innerHTML;
	}


}

export {TextEditor}