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

        this.readTopics();
    }

    activateTopic(topic) {
        this.topics[this.currentTopic].deactivate();
        this.currentTopic = topic;
        this.topics[this.currentTopic].activate();
    }

    readTopics() {
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

    createTopic(topic, setAsActive=false) {
        let topicItem = document.createElement('div');
        topicItem.classList.add('topic-item', 'base-font')
        let topicFactory = new TopicFactory(topic.name, topicItem, topic.id)
        topicFactory.initialize((topicObj) => {
            topicItem.id = topicObj.id;
            topicItem.innerHTML = topicObj.name;
            this.topics[topicObj.id] = topicFactory;
            addMenuItemEvents(
                topicItem,
                () => {this.activateTopic(topicObj.id);},
                (newName) => {
                    console.log(newName)
                    updateTopic(topicObj.id, newName, () => {
                        topicItem.innerHTML = newName;
                    });
                },
                () => {
                    console.log('delete topic')
                }
            )
            if(setAsActive) {
                this.currentTopic = topicObj.id;
                this.activateTopic(topicObj.id);
            }
        });

        this.topicContainer.appendChild(topicItem);
    }
}