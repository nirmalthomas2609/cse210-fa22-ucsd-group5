let tweetStoreName = "tweets";
let topicStoreName = "topics";
let topicIndexName = "topicIndex";

let OK_STATUS = 200;
let FAILURE_STATUS = 500;

let db;

// Class: ContentManagement
// A class that manages the tweets and topics by interfacing with indexedDB.

// Function: createTweet
//
// Creates an entry corresponding to a tweet in the database
//
// Parameters:
//
//  tweetText       - The text contained in the tweet.
//  topicName       - Name of the topic to file the tweet under.
//  statusCallback  - Listener function from frontend to be executed
// 
// Returns:
//
//      Nothing

function setupDB(callback) {
    // if (!('indexedDB' in window)){
    //     alert("Browser not compatible");
    //     console.error(`Browser does not support IndexedDB`);
    // }

    // const request = window.indexedDB.open("note-taker-content-store", 1);
    const request = indexedDB.open("note-taker-content-store", 1);

    request.onerror = (event) => {
        // console.error(`Something went wrong: ${event.target.errorCode}`);
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        // console.log("DB created successfully!");
        callback();
    }

    request.onupgradeneeded = (event) => {
        const db = event.target.result;

        const tweetStore = db.createObjectStore("tweets", {"keyPath": "tweetId"});
        tweetStore.createIndex("topicIndex", "topicId", {unique: false});

        const topicStore = db.createObjectStore("topics", {"keyPath": "topicId"});

        tweetStore.transaction.onerror = (event) => {
            // console.error(`Tweets object store creation failed: ${event.target.errorCode}`);
        };

        topicStore.transaction.onerrror = (event) => {
            // console.error(`Topics object store creation failed: ${event.target.errorCode}`);
        }
    }
}

function createTweet(tweetText, topicId, statusCallback) {
    const tweetId = `tweet-${Date.now()}`;
    const tweetObj = {tweetId: tweetId, textContent: tweetText, topicId: topicId};
    const objStore = db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
    const request = objStore.add(tweetObj);
    // console.log(`Tweet Id - ${tweetId}, topicId - ${topicId}, textContent - ${tweetText}`);

    request.onsuccess = (_) => {
        // console.log(`Tweet ${tweetId} added to store`);
        statusCallback({status: OK_STATUS, data: {id: tweetId}});
    }

    request.onerror = (event) => {
        // console.log(`Failed adding tweet ${tweetId} to store with error code ${event}`);
        statusCallback({status: FAILURE_STATUS, errorMessage: `Failed adding tweet ${tweetId} to store with error code ${event.target.errorCode}`});
    }
}

// Function: updateTweet
//
// Updates tweet content in the database / moves tweet within topics
//
// Parameters:
//
//  tweetId         - The unique id of the tweet.
//  tweetText       - Updated text contained in the tweet.
//  topicId       - Updated TopicId if moving tweet
//  statusCallback  - Listener function from frontend to be executed
// 
// Returns:
//
//      Nothing

function updateTweet(tweetId, tweetText, topicId, statusCallback) {
    const objStore = db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
    const fetchRequest = objStore.get(tweetId);

    fetchRequest.onsuccess = (event) => {
        const tweet = event.target.result;
        tweet.textContent = tweetText;
        tweet.topicId = topicId;

        const updateReq = objStore.update(tweet);
        updateReq.onsuccess = (_) => {
            // console.log(`Tweet ${tweetId} updated in store`);
            statusCallback({status: OK_STATUS});
        }

        updateReq.onerror = (event) => {
            // console.log(`Failed to update ${tweetId} in store with error code ${event.target.errorCode}`);
            statusCallback({status: FAILURE_STATUS, errorMessage: `Failed to update ${tweetId} in store with error code ${event.target.errorCode}`});
        }
    }

    fetchRequest.onerror = (event) => {
        // console.log(`Failed to fetch ${tweetId} from store with error code ${event.target.errorCode}`);
        statusCallback({status: FAILURE_STATUS, errorMessage: `Failed to fetch ${tweetId} from store with error code ${event.target.errorCode}`});
    }
}

// Function: deleteTweet
//
// Delete tweet entry from DB
//
// Parameters:
//
//  tweetId         - The unique id of the tweet.
//  statusCallback  - Listener function from frontend to be executed
// 
// Returns:
//
//      Nothing

