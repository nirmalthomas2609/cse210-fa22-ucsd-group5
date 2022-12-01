class TextEditor extends AbstractObserverPattern {
	constructor() {
		super('_textEditorUpdate');
        this.textEditorContainer = document.getElementById('text-editor-container');
		this.title = document.getElementById('tweet-title');
        this.saveButton = document.getElementById('save-button');
        this.textEditor = document.getElementById('text-editor');
		this.savedStatus = this.title.parentElement;
		
		this.title.oninput = () => {
			this._setSavedStatus(false);
		}
		this.textEditor.oninput = () => {
			this._setSavedStatus(false);
		}
		this.id =null;
	}

	start(title, content='', id) {
		// closes previous session
		this.end();
	
		this.textEditorContainer.classList.remove('hidden');
		this.id = id;
		this.setTitle(title);
		this.textEditor.value = content;
		this.textEditor.focus();
		this.textEditor.selectionEnd = 0;
		
		this.saveButton.onclick = () => {
			this._save();
		}
	}

	_save() {
		this._setSavedStatus(true);
		this.savedStatus.classList.remove('not-saved');
		this.notify({
			id: this.id,
			title: this.getTitle(),
			content: this.textEditor.value
		})
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

	end() {
		if(this._isUnSaved()) {
			if(confirm(`Save changes to tweet ${this.getTitle()}.\nYour changes will be lost if you don't save them.`)) {
				this._save();
			}
		}
		this.savedStatus.classList.remove('not-saved');
		this.title.innerHTML = '';
		this.textEditor.value = '';
		this.textEditorContainer.classList.add('hidden');
	}
}