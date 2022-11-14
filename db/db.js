let db;

if (!('indexedDB' in window)){
    alert("Browser not compatible");
    console.error(`Browser does not support IndexedDB`);
    return;
}

const request = window.indexedDB.open("note-taker-content-store", 1);

request.onerror = (event) => {
    console.error(`Something went wrong: ${event.target.errorCode}`);
    return;
};

request.onsuccess = (event) => {
    db = event.target.result;
    return;
}

request.onupgradeneeded = (event) => {
    const db = event.target.result;

    const tweetStore = db.createObjectStore("tweets", {"keyPath": "tweetId"});
    tweetStore.createIndex("topic", "topicName", {unique: false});

    tweetStore.transaction.onerror = (event) => {
        console.error(`Object store creation failed: ${event.target.errorCode}`);
        return;
    };
}