function deleteTweet(tweetId, statusCallback) {
    const objStore = db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
    const request = objStore.delete(tweetId);

    request.onsuccess = (_) => {
        // console.log(`Tweet ${tweetId} deleted from store`);
        statusCallback({status: OK_STATUS});
    }
    request.onerror = (event) => {
            // console.log(`Could not delete ${tweetId} from records. Failed with ${event.target.errorCode}`);
            statusCallback({status: FAILURE_STATUS, errorMessage: `Could not delete ${tweetId} from records. Failed with ${event.target.errorCode}`});
    }
}

// Function: createTopic
//
// Creates an entry corresponding to a new topic in the database
//
// Parameters:
//
//  topicName       - Name of the topic to store tweets within
//  statusCallback  - Listener function from frontend to be executed
// 
// Returns:
//
//      Nothing

function createTopic(topicName, statusCallback) {
    const topicId = topicName;
    const topicObj = {topicId: topicId, topicName: topicName};
    const objStore = db.transaction([topicStoreName], "readwrite").objectStore(topicStoreName);
    const request = objStore.add(topicObj);

    request.onsuccess = (_) => {
        // console.log(`Topic ${topicId} added to store`);
        statusCallback({status: OK_STATUS, data: {id: topicId}});
    }

    request.onerror = (event) => {
        // console.log(`Failed adding topic ${topicId} to store`);
        statusCallback({status: FAILURE_STATUS, errorMessage: `Failed adding topic ${topicId} to store with error code ${event.target.errorCode}`});
    }
}

// Function: updateTopic
//
// Updates topic Name
//
// Parameters:
//
//  topicId         - Unique topic ID corresponding to the topic (Primary Key)
//  topicName       - Updated topic name
//  statusCallback  - Listener function from frontend to be executed
// 
// Returns:
//
//      Nothing

function updateTopic(topicId, topicName, statusCallback) {
    const objStore = db.transaction([topicStoreName], "readwrite").objectStore(topicStoreName);
    const fetchRequest = objStore.get(topicId);

    fetchRequest.onsuccess = (event) => {
        const topic = event.target.result;
        topic.topicName = topicName;

        const updateReq = objStore.update(topic);
        updateReq.onsuccess = (_) => {
            // console.log(`Topic ${topicId} updated in store`);
            statusCallback({status: OK_STATUS});
        }

        updateReq.onerror = (event) => {
            // console.log(`Failed to update ${topicId} in store with error code ${event.target.errorCode}`);
            statusCallback({status: FAILURE_STATUS, errorMessage: `Failed to update ${topicId} in store with error code ${event.target.errorCode}`});
        }
    }

    fetchRequest.onerror = (event) => {
        // console.log(`Failed to fetch ${topicId} from store with error code ${event.target.errorCode}`);
        statusCallback({status: FAILURE_STATUS, errorMessage: `Failed to fetch ${topicId} from store with error code ${event.target.errorCode}`});
    }
}

// Function: getTweetsByTopicId
//
// Gets all tweets corresponding to a given topic ID
//
// Parameters:
//
//  topicId         - Unique ID corresponding to the topic
//  displayTweetsCallback  - Listener function from frontend to be executed
// 
// Returns:
//
//      Nothing

function getTweetsByTopicId(topicId, displayTweetsCallback) {
    const objStore = db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
    const request = objStore.index(topicIndexName).getAll(topicId);

    request.onsuccess = (event) => {
        const data = event.target.result;
        displayTweetsCallback({status: OK_STATUS, data: data});
        };

        request.onerror = (event) => {
        // console.log(`Failed fetch tweets request by topic ID ${topicId} with error code ${event.target.result}`);
        displayTweetsCallback({status: FAILURE_STATUS, errorMessage: `Failed fetch tweets request by topic ID ${topicId} with error code ${event.target.result}`});
        }
}

// Function: getAllTopics
//
// Gets a list of all topics in the topics store
//
// Parameters:
//
//  displayTopicsCallback - Listener fucntion from fontend to be executed
// 
// Returns:
//

function getAllTopics(displayTopicsCallback) {

    const topicStore = db.transaction([topicStoreName], "readonly").objectStore(topicStoreName);

    var allRecords = topicStore.getAll();

    allRecords.onsuccess = (event) => {
        let data = event.target.result;
        let topicList = new Set();
        for (var topic of data) {
            topicList.add(topic.topicId);
        }
        const returnObj = {status: true, topicsList: [...topicList]};
        displayTopicsCallback(returnObj);
    }

    allRecords.onerror = (event) => {
        // console.log(`Could not load topics from database. Failed with ${event.target.errorCode}`);
        const returnObj = {status: false, topicsList: []};
        displayTopicsCallback(returnObj);
    }

}

