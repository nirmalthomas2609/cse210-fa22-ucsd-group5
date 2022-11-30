class TextEditor extends AbstractObserverPattern {
	constructor(userContainer) {
		super('_textEditorUpdate');
        this.textEditorContainer = document.getElementById('text-editor-container');
		this.title = document.getElementById('tweet-title');
        this.saveButton = document.getElementById('save-button');
        this.textEditor = document.getElementById('text-editor');
	}

	start(title, content='', id) {
		this.textEditorContainer.classList.remove('hidden');
		this.title.value = title;
		this.textEditor.value = content;
		this.saveButton.onclick = () => {
			this.notify({
				id: id,
				title: this.title.value,
				content: this.textEditor.value
			});
		}
	}

	close() {
		this.textEditor.value = '';
		this.textEditorContainer.classList.add('hidden');
	}

}