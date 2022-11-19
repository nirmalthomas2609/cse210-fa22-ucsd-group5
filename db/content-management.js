let tweetStoreName = "tweets";
let topicStoreName = "topics";
let topicIndexName = "topicIndex";

// Class: ContentManagement
// A class that manages the tweets and topics by interfacing with indexedDB.

class ContentManagemnt {

    // Constructor: constructor
    //  Initializes the db object.

    constructor(db) {
        this.db = db;
    }

    // Function: createTweet
    //
    // Creates an entry corresponding to a tweer in the database
    //
    // Parameters:
    //
    //  tweetId         - The unique id of the tweet.
    //  tweetText       - The text contained in the tweet.
    //  topicName       - Name of the topic to file the tweet under.
    //  statusCallback  - Listener function from frontend to be executed
    // 
    // Returns:
    //
    //      Nothing

    createTweet(tweetId, tweetText, topicName, statusCallback) {
        const tweetObj = {tweetId: tweetId, textContent: tweetText, topicName: topicName};
        const objStore = this.db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
        const request = objStore.add(tweetObj);

        request.onsuccess = (_) => {
            console.log(`Tweet ${tweetId} added to store`);
            statusCallback({status: 200});
        }

        request.onerror = (event) => {
            console.log(`Failed adding tweet ${tweetId} to store with error code ${event.target.errorCode}`);
            statusCallback({status: 500, errorMessage: `Failed adding tweet ${tweetId} to store with error code ${event.target.errorCode}`});
        }
    }

    updateTweet(tweetId, tweetText, topicId, statusCallback) {
        const objStore = this.db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
        const fetchRequest = objStore.get(tweetId);

        fetchRequest.onsuccess = (event) => {
            const tweet = event.target.result;
            tweet.textContent = tweetText;
            tweet.topicId = topicId;

            const updateReq = objStore.update(tweet);
            updateReq.onsuccess = (_) => {
                console.log(`Tweet ${tweetId} updated in store`);
                statusCallback({status: 200});
            }

            updateReq.onerror = (event) => {
                console.log(`Failed to update ${tweetId} in store with error code ${event.target.errorCode}`);
                statusCallback({status: 500, errorMessage: `Failed to update ${tweetId} in store with error code ${event.target.errorCode}`});
            }
        }

        fetchRequest.onerror = (event) => {
            console.log(`Failed to fetch ${tweetId} from store with error code ${event.target.errorCode}`);
            statusCallback({status: 500, errorMessage: `Failed to fetch ${tweetId} from store with error code ${event.target.errorCode}`});
        }
    }

    deleteTweet(tweetId, statusCallback) {
        const objStore = this.db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
        const request = objStore.delete(tweetId);

        request.onsuccess = (_) => {
            console.log(`Tweet ${tweetId} deleted from store`);
            statusCallback({status: 200});
        }
        request.onerror = (event) => {
             console.log(`Could not delete ${tweetId} from records. Failed with ${event.target.errorCode}`);
             statusCallback({status: 500, errorMessage: `Could not delete ${tweetId} from records. Failed with ${event.target.errorCode}`});
        }
    }

    createTopic(topicId, topicName, statusCallback) {
        const topicObj = {topicId: topicId, topicName: topicName};
        const objStore = this.db.transaction([topicStoreName], "readwrite").objectStore(topic);
        const request = objStore.add(topicObj);

        request.onsuccess = (_) => {
            console.log(`Topic ${topicId} added to store`);
            statusCallback({status: 200});
        }

        request.onerror = (event) => {
            console.log(`Failed adding topic ${topicId} to store`);
            statusCallback({status: 500, errorMessage: `Failed adding tweet ${tweetId} to store with error code ${event.target.errorCode}`});
        }
    }

    updateTopic(topicId, topicName, statusCallback) {
        const objStore = this.db.transaction([topicStoreName], "readwrite").objectStore(topicStoreName);
        const fetchRequest = objStore.get(topicId);

        fetchRequest.onsuccess = (event) => {
            const topic = event.target.result;
            topic.topicName = topicName;

            const updateReq = objStore.update(topic);
            updateReq.onsuccess = (_) => {
                console.log(`Topic ${topicId} updated in store`);
                statusCallback({status: 200});
            }

            updateReq.onerror = (event) => {
                console.log(`Failed to update ${topicId} in store with error code ${event.target.errorCode}`);
                statusCallback({status: 500, errorMessage: `Failed to update ${topicId} in store with error code ${event.target.errorCode}`});
            }
        }

        fetchRequest.onerror = (event) => {
            console.log(`Failed to fetch ${topicId} from store with error code ${event.target.errorCode}`);
            statusCallback({status: 500, errorMessage: `Failed to fetch ${topicId} from store with error code ${event.target.errorCode}`});
        }
    }

    getTweetsByTopicId(topicId, displayTweetsCallback) {
        const objStore = this.db.transaction([topicStoreName], "readwrite").objectStore(topicStoreName);
        const keyRange = IDBKeyRange.only(topicId);
        const request = objStore.index(topicIndexName).openKeyCursor(keyRange);

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            let listTweets = [];
            if (cursor) {
                listTweets.push(cursor);
                cursor.continue();
            }
            console.log(`Completed fetch tweets request by topic ID ${topicId}`);
            displayTweetsCallback({status: 200, data: listTweets});
          };

          request.onerror = (event) => {
            console.log(`Failed fetch tweets request by topic ID ${topicId} with error code ${event.target.result}`);
            displayTweetsCallback({status: 500, errorMessage: `Failed fetch tweets request by topic ID ${topicId} with error code ${event.target.result}`});
          }
    }

    // Function: getAllTopics
    //
    // Gets a list of all topics in the topics store
    //
    // Parameters:
    //
    //  displayTopicsCallback   - Listener fucntion from fontend to be executed
    // 
    // Returns:
    //

    getAllTopics(displayTopicsCallback) {

        const topicStore = this.db.transaction([topicStoreName], "readonly").objectStore(topicStoreName);

        var allRecords = topicStore.getAll();

        allRecords.onsuccess = (event) => {
            console.log(`Retrieved all topics`);
            const returnObj = {
                status: 200,
                data: {
                    allTopics: allRecords
                }
            };
            displayTopicsCallback(returnObj);
        }

        allRecords.onerror = (event) => {
            console.log(`Could not load topics from database. Failed with ${event.target.errorCode}`);
            const returnObj = {
                status: 500,
                errorMsg: "Unable to load topics from database"
            };
            displayTopicsCallback(returnObj);
       }

    }
}

