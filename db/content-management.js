let tweetStoreName = "tweets";

class ContentManagemnt {
    constructor(db) {
        this.db = db;
    }

    // Function: createTweet
    //
    // Creates a tweet entry in the database
    //
    // Parameters:
    //
    //  tweetId     - The unique id of the tweet.
    //  tweetText   - The text contained in the tweet.
    //  topicName   - Name of the topic to file the tweet under.

    createTweet(tweetId, tweetText, topicName = "") {
        const tweetObj = {tweetId: tweetId, textContent: tweetText, topicName: topicName};
        const objStore = this.db.transaction([tweetStoreName], "readWrite").objectStore(tweetStoreName);
        const request = objStore.add(tweetObj);

        request.onsuccess = (event) => {
            console.log(`Tweet ${tweetId} added to store`);
        }

        request.onerror = (event) => {
            console.log(`Failed adding tweet ${tweetId} to store`);
        }
    }

    updateTweet(tweetId, tweetText) {
        const objStore = this.db.transaction([tweetStoreName], "readWrite").objectStore(tweetStoreName);
        const fetchRequest = objStore.get(tweetId);

        fetchRequest.onsuccess = (event) => {
            const tweet = event.target.result;
            tweet.textContent = tweetText;

            const updateReq = objStore.update(tweet);
            updateReq.onsuccess = (event) => {
                console.log(`Tweet ${tweetId} updated in store`);
            }

            updateReq.onerror = (event) => {
                console.log(`Failed to update ${tweetId} in store with error code ${event.target.errorCode}`);
            }
        }

        fetchRequest.onerror = (event) => {
            console.log(`Failed to fetch ${tweetId} from store with error code ${event.target.errorCode}`);
        }
    }

    deleteTweet(tweetId) {
        const objStore = this.db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
        const request = objStore.delete(tweetId);

        request.onsuccess = (event) => {
            console.log(`Tweet ${tweetId} deleted from store`);
        }
        request.onerror = (event) => {
             console.log(`Could not delete ${tweetId} from records. Failed with ${event.target.errorCode}`);
        }
    }

    getTweetsByTopicName(topicName) {

    }

    getAllTopics() {

    }
}

