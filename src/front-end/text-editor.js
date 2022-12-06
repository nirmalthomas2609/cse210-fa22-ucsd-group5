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

	reset() {
		// creates an empty text window
		this.textEditorContainer.classList.add('hidden');
		this.textEditorContainer.classList.remove('not-saved');
		this.tweetId = null;
		this.topicId = null;
		this.title.innerHTML = '';
		this.textEditor.value = '';
	}

	isRunning() {
		// returns boolean value if unsaved changes in text editor
		return this._isUnSaved();
	}

	start(title, content, tweetId, topicId) {
		// creates an empty text editor upon new note creation
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
	close() {
		// closes the actively opened text editor
		// returns the saved object upon closing
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

	_save() {
		// sets a note as saved
		this._setSavedStatus(true);
	}

	_setSavedStatus(isSaved) {
		// update the button based on save status
		if(isSaved) {
			this.textEditorContainer.classList.remove('not-saved');
		} else  {
			this.textEditorContainer.classList.add('not-saved');
		}
	}
	
	_isUnSaved() {
		// returns True if note is unsaved
		return this.textEditorContainer.classList.contains('not-saved');
	}

	setTitle(title) {
		// sets title of a note
		this.title.innerHTML = title;
	}

	getTitle() {
		// gets title of a note
		return this.title.innerHTML;
	}


}

export {TextEditor}