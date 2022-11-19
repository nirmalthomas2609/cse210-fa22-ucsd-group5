let tweetStoreName = "tweets";

class ContentManagemnt {
    constructor(db) {
        this.db = db;
    }

    createTweet(tweetId, tweetText, topicName, statusCallback) {
        const tweetObj = {tweetId: tweetId, textContent: tweetText, topicName: topicName};
        const objStore = this.db.transaction([tweetStoreName], "readWrite").objectStore(tweetStoreName);
        const request = objStore.add(tweetObj);

        request.onsuccess = (event) => {
            console.log(`Tweet ${tweetId} added to store`);
            statusCallback(true);
        }

        request.onerror = (event) => {
            console.log(`Failed adding tweet ${tweetId} to store`);
            statusCallback(false);
        }
    }

    updateTweet(tweetId, tweetText, topicId, statusCallback) {
        const objStore = this.db.transaction([tweetStoreName], "readWrite").objectStore(tweetStoreName);
        const fetchRequest = objStore.get(tweetId);

        fetchRequest.onsuccess = (event) => {
            const tweet = event.target.result;
            tweet.textContent = tweetText;
            tweet.topicId = topicId;

            const updateReq = objStore.update(tweet);
            updateReq.onsuccess = (event) => {
                console.log(`Tweet ${tweetId} updated in store`);
                statusCallback(true);
            }

            updateReq.onerror = (event) => {
                console.log(`Failed to update ${tweetId} in store with error code ${event.target.errorCode}`);
                statusCallback(false);
            }
        }

        fetchRequest.onerror = (event) => {
            console.log(`Failed to fetch ${tweetId} from store with error code ${event.target.errorCode}`);
            statusCallback(false);
        }
    }

    deleteTweet(tweetId, statusCallback) {
        const objStore = this.db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
        const request = objStore.delete(tweetId);

        request.onsuccess = (event) => {
            console.log(`Tweet ${tweetId} deleted from store`);
            statusCallback(true);
        }
        request.onerror = (event) => {
             console.log(`Could not delete ${tweetId} from records. Failed with ${event.target.errorCode}`);
             statusCallback(false);
        }
    }

    createTopic(topicId, statusCallback) {

    }

    getTweetsByTopicId(topicId, displayTweetsCallback) {

    }

    getAllTopics(displayTopicsCallback) {

    }
}

