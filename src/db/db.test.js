require("fake-indexeddb/auto");
let {setupDB, createTweet, getTweetsByTopicId, updateTweet, updateTopic, getAllTopics, createTopic} = require('./content-management');

test('update tweet', function() {
    setupDB('Test-1', function() {
        createTweet('Test', 'ADA', function(createTweetMetadata) {
            let tweetId = createTweetMetadata.data.id;
            updateTweet(tweetId, 'New Text', 'NewTopicId', function(updateTweetMetadata) {
                getTweetsByTopicId('NewTopicId', function(returnData) {
                    expect(returnData.data[0].textContent).toBe('New Text');
                    expect(returnData.data[0].topicId).toBe('NewTopicId');
                });
            });
        });
    });
});

test('create tweet', function() {
    setupDB('Test-2', function() {
      createTweet('Test', 'ADA', function(temp) {
          getTweetsByTopicId('ADA', function(returnData) {
              expect(returnData.data[0].textContent).toBe('Test');
          });
      });
    });
});

test('delete tweet', function() {
    setupDB('Test-3', function() {
        createTweet('Test', 'ADA', function(createTweetMetadata) {
            let tweetId = createTweetMetadata.data.id;
            deleteTweet(tweetId, function(_) {
                getTweetsByTopicId('ADA', function(returnData) {
                    expect(returnData.data).toHaveLength(0);
                });
            });
        });
    });
});

test('create topic', function() {
    setupDB('Test-4', function(){
        createTopic('ABCDE', function(createTopicMetadata) {
            getAllTopics(function(getTopicsMetadata) {
                expect(getTopicsMetadata.data).toHaveLength(1);
            });
        });
    });
});

test('update topic', function() {
    setupDB('Test-5', function() {
        createTopic('ABCDE', function(createTopicMetadata) {
            let topicId = createTopicMetadata.data.id;
            updateTopic(topicId, 'GHIJK', function(updateTopicMetadata) {
                getAllTopics(function(getTopicsMetadata) {
                    expect(getTopicsMetadata.data[0].topicName).toBe('GHIJK');
                });
            });
        });
    });
});