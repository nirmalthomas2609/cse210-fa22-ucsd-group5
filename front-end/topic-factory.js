let TOPIC_ID = 0;
class TopicFactory {
    constructor(title, db, container, topicid=null) {
    	this.tweets = [];
    	this.topicid = topicid ? topicid : TOPIC_ID++;
    	this.container = container;

    	this.initializeHTML();
    	this.initializeDB();
	}

	initializeHTML() {
		// add folder to folder object
       // create folder container
        this.folderContainer = document.createElement('div');

        this.topic = document.createElement('div');
        this.folderContainer.append(this.topic);
        this.topic.style = 'display: flex; flex-direction: row;'

        this.title = document.createElement('h1');
        this.title.innerHTML = `new_folder`;

        this.renameTxt = document.createElement('input');
        this.renameTxt.classList.add('hidden');

                
        this.newTweetBtn = document.createElement('button');
        this.newTweetBtn.innerHTML ="New Note        📝";

        // add it to our panel
        this.topic.append(this.title);
        this.topic.append(this.renameTxt);
        this.topic.append(this.newTweetBtn);
        this.notesDiv = document.createElement('div');

        this.folderContainer.append(this.notesDiv);
        this.container.append(this.folderContainer);
	}

	initializeDB() {
		// double click to change folder name
        this.title.ondblclick = (e) => {
            this.title.classList.add('hidden');
            this.renameTxt.classList.remove('hidden');
            this.renameTxt.focus();
        }
        this.renameTxt.addEventListener('focusout', () => {
            if (this.renameTxt.value){
                this.title.innerHTML = this.renameTxt.value;
            }
            this.title.classList.remove('hidden');
            this.renameTxt.classList.add('hidden');
            this.renameTxt.value = '';
            console.log(this.renameTxt)

            // add code to rename topic in database here 
        });
        this.newTweetBtn.onclick = () => {
        	this.tweets.push(new TweetFactory(
                'place_holder_id',
                db,
                this.notesDiv)
            );
            // add tweet to db
        }

	}
}