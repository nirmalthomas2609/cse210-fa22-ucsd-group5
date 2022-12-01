let DEFAULT_TOPIC = 'General';
let TOPIC_ID = 1;
class TopicFactory {
    constructor(title, topicid=null) {
        this.title = title;
    	this.topicid = topicid;
        this.container = null;
        this.tweetContainer = document.getElementById('tweet-items');
        this.currentTweet = null;
        this.textEditor = new TextEditor();
        this.textEditor.registerObserver(this);
	}

    setContainer(htmlElement) {
        this.container = htmlElement;
    }

    isActive() {
        return this.container.classList.contains('topic-item-selected');
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
        let container = createMenuItem({id: id, name: title}, {
            selectCallback: (id) => {this.launchTextEditor(id);},
            renameCallback: (id, title) => {
                updateTweet(id, title, '', this.topicid, () => {});
                this.textEditor.setTitle(title);
            },
            deleteCallback: (id) => {
                deleteTweet(id, () => {});
                if(id===this.currentTweet) {
                    this.closeTextEditor();
                }
            }},
            true
        );
        this.tweetContainer.appendChild(container);
    }

    deactivate() {
        this.container.classList.remove('topic-item-selected');
        while (this.tweetContainer.firstChild) {
            this.tweetContainer.removeChild(this.tweetContainer.firstChild);
        }
        this.closeTextEditor();
    }

    _textEditorUpdate(tweetData) {
        updateTweet(tweetData.id, tweetData.title, tweetData.content, this.topicid, console.log)
        if(this.isActive()) {
            setMenuItemName(tweetData.id, tweetData.title);
        }
    }


    newTweet() {
        let tweetTitle = 'Untitled';
        createTweet('', tweetTitle, this.topicid, (tweet) => {
            this.createTweetItem(tweetTitle, tweet.data.id);
            this.launchTextEditor(tweet.data.id);
        });
    }

    launchTextEditor(tweetId) {
        this.currentTweet = tweetId;
        for(let tweet of document.getElementsByClassName('tweet-item-selected')) {
            tweet.classList.remove('tweet-item-selected');
        }
        let tweet = document.getElementById(tweetId);
        tweet.classList.add('tweet-item-selected');
        getTweetsByTopicId(this.topicid, (tweetList) => {
            if (tweetList.status === OK_STATUS) {
                for(let tweet of tweetList.data) {
                    if (tweet.tweetId === tweetId) {
                        this.textEditor.start(tweet.tweetTitle, tweet.textContent, tweet.tweetId)
                    }
                }
            }
        })
    }

    closeTextEditor() {
        this.currentTweet=null;
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