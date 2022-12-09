let tweetStoreName = "tweets";
let topicStoreName = "topics";
let topicIndexName = "topicIndex";

let OK_STATUS = 200;
let FAILURE_STATUS = 500;

let db;

function setupDB(namespace, callback) {

    if (db) {
        callback();
        return;
    }

    const dbReq = indexedDB.open(`${namespace}`, 1);

    dbReq.onsuccess = (event) => {
        db = event.target.result;
        callback();
    }

    dbReq.onupgradeneeded = function(event) {
        const db = event.target.result;

       let topicStore, tweetStore;

       if (!db.objectStoreNames.contains(tweetStoreName)) {
            tweetStore = db.createObjectStore(tweetStoreName, {"keyPath": "tweetId"});
            tweetStore.createIndex("topicIndex", "topicId", {unique: false});
        } else {
            tweetStore = dbReq.transaction.objectStore(tweetStoreName);
        }

        if (!db.objectStoreNames.contains(topicStoreName)) {
            topicStore = db.createObjectStore(topicStoreName, {"keyPath": "topicId"});
        } else {
            topicStore = dbReq.transaction.objectStore(topicStoreName);
        }
      }
}

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

function createTweet(tweetText, tweetTitle, topicId, statusCallback) {
    const tweetId = `tweet-${Date.now()}`;
    const tweetObj = {tweetId: tweetId, textContent: tweetText, topicId: topicId, tweetTitle: tweetTitle};
    let tx = db.transaction([tweetStoreName], "readwrite");
    let objStore = tx.objectStore(tweetStoreName);
    let req = objStore.add(tweetObj);

    req.onsuccess = function(_) {
        statusCallback({status: OK_STATUS, data: {id: tweetId}});
    }

    req.onerror = (event) => {
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

function updateTweet(tweetId, tweetTitle, tweetText, topicId, statusCallback) {
    const objStore = db.transaction([tweetStoreName], "readwrite").objectStore(tweetStoreName);
    const fetchRequest = objStore.get(tweetId);

    fetchRequest.onsuccess = (event) => {
        const tweet = event.target.result;
        if (tweetTitle.length > 0){
            tweet.tweetTitle = tweetTitle;
        }
        if (tweetText.length > 0){
            tweet.textContent = tweetText;
        }
        if (topicId.length > 0) {
            tweet.topicId = topicId;
        }

        const updateReq = objStore.put(tweet);
        updateReq.onsuccess = (_) => {
            statusCallback({status: OK_STATUS});
        }

        updateReq.onerror = (event) => {
            statusCallback({status: FAILURE_STATUS, errorMessage: `Failed to update ${tweetId} in store with error code ${event.target.errorCode}`});
        }
    }

    fetchRequest.onerror = (event) => {
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
        statusCallback({status: OK_STATUS});
    }
    request.onerror = (event) => {
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
    const topicId = `topic-${Date.now()}`;
    const topicObj = {topicId: topicId, topicName: topicName};
    const objStore = db.transaction([topicStoreName], "readwrite").objectStore(topicStoreName);
    const request = objStore.add(topicObj);

    request.onsuccess = (_) => {
        statusCallback({status: OK_STATUS, data: {id: topicId}});
    }

    request.onerror = (event) => {
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
        const updateReq = objStore.put(topic);
        updateReq.onsuccess = (_) => {
            statusCallback({status: OK_STATUS});
        }

        updateReq.onerror = (event) => {
            statusCallback({status: FAILURE_STATUS, errorMessage: `Failed to update ${topicId} in store with error code ${event.target.errorCode}`});
        }
    }

    fetchRequest.onerror = (event) => {
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
            topicList.add({id: topic.topicId, name: topic.topicName});
        }
        const returnObj = {status: OK_STATUS, topicsList: [...topicList]};
        displayTopicsCallback(returnObj);
    }

    allRecords.onerror = (event) => {
        const returnObj = {status: FAILURE_STATUS, topicsList: []};
        displayTopicsCallback(returnObj);
    }

}

// Function: getTweetById
//
// Gets tweet identified by tweetId
//
// Parameters:
//
//  tweetId         - Unique ID corresponding to the tweet
//  displayTweetCallback  - Listener function from frontend to be executed
// 
// Returns:
//
//      Nothing

function getTweetById(tweetId, displayTweetCallback) {
    const objStore = db.transaction([tweetStoreName], "readonly").objectStore(tweetStoreName);

    var tweetRecord = objStore.get(tweetId);

    tweetRecord.onsuccess = (event) => {
        let tweetData = event.target.result;
        const returnObj = {status: OK_STATUS, data: tweetData};
        displayTweetCallback(returnObj);
    }

    tweetRecord.onerror = (event) => {
        const returnObj = {status: FAILURE_STATUS, data: undefined}
        displayTweetCallback(returnObj);
    }
}

// Function: deleteTopic
//
// Deletes all tweets corresponding to the topic and also additionally removes the topic record from the topic store
//
// Parameters:
//
//  topicId         - Unique ID corresponding to the topic
//  statusCallback  - Listener function from frontend to be executed
// 
// Returns:
//
//      Nothing

function deleteTopic(topicId, statusCallback) {
    const successReturnObj = {status: OK_STATUS};
    const failureReturnObj = {status: FAILURE_STATUS};

    getTweetsByTopicId(topicId, function(tweetsFetchStatus) {
        if (tweetsFetchStatus.status == FAILURE_STATUS){
            statusCallback(failureReturnObj);
            return;
        }

        const tweets = tweetsFetchStatus.data;
        for (var tweet of tweets) {
            deleteTweet(tweet.tweetId, function(tweetDeleteStatus) {
                if (tweetDeleteStatus.status === FAILURE_STATUS){
                    statusCallback(failureReturnObj);
                    return;
                }
            });
        }
        
        const topicStore = db.transaction([topicStoreName], "readwrite").objectStore(topicStoreName);
        const deleteTopicRequest = topicStore.delete(topicId);

        deleteTopicRequest.onsuccess = (event) => {
            statusCallback(successReturnObj);
            return;
        }

        deleteTopicRequest.onerror = (event) => {
            statusCallback(failureReturnObj);
            return;
        }
    });
}

// module.exports = {setupDB, createTweet, getTweetsByTopicId, updateTweet, updateTopic, getAllTopics, createTopic, deleteTweet, deleteTopic, getTweetById};


