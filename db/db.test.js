require("fake-indexeddb/auto");
let {setupDB, createTweet, getTweetsByTopicId} = require('./content-management');

test('create tweet', function() {
  setupDB(function() {
    createTweet('Test', 'ADASSA', function(temp) {
        getTweetsByTopicId('ADASSA', function(returnData) {
            expect(returnData.data[0].textContent).toBe('Test');
        });
    });
  });
});