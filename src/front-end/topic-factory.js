import { createTopic, getAllTopics, updateTopic, deleteTopic, } from "../db/content-management"
import { TOPICS } from "../configure";
import { AbstractMenuItem } from "./abstract-menu-item";
import { sortElements } from "./util";

class TopicFactory extends AbstractMenuItem {
    // Class TopicFactory is for creating, reading, updating, and deleting topics

    // TopicFactor constructor depends on the Menu object  
    constructor(menuItemContainer) {
        super(menuItemContainer, false, '_topicItemUpdate', 'topis');
        this.newFolderBtn = document.getElementById(TOPICS.NEW_BUTTON);
        this.newFolderBtn.onclick = () => {
            this.add();
        }

        this.load();
	}

    load() {
        // Loads in all the topics and tweets created by the user
        getAllTopics((topicEvent) => {
            if(!topicEvent.topicsList.length > 0) {
                createTopic(TOPICS.DEFAULT_TOPIC, (topicObj) => {
                    this.topicid = topicObj.data.id;
                    this.add(this.topicid, TOPICS.DEFAULT_TOPIC);
                });
            } else {
                let topicsList = sortElements(topicEvent.topicsList, 'name');
                for(let i = 0; i < topicsList.length; i++) {
                    let topic = topicsList[i];
                    this.add(topic.id, topic.name);
                }
            }
            this.selectedMenuItem = this.menuItemContainer.firstChild;
            this.activate('loaded');
        });
    }

    renameEvent() {
        // Renames topic on webpage when user makes name change
        updateTopic(this.selectedId, this.selectedTitle, () => {
            this.notify({
                id: this.selectedId, type: 'topics',
                event: 'rename', data: null
            });
        });
    }

    deleteEvent(data) {
        // Deletes a topic when user wants to remove a topic
        deleteTopic(data.deleteId, () => {
            this.notify({
                id: this.selectedId, type: 'topics',
                event: 'delete', data: data
            });
        })
    }

    newEvent() {
        // Creates a new, empty topic when user wants to add a topic
        if(this.selectedMenuItem) {
            createTopic(this.selectedTitle, (dbObj) => {
                this.notify({
                    id: dbObj.data.id, type: 'topics',
                    event: 'new', data: null
                });
            });
        } else {
            this.notify({
                id: null, type: 'topics',
                event: 'new', data: null
            });
        }

    }
}

export {TopicFactory};