// class ContentManagemnt {
//     // Constructor: constructor
//     // Initializes the db object.
//     constructor() {
//         this.db = db;
//     }

//     // Function: createTweet
//     //
//     // Creates an entry corresponding to a tweet in the database
//     //
//     // Parameters:
//     //
//     //  tweetText       - The text contained in the tweet.
//     //  topicName       - Name of the topic to file the tweet under.
//     //  statusCallback  - Listener function from frontend to be executed
//     // 
//     // Returns:
//     //
//     //      Nothing

//     createTweet(tweetText, topicId, statusCallback) {
//         const tweetId = `tweet-${Date.now()}`;
//         const tweetObj = {tweetId: tweetId, textContent: tweetText, topicId: topicId};
//         const objStore = this.db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
//         const request = objStore.add(tweetObj);
//         console.log(`Tweet Id - ${tweetId}, topicId - ${topicId}, textContent - ${tweetText}`);

//         request.onsuccess = (_) => {
//             console.log(`Tweet ${tweetId} added to store`);
//             statusCallback({status: OK_STATUS, data: {id: tweetId}});
//         }

//         request.onerror = (event) => {
//             console.log(`Failed adding tweet ${tweetId} to store with error code ${event}`);
//             statusCallback({status: FAILURE_STATUS, errorMessage: `Failed adding tweet ${tweetId} to store with error code ${event.target.errorCode}`});
//         }
//     }

//     // Function: updateTweet
//     //
//     // Updates tweet content in the database / moves tweet within topics
//     //
//     // Parameters:
//     //
//     //  tweetId         - The unique id of the tweet.
//     //  tweetText       - Updated text contained in the tweet.
//     //  topicId       - Updated TopicId if moving tweet
//     //  statusCallback  - Listener function from frontend to be executed
//     // 
//     // Returns:
//     //
//     //      Nothing

//     updateTweet(tweetId, tweetText, topicId, statusCallback) {
//         const objStore = this.db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
//         const fetchRequest = objStore.get(tweetId);

//         fetchRequest.onsuccess = (event) => {
//             const tweet = event.target.result;
//             tweet.textContent = tweetText;
//             tweet.topicId = topicId;

//             const updateReq = objStore.update(tweet);
//             updateReq.onsuccess = (_) => {
//                 console.log(`Tweet ${tweetId} updated in store`);
//                 statusCallback({status: OK_STATUS});
//             }

//             updateReq.onerror = (event) => {
//                 console.log(`Failed to update ${tweetId} in store with error code ${event.target.errorCode}`);
//                 statusCallback({status: FAILURE_STATUS, errorMessage: `Failed to update ${tweetId} in store with error code ${event.target.errorCode}`});
//             }
//         }

//         fetchRequest.onerror = (event) => {
//             console.log(`Failed to fetch ${tweetId} from store with error code ${event.target.errorCode}`);
//             statusCallback({status: FAILURE_STATUS, errorMessage: `Failed to fetch ${tweetId} from store with error code ${event.target.errorCode}`});
//         }
//     }

//     // Function: deleteTweet
//     //
//     // Delete tweet entry from DB
//     //
//     // Parameters:
//     //
//     //  tweetId         - The unique id of the tweet.
//     //  statusCallback  - Listener function from frontend to be executed
//     // 
//     // Returns:
//     //
//     //      Nothing

//     deleteTweet(tweetId, statusCallback) {
//         const objStore = this.db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
//         const request = objStore.delete(tweetId);

//         request.onsuccess = (_) => {
//             console.log(`Tweet ${tweetId} deleted from store`);
//             statusCallback({status: OK_STATUS});
//         }
//         request.onerror = (event) => {
//              console.log(`Could not delete ${tweetId} from records. Failed with ${event.target.errorCode}`);
//              statusCallback({status: FAILURE_STATUS, errorMessage: `Could not delete ${tweetId} from records. Failed with ${event.target.errorCode}`});
//         }
//     }

//     // Function: createTopic
//     //
//     // Creates an entry corresponding to a new topic in the database
//     //
//     // Parameters:
//     //
//     //  topicName       - Name of the topic to store tweets within
//     //  statusCallback  - Listener function from frontend to be executed
//     // 
//     // Returns:
//     //
//     //      Nothing

