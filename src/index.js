import "./scss/main.scss";
import { displayTopics, addTopics, displayTweets, getActiveTopic, removeTopicHTML } from "./front-end/topic-helper";

// You can specify which plugins you need
import { Popover } from 'bootstrap';

import { setupDB, getAllTopics, deleteTweet, deleteTopic, createTweet } from "./db/content-management";

function setEventListeners() {
    let tweetPrompt = document.getElementById('newTweetPrompt');
    let tweetInput = tweetPrompt.querySelector('#new-tweet-name');

    tweetPrompt.addEventListener('show.bs.modal', () => {
        tweetInput.value = '';
        tweetInput.disabled=false;
        tweetInput.classList.remove('no-topic');
    });
    tweetPrompt.addEventListener('shown.bs.modal', () => {
        let activateTopic = getActiveTopic();
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
        trashBtn.classList.remove('drag-over');
        let [tweetId, topicId] = e.dataTransfer.getData('text').split(',');
        if(tweetId ==='') {
            deleteTopic(topicId, () => {
                removeTopicHTML(topicId);
                displayTopics(getActiveTopic())
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
}

function initUI() {
    setEventListeners();
    getAllTopics((dbObj) => {
        addTopics(dbObj);
    });
}



// ENTERY POINT!!!!!!!!!!!!!!!!!
setupDB('note-taker', () => {
    initUI();   
});


