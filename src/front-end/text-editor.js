import { AbstractObserverPattern } from "./abstract-observer";

class TextEditor extends AbstractObserverPattern {
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
		this.textEditorContainer.classList.add('hidden');
		this.textEditorContainer.classList.remove('not-saved');
		this.tweetId = null;
		this.topicId = null;
		this.title.innerHTML = '';
		this.textEditor.value = '';
	}

	isRunning() {
		return this._isUnSaved();
	}

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

	getSaveObj() {
		let savedObj = {
			tweetId: this.tweetId,
			topicId: this.topicId,
			title: this.title.innerHTML,
			content: this.textEditor.value
		}
		return savedObj;
	}
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

	_save() {
		this._setSavedStatus(true);
	}

	_setSavedStatus(isSaved) {
		if(isSaved) {
			this.textEditorContainer.classList.remove('not-saved');
		} else  {
			this.textEditorContainer.classList.add('not-saved');
		}
	}
	
	_isUnSaved() {
		return this.textEditorContainer.classList.contains('not-saved');
	}

	setTitle(title) {
		this.title.innerHTML = title;
	}

	getTitle() {
		return this.title.innerHTML;
	}


}

export {TextEditor}