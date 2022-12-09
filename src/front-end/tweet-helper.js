import { getTweetsByTopicId, updateTweet } from "../db/content-management";
import { setTheme } from "./theme-util";

let tweetContainer = document.getElementById('tweets');

// Function: displayTweets
//
// Shows the tweets for the given topicId
//
// Parameters:
//      topicId - the topic id string for the tweets
//
// Returns:
//      None
//
// See Also:
//      Calls <getTweetsByTopicId>

function displayTweets(topicId) {
    getTweetsByTopicId(topicId, (dbObj) => {
        let tempText = '';
        for(let tweet of dbObj.data) {
            tempText += _createTweetHTMLElement(tweet.tweetId, tweet.tweetTitle, tweet.textContent, topicId);
        }
        tweetContainer.innerHTML = tempText;
        tweetContainer.addEventListener('focusout',(e) => {
            let dataset = e.target.parentElement.querySelector('.data-info').dataset;
            let tweetId = dataset.tweetid;

            let type = e.target.dataset.type;
            if(type==='content') {
                updateTweet(tweetId, '', e.target.innerText.trim(), '', console.log)

            } else if(type==='title') {
                updateTweet(tweetId, e.target.innerText.trim(), '', '', console.log)
            }
        })
        setTheme();
    })
}

// Function: _createTweetHTMLElement
//
// Creates an html element for a tweet. This should not be called outside of tweet-helper
//
// Parameters:
//      id - tweet id string
//      title - title string
//      content - tweet content string
//      topicID topic id string
//
// Returns:
//      String that defines html elements.
//

function _createTweetHTMLElement(id, title, content, topicId) {
    return `
    <div id="${id}" draggable="true" class="card"
         ondragstart="event.dataTransfer.setData('text/plain', '${id},${topicId}')"
         ondragover="event.preventDefault();"
         ondrop="event.preventDefault();">
        <div class="card-header"
             data-type="title"
             contenteditable="true"
             onmouseenter="document.getElementById('${id}').setAttribute('draggable', false);"
             onmouseleave="document.getElementById('${id}').setAttribute('draggable', true);"
        >${title}</div>
        <div class="card-body card-3">
            <p class="card-text card-1" 
               data-type="content" 
               contenteditable="true"
               onmouseenter="document.getElementById('${id}').setAttribute('draggable', false);"
               onmouseleave="document.getElementById('${id}').setAttribute('draggable', true);"
            >${content}</p>
            <div class="data-info hidden"
                 data-tweetid="${id}"
                 data-topicid="${topicId}">
            </div>
        </div>
    </div>
    `;
}

export {displayTweets}