//     createTopic(topicName, statusCallback) {
//         console.log(this.db);
//         const topicId = topicName;
//         const topicObj = {topicId: topicId, topicName: topicName};
//         const objStore = this.db.transaction([topicStoreName], "readwrite").objectStore(topicStoreName);
//         const request = objStore.add(topicObj);

//         request.onsuccess = (_) => {
//             console.log(`Topic ${topicId} added to store`);
//             statusCallback({status: OK_STATUS, data: {id: topicId}});
//         }

//         request.onerror = (event) => {
//             console.log(`Failed adding topic ${topicId} to store`);
//             statusCallback({status: FAILURE_STATUS, errorMessage: `Failed adding topic ${topicId} to store with error code ${event.target.errorCode}`});
//         }
//     }

//     // Function: updateTopic
//     //
//     // Updates topic Name
//     //
//     // Parameters:
//     //
//     //  topicId         - Unique topic ID corresponding to the topic (Primary Key)
//     //  topicName       - Updated topic name
//     //  statusCallback  - Listener function from frontend to be executed
//     // 
//     // Returns:
//     //
//     //      Nothing

//     updateTopic(topicId, topicName, statusCallback) {
//         const objStore = this.db.transaction([topicStoreName], "readwrite").objectStore(topicStoreName);
//         const fetchRequest = objStore.get(topicId);

//         fetchRequest.onsuccess = (event) => {
//             const topic = event.target.result;
//             topic.topicName = topicName;

//             const updateReq = objStore.update(topic);
//             updateReq.onsuccess = (_) => {
//                 console.log(`Topic ${topicId} updated in store`);
//                 statusCallback({status: OK_STATUS});
//             }

//             updateReq.onerror = (event) => {
//                 console.log(`Failed to update ${topicId} in store with error code ${event.target.errorCode}`);
//                 statusCallback({status: FAILURE_STATUS, errorMessage: `Failed to update ${topicId} in store with error code ${event.target.errorCode}`});
//             }
//         }

//         fetchRequest.onerror = (event) => {
//             console.log(`Failed to fetch ${topicId} from store with error code ${event.target.errorCode}`);
//             statusCallback({status: FAILURE_STATUS, errorMessage: `Failed to fetch ${topicId} from store with error code ${event.target.errorCode}`});
//         }
//     }

//     // Function: getTweetsByTopicId
//     //
//     // Gets all tweets corresponding to a given topic ID
//     //
//     // Parameters:
//     //
//     //  topicId         - Unique ID corresponding to the topic
//     //  displayTweetsCallback  - Listener function from frontend to be executed
//     // 
//     // Returns:
//     //
//     //      Nothing

//     getTweetsByTopicId(topicId, displayTweetsCallback) {
//         const objStore = this.db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
//         const request = objStore.index(topicIndexName).getAll(topicId);

//         request.onsuccess = (event) => {
//             const data = event.target.result;
//             displayTweetsCallback({status: OK_STATUS, data: data});
//           };

//           request.onerror = (event) => {
//             console.log(`Failed fetch tweets request by topic ID ${topicId} with error code ${event.target.result}`);
//             displayTweetsCallback({status: FAILURE_STATUS, errorMessage: `Failed fetch tweets request by topic ID ${topicId} with error code ${event.target.result}`});
//           }
//     }

//     // Function: getAllTopics
//     //
//     // Gets a list of all topics in the topics store
//     //
//     // Parameters:
//     //
//     //  displayTopicsCallback - Listener fucntion from fontend to be executed
//     // 
//     // Returns:
//     //

//     getAllTopics(displayTopicsCallback) {

//         const topicStore = this.db.transaction([topicStoreName], "readonly").objectStore(topicStoreName);

//         var allRecords = topicStore.getAll();

//         allRecords.onsuccess = (event) => {
//             let data = event.target.result;
//             let topicList = new Set();
//             for (var topic of data) {
//                 topicList.add(topic.topicId);
//             }
//             const returnObj = {status: true, topicsList: [...topicList]};
//             displayTopicsCallback(returnObj);
//         }

//         allRecords.onerror = (event) => {
//             console.log(`Could not load topics from database. Failed with ${event.target.errorCode}`);
//             const returnObj = {status: false, topicsList: []};
//             displayTopicsCallback(returnObj);
//        }

//     }
// }

module.exports = {setupDB, createTweet, getTweetsByTopicId};

