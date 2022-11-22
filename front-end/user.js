class User extends AbstractUserMenu {
    constructor(name, container) {
        super();
        this.name = name;
        this.container = container;
        this.tweets = [];
        this.topics = {};
        this.db = db;
        this.contentManager = new ContentManagemnt(this.db);

        this.htmlElements = [];
        
        this.createUserScreen();
        this.notes = [];
        this.folders = [];
        this.chksPressed = 0;
    }

    createUserScreen() {
        let labelDiv = document.createElement('div');
        labelDiv.classList.add(USER_ITEM_CLASS, TITLE_CLASS);
        labelDiv.innerHTML = `Welcome ${this.name}!`;
        this.container.appendChild(labelDiv);
        this.htmlElements.push(labelDiv);
        
        // // New Note
        // this.newNoteBtn = document.createElement('button');
        // this.newNoteBtn.classList.add(USER_ITEM_CLASS, SUB_ITEM_CLASS);
        // this.newNoteBtn.innerHTML ="New Note";
        // this.container.appendChild(this.newNoteBtn);
        // this.htmlElements.push(this.newNoteBtn);
        // this.newNoteBtn.onclick = () => {
        //     if(!this.topics.hasOwnProperty('General')) {
        //         this.topics['General'] = new TopicFactory(
        //             'General',
        //             db,
        //             this.container
        //         );
        //         this.topics['General'].newTweet('My First Tweet!');
        //     } else {
        //         this.topics['General'].newTweet('Another Tweet!');
        //     }
        //     this.topics['General']._toggleSubItems();
        // }
                
        // new topic
        this.newFolderBtn = document.createElement('button');
        this.newFolderBtn.innerHTML = 'New Folder';
        this.newFolderBtn.classList.add(USER_ITEM_CLASS, SUB_ITEM_CLASS)
        this.container.appendChild(this.newFolderBtn);
        this.htmlElements.push(this.newFolderBtn);
        let topics = 1;
        this.newFolderBtn.onclick = () => {
            this.topics[`New Topic ${topics}`](new TopicFactory(
                `New Topic ${topics}`,
                db,
                this.container)
            );
            topics+=1;
        }
        this.readTweetsPerTopic("General");
        console.log(this.tweets);

        this.topics['General'] = new TopicFactory(
            'General',
            db,
            this.container
        );
        this.htmlElements.push(...this.topics['General'].getHTMLElements());
        this._toggleSubItems();
    }

    readTopics() {
        this.topics = this.contentManager.getAllTopics(this.htmlElements.push);
        console.log(topics);
    }

    readTweetsPerTopic(topic_id){
        console.log(this.htmlElements);

        this.tweets= this.contentManager.getTweetsByTopicId(topic_id, this.displayTweetsByTopics)
    }

    displayTweetsByTopics(topicList){
//        console.log(this.htmlElements);
        console.log(this.name);
        this.htmlElements.push(topicList.data.getHTMLElements())
    }
}