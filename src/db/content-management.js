let DB = {
    tweetStoreName: "tweets",
    topicStoreName: "topics",
    topicIndexName: "topicIndex",

    OK_STATUS: 200,
    FAILURE_STATUS: 500,
}

let db;

// Function: setupDB
//
// *Creates a datastore corresponding for the tweets/topics*
//
// Parameters:
//
//  namespace - Name of the datastore created
//  callback - Method invoked on successful creation of the datastore
// 
// Returns:
//
//      None

function setupDB(namespace, callback) {

    const request = indexedDB.open(`${namespace}`, 1);

    request.onsuccess = (event) => {
        db = event.target.result;
        callback();
    }

    request.onupgradeneeded = (event) => {
        const db = event.target.result;

        const tweetStore = db.createObjectStore("tweets", {"keyPath": "tweetId"});
        tweetStore.createIndex("topicIndex", "topicId", {unique: false});

        const topicStore = db.createObjectStore("topics", {"keyPath": "topicId"});
    }
}

// Function: createTweet
//
// *Creates an entry corresponding to a tweet in the database*
//
// Parameters:
//
//  tweetText       - The text contained in the tweet
//  topicName       - Name of the topic to file the tweet under
//  statusCallback  - Listener function from frontend to be executed on completed transaction
// 
// Returns:
//
//      None
//
// See Also:
//  
//  Called by <TweetFactory.newEvent> and <Menu._topicItemUpdate>


function createTweet(tweetText, tweetTitle, topicId, statusCallback) {
    const tweetId = `tweet-${Date.now()}`;
    const tweetObj = {tweetId: tweetId, textContent: tweetText, topicId: topicId, tweetTitle: tweetTitle};
    const objStore = db.transaction([DB.tweetStoreName], "readwrite").objectStore(DB.tweetStoreName);
    const request = objStore.add(tweetObj);

    request.onsuccess = (_) => {
        statusCallback({status: DB.OK_STATUS, data: {id: tweetId}});
    }

    request.onerror = (event) => {
        statusCallback({status: DB.FAILURE_STATUS, errorMessage: `Failed adding tweet ${tweetId} to store with error code ${event.target.errorCode}`});
    }
}

// Function: updateTweet
//
// *Updates tweet content in the database / moves tweet within topics*
//
// Parameters:
//
//  tweetId         - ID of the tweet to be updated
//  tweetTitle      - Updated tweet title if any (else pass empty string)
//  tweetText       - Updated text contained in the tweet if any (else pass empty string)
//  topicId         - Updated TopicId if moving tweet if any (else pass empty string)
//  statusCallback  - Listener function from frontend to be executed on completed transaction
// 
// Returns:
//
//      None
//
// See Also:
//  
//  Called by <TweetFactory.renameEvent>, <Menu._tweetItemUpdate> and <Menu._topicItemUpdate>

function updateTweet(tweetId, tweetTitle, tweetText, topicId, statusCallback) {
    const objStore = db.transaction([DB.tweetStoreName], "readwrite").objectStore(DB.tweetStoreName);
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
            statusCallback({status: DB.OK_STATUS});
        }

        updateReq.onerror = (event) => {
            statusCallback({status: DB.FAILURE_STATUS, errorMessage: `Failed to update ${tweetId} in store with error code ${event.target.errorCode}`});
        }
    }

    fetchRequest.onerror = (event) => {
        statusCallback({status: DB.FAILURE_STATUS, errorMessage: `Failed to fetch ${tweetId} from store with error code ${event.target.errorCode}`});
    }
}

// Function: deleteTweet
//
// *Delete tweet entry from DB*
//
// Parameters:
//
//  tweetId         - ID of the tweet to be deleted
//  statusCallback  - Listener function from frontend to be executed on completed transaction
// 
// Returns:
//
//      None
//
// See Also:
//  
//  Called by <TweetFactory.deleteEvent> and <Menu._topicItemUpdate>


function deleteTweet(tweetId, statusCallback) {
    const objStore = db.transaction([DB.tweetStoreName], "readwrite").objectStore(DB.tweetStoreName);
    const request = objStore.delete(tweetId);

    request.onsuccess = (_) => {
        statusCallback({status: DB.OK_STATUS});
    }
    request.onerror = (event) => {
            statusCallback({status: DB.FAILURE_STATUS, errorMessage: `Could not delete ${tweetId} from records. Failed with ${event.target.errorCode}`});
    }
}

// Function: createTopic
//
// *Creates an entry corresponding to a new topic in the database*
//
// Parameters:
//
//  topicName       - Name of the topic to store tweets within (Folder)
//  statusCallback  - Listener function from frontend to be executed on transaction complete
// 
// Returns:
//
//      None
//
// See Also:
//  
//  Called by <TopicFactory.load> and <TopicFactory.newEvent>


function createTopic(topicName, statusCallback) {
    const topicId = `topic-${Date.now()}`;
    const topicObj = {topicId: topicId, topicName: topicName};
    const objStore = db.transaction([DB.topicStoreName], "readwrite").objectStore(DB.topicStoreName);
    const request = objStore.add(topicObj);

    request.onsuccess = (_) => {
        statusCallback({status: DB.OK_STATUS, data: {id: topicId}});
    }

    request.onerror = (event) => {
        statusCallback({status: DB.FAILURE_STATUS, errorMessage: `Failed adding topic ${topicId} to store with error code ${event.target.errorCode}`});
    }
}

