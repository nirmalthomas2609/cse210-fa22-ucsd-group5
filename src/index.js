import "./scss/main.scss";

// You can specify which plugins you need
import { Tooltip, Toast, Popover } from 'bootstrap';

import { setupDB, getAllTopics, getTweetsByTopicId, deleteTweet, deleteTopic, createTopic, createTweet, updateTweet } from "./db/content-management";
import DOMPurify from "dompurify";

// globals
let curTopicId = null;
let topicItems = [];
let topicsContainer = document.getElementById('topics-container');
let tweetContainer = document.getElementById('tweets');

function displayTopics(activeObj) {
    console.log(activeObj)
    let tempString = DOMPurify.sanitize(topicItems.map(item => `
    <div class="row mx-0 px-0 py-2">
        <div id="${item.id}" class="container text-center rounded-pill fs-3 topic">
            ${item.name}
        </div>
    </div>
    `).join(''));
    document.getElementById('topics').innerHTML = tempString;
    document.getElementById('tweets').innerHTML ='';

    if(activeObj.detail) {
        openTopic(activeObj.detail.id);
    } else {
        openTopic(topicItems[0].id);
    }
}

function displayTweets(topicId) {
    getTweetsByTopicId(topicId, (dbObj) => {
        let tempText = '';
        for(let tweet of dbObj.data) {
            tempText += `
            <div id="${tweet.tweetId}" class="card">
                <div class="card-header" data-type="title" contenteditable="true">${tweet.tweetTitle}</div>
                <div class="card-body card-1">
                    <p class="card-text card-1" data-type="content" contenteditable="true">${tweet.textContent}</p>
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
            console.log(dataset)

            let topicId = dataset.topicId;
            let type = e.target.dataset.type;
            if(type==='content') {
                console.log(e.target.innerText.trim())
                updateTweet(tweetId, '', e.target.innerText, '', console.log)

            } else if(type==='title') {
                updateTweet(tweetId, e.target.innerText, '', '', console.log)
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

    displayTweets(topicId);
}

function setEventListeners() {
    // handle topic clicks
    topicsContainer.onclick = function(e) {
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