class User {
    constructor() {
        this.topicContainer = document.getElementById('topics');
        this.topics = {};
        
        this.currentTopic = null;
        this.newFolderBtn = document.getElementById('new-topic');
        this.newFolderBtn.onclick = () => {
            this.createTopic({name: `Untitled`});
        }
        
        this.newTweetBtn = document.getElementById('new-note'); 
        this.newTweetBtn.onclick = () => {
            this.topics[this.currentTopic].newTweet();
        }      

        getAllTopics((topicEvent) => {
            if(!topicEvent.topicsList.length > 0) {
                this.createTopic({name: DEFAULT_TOPIC}, true);
            } else {
                for(let i = 0; i < topicEvent.topicsList.length; i++) {
                    let topic = topicEvent.topicsList[i];
                    let setAsActive = i == 0;
                    this.createTopic(topic, setAsActive);
                }
            }
        });
    }

    activateTopic(topic) {
        this.topics[this.currentTopic].deactivate();
        this.currentTopic = topic;
        this.topics[this.currentTopic].activate();
    }

    createTopic(topic, setAsActive=false) {
        let topicFactory = new TopicFactory(topic.name, topic.id)
        topicFactory.initialize((topicObj) => {
            let topicItem = createMenuItem(topicObj, {
                selectCallback: (id) => {this.activateTopic(id)},
                renameCallback: (id, title) => {updateTopic(id, title, console.log);},
                deleteCallback: (id) => {
                    deleteTopic(id, () => {
                        if (id === this.currentTopic) {
                            this.currentTopic = Object.keys(this.topics)[0];
                            this.activateTopic(this.currentTopic);
                        }
                    })},
                dragCallback: (id) => {
                    console.log(id);
                }     
            });
            topicFactory.setContainer(topicItem);

            this.topics[topicObj.id] = topicFactory;
            if(setAsActive) {
                this.currentTopic = topicObj.id;
                this.activateTopic(topicObj.id);
            }
            this.topicContainer.appendChild(topicItem);
        });
    }
}