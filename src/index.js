import "./scss/main.scss";

// You can specify which plugins you need
import { Tooltip, Toast, Popover } from 'bootstrap';

import { setupDB, getAllTopics, getTweetsByTopicId, deleteTweet, deleteTopic, createTopic, createTweet, updateTweet, updateTopic } from "./db/content-management";
import DOMPurify from "dompurify";

// globals
let curTopicId = null;
let topicItems = [];
let topicsContainer = document.getElementById('topics-container');
let tweetContainer = document.getElementById('tweets');

// function drag

function displayTopics(activeObj) {
    console.log(activeObj)
    let tempString = DOMPurify.sanitize(topicItems.map(item => `
    <div class="row mx-0 px-0 py-2" >
        <div contenteditable="true" id="${item.id}" draggable="true"
             class="container text-center rounded-pill fs-3 topic"> ${item.name}
        </div>
    </div>
    `).join(''));
    document.getElementById('topics').innerHTML = tempString;
    document.getElementById('tweets').innerHTML ='';
    for(let topic of document.querySelectorAll('.topic')) {
        topic.ondragstart = function(e) {
            e.dataTransfer.setData('text/plain', `,${this.id}`)
        }
        topic.ondragover = function(e) {
            e.preventDefault();
            let [tweetId, topicId] = e.dataTransfer.getData('text').split(',');
            console.log(tweetId, topicId)
            if(tweetId === '') return;
            this.classList.add('drag-over');
        }
        topic.ondragleave = function(e) {
            e.preventDefault();
            let [tweetId, topicId] = e.dataTransfer.getData('text').split(',');
            if(tweetId === '') return;
            this.classList.remove('drag-over');
        }
        topic.ondrop = function(e) {
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
        topic.ondblclick = (e) => {
            e.target.contentEditable=true;
            e.target.focus();
        }

        topic.onblur = (e) => {
            e.target.contentEditable=false;
            updateTopic(e.target.id, e.target.innerText, console.log)
        }
    }
    if(activeObj.detail) {
        openTopic(activeObj.detail.id);
    } else if(topicItems.length > 0) {
        openTopic(topicItems[0].id);
    }
}

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
    if(!topicId) return;

    let curActive = topicsContainer.querySelector('.active');
    if(curActive){
        curActive.classList.remove('active');
    }

    curActive = topicsContainer.querySelector(`#${topicId}`);
    curActive.classList.add('active');
    curTopicId=topicId;
    curActive.scrollIntoView(false);
    displayTweets(topicId);
}

function setEventListeners() {
    // handle topic clicks
    topicsContainer.onclick = function(e) {
        if(e.target.type === 'button') return;
        if(e.target.id) {
            openTopic(e.target.id);
        }
    }

    topicsContainer.addEventListener('refreshTopics', displayTopics);

    // new topic prompt
    let topicPrompt = document.getElementById('newTopicPrompt');
    let topicInput = topicPrompt.querySelector("#new-topic-name");

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
                    topicsContainer.dispatchEvent(
                        new CustomEvent('refreshTopics', {
                            detail: {id: dbObj.data.id}
                        })
                    );
                });
            }
        };
    });

    let tweetPrompt = document.getElementById('newTweetPrompt');
    let tweetInput = tweetPrompt.querySelector('#new-tweet-name');

    tweetPrompt.addEventListener('show.bs.modal', () => {
        tweetInput.value = '';
        tweetInput.disabled=false;
        tweetInput.classList.remove('no-topic');
    });
    tweetPrompt.addEventListener('shown.bs.modal', () => {
        let activateTopic = topicsContainer.querySelector('.active');
        if(activateTopic) {
            tweetInput.focus();
            let okBtn = tweetPrompt.querySelector("#tweet-ok-btn");
            okBtn.onclick = () => {
                if(tweetInput.value) {
                    let title = tweetInput.value;
                    createTweet('', title, activateTopic.id, ()=>{
                        displayTweets(activateTopic.id);
                    });
                }
            }
        } else {
            tweetInput.value = 'Select topic first to create tweet.'
            tweetInput.classList.add('no-topic');
            tweetInput.disabled=true;
        }
    });

    let trashBtn = document.getElementById('trash-btn');
    trashBtn.ondragover = function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    }
    trashBtn.ondragleave = function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
    }
    trashBtn.ondrop = (e) => {
        console.log(e.dataTransfer.getData('text'));
        trashBtn.classList.remove('drag-over');
        let [tweetId, topicId] = e.dataTransfer.getData('text').split(',');
        if(tweetId ==='') {
            let container = document.getElementById(topicId);
            deleteTopic(topicId, () => {
                container = container.parentElement;
                while(container.firstChild) {
                    container.removeChild(container.firstChild);
                }
                container.remove();
            })
        }
        else {
            let container = document.getElementById(tweetId);
            deleteTweet(tweetId, () => {
                while(container.firstChild) {
                    container.removeChild(container.firstChild)
                }
                container.remove();
            });    
        }
        
    }
    trashBtn.onclick = () => {
        console.log('???')
    }
}

function initUI() {
    setEventListeners();
    getAllTopics((dbObj) => {
        topicItems.push(...dbObj.topicsList);
        topicsContainer.dispatchEvent(new CustomEvent('refreshTopics'));
    });
}

// ENTERY POINT!!!!!!!!!!!!!!!!!
setupDB('note-taker', () => {
    initUI();   
});