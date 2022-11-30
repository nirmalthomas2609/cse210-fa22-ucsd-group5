let DEFAULT_TOPIC = 'General';
let TOPIC_ID = 1;
class TopicFactory {
    constructor(title, container, newTopic=false) {
        this.title = title;
    	this.topicid = title;
        this.container = container;
        this.tweetContainer = document.getElementById('tweet-items');
        if(newTopic) {
            this.initializeDB();
        }
        this.currentTweet = null;
        this.textEditor = new TextEditor();
        this.textEditor.registerObserver(this);
	}

    activate() {
        this.container.classList.add('topic-item-selected');
        getTweetsByTopicId(this.topicid, (tweetList) => {
            if (tweetList.status === OK_STATUS) {
                for(let tweet of tweetList.data) {
                    this.createTweetItem(tweet.tweetTitle, tweet.tweetId);
                }
            }
            if (tweetList.data.length > 0) {
                this.launchTextEditor(tweetList.data[0].tweetId);
            }
        });
    }

    createTweetItem(title, id) {
        let container = document.createElement('div');
        container.innerHTML = title;
        container.id = id;
        container.classList.add('tweet-item');
        container.onmouseover = () => {
            container.dataset.active = true;
        }
        container.onmouseout = () => {
            container.dataset.active = false;
        }
        container.onclick = () => {
            this.launchTextEditor(container.id);
        }
        this.tweetContainer.appendChild(container);
    }

    deactivate() {
        this.container.classList.remove('topic-item-selected');
        while (this.tweetContainer.firstChild) {
            this.tweetContainer.removeChild(this.tweetContainer.firstChild);
        }
    }

    _tweetClickEvent(tweetData) {
        this.textEditor.start(false, tweetData.content);
    }
    
    _textEditorUpdate(tweetData) {
        console.log(tweetData)
        updateTweet(tweetData.id, tweetData.title, tweetData.content, this.topicid, console.log)
    }

	initializeHTML() {
        // Edit Topic Name Button
        this.updateTopicNameButton = document.createElement('div');
        this.updateTopicNameButton.innerHTML = 'Edit Topic Name';
        this.updateTopicNameButton.classList.add(USER_ITEM_CLASS, SUB_ITEM_CLASS)
        this.topicContainer.appendChild(this.updateTopicNameButton);
        this.updateTopicNameButton.onclick = () => {
            this.promptNewTopicName()
        }
	}

    promptNewTopicName() {
        let text;
        let newTopicId = prompt("New name for topic");
        console.log(this.topicid)
        this.contentManager.updateTopic(this.topicid, newTopicId);
        this.topicid = newTopicId;
          
    }

    newTweet() {
        let tweetTitle = 'Untitled';
        createTweet('', tweetTitle, this.topicid, (tweet) => {
            this.createTweetItem(tweetTitle, tweet.data.tweetId);
            this.launchTextEditor();
        });
    }

    launchTextEditor(tweetId) {
        for(let tweet of document.getElementsByClassName('tweet-item-selected')) {
            tweet.classList.remove('tweet-item-selected');
        }
        let tweet = document.getElementById(tweetId);
        tweet.classList.add('tweet-item-selected');
        getTweetsByTopicId(this.topicid, (tweetList) => {
            if (tweetList.status === OK_STATUS) {
                for(let tweet of tweetList.data) {
                    if (tweet.tweetId === tweetId) {
                        console.log(tweet)
                        this.textEditor.start(tweet.tweetTitle, tweet.textContent, tweet.tweetId)
                        console.log(`launch tweet${tweet.tweetId}`)
                    }
                }
            }
        })
    }

	initializeDB() {
        createTopic(this.title, (topicObj) => {
            this.topicid = topicObj.topicid;
        });
    }
}