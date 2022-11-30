class User extends AbstractUserMenu {
    constructor(topicContainer) {
        super();
        this.topicContainer = document.getElementById('topics');
        this.contextMenu = document.getElementById('context-menu')
        this.topicIDNum = 1;
        this.topics = {};
        
        this.currentTopic = DEFAULT_TOPIC;
        this.newFolderBtn = document.getElementById('new-topic');
        this.newTweetBtn = document.getElementById('new-note');       
        this.newFolderBtn.onclick = () => {
            this.createTopic(`New Topic ${this.topicIDNum}`, true);
            this.topicIDNum += 1;
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
            if(!topicEvent.topicsList.includes(DEFAULT_TOPIC)) {
                this.createTopic(DEFAULT_TOPIC, true);
            }
            for(let topic of topicEvent.topicsList) {
                this.createTopic(topic);
            }
            this.activateTopic(DEFAULT_TOPIC);
            this.newTweetBtn.onclick = () => {
                this.topics[this.currentTopic].newTweet();
            }
        });

    }

    createTopic(topic, isNewTopic = false) {
        let topicItem = document.createElement('div');
        topicItem.innerHTML = topic;
        topicItem.classList.add('topic-item', 'base-font')
        topicItem.onmouseover = () => {
            topicItem.dataset.active = true;
        }
        topicItem.onmouseout = () => {
            topicItem.dataset.active = false;
        }
        // topicItem.addEventListener('contextmenu', (event) => {
        //     event.preventDefault();

        //     const {clientX: mouseX, clientY: mouseY} = event;

        //     this.contextMenu.style.top = `${mouseY}px`;
        //     this.contextMenu.style.left = `${mouseX}px`;

        //     this.contextMenu.classList.remove('hidden');
        // });

        this.topics[topic] = new TopicFactory(topic, topicItem, isNewTopic);

        topicItem.onclick = () => {
            this.activateTopic(topic);
        }
        this.topicContainer.appendChild(topicItem);
    }
}