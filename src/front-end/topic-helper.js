import { createTopic, updateTweet, updateTopic } from "../db/content-management";

import DOMPurify from "dompurify";
import { displayTweets } from "./tweet-helper";
import { setTheme } from "./theme-util";

// Function: openTopic
// 
// Adds .active class to the HTMLElement with topicId active and
// displays its tweets to the UI. If no topicId was passed in, then
// the top most (i.e. topicItems[0]) topic will be opened. 
//
// Parameter:
//      topicId - string representing the topic id
//
// Returns:
//      None
//
// See Also:
//      Calls <setTheme> and <displayTweets>


function openTopic(topicId) {
    let curActive = topicsContainer.querySelector('.active');
    if(curActive){
        curActive.classList.remove('active');
    }

    if(!topicId) {
        if (topicItems.length > 0) {
            topicId = topicItems[0].id;
        } else {
            return;
        }
    }
    curActive = topicsContainer.querySelector(`#${topicId}`);
    if(curActive) {
        curActive.classList.add('active');
        curActive.scrollIntoView(false);
        displayTweets(topicId);
    }
    setTheme();
}

// Function: removeTopicHTML
//
// Removes the topic and related tweets from the UI
//
// Parameters:
//      topicID - the topic id string
//
// Returns:
//      None

function removeTopicHTML(topicId) {
    let container = document.getElementById(topicId);
    container = container.parentElement;
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.remove();
    topicItems = topicItems.filter(topic => topic.id !== topicId);
}

// Function: addTopics
//
// Adds topics to the UI
//
// Parameters:
//      dbObj - The return from getAllTopics
//
// See Also:
// <getAllTopics>

function addTopics(dbObj) {
    topicItems.push(...dbObj.topicsList);
    topicsContainer.dispatchEvent(new CustomEvent('refreshTopics'));
}

// Function: displayTopics
//
// Displays all topics in the UI
//
// Parameters:
//      activeObj - If passed in, will make that topic active
// Returns:
//      None

function displayTopics(activeObj) {
    let tempString = DOMPurify.sanitize(topicItems.map(topicObj => 
        _createTopicHTMLElement(topicObj)).join(''));
    document.getElementById('topics').innerHTML = tempString;
    document.getElementById('tweets').innerHTML ='';
    _addTopicElementEvents();
    if(!activeObj || !activeObj.detail) {
        if(topicItems.length > 0) {
            openTopic(topicItems[0].id);
        }
    } else if(activeObj.detail) {
        openTopic(activeObj.detail.id);
    }
}

// Function: _addTopicElementEvents
//
// Create user events for all topic HTMLElements. Topic HTMLElements are defined by any HTMLElement
// with the .topic class. This should not be called outside of topic-helper.
//
// Returns:
//      None
//
// See Also:
//      <displayTopics>

function _addTopicElementEvents() {
    for(let topicElement of document.querySelectorAll('.topic')) {
        topicElement.ondragstart = function(e) {
            e.dataTransfer.setData('text/plain', `,${this.id}`)
        }
        topicElement.ondragover = function(e) {
            e.preventDefault();
            let [tweetId, topicId] = e.dataTransfer.getData('text').split(',');
            if(tweetId === '') return;
            this.classList.add('drag-over');
        }
        topicElement.ondragleave = function(e) {
            e.preventDefault();
            let [tweetId, topicId] = e.dataTransfer.getData('text').split(',');
            if(tweetId === '') return;
            this.classList.remove('drag-over');
        }
        topicElement.ondrop = function(e) {
            let [tweetId, topicId] = e.dataTransfer.getData('text').split(',');
            if(tweetId === '') return;
            this.classList.remove('drag-over');
            if(this.id !== topicId) {
                let tweet =  document.getElementById(tweetId);
                updateTweet(tweetId, '', '', this.id, () => {
                    while(tweet.firstChild) {
                        tweet.removeChild(tweet.firstChild)
                    }
                    tweet.remove();
                });
            }
        }

        topicElement.ondblclick = (e) => {
            e.target.contentEditable=true;
            e.target.focus();
        }
        topicElement.onblur = (e) => {
            e.target.contentEditable=false;
            updateTopic(e.target.id, e.target.innerText, console.log)
        }
    }
}

// Function: _createTopicHTMLElement
//
// Creates an html element for a topic. This should not be called outside of topic-helper
//
// Parameters:
//      topicObj - {id: topic id string, name: topic name string}
//
// Returns:
//      String that defines html elements.
//
// See Also:
//  Called by <displayTopics>

function _createTopicHTMLElement(topicObj) {
    return `
        <div class="row mx-0 px-0 py-2" >
            <div contenteditable="true" id="${topicObj.id}" draggable="true"
                class="container text-center rounded-pill fs-3 topic"> ${topicObj.name}
            </div>
        </div>
    `;
}

// Function: getActiveTopic
//
// Gets the current active topic. An active topic is any topic with the .active class.
// There should only be one topic with .active but if multiple topics have the .active
// class then the first topic encountered with .active will be returned.
//
// Returns:
//
//      HTMLElement representing active topic or null if there is not an active topic

function getActiveTopic() {
    return topicsContainer.querySelector('.active');
}

// stores the objects representing topics
// object format {id: string, name: string}
let topicItems = [];

// container that stores the HTMLElements for each topic
let topicsContainer = document.getElementById('topics-container');

// handle topic clicks
topicsContainer.onclick = function(e) {
    // dont do anything if button was double clicked
    if(e.target.type === 'button') return;

    if(e.target.id) {
        openTopic(e.target.id);
    }
}

// refreshTopics is called whenever topics are added to UI
topicsContainer.addEventListener('refreshTopics', displayTopics);

// new topic prompt
let topicPrompt = document.getElementById('newTopicPrompt');
let topicInput = topicPrompt.querySelector(".modal-input");

// clear topicInput
topicPrompt.addEventListener('show.bs.modal', () => {
    topicInput.value = '';
});

// collect user input
topicPrompt.addEventListener('shown.bs.modal', () => {
    topicInput.focus();

    let okBtn = topicPrompt.querySelector("#topic-ok-btn");
    okBtn.onclick = () => {
        if(topicInput.value) {
            let title=topicInput.value;
            createTopic(title, (dbObj) => {
                topicItems.push({id: dbObj.data.id, name: title});
                topicsContainer.dispatchEvent(new CustomEvent('refreshTopics', {
                        detail: {id: dbObj.data.id}}
                ));
            });
        }
    };
});

export { openTopic, displayTopics, removeTopicHTML, addTopics, displayTweets, getActiveTopic}