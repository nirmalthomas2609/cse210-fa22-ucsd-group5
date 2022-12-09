import { setupDB, getAllTopics, getTweetsByTopicId, deleteTweet, deleteTopic, createTopic, createTweet, updateTweet, updateTopic } from "../db/content-management";

import DOMPurify from "dompurify";

let topicsContainer = document.getElementById('topics-container');
let topicItems = [];

let tweetContainer = document.getElementById('tweets');

function displayTweets(topicId) {
    getTweetsByTopicId(topicId, (dbObj) => {
        let tempText = '';
        for(let tweet of dbObj.data) {
            tempText += `
            <div id="${tweet.tweetId}" draggable="true" class="card"
                 ondragstart="event.dataTransfer.setData('text/plain', '${tweet.tweetId},${topicId}')"
                 ondragover="event.preventDefault();"
                 ondrop="event.preventDefault();">
                <div class="card-header"
                     data-type="title"
                     contenteditable="true"
                     onmouseenter="document.getElementById('${tweet.tweetId}').setAttribute('draggable', false);"
                     onmouseleave="document.getElementById('${tweet.tweetId}').setAttribute('draggable', true);"
                >${tweet.tweetTitle}</div>
                <div class="card-body card-3">
                    <p class="card-text card-1" 
                       data-type="content" 
                       contenteditable="true"
                       onmouseenter="document.getElementById('${tweet.tweetId}').setAttribute('draggable', false);"
                       onmouseleave="document.getElementById('${tweet.tweetId}').setAttribute('draggable', true);"
                    >${tweet.textContent}</p>
                    <div class="data-info hidden"
                         data-tweetid="${tweet.tweetId}"
                         data-topicid="${topicId}">
                    </div>
                </div>
            </div>
            `;
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
    })
}

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
    curActive.classList.add('active');
    curActive.scrollIntoView(false);
    displayTweets(topicId);
}


function addTopic(topic) {
    topicItems.push(topic);
}

function addTopics(dbObj) {
    topicItems.push(...dbObj.topicsList);
    topicsContainer.dispatchEvent(new CustomEvent('refreshTopics'));
}

function _addDragEvent(topicElement) {
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
}

function _addTopicElementEvents() {
    for(let topicElement of document.querySelectorAll('.topic')) {
        _addDragEvent(topicElement)
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

function _topicContainerEvents() {
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
                    // topicItems.push({id: dbObj.data.id, name: title});
                    addTopic({id: dbObj.data.id, name: title});
                    topicsContainer.dispatchEvent(new CustomEvent('refreshTopics', {
                            detail: {id: dbObj.data.id}}
                    ));
                });
            }
        };
    });
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

_topicContainerEvents();

export { addTopics, displayTweets, getActiveTopic}