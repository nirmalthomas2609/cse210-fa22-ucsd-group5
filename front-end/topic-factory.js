let DEFAULT_TOPIC = 'General';
let TOPIC_ID = 1;
class TopicFactory {
    constructor(title, container, topicid=null) {
        this.title = title;
    	this.topicid = topicid;
        this.container = container;
        this.tweetContainer = document.getElementById('tweet-items');
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
        container.draggable = true;
        addMenuItemEvents(
            container,
            () => {this.launchTextEditor(container.id);},
            (newName) => {
                updateTweet(id, newName, '', this.topicid, () => {});
                document.getElementById(id).innerHTML = newName;
            },
            () => {
                deleteTweet(id, () => {});
                document.getElementById(id).remove();
            }
        )
        this.tweetContainer.appendChild(container);
    }

    deactivate() {
        this.container.classList.remove('topic-item-selected');
        while (this.tweetContainer.firstChild) {
            this.tweetContainer.removeChild(this.tweetContainer.firstChild);
        }
    }

    _textEditorUpdate(tweetData) {
        updateTweet(tweetData.id, tweetData.title, tweetData.content, this.topicid, console.log)
        document.getElementById(tweetData.id).innerHTML = tweetData.title;
    }


    newTweet() {
        let tweetTitle = 'Untitled';
        createTweet('', tweetTitle, this.topicid, (tweet) => {
            this.createTweetItem(tweetTitle, tweet.data.id);
            this.launchTextEditor(tweet.data.id);
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
                        this.currentTweet = tweet.tweetId;
                        this.textEditor.start(tweet.tweetTitle, tweet.textContent, tweet.tweetId)
                    }
                }
            }
        })
    }

    closeTextEditor() {
        this.textEditor.end();
    }

	initialize(callback) {
        if(!this.topicid) {
            createTopic(this.title, (topicObj) => {
                this.topicid = topicObj.data.id;
                callback({id: this.topicid, name: this.title})
            });
        } else {
            callback({id: this.topicid, name: this.title})
        }
    }
}