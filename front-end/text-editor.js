class TextEditor extends AbstractObserverPattern {
	constructor(userContainer) {
		super('_textEditorUpdate');
		this.userContainer = userContainer;
        this.textEditorContainer = document.getElementById('text-editor-container');
        this.saveButton = document.getElementById('save-button');
        this.textEditor = document.getElementById('text-editor');
        this.saveContainer = document.getElementById('save-container');
        this.saveInput = document.getElementById('save-input');
	}

	start(newTweet=true, content='') {
		this.userContainer.classList.add('hidden');
		this.textEditor.value = content;
		this.textEditorContainer.classList.remove('hidden');
		this.saveButton.onclick = () => {
        	if(newTweet) {
	        	this.saveContainer.classList.remove('hidden');
	        	this.saveInput.onkeyup = (e) => {
	  	          	if(e.key === 'Enter') {
			        	this.saveContainer.classList.add('hidden');
		        		this.notify({
		        			title: this.saveInput.value,
		        			content: this.textEditor.value,
		        			newTweet: true
		        		});
						this.userContainer.classList.remove('hidden');
		        		this.saveInput.value = '';
        				this.close();
	  	          	}
  	          	}
        	} else {
				this.userContainer.classList.remove('hidden');
	        	this.close();
        	}
        }
	}

	close() {
		this.textEditor.value = '';
		this.textEditorContainer.classList.add('hidden');
	}

}