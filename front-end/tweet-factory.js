let TWEET_ID = 0;

class TweetFactory {
    constructor(title, db, container, tweetid=null) {
        this.tweetid = (tweetid) ? tweetid : TWEET_ID++;
        this.container = container;
        
        this.initializeHTML();
        this.initializeDB();
    }

    initializeHTML() {
        // add new note
        // instantiate note object
        // add note object to user screen
        console.log('create note');
        this.tweet = document.createElement('div');
        this.tweet.style = 'display: flex; flex-direction: row;'

        let noteCheck = document.createElement('input');
        this.tweet.style = "background-color: aqua;"
        this.tweet.innerHTML = 'New tweet!'
        this.container.appendChild(this.tweet);
    }
    initializeDB() {
        this.tweet.onclick = () => {
            console.log('test')
        }
    }
    getId() {}
}