require("fake-indexeddb/auto");
let {setupDB, createTweet, getTweetsByTopicId, updateTweet, updateTopic, getAllTopics, createTopic, deleteTweet, deleteTopic, getTweetById} = require('./content-management');

test('update tweet', done => {
    setupDB('Test-1', function() {
        createTweet('aC1', 'bT1', 'cTo1', function(createTweetMetadata) {
            let tweetId = createTweetMetadata.data.id;
            updateTweet(tweetId, 'bUT1', 'aUC1', '', function(updateTweetMetadata) {
                getTweetsByTopicId('cTo1', function(returnData) {
                    expect(returnData.data[0].textContent).toBe('aUC1');
                    expect(returnData.data[0].tweetTitle).toBe('bUT1');
                    done();
                });
            });
        });
    });
});

test('create tweet', done => {
    setupDB('Test-2', function() {
      createTweet('aC2', 'bT2', 'cTo2', function(createTweetMetadata) {
          getTweetsByTopicId('cTo2', function(returnData) {
              expect(returnData.data[0].textContent).toBe('aC2');
              done();
          });
      });
    });
});

test('delete tweet', done => {
    setupDB('Test-3', function() {
        createTweet('aC3', 'bT3', 'cTo3', function(createTweetMetadata) {
            let tweetId = createTweetMetadata.data.id;
            deleteTweet(tweetId, function(delStatus) {
                getTweetsByTopicId('cTo3', function(returnData) {
                    expect(returnData.data).toHaveLength(0);
                    done();
                });
            });
        });
    });
});

test('get tweet by ID', done => {
    setupDB('Test-7', function() {
      createTweet('aC7', 'bT7', 'cTo7', function(createTweetMetadata) {
        let tweetId = createTweetMetadata.data.id;
          getTweetById(tweetId, function(returnData) {
              expect(returnData.data.textContent).toBe('aC7');
              done();
          });
      });
    });
});

test('create topic', done => {
    setupDB('Test4', function() {
        createTopic('aTo4', function(createTopicMetadata) {
            getAllTopics(function(getTopicsMetadata) {
                expect(getTopicsMetadata.topicsList).toHaveLength(1);
                done();
            });
        });
    });
});

test('delete topic', done => {
    setupDB('Test 6', function() {
        getAllTopics(function(getTopicsMetadata) {
            for (var topic of getTopicsMetadata.topicsList){
                let topicId = topic.id;
                deleteTopic(topicId, () => {});
            }
            createTopic('aTo6', function(createTopicMetadata) {
                let topicId = createTopicMetadata.data.id;
                createTweet('aC6', 'bT6', topicId, function(createTweetMetadata) {
                    deleteTopic(topicId, function() {
                        getTweetsByTopicId(topicId, function(returnData) {
                            expect(returnData.data.length).toBe(0);
                            getAllTopics(function(allTopicsMetadata){
                                expect(allTopicsMetadata.topicsList.length).toBe(0);
                                done();
                            });
                        });
                    });
                });
            });
        });
    })
});

test('update topic', done => {
    setupDB('Test5', function() {
        createTopic('aTo5', function(createTopicMetadata) {
            let topicId = createTopicMetadata.data.id;
            updateTopic(topicId, 'aUTo5', function(updateTopicMetadata) {
                getAllTopics(function(getTopicsMetadata) {
                    expect(getTopicsMetadata.topicsList[0].name).toBe('aUTo5');
                    done();
                });
            });
        });
    });
});