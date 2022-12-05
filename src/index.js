import "./scss/main.scss";

// You can specify which plugins you need
import { Tooltip, Toast, Popover } from 'bootstrap';

import { setupDB, getAllTopics, deleteTweet, deleteTopic, createTopic } from "./db/content-management";


function displayTopics() {
    // let tempString = DOMPurify.sanitize(topicItems.map(item => 
    //     `<li><a id=${item.id} class="dropdown-item" href="#">${item.name}</a></li>`
    // ).join(''));
    let tempString = topicItems.map(item => `
        <li><a id="${item.id}" class="dropdown-item" href="#">${item.name}</a></li>
    `).join('');
    console.log(tempString)
    // topicsContainer.innerHTML = tempString; 
    console.log(topicsContainer.innerHTML)
}

function initUI() {
    getAllTopics((dbObj) => {
        topicItems.push(...dbObj.topicsList);
        console.log(topicItems)
        topicsContainer.dispatchEvent(new CustomEvent('refreshTopics'));
    });
}

// ENTERY POINT!!!!!!!!!!!!!!!!!
setupDB('note-taker', () => {
    initUI();   
});

let topicItems = [];
let topicsContainer = document.getElementById('topics');

topicsContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains('dropdown-item')) {
        let id = e.target.id;
        topicItems.filter(item => item.id === e.target.id);
        console.log(id)
        deleteTopic(id, displayTopics);
    }
});


topicsContainer.addEventListener('refreshTopics', displayTopics);
// topicsContainer.addEventListener('refreshTopics', (e) => {

// });