// Function: updateTopic
//
// *Updates topic Name*
//
// Parameters:
//
//  topicId         - Unique topic ID corresponding to the topic (Primary Key)
//  topicName       - Updated topic name
//  statusCallback  - Listener function from frontend to be executed on transaction complete
// 
// Returns:
//
//      None
//
// See Also:
//  
//  Called by <TopicFactory.renameEvent>

function updateTopic(topicId, topicName, statusCallback) {
    const objStore = db.transaction([DB.topicStoreName], "readwrite").objectStore(DB.topicStoreName);
    const fetchRequest = objStore.get(topicId);

    fetchRequest.onsuccess = (event) => {
        const topic = event.target.result;
        topic.topicName = topicName;

        const updateReq = objStore.put(topic);
        updateReq.onsuccess = (_) => {
            statusCallback({status: DB.OK_STATUS});
        }

        updateReq.onerror = (event) => {
            statusCallback({status: DB.FAILURE_STATUS, errorMessage: `Failed to update ${topicId} in store with error code ${event.target.errorCode}`});
        }
    }

    fetchRequest.onerror = (event) => {
        statusCallback({status: DB.FAILURE_STATUS, errorMessage: `Failed to fetch ${topicId} from store with error code ${event.target.errorCode}`});
    }
}

// Function: getTweetsByTopicId
//
// *Gets all tweets corresponding to a given topic ID*
//
// Parameters:
//
//  topicId         - Unique ID corresponding to the topic
//  displayTweetsCallback  - Listener function from frontend to be executed on transaction complete
// 
// Returns:
//
//      None
//
// See Also:
//  
//  Called by <TweetFactory.load>

function getTweetsByTopicId(topicId, displayTweetsCallback) {
    const objStore = db.transaction([DB.tweetStoreName], "readwrite").objectStore(DB.tweetStoreName);
    const request = objStore.index(DB.topicIndexName).getAll(topicId);

    request.onsuccess = (event) => {
        const data = event.target.result;
        displayTweetsCallback({status: DB.OK_STATUS, data: data});
        };

        request.onerror = (event) => {
        displayTweetsCallback({status: DB.FAILURE_STATUS, errorMessage: `Failed fetch tweets request by topic ID ${topicId} with error code ${event.target.result}`});
        }
}

// Function: getAllTopics
//
// *Gets a list of all topics in the topics store*
//
// Parameters:
//
//  displayTopicsCallback - Listener fucntion from fontend to be executed on transaction complete
// 
// Returns:
//
// See Also:
//  
//  Called by <TopicFactory.load>

function getAllTopics(displayTopicsCallback) {

    const topicStore = db.transaction([DB.topicStoreName], "readonly").objectStore(DB.topicStoreName);

    var allRecords = topicStore.getAll();

    allRecords.onsuccess = (event) => {
        let data = event.target.result;
        let topicList = new Set();
        for (var topic of data) {
            topicList.add({id: topic.topicId, name: topic.topicName});
        }
        const returnObj = {status: DB.OK_STATUS, topicsList: [...topicList]};
        displayTopicsCallback(returnObj);
    }

    allRecords.onerror = (event) => {
        const returnObj = {status: DB.FAILURE_STATUS, topicsList: []};
        displayTopicsCallback(returnObj);
    }

}

// Function: getTweetById
//
// *Gets tweet identified by tweetId*
//
// Parameters:
//
//  tweetId         - Unique ID corresponding to the tweet to be fetched
//  displayTweetCallback  - Listener function from frontend to be executed on transaction complete
// 
// Returns:
//
//      None
//
// See Also:
//  
//  Called by <Menu._tweetItemUpdate>

function getTweetById(tweetId, displayTweetCallback) {
    const objStore = db.transaction([DB.tweetStoreName], "readonly").objectStore(DB.tweetStoreName);

    var tweetRecord = objStore.get(tweetId);

    tweetRecord.onsuccess = (event) => {
        let tweetData = event.target.result;
        const returnObj = {status: DB.OK_STATUS, data: tweetData};
        displayTweetCallback(returnObj);
    }

    tweetRecord.onerror = (event) => {
        const returnObj = {status: DB.FAILURE_STATUS, data: undefined}
        displayTweetCallback(returnObj);
    }
}

// Function: deleteTopic
//
// *Deletes all tweets corresponding to the topic and also additionally removes the topic record from the topic store*
//
// Parameters:
//
//  topicId         - ID corresponding to the topic to be deleted
//  statusCallback  - Listener function from frontend to be executed on transaction complete
// 
// Returns:
//
//      None
//
// See Also:
//  
//  Called by <TopicFactory.deleteEvent>

function deleteTopic(topicId, statusCallback) {
    const successReturnObj = {status: DB.OK_STATUS};
    const failureReturnObj = {status: DB.FAILURE_STATUS};

    getTweetsByTopicId(topicId, function(tweetsFetchStatus) {
        if (tweetsFetchStatus.status == DB.FAILURE_STATUS){
            statusCallback(failureReturnObj);
            return;
        }

        const tweets = tweetsFetchStatus.data;
        for (var tweet of tweets) {
            deleteTweet(tweet.tweetId, function(tweetDeleteStatus) {
                if (tweetDeleteStatus.status === DB.FAILURE_STATUS){
                    statusCallback(failureReturnObj);
                    return;
                }
            });
        }
        
        const topicStore = db.transaction([DB.topicStoreName], "readwrite").objectStore(DB.topicStoreName);
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

module.exports = {
    setupDB, createTweet, getTweetsByTopicId, updateTweet, updateTopic, getAllTopics, createTopic, deleteTopic,
    deleteTweet,getTweetById
};


