let TWEET_ID = 1;

class TweetFactory extends AbstractUserMenu {
    constructor(title, db, container, tweetid=null) {
        super();
        this.title = title;
        this.tweetid = (tweetid) ? tweetid : TWEET_ID++;
        this.container = container;
        this.db = db;
        this.contentManager = new ContentManagemnt(this.db);
        
        this.initializeHTML();
        this.initializeDB();
    }

    initializeHTML() {
        this.tweet = document.createElement('div');
        this.tweet.classList.add(USER_ITEM_CLASS, SUB_ITEM_CLASS, TWEET_ITEM_CLASS)
        this.tweet.innerHTML = this.title;
        this._toggleSubItem(this.tweet);
        this.container.appendChild(this.tweet);
    }
    initializeDB() {
        this.tweet.onclick = () => {
            console.log('test')
        }
        this.contentManager.createTweet(this.tweetid, "Dummy text", "General", console.log);
    }

    getId() {